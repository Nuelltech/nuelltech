import os
import json
from datetime import datetime
from tavily import TavilyClient
from notion_client import Client

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

# ---------------------------------------------------------------------------
# Domínios a excluir sistematicamente — académicos, dicionários, lixo genérico
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
]

# Extensões de ficheiros binários a ignorar na origem (antes de criar registo no Notion)
EXTENSOES_IGNORAR = (".pdf", ".docx", ".doc", ".pptx", ".xls", ".xlsx", ".zip", ".rar")

# ---------------------------------------------------------------------------
# Queries por setor — cada entrada é um dict com os parâmetros Tavily
#
# topic="news" + days=N  →  só artigos publicados nos últimos N dias
# topic="general"        →  pesquisa geral (para Reddit e queries atemporais)
#
# Estratégia: 2 queries de notícias recentes (Web) por setor (Reddit em pausa)
# ---------------------------------------------------------------------------
FONTES_POR_SETOR = {
    "farmacias": [
        {
            "query": "farmácias Portugal regulação INFARMED margens preços 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 30,
        },
        {
            "query": "farmácia Portugal digitalização gestão stock automação desafios",
            "tipo": "Web",
            "topic": "news",
            "days": 60,
        },
    ],
    "clinicas": [
        {
            "query": "clínicas privadas Portugal gestão custos SNS digitalização 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 30,
        },
        {
            "query": "saúde privada Portugal desafios agendamento faturação tecnologia 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 60,
        },
    ],
    "restaurantes": [
        {
            "query": "restaurantes Portugal custos energia pessoal encerramento margens 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 30,
        },
        {
            "query": "restauração Portugal digitalização desperdício alimentar gestão tecnologia 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 60,
        },
    ],
    "fábricas": [
        {
            "query": "indústria PME Portugal automação produtividade custos produção 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 30,
        },
        {
            "query": "manufactura Portugal digitalização indústria 4.0 PME desafios 2025",
            "tipo": "Web",
            "topic": "news",
            "days": 60,
        },
    ],
}


def vigiar():
    total_adicionados = 0
    total_ignorados = 0

    for setor, fontes in FONTES_POR_SETOR.items():
        print(f"\n--- Pesquisando setor: {setor} ---")

        for fonte in fontes:
            query = fonte["query"]
            tipo = fonte["tipo"]
            topic = fonte["topic"]
            days = fonte["days"]

            print(f"  Query ({tipo}): {query[:80]}...")

            try:
                kwargs = {
                    "query": query,
                    "max_results": 5,
                    "exclude_domains": DOMINIOS_EXCLUIR,
                }
                if topic == "news":
                    kwargs["topic"] = "news"
                if days:
                    kwargs["days"] = days

                results = tavily.search(**kwargs)
            except Exception as e:
                print(f"  [ERRO] Falha na pesquisa Tavily: {e}")
                continue

            for res in results.get('results', []):
                url = res.get('url', '')
                titulo = res.get('title', 'Sem título')

                # Filtrar PDFs e ficheiros binários na origem
                url_lower = url.lower().split("?")[0]
                if any(url_lower.endswith(ext) for ext in EXTENSOES_IGNORAR):
                    print(f"  [Ignorado — ficheiro binário] {url[:80]}")
                    total_ignorados += 1
                    continue

                titulo_final = f"[{tipo}] {titulo}"

                pub_date = res.get('published_date')
                data_str = pub_date[:10] if (pub_date and len(pub_date) >= 10) else datetime.now().strftime("%Y-%m-%d")

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

    print(f"\n=== Vigilante concluído: {total_adicionados} artigos adicionados, {total_ignorados} ficheiros ignorados ===")


if __name__ == "__main__":
    vigiar()
