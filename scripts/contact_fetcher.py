import os
import re
import json
import time
import urllib.request
import urllib.error
from urllib.parse import urlparse

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------
NOTION_TOKEN   = os.environ["NOTION_TOKEN"]
LEADS_DB_ID    = os.environ["LEADS_DB_ID"]
APIFY_TOKEN    = os.environ["APIFY_API_TOKEN"]

NOTION_VERSION = "2022-06-28"

APIFY_GMAPS_ACTOR    = os.environ.get("APIFY_GMAPS_ACTOR_ID", "compass~crawler-google-places")
APIFY_CONTACTS_ACTOR = os.environ.get("APIFY_CONTACTS_ACTOR_ID", "vdrmota~contact-info-scraper")

MAX_RESULTS_POR_QUERY   = int(os.environ.get("MAX_RESULTS_POR_QUERY", "20"))
PAUSA_ENTRE_QUERIES_SEG = 2

# Nomes EXATOS das colunas na "Tabela de Leads"
COL_DECISOR    = "Nome do Decisor / Contacto"   # coluna TITLE da base
COL_EMPRESA    = "Empresa / Organização"
COL_SETOR      = "Setor"
COL_EMAIL      = "E-mail"
COL_LINKEDIN   = "Perfil LinkedIn"
COL_STATUS     = "Status do Lead"
COL_TELEFONE   = "Telefone"        # tipo Phone no Notion
COL_LOCALIDADE = "Localidade"      # tipo Texto
COL_INSTAGRAM  = "Instagram"       # << nova coluna, cria como URL
COL_AVALIACAO  = "Avaliação"       # << nova coluna, cria como Texto (ex: "4.5 (120 reviews)")

STATUS_INICIAL = "Não iniciada"
MARCADOR_DECISOR_DESCONHECIDO = "(a confirmar) "


# ---------------------------------------------------------------------------
# Notion — chamadas diretas à API REST
# ---------------------------------------------------------------------------
def notion_post(path, payload):
    url = f"https://api.notion.com/v1/{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }
    )
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  [NOTION ERROR {e.code}] Path: {path}")
        print(f"  [NOTION ERROR] Detalhe: {body[:500]}")
        raise


def lead_ja_existe(nome_empresa):
    if not nome_empresa:
        return False
    resultado = notion_post(f"databases/{LEADS_DB_ID}/query", {
        "filter": {"property": COL_EMPRESA, "rich_text": {"equals": nome_empresa}}
    })
    return len(resultado.get("results", [])) > 0


def criar_lead(nome_empresa, setor, decisor, email, linkedin, telefone, localidade, instagram, avaliacao):
    titulo = decisor if decisor else f"{MARCADOR_DECISOR_DESCONHECIDO}{nome_empresa}"

    properties = {
        COL_DECISOR: {"title": [{"text": {"content": titulo[:200]}}]},
        COL_EMPRESA: {"rich_text": [{"text": {"content": nome_empresa[:200]}}]},
        COL_SETOR:   {"select": {"name": setor}},
        COL_STATUS:  {"status": {"name": STATUS_INICIAL}},
    }
    if email:
        properties[COL_EMAIL] = {"email": email}
    if linkedin:
        properties[COL_LINKEDIN] = {"url": linkedin}
    if telefone:
        properties[COL_TELEFONE] = {"phone_number": telefone[:100]}
    if localidade:
        properties[COL_LOCALIDADE] = {"rich_text": [{"text": {"content": localidade[:200]}}]}
    if instagram:
        properties[COL_INSTAGRAM] = {"url": instagram}
    if avaliacao:
        properties[COL_AVALIACAO] = {"rich_text": [{"text": {"content": avaliacao[:100]}}]}

    notion_post("pages", {"parent": {"database_id": LEADS_DB_ID}, "properties": properties})


# ---------------------------------------------------------------------------
# Apify — Google Maps Scraper (Etapa 1: descobrir empresas)
# ---------------------------------------------------------------------------
def apify_run_sync(actor_id, payload, timeout=300):
    url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  [APIFY ERROR {e.code}] actor={actor_id} | {body[:400]}")
        return []
    except Exception as e:
        print(f"  [APIFY ERROR] actor={actor_id} | {e}")
        return []


def correr_apify_gmaps(termo_busca, max_results):
    payload = {
        "searchStringsArray": [termo_busca],
        "maxCrawledPlacesPerSearch": max_results,
        "skipClosedPlaces": True,
    }
    return apify_run_sync(APIFY_GMAPS_ACTOR, payload)


