import os
import requests
import json

# 1. Carregar Variáveis de Ambiente (Injetadas pelo GitHub Actions)
NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
INBOX_DB_ID = os.environ.get("INBOX_DB_ID")
CAMPANHAS_DB_ID = os.environ.get("CAMPANHAS_DB_ID")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY") # Para usares na função do Claude

headers = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def obter_artigos_processados(setor_alvo):
    print(f"A procurar artigos processados para o setor: {setor_alvo}...")
    url = f"https://api.notion.com/v1/databases/{INBOX_DB_ID}/query"
    payload = {
        "filter": {
            "and": [
                {"property": "Status", "status": {"equals": "Processado"}},
                {"property": "Setor", "select": {"equals": setor_alvo}}
            ]
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    resultados = response.json().get("results", [])
    
    if not resultados:
        print(f"Sem artigos novos para {setor_alvo}.")
        return None, []

    contexto_para_claude = ""
    artigos_ids = []
    
    for pagina in resultados:
        artigos_ids.append(pagina["id"])
        props = pagina["properties"]
        dor = props["Dor/Problema"]["title"][0]["text"]["content"]
        # Ajusta o nome da coluna de resumo se for diferente na tua tabela original
        resumo = props.get("Resumo Executivo", {}).get("rich_text", [{"text": {"content": ""}}])[0]["text"]["content"]
        contexto_para_claude += f"- Dor/Problema: {dor}\n  Contexto: {resumo}\n\n"
        
    return contexto_para_claude, artigos_ids

def criar_campanha_notion(setor, tema, draft_email, draft_linkedin, ids_origem):
    print("A injetar nova campanha na tabela Campanhas_Prospector...")
    url = "https://api.notion.com/v1/pages"
    
    relation_data = [{"id": page_id} for page_id in ids_origem]
    
    payload = {
        "parent": {"database_id": CAMPANHAS_DB_ID},
        "properties": {
            "Nome da Campanha": {"title": [{"text": {"content": f"Campanha {setor.capitalize()} - Automática"}}]},
            "Setor_Alvo": {"select": {"name": setor}},
            "Status_Campanha": {"status": {"name": "Rascunho Pronto"}},
            "Tema_Central": {"rich_text": [{"text": {"content": tema}}]},
            "Draft_Email": {"rich_text": [{"text": {"content": draft_email}}]},
            "Draft_LinkedIn": {"rich_text": [{"text": {"content": draft_linkedin}}]},
            "Artigos_Origem": {"relation": relation_data}
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    return response.status_code

def arquivar_artigos_usados(ids_origem):
    print("A limpar a Inbox_Mercado (mudando status para 'Utilizado')...")
    for page_id in ids_origem:
        url = f"https://api.notion.com/v1/pages/{page_id}"
        payload = {
            "properties": {
                "Status": {"status": {"name": "Utilizado"}} # Verifica se tens este Status criado no Notion
            }
        }
        requests.patch(url, headers=headers, json=payload)

def main():
    setores_ativos = ["clinicas", "fabricas", "restaurantes", "farmacias"]
    
    for setor in setores_ativos:
        contexto, ids = obter_artigos_processados(setor)
        
        if contexto:
            # 1. Aqui entra a tua função de chamada à API do Claude (Anthropic)
            # pseudo_resposta = chamar_claude(contexto)
            
            # Para testar a ligação ao Notion, vamos simular o JSON do Claude:
            dados_simulados = {
                "tema_central": "Simulação de padrão encontrado",
                "draft_email": "Olá Diretor, simulamos este email...",
                "draft_linkedin": "Sabia que as clínicas sofrem com X? (Simulação)"
            }
            
            # 2. Criar a campanha
            status = criar_campanha_notion(
                setor, 
                dados_simulados["tema_central"], 
                dados_simulados["draft_email"], 
                dados_simulados["draft_linkedin"], 
                ids
            )
            
            # 3. Se a campanha for criada com sucesso, arquivar os originais
            if status == 200:
                arquivar_artigos_usados(ids)
                print(f"Sucesso total para o setor: {setor}\n---")

if __name__ == "__main__":
    main()
