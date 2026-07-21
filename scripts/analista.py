import os
import sys
import json
import re
import urllib.request
from anthropic import Anthropic
from notion_client import Client

# Inicialização
anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])
NOTION_TOKEN = os.environ["NOTION_TOKEN"]
NOTION_VERSION = "2022-06-28"

def extract_notion_id(id_or_url):
    if not id_or_url:
        return ""
    cleaned = id_or_url.strip().strip("'\"")
    match = re.search(r'([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})', cleaned, re.IGNORECASE)
    if match:
        return match.group(1)
    return cleaned.split('?')[0].split('/')[-1]

def query_database(db_id, filter_body):
    """
    Consulta a base de dados Notion via urllib (stdlib) — zero dependências externas.
    """
    url = f"https://api.notion.com/v1/databases/{db_id}/query"
    data = json.dumps(filter_body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

def ler_contexto_notion(page_id):
    clean_page_id = extract_notion_id(page_id)
    if not clean_page_id:
        return "Contexto indisponível."
    try:
        blocks = notion.blocks.children.list(block_id=clean_page_id)
        return "\n".join([b['paragraph']['rich_text'][0]['plain_text'] for b in blocks['results'] if 'paragraph' in b and b['paragraph']['rich_text']])
    except Exception as e:
        print(f"Aviso ao ler contexto do Notion ({page_id}): {e}")
        return "Contexto indisponível."

def processar_page(page, contexto):
    page_id = extract_notion_id(page['id'])
    try:
        titulo = page['properties']['Nome']['title'][0]['text']['content']
    except (KeyError, IndexError):
        titulo = "Artigo sem título"
        
    print(f"Processando artigo: {titulo} ({page_id[:8]}...)...")
    
    prompt = f"""
    Contexto Nuelltech: {contexto}
    Analisa este artigo: "{titulo}"
    Retorna APENAS um objeto JSON válido. Não escrevas nada antes ou depois.
    {{
        "Dor_Problema": "Descreve o desafio, dor e impacto para a empresa (2-3 parágrafos).",
        "Resumo_Executivo": "Resumo executivo: como a Nuelltech resolve este problema com as suas soluções de IA e automação.",
        "Oportunidade_Estrategica": "Qual é a oportunidade estratégica para a Nuelltech neste setor ou tema.",
        "Acao_Imediata": "Ação comercial imediata: ângulo de venda, objeções a antecipar, próximo passo."
    }}
    """
    
    try:
        response = anthropic.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text
        json_str = content[content.find('{'):content.rfind('}')+1]
        data = json.loads(json_str)
        
        # Nomes das colunas reais da base de dados Inbox_Mercado no Notion
        notion.pages.update(
            page_id=page_id,
            properties={
                "Dor/Problema":           {"rich_text": [{"text": {"content": data.get('Dor_Problema', '')[:2000]}}]},
                "Resumo_Executivo":        {"rich_text": [{"text": {"content": data.get('Resumo_Executivo', '')[:2000]}}]},
                "Oportunidade_Estrategica":{"rich_text": [{"text": {"content": data.get('Oportunidade_Estrategica', '')[:2000]}}]},
                "Acao_Imediata":           {"rich_text": [{"text": {"content": data.get('Acao_Imediata', '')[:2000]}}]},
                "Status":                  {"select": {"name": "Processado"}}
            }
        )
        print(f"Sucesso ao processar: {titulo}")
    except Exception as e:
        print(f"Erro ao processar página {page_id[:8]}...: {e}")

def main():
    db_id = extract_notion_id(os.environ["NOTION_DATABASE_ID"])
    print(f"Database ID (primeiros 8 chars): {db_id[:8]}...")
    
    contexto_page_id = os.environ.get("NOTION_CONTEXTO_PAGE_ID", "")
    contexto = ler_contexto_notion(contexto_page_id) if contexto_page_id else "Contexto indisponível."

    # Filtro: muda para "Novo" quando quiseres processar todos os artigos
    status_filtro = "Teste"

    if len(sys.argv) > 1:
        target_id = extract_notion_id(sys.argv[1])
        page = notion.pages.retrieve(page_id=target_id)
        processar_page(page, contexto)
    else:
        pendentes = query_database(db_id, {
            "filter": {
                "property": "Status",
                "select": {"equals": status_filtro}
            }
        })
        results = pendentes.get('results', [])
        print(f"Encontrados {len(results)} artigos pendentes com Status='{status_filtro}'.")
        for page in results:
            processar_page(page, contexto)

if __name__ == "__main__":
    main()
