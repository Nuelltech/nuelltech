import os
import sys
import json
import re
from anthropic import Anthropic
from notion_client import Client

# Inicialização
anthropic = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
notion = Client(auth=os.environ["NOTION_TOKEN"])

def extract_notion_id(id_or_url):
    """
    Extrai e limpa o ID do Notion a partir de um ID, URL ou string com parâmetros query.
    Previne erros de URL inválida (invalid_request_url).
    """
    if not id_or_url:
        return ""
    cleaned = id_or_url.strip().strip("'\"")
    match = re.search(r'([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})', cleaned, re.IGNORECASE)
    if match:
        return match.group(1)
    return cleaned.split('?')[0].split('/')[-1]

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
    # Extração segura do título
    try:
        titulo = page['properties']['Nome']['title'][0]['text']['content']
    except (KeyError, IndexError):
        titulo = "Artigo sem título"
        
    print(f"Processando artigo: {titulo} ({page_id})...")
    
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
    
    try:
        response = anthropic.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        content = response.content[0].text
        # Extração robusta de JSON
        json_str = content[content.find('{'):content.rfind('}')+1]
        data = json.loads(json_str)
        
        # Atualização com corte de segurança para limites do Notion (2000 chars)
        notion.pages.update(
            page_id=page_id,
            properties={
                "Diagnostico_Problema": {"rich_text": [{"text": {"content": data.get('Diagnostico_Problema', '')[:2000]}}]},
                "Solucao_Nuelltech_Fit": {"rich_text": [{"text": {"content": data.get('Solucao_Nuelltech_Fit', '')[:2000]}}]},
                "Argumentario_Venda": {"rich_text": [{"text": {"content": data.get('Argumentario_Venda', '')[:2000]}}]},
                "Status": {"select": {"name": "Processado"}}
            }
        )
        print(f"Sucesso ao processar {titulo}")
    except Exception as e:
        print(f"Erro ao processar página {page_id}: {e}")

def main():
    db_id = extract_notion_id(os.environ["NOTION_DATABASE_ID"])
    contexto_page_id = os.environ.get("NOTION_CONTEXTO_PAGE_ID", "")
    contexto = ler_contexto_notion(contexto_page_id) if contexto_page_id else "Contexto indisponível."
    
    if len(sys.argv) > 1:
        target_id = extract_notion_id(sys.argv[1])
        page = notion.pages.retrieve(page_id=target_id)
        processar_page(page, contexto)
    else:
        # Usa notion.request() com ID limpo — compatível com todas as versões do SDK
        pendentes = notion.request(
            path=f"databases/{db_id}/query",
            method="POST",
            body={
                "filter": {
                    "property": "Status",
                    "select": {"equals": "Teste"}
                }
            }
        )
        results = pendentes.get('results', [])
        print(f"Encontrados {len(results)} artigos pendentes com Status='Teste'.")
        for page in results:
            processar_page(page, contexto)

if __name__ == "__main__":
    main()
