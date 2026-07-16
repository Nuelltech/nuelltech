import os
import json
from tavily import TavilyClient

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def carregar_alvos():
    with open('scripts/alvos.json', 'r', encoding='utf-8') as f:
        return json.load(f)['setores']

def procurar_dores():
    alvos = carregar_alvos()
    
    for setor in alvos:
        # A query torna-se dinâmica e muito mais potente
        query = f"problemas dificuldades gestão automação {setor} PME Portugal fóruns linkedin"
        
        print(f"--- Investigando setor: {setor} ---")
        response = tavily.search(query=query, search_depth="advanced", max_results=3)
        
        for result in response.results:
            print(f"Setor: {setor} | Título: {result['title']}")
            # Aqui poderíamos guardar num ficheiro ou enviar para o Notion
    
if __name__ == "__main__":
    procurar_dores()
