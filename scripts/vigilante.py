import os
import json
import sys
from tavily import TavilyClient
from notion_client import Client

# Inicialização
try:
    tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
    notion = Client(auth=os.environ["NOTION_TOKEN"])
    DATABASE_ID = os.environ["NOTION_DATABASE_ID"]
except KeyError as e:
    print(f"Erro: Falta definir a variável de ambiente {e}")
    sys.exit(1)

def carregar_alvos():
    try:
        with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
            return json.load(f)['setores']
    except Exception as e:
        print(f"Erro ao ler alvos.json: {e}")
        sys.exit(1)

def procurar_dores():
    alvos = carregar_alvos()
    for setor in alvos:
        print(f"Processando setor: {setor}")
        query = f"dificuldades gestão processos {setor} PME Portugal"
        response = tavily.search(query=query, search_depth="advanced", max_results=2)
        
        for result in response.results:
            try:
                notion.pages.create(
                    parent={"database_id": DATABASE_ID},
                    properties={
                        "Nome": {"title": [{"text": {"content": result['title'][:200]}}]},
                        "Setor": {"select": {"name": setor}},
                        "Fonte": {"url": result['url']},
                        "Status": {"status": {"name": "Novo"}}
                    }
                )
                print(f"Sucesso: {result['title']}")
            except Exception as e:
                print(f"Erro ao escrever no Notion: {e}")

if __name__ == "__main__":
    procurar_dores()
