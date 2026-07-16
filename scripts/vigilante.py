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
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        return json.load(f)['setores']

def artigo_ja_existe(nome_artigo):
    # Procura na base de dados se já existe uma página com este nome exato
    response = notion.databases.query(
        database_id=DATABASE_ID,
        filter={
            "property": "Nome",
            "title": {"equals": nome_artigo}
        }
    )
    return len(response['results']) > 0

def procurar_dores():
    alvos = carregar_alvos()
    for setor in alvos:
        print(f"Processando setor: {setor}")
        query = f"dificuldades gestão processos {setor} PME Portugal"
        # Aumentado para 4 resultados conforme solicitado
        response = tavily.search(query=query, search_depth="advanced", max_results=4)
        
        for result in response.get('results', []):
            titulo = result.get('title', 'Sem Título')[:200]
            
            # Verificação de duplicados
            if artigo_ja_existe(titulo):
                print(f"Skipping: {titulo} (já existe no Notion)")
                continue
            
            try:
                notion.pages.create(
                    parent={"database_id": DATABASE_ID},
                    properties={
                        "Nome": {"title": [{"text": {"content": titulo}}]},
                        "Fonte": {"url": result.get('url', '')},
                        "Setor": {"select": {"name": setor}}
                    }
                )
                print(f"Sucesso: {titulo}")
            except Exception as e:
                print(f"Erro ao escrever no Notion para o item {titulo}: {e}")

if __name__ == "__main__":
    procurar_dores()
