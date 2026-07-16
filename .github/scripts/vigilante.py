import os
import json
from tavily import TavilyClient
from notion_client import Client

# Configurações
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

def carregar_alvos():
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        return json.load(f)['setores']

def procurar_dores():
    alvos = carregar_alvos()
    for setor in alvos:
        query = f"dificuldades gestão processos {setor} PME Portugal"
        response = tavily.search(query=query, search_depth="advanced", max_results=2)
        
        for result in response.results:
            # Enviar para o Notion
            notion.pages.create(
                parent={"database_id": DATABASE_ID},
                properties={
                    "Nome": {"title": [{"text": {"content": result['title']}}]},
                    "Setor": {"select": {"name": setor}},
                    "Fonte": {"url": result['url']},
                    "Status": {"status": {"name": "Novo"}}
                }
            )

if __name__ == "__main__":
    procurar_dores()
