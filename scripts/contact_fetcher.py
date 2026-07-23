import os
import re
import json
import time
import urllib.request
import urllib.error
from notion_client import Client

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------
NOTION_TOKEN   = os.environ["NOTION_TOKEN"]
LEADS_DB_ID    = os.environ["LEADS_DB_ID"]   # ID da "Tabela de Leads"
APIFY_TOKEN    = os.environ["APIFY_API_TOKEN"]

# Actor "Google Maps Scraper" da Apify (compass/crawler-google-places)
APIFY_ACTOR_ID = os.environ.get("APIFY_GMAPS_ACTOR_ID", "compass~crawler-google-places")

MAX_RESULTS_POR_QUERY   = int(os.environ.get("MAX_RESULTS_POR_QUERY", "20"))
PAUSA_ENTRE_QUERIES_SEG = 2

notion = Client(auth=NOTION_TOKEN)

# Nomes EXATOS das colunas na "Tabela de Leads" (têm de bater certo com o Notion)
COL_DECISOR    = "Nome do Decisor / Contacto"
COL_EMPRESA    = "Empresa / Organização"
COL_SETOR      = "Setor"
COL_EMAIL      = "E-mail"
COL_LINKEDIN   = "Perfil LinkedIn"
COL_STATUS     = "Status do Lead"
COL_CAMPANHA   = "Campanha Associada"
COL_MENSAGEM   = "Mensagem Personalizada Gerada"

STATUS_INICIAL = "Não iniciada"

# Padrões que costumam anteceder o nome do responsável numa página "Sobre/Contactos"
PADROES_DECISOR = [
    r"(?:Direç[ãa]o[:\s]+)([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})",
    r"(?:Gerente[:\s]+)([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})",
    r"(?:Propriet[áa]ri[oa][:\s]+)([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})",
    r"(?:Farmac[êe]utic[oa]\s+Respons[áa]vel[:\s]+)([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})",
    r"(?:Dr\.?a?\.?\s+)([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})",
]

# Regex simples para encontrar emails de contacto no HTML de um site
REGEX_EMAIL = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

# Domínios genéricos que NÃO queremos apanhar (imagens, exemplos, etc.)
EMAILS_IGNORAR = ("example.com", "sentry.io", "wixpress.com", "godaddy.com")


