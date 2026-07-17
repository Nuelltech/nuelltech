import os
import json
from tavily import TavilyClient
from notion_client import Client
from analista import processar_noticia

# Inicialização
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

def artigo_ja_existe(nome_artigo):
    try:
        response = notion.databases.query(**{
            "database_id": DATABASE_ID,
            "filter": {"property": "Nome", "title": {"equals": nome_artigo}}
        })
        return len(response['results']) > 0
    except:
        return False

def procurar_dores():
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        alvos = json.load(f)['setores']
    
    # Fontes de pesquisa: [Query, Nome da Fonte]
    fontes = [
        ("dificuldades gestão processos {setor} PME Portugal", "Web"),
        ("site:reddit.com problemas gestão processos {setor} PME Portugal", "Reddit")
    ]
    
    for setor in alvos:
        print(f"--- Processando setor: {setor} ---")
        
        for base_query, tipo in fontes:
            query = base_query.format(setor=setor)
            print(f"Pesquisando via {tipo}...")
            
            response = tavily.search(query=query, search_depth="advanced", max_results=3)
            
            for result in response.get('results', []):
                titulo = f"[{tipo}] {result.get('title', 'Sem Título')}"[:200]
                
                if artigo_ja_existe(titulo):
                    continue
                
                try:
                    analise = processar_noticia(titulo, result.get('content', ''))
                    
                    notion.pages.create(
                        parent={"database_id": DATABASE_ID},
                        properties={
                            "Nome": {"title": [{"text": {"content": titulo}}]},
                            "Resumo_Executivo": {"rich_text": [{"text": {"content": analise['Resumo_Executivo']}}]},
                            "Oportunidade_Estrategica": {"rich_text": [{"text": {"content": analise['Oportunidade_Estrategica']}}]},
                            "Acao_Imediata": {"rich_text": [{"text": {"content": analise['Acao_Imediata']}}]},
                            "Fonte": {"url": result.get('url', '')},
                            "Setor": {"select": {"name": setor}},
                            "Intensidade": {"number": int(analise['Intensidade'])},
                            "Status": {"select": {"name": "Novo"}}
                        }
                    )
                    print(f"Sucesso: {titulo}")
                except Exception as e:
                    print(f"Erro ao processar: {e}")

if __name__ == "__main__":
    procurar_dores()