# ---------------------------------------------------------------------------
# Apify — Contact Details Scraper (Etapa 2: enriquecer com email/redes sociais)
# Percorre várias páginas do site (contactos, sobre, equipa) automaticamente —
# muito mais fiável do que ler só a homepage.
# ---------------------------------------------------------------------------
def enriquecer_contactos(websites):
    """
    Recebe uma lista de URLs de sites e devolve um dicionário:
    { domínio: {"email": ..., "linkedin": ..., "instagram": ...} }
    """
    enriquecido = {}
    if not websites:
        return enriquecido

    payload = {
        "startUrls": [{"url": site} for site in websites],
        "maxDepth": 2,
        "sameDomain": True,
    }
    resultados = apify_run_sync(APIFY_CONTACTS_ACTOR, payload, timeout=300)

    for item in resultados:
        pagina_url = item.get("url") or item.get("referrerUrl") or ""
        if not pagina_url:
            continue
        dominio = urlparse(pagina_url).netloc.replace("www.", "")
        if not dominio:
            continue

        entrada = enriquecido.setdefault(dominio, {"email": "", "linkedin": "", "instagram": ""})

        emails = item.get("emails") or ([item["email"]] if item.get("email") else [])
        if emails and not entrada["email"]:
            entrada["email"] = emails[0]

        linkedins = item.get("linkedIns") or item.get("linkedins") or []
        if linkedins and not entrada["linkedin"]:
            entrada["linkedin"] = linkedins[0]

        instagrams = item.get("instagrams") or []
        if instagrams and not entrada["instagram"]:
            entrada["instagram"] = instagrams[0]

    return enriquecido


def dominio_de(url_site):
    if not url_site:
        return ""
    return urlparse(url_site).netloc.replace("www.", "")


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
            print(f"  {len(resultados)} resultados devolvidos pela Apify (Google Maps).")

            # Filtra já os que são novos (evita gastar créditos de enriquecimento em duplicados)
            candidatos = []
            for item in resultados:
                nome_empresa = item.get("title", "").strip()
                if not nome_empresa:
                    continue
                try:
                    if lead_ja_existe(nome_empresa):
                        total_ignorados += 1
                        continue
                except Exception as e:
                    print(f"  Erro ao verificar duplicado de '{nome_empresa}': {e}")
                    continue
                candidatos.append(item)

            if not candidatos:
                time.sleep(PAUSA_ENTRE_QUERIES_SEG)
                continue

            # Etapa 2: enriquecimento em lote dos sites destes candidatos novos
            websites = list({c["website"].strip() for c in candidatos if c.get("website")})
            print(f"  A enriquecer {len(websites)} sites com o Contact Details Scraper...")
            contactos_por_dominio = enriquecer_contactos(websites)

            for item in candidatos:
                nome_empresa = item.get("title", "").strip()
                website = (item.get("website") or "").strip()
                telefone = (item.get("phone") or item.get("phoneUnformatted") or "").strip()
                localidade = (item.get("address") or "").strip() or concelho

                rating = item.get("totalScore")
                reviews = item.get("reviewsCount")
                avaliacao = f"{rating} ({reviews} reviews)" if rating and reviews else ""

                dominio = dominio_de(website)
                dados_contacto = contactos_por_dominio.get(dominio, {})
                email    = dados_contacto.get("email", "")
                linkedin = dados_contacto.get("linkedin", "")
                instagram = dados_contacto.get("instagram", "")
                decisor  = ""  # nome do decisor continua a exigir confirmação manual/presencial

                try:
                    criar_lead(
                        nome_empresa, setor, decisor, email, linkedin,
                        telefone, localidade, instagram, avaliacao
                    )
                    total_criados += 1
                    print(
                        f"  + {nome_empresa} | tel: {telefone or 'N/D'} | local: {localidade or 'N/D'} "
                        f"| email: {email or 'N/D'} | linkedin: {'sim' if linkedin else 'N/D'} "
                        f"| instagram: {'sim' if instagram else 'N/D'} | avaliação: {avaliacao or 'N/D'}"
                    )
                except Exception as e:
                    print(f"  Erro ao gravar '{nome_empresa}' no Notion: {e}")

            time.sleep(PAUSA_ENTRE_QUERIES_SEG)

    print(f"\nConcluído. Novos leads: {total_criados} | Duplicados ignorados: {total_ignorados}")


if __name__ == "__main__":
    main()
