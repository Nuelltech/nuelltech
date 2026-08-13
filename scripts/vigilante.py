import os
import json
import re
from datetime import datetime
from email.utils import parsedate_to_datetime
from tavily import TavilyClient
from notion_client import Client

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

# ---------------------------------------------------------------------------
# Domínios a excluir sistematicamente — académicos, dicionários, entretenimento, lixo
# ---------------------------------------------------------------------------
DOMINIOS_EXCLUIR = [
    "fenix.tecnico.ulisboa.pt",
    "estudogeral.uc.pt",
    "repositorio-aberto.up.pt",
    "repositorium.sdum.uminho.pt",
    "rcaap.pt",
    "ubibliorum.ubi.pt",
    "collinsdictionary.com",
    "linguee.com",
    "translate.google.com",
    "pt.wikipedia.org",
    "en.wikipedia.org",
    "dicionario.priberam.org",
    "infopedia.pt",
    "academia.edu",
    "researchgate.net",
    "folha.uol.com.br",
    "globo.com",
]

# Extensões de ficheiros binários a ignorar na origem
EXTENSOES_IGNORAR = (".pdf", ".docx", ".doc", ".pptx", ".xls", ".xlsx", ".zip", ".rar")

# ---------------------------------------------------------------------------
# Palavras-chave obrigatórias por setor (Filtro de Relevância Temática)
# Pelo menos UMA destas raízes de palavras tem de constar no título, URL ou resumo
# ---------------------------------------------------------------------------
PALAVRAS_CHAVE_SETOR = {
    "farmacias": [
        "farmác", "farmac", "infarmed", "medicament", "farma", "prescrição",
        "prescricao", "farmacêutic", "farmaceutic", "receita médica", "anf"
    ],
    "clinicas": [
        "clínic", "clinic", "hospital", "médic", "medic", "saúde", "saude",
        "pacient", "consultór", "consultor", "exame", "diagnóstico", "diagnostico", "ers"
    ],
    "restaurantes": [
        "restauran", "restauraç", "restaurac", "gastronom", "hotelaria", "menu",
        "ementa", "cozinha", "chef", "ahresp", "refeição", "refeicao", "takeaway"
    ],
    "fábricas": [
        "fábric", "fabric", "indústria", "industria", "manufactur", "produção",
        "producao", "operá", "opera", "metalur", "têxtil", "textil", "moldes",
        "automação", "automacao", "robot", "cadeia de abastecimento"
    ],
}

# ---------------------------------------------------------------------------
# Queries focadas por setor (sem anos passados nem termos longos que provocam fallbacks)
# ---------------------------------------------------------------------------
FONTES_POR_SETOR = {
    "farmacias": [
        {
            "query": "farmácia OR farmácias gestão desafios Portugal",
            "tipo": "Web",
            "days": 30,
        },
        {
            "query": "farmácias regulação INFARMED margens preços Portugal",
            "tipo": "Web",
            "days": 60,
        },
    ],
    "clinicas": [
        {
            "query": "clínica OR clínicas privadas saúde gestão Portugal",
            "tipo": "Web",
            "days": 30,
        },
        {
            "query": "saúde privada clínicas agendamento faturação desafios Portugal",
            "tipo": "Web",
            "days": 60,
        },
    ],
    "restaurantes": [
        {
            "query": "restaurante OR restaurantes restauração gestão custos Portugal",
            "tipo": "Web",
            "days": 30,
        },
        {
            "query": "restauração restaurantes margens pessoal digitalização Portugal",
            "tipo": "Web",
            "days": 60,
        },
    ],
    "fábricas": [
        {
            "query": "fábrica OR fábricas indústria PME produção Portugal",
            "tipo": "Web",
            "days": 30,
        },
        {
            "query": "indústria manufactura automação produtividade PME Portugal",
            "tipo": "Web",
            "days": 60,
        },
    ],
}


