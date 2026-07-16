import os
import json
import sys
from tavily import TavilyClient
from notion_client import Client
# Importação corrigida para funcionar dentro da pasta scripts/
from analista import processar_noticia

# Inicialização dos serviços
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

def artigo_ja_existe(nome_artigo):
    response = notion.databases.query(
        database_id=DATABASE_ID,
        filter={"property": "Nome", "title": {"equals": nome_artigo}}
    )
    return len(response['results']) > 0

def procurar_dores():
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        alvos = json.load(f)['setores']
    
    for setor in alvos:
        print(f"--- Processando setor: {setor} ---")
        query = f"dificuldades gestão processos {setor} PME Portugal"
        response = tavily.search(query=query, search_depth="advanced", max_results=4)
        
        for result in response.get('results', []):
            titulo = result.get('title', 'Sem Título')[:200]
            
            if artigo_ja_existe(titulo):
                print(f"Skipping: {titulo} (já existe)")
                continue
            
            # Chama o Analista (Claude)
            try:
                analise = processar_noticia(titulo, result.get('content', ''))
                
                # Insere no Notion
                notion.pages.create(
                    parent={"database_id": DATABASE_ID},
                    properties={
                        "Nome": {"title": [{"text": {"content": titulo}}]},
                        "Dor/Problema": {"rich_text": [{"text": {"content": analise['Dor']}}]},
                        "Fonte": {"url": result.get('url', '')},
                        "Setor": {"select": {"name": setor}},
                        "Intensidade": {"select": {"name": analise['Intensidade']}},
                        "Status": {"select": {"name": "Novo"}}
                    }
                )
                print(f"Sucesso: {titulo} | Intensidade: {analise['Intensidade']}")
            except Exception as e:
                print(f"Erro ao processar/escrever {titulo}: {e}")

if __name__ == "__main__":
    procurar_dores()