# ---------------------------------------------------------------------------
# Apify — recolha via Google Maps Scraper
# ---------------------------------------------------------------------------
def correr_apify_gmaps(termo_busca, max_results):
    """
    Corre o actor de forma síncrona e devolve os itens do dataset.
    Usa o endpoint run-sync-get-dataset-items para não precisar de polling.
    """
    url = (
        f"https://api.apify.com/v2/acts/{APIFY_ACTOR_ID}"
        f"/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    )
    payload = {
        "searchStringsArray": [termo_busca],
        "maxCrawledPlacesPerSearch": max_results,
        "language": "pt",
        "skipClosedPlaces": True,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  [APIFY ERROR {e.code}] {body[:300]}")
        return []
    except Exception as e:
        print(f"  [APIFY ERROR] {e}")
        return []


def obter_html_site(url_site, timeout=10):
    if not url_site:
        return ""
    try:
        req = urllib.request.Request(url_site, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception:
        return ""


def extrair_decisor(html):
    """
    Tentativa best-effort de encontrar o nome do responsável na página do site.
    Não garante resultado — a maioria das PMEs não publica isto, e nesses
    casos o campo fica em branco para preenchimento manual/presencial.
    """
    if not html:
        return ""
    texto = re.sub(r"<[^>]+>", " ", html)
    for padrao in PADROES_DECISOR:
        match = re.search(padrao, texto)
        if match:
            return match.group(1).strip()
    return ""


def extrair_email(html):
    """Procura o primeiro email de contacto válido no HTML do site."""
    if not html:
        return ""
    candidatos = REGEX_EMAIL.findall(html)
    for email in candidatos:
        email_lower = email.lower()
        if not any(dominio in email_lower for dominio in EMAILS_IGNORAR):
            return email
    return ""


def extrair_linkedin_da_empresa(html):
    """
    Procura um link para o LinkedIn no site (normalmente no rodapé).
    Devolve a página da EMPRESA, não o perfil pessoal do decisor —
    isso continua a exigir pesquisa manual, já que não há forma fiável
    e gratuita de automatizar essa ligação nome → perfil pessoal.
    """
    if not html:
        return ""
    match = re.search(r'href=["\'](https?://(?:www\.)?linkedin\.com/[^"\']+)["\']', html)
    return match.group(1) if match else ""


# ---------------------------------------------------------------------------
# Notion — deduplicação e escrita
# ---------------------------------------------------------------------------
def lead_ja_existe(nome_empresa):
    """Verifica duplicados pelo nome da empresa antes de criar novo registo."""
    if not nome_empresa:
        return False
    resultado = notion.databases.query(
        database_id=LEADS_DB_ID,
        filter={"property": COL_EMPRESA, "rich_text": {"equals": nome_empresa}}
    )
    return len(resultado.get("results", [])) > 0


def criar_lead(nome_empresa, setor, decisor, email, linkedin):
    properties = {
        COL_EMPRESA: {"rich_text": [{"text": {"content": nome_empresa[:200]}}]},
        COL_SETOR:   {"select": {"name": setor}},
        COL_STATUS:  {"status": {"name": STATUS_INICIAL}},
    }
    if decisor:
        properties[COL_DECISOR] = {"rich_text": [{"text": {"content": decisor[:200]}}]}
    if email:
        properties[COL_EMAIL] = {"email": email}
    if linkedin:
        properties[COL_LINKEDIN] = {"url": linkedin}

    notion.pages.create(parent={"database_id": LEADS_DB_ID}, properties=properties)


# ---------------------------------------------------------------------------
# Orquestração
# ---------------------------------------------------------------------------
def carregar_alvos():
    with open("scripts/alvos.json", "r", encoding="utf-8") as f:
        config = json.load(f)
    setores = config.get("setores", ["farmacias", "clinicas", "restaurantes"])
    concelhos = config.get("concelhos", ["Vila Real", "Viana do Castelo"])
    return setores, concelhos


TERMOS_POR_SETOR = {
    "farmacias": "farmácia",
    "clinicas": "clínica médica",
    "restaurantes": "restaurante",
    "ginasios": "ginásio",
    "hoteis": "hotel",
    "fábricas": "fábrica",
}


def main():
    setores, concelhos = carregar_alvos()
    print(f"Contact fetcher iniciado. Setores: {setores} | Concelhos: {concelhos}")

    total_criados = 0
    total_ignorados = 0

    for setor in setores:
        termo_base = TERMOS_POR_SETOR.get(setor, setor)

        for concelho in concelhos:
            termo_busca = f"{termo_base} em {concelho}"
            print(f"\n--- A procurar: '{termo_busca}' ---")

            resultados = correr_apify_gmaps(termo_busca, MAX_RESULTS_POR_QUERY)
            print(f"  {len(resultados)} resultados devolvidos pela Apify.")

            for item in resultados:
                nome_empresa = item.get("title", "").strip()
                website = (item.get("website") or "").strip()

                if not nome_empresa:
                    continue

                if lead_ja_existe(nome_empresa):
                    total_ignorados += 1
                    continue

                html = obter_html_site(website) if website else ""
                decisor  = extrair_decisor(html)
                email    = extrair_email(html)
                linkedin = extrair_linkedin_da_empresa(html)

                try:
                    criar_lead(nome_empresa, setor, decisor, email, linkedin)
                    total_criados += 1
                    print(
                        f"  + {nome_empresa} | decisor: {decisor or 'N/D'} "
                        f"| email: {email or 'N/D'} | linkedin: {'sim' if linkedin else 'N/D'}"
                    )
                except Exception as e:
                    print(f"  Erro ao gravar '{nome_empresa}' no Notion: {e}")

            time.sleep(PAUSA_ENTRE_QUERIES_SEG)

    print(f"\nConcluído. Novos leads: {total_criados} | Duplicados ignorados: {total_ignorados}")


if __name__ == "__main__":
    main()
