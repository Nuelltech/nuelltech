import os
import json
import sys
from tavily import TavilyClient
from notion_client import Client

# Inicialização
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

def carregar_alvos():
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        return json.load(f)['setores']

def procurar_dores():
    alvos = carregar_alvos()
    for setor in alvos:
        print(f"Processando setor: {setor}")
        query = f"dificuldades gestão processos {setor} PME Portugal"
        response = tavily.search(query=query, search_depth="advanced", max_results=2)
        
        for result in response.get('results', []):
            try:
                # Criar página sem o campo Status para evitar erro de validação
                notion.pages.create(
                    parent={"database_id": DATABASE_ID},
                    properties={
                        "Nome": {"title": [{"text": {"content": result.get('title', 'Sem Título')[:200]}}]},
                        "Fonte": {"url": result.get('url', '')},
                        "Setor": {"select": {"name": setor}}
                    }
                )
                print(f"Sucesso: {result.get('title')}")
            except Exception as e:
                print(f"Erro ao escrever no Notion: {e}")

if __name__ == "__main__":
    procurar_dores()
