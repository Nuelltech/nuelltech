import os
import json
from tavily import TavilyClient
from notion_client import Client

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
DATABASE_ID = os.environ["NOTION_DATABASE_ID"]

def vigiar():
    # 1. Carrega os setores
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        setores = json.load(f)['setores']
    
    # 2. Define as fontes
    fontes = [
        ("dificuldades gestão processos {setor} PME Portugal", "Web"),
        ("site:reddit.com problemas gestão processos {setor} PME Portugal", "Reddit")
    ]
    
    # 3. Executa a caça
    for setor in setores:
        print(f"--- Pesquisando setor: {setor} ---")
        
        for base_query, tipo in fontes:
            query = base_query.format(setor=setor)
            results = tavily.search(query=query, max_results=3)
            
            for res in results.get('results', []):
                # Prefixa o título para sabermos a origem
                titulo_final = f"[{tipo}] {res['title']}"
                
                try:
                    notion.pages.create(
                        parent={"database_id": DATABASE_ID},
                        properties={
                            "Nome": {"title": [{"text": {"content": titulo_final[:200]}}]},
                            "Fonte": {"url": res['url']},
                            "Setor": {"select": {"name": setor}},
                            "Status": {"select": {"name": "Novo"}}
                        }
                    )
                    print(f"Adicionado ({tipo}): {res['title'][:50]}")
                except Exception as e:
                    print(f"Erro ao adicionar ao Notion: {e}")

if __name__ == "__main__":
    vigiar()
