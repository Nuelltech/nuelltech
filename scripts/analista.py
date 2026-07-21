import os
import sys
import json
from anthropic import Anthropic
from notion_client import Client

# Inicialização
anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])

def ler_contexto_notion(page_id):
    try:
        blocks = notion.blocks.children.list(block_id=page_id)
        return "\n".join([b['paragraph']['rich_text'][0]['plain_text'] for b in blocks['results'] if 'paragraph' in b and b['paragraph']['rich_text']])
    except Exception as e:
        return "Contexto indisponível."

def processar_page(page):
    page_id = page['id']
    try:
        titulo = page['properties']['Nome']['title'][0]['text']['content']
    except (KeyError, IndexError):
        titulo = "Artigo sem título"
        
    contexto = ler_contexto_notion(os.environ["NOTION_CONTEXTO_PAGE_ID"])
    
    prompt = f"""
    Contexto Nuelltech: {contexto}
    Analisa este artigo: "{titulo}"
    Retorna APENAS um objeto JSON. Não escrevas nada antes ou depois.
    {{
        "Diagnostico_Problema": "Analisa o desafio, dor e impacto (2-3 parágrafos).",
        "Solucao_Nuelltech_Fit": "Lógica técnica: Como resolvemos isto? (Arquitetura ou produto).",
        "Argumentario_Venda": "Ângulo de venda, objeções a antecipar."
    }}
    """
    
    response = anthropic.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    content = response.content[0].text
    json_str = content[content.find('{'):content.rfind('}')+1]
    data = json.loads(json_str)
    
    notion.pages.update(
        page_id=page_id,
        properties={
            "Diagnostico_Problema": {"rich_text": [{"text": {"content": data['Diagnostico_Problema'][:2000]}}]},
            "Solucao_Nuelltech_Fit": {"rich_text": [{"text": {"content": data['Solucao_Nuelltech_Fit'][:2000]}}]},
            "Argumentario_Venda": {"rich_text": [{"text": {"content": data['Argumentario_Venda'][:2000]}}]},
            "Status": {"select": {"name": "Processado"}}
        }
    )

def main():
    db_id = os.environ["NOTION_DATABASE_ID"]
    
    if len(sys.argv) > 1:
        page = notion.pages.retrieve(page_id=sys.argv[1])
        processar_page(page)
    else:
        # Abordagem robusta utilizando o cliente HTTP interno do notion-client (httpx)
        # Evita por completo o erro do DatabasesEndpoint
        url = f"https://api.notion.com/v1/databases/{db_id}/query"
        headers = {
            "Authorization": f"Bearer {os.environ['NOTION_TOKEN']}",
            "Notion-Version": "2022-02-22",
            "Content-Type": "application/json"
        }
        body = {
            "filter": {
                "property": "Status",
                "select": {"equals": "Teste"}
            }
        }
        
        # O notion-client expõe o cliente HTTP utilizado internamente em notion.client
        response = notion.client.post(url, headers=headers, json=body)
        pendentes = response.json()
        
        for page in pendentes.get('results', []):
            processar_page(page)

if __name__ == "__main__":
    main()
