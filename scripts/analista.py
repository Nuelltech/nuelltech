import os
import sys
import json
from anthropic import Anthropic
from notion_client import Client

anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])

def ler_contexto_notion(page_id):
    blocks = notion.blocks.children.list(block_id=page_id)
    return "\n".join([b['paragraph']['rich_text'][0]['plain_text'] for b in blocks['results'] if 'paragraph' in b and b['paragraph']['rich_text']])

def processar_page(page):
    page_id = page['id']
    titulo = page['properties']['Nome']['title'][0]['text']['content']
    contexto = ler_contexto_notion(os.environ["NOTION_CONTEXTO_PAGE_ID"])
    
    prompt = f"""
    Contexto Nuelltech: {contexto}
    Analisa este artigo: "{titulo}"
    Retorna APENAS JSON estruturado:
    {{
        "Diagnostico_Problema": "...",
        "Solucao_Nuelltech_Fit": "...",
        "Argumentario_Venda": "...",
        "Intensidade": 9
    }}
    """
    
    response = anthropic.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    data = json.loads(response.content[0].text.split('{', 1)[1].rsplit('}', 1)[0].replace('{', '', 1))
    
    notion.pages.update(
        page_id=page_id,
        properties={
            "Diagnostico_Problema": {"rich_text": [{"text": {"content": data['Diagnostico_Problema']}}]},
            "Solucao_Nuelltech_Fit": {"rich_text": [{"text": {"content": data['Solucao_Nuelltech_Fit']}}]},
            "Argumentario_Venda": {"rich_text": [{"text": {"content": data['Argumentario_Venda']}}]},
            "Status": {"select": {"name": "Processado"}}
        }
    )

def main():
    if len(sys.argv) > 1:
        page = notion.pages.retrieve(page_id=sys.argv[1])
        processar_page(page)
    else:
        pendentes = notion.databases.query(database_id=os.environ["NOTION_DATABASE_ID"], 
                                           filter={"property": "Status", "select": {"equals": "Novo"}})
        for page in pendentes['results']:
            processar_page(page)

if __name__ == "__main__":
    main()