def formatar_data_iso(pub_date):
    """
    Converte qualquer string de data recebida da API Tavily
    num formato estrito ISO YYYY-MM-DD exigido pela API do Notion.
    """
    if not pub_date or not isinstance(pub_date, str):
        return datetime.now().strftime("%Y-%m-%d")

    pub_date = pub_date.strip()

    # 1. Procurar padrão YYYY-MM-DD direto na string
    match_iso = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', pub_date)
    if match_iso:
        return match_iso.group(1)

    # 2. Tentar parse RFC 2822 (ex: "Tue, 04 Aug 2025 12:00:00 GMT")
    try:
        dt = parsedate_to_datetime(pub_date)
        if dt:
            return dt.strftime("%Y-%m-%d")
    except Exception:
        pass

    return datetime.now().strftime("%Y-%m-%d")


def eh_relevante_ao_setor(setor, titulo, url, snippet):
    """
    Verifica se pelo menos uma palavra-chave do setor está presente no título, URL ou snippet.
    Evita inserir notícias de celebridades, desporto, política ou temas alheios ao setor.
    """
    palavras = PALAVRAS_CHAVE_SETOR.get(setor, [])
    if not palavras:
        return True

    texto_combinado = f"{titulo} {url} {snippet}".lower()
    return any(p in texto_combinado for p in palavras)


def vigiar():
    total_adicionados = 0
    total_ignorados_binarios = 0
    total_ignorados_tematica = 0

    for setor, fontes in FONTES_POR_SETOR.items():
        print(f"\n--- Pesquisando setor: {setor} ---")

        for fonte in fontes:
            query = fonte["query"]
            tipo = fonte["tipo"]
            days = fonte.get("days", 30)

            print(f"  Query ({tipo}): {query}...")

            try:
                kwargs = {
                    "query": query,
                    "search_depth": "advanced",
                    "max_results": 5,
                    "days": days,
                    "exclude_domains": DOMINIOS_EXCLUIR,
                }
                results = tavily.search(**kwargs)
            except Exception as e:
                print(f"  [ERRO] Falha na pesquisa Tavily: {e}")
                continue

            for res in results.get('results', []):
                url = res.get('url', '')
                titulo = res.get('title', 'Sem título')
                snippet = res.get('content', '')

                # 1. Filtrar PDFs e ficheiros binários na origem
                url_lower = url.lower().split("?")[0]
                if any(url_lower.endswith(ext) for ext in EXTENSOES_IGNORAR):
                    print(f"  [Ignorado — Ficheiro binário] {url[:70]}")
                    total_ignorados_binarios += 1
                    continue

                # 2. Filtro de Relevância Temática do Setor (impede notícias de fofoca, desporto, etc.)
                if not eh_relevante_ao_setor(setor, titulo, url, snippet):
                    print(f"  [Ignorado — Fora do tema '{setor}'] {titulo[:70]}")
                    total_ignorados_tematica += 1
                    continue

                titulo_final = f"[{tipo}] {titulo}"
                pub_date = res.get('published_date')
                data_str = formatar_data_iso(pub_date)

                try:
                    notion.pages.create(
                        parent={"database_id": DATABASE_ID},
                        properties={
                            "Nome":        {"title": [{"text": {"content": titulo_final[:200]}}]},
                            "Fonte":       {"url": url},
                            "Setor":       {"select": {"name": setor}},
                            "Status":      {"select": {"name": "Novo"}},
                            "Data_Coleta": {"date": {"start": data_str}},
                        }
                    )
                    print(f"  [+] ({tipo}) {titulo[:70]} [{data_str}]")
                    total_adicionados += 1
                except Exception as e:
                    print(f"  [ERRO Notion] {e}")

    print(f"\n=== Vigilante concluído: {total_adicionados} artigos adicionados, {total_ignorados_binarios} PDFs ignorados, {total_ignorados_tematica} fora de tema ignorados ===")


if __name__ == "__main__":
    vigiar()
