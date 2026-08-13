import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.error
from datetime import datetime
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
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  [ERRO API NOTION {e.code}] ao consultar base de dados:")
        print(f"  [DETALHE DO ERRO NOTION]: {body}")
        raise

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
        "Resumo_Executivo": "Resumo executivo: um resumo mais elaborado do artigo, de forma aque director de marketing, director comercial entendam o contexto, os envolvidos, os problemas e a questão em causa",
        "Oportunidade_Estrategica": "Qual é a oportunidade estratégica para a Nuelltech neste setor ou tema. como A Nuelltech pode ajudar a resolver este assunto com as nossas soluções de IA e automação",
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
        data_hoje = datetime.now().strftime("%Y-%m-%d")
        notion.pages.update(
            page_id=page_id,
            properties={
                "Dor/Problema":           {"rich_text": [{"text": {"content": data.get('Dor_Problema', '')[:2000]}}]},
                "Resumo_Executivo":        {"rich_text": [{"text": {"content": data.get('Resumo_Executivo', '')[:2000]}}]},
                "Oportunidade_Estrategica":{"rich_text": [{"text": {"content": data.get('Oportunidade_Estrategica', '')[:2000]}}]},
                "Acao_Imediata":           {"rich_text": [{"text": {"content": data.get('Acao_Imediata', '')[:2000]}}]},
                "Status":                  {"select": {"name": "Processado"}},
                "Data_Resumo":             {"date": {"start": data_hoje}}
            }
        )
        print(f"Sucesso ao processar: {titulo} [Data_Resumo: {data_hoje}]")
    except Exception as e:
        print(f"Erro ao processar página {page_id[:8]}...: {e}")

def clean_str(val):
    if not val:
        return ""
    return val.strip('\'" \t\r\n')

def main():
    parser = argparse.ArgumentParser(description="Analista Brain - Analisa artigos de mercado no Notion.")
    parser.add_argument("--setor", "-s", type=str, default="", help="Filtrar por setor (ex: farmacias, restaurantes). Vazio para todos.")
    parser.add_argument("--status", "-st", type=str, default="Novo", help="Filtrar por status (ex: Novo, Teste, Processado). Padrão: Novo.")
    parser.add_argument("--data-inicio", "-di", type=str, default="", help="Filtrar artigos criados a partir desta data (YYYY-MM-DD).")
    parser.add_argument("--data-fim", "-df", type=str, default="", help="Filtrar artigos criados até esta data (YYYY-MM-DD).")
    parser.add_argument("target_id", nargs="?", type=str, default="", help="ID ou URL de uma página específica no Notion a processar.")

    args = parser.parse_args()

    db_id = extract_notion_id(os.environ["NOTION_DATABASE_ID"])
    print(f"Database ID (primeiros 8 chars): {db_id[:8]}...")
    
    contexto_page_id = os.environ.get("NOTION_CONTEXTO_PAGE_ID", "")
    contexto = ler_contexto_notion(contexto_page_id) if contexto_page_id else "Contexto indisponível."

    if args.target_id:
        target_id = extract_notion_id(args.target_id)
        print(f"Processando página específica: {target_id[:8]}...")
        page = notion.pages.retrieve(page_id=target_id)
        processar_page(page, contexto)
        return

    # Construir filtros para a query do Notion
    filters = []

    # 1. Filtro de Status (opcional, padrão: "Novo")
    status_filtro = clean_str(args.status)
    if status_filtro:
        filters.append({
            "property": "Status",
            "select": {"equals": status_filtro}
        })

    # 2. Filtro de Setor (opcional, ex: "farmacias")
    setor_filtro = clean_str(args.setor)
    if setor_filtro:
        filters.append({
            "property": "Setor",
            "select": {"equals": setor_filtro}
        })

    # 3. Filtros de Data (opcional, YYYY-MM-DD) - verifica a coluna Data_Coleta ou a data de criação nativa
    data_inicio = clean_str(args.data_inicio)
    if data_inicio:
        filters.append({
            "or": [
                {"property": "Data_Coleta", "date": {"on_or_after": data_inicio}},
                {"timestamp": "created_time", "created_time": {"on_or_after": data_inicio}}
            ]
        })

    data_fim = clean_str(args.data_fim)
    if data_fim:
        filters.append({
            "or": [
                {"property": "Data_Coleta", "date": {"on_or_before": data_fim}},
                {"timestamp": "created_time", "created_time": {"on_or_before": data_fim}}
            ]
        })

    # Monta a estrutura de filtro do Notion
    if len(filters) == 0:
        filter_body = {}
    elif len(filters) == 1:
        filter_body = {"filter": filters[0]}
    else:
        filter_body = {"filter": {"and": filters}}

    print("Parâmetros de filtro aplicados:")
    print(f"  - Status: '{status_filtro if status_filtro else 'Todos'}'")
    print(f"  - Setor: '{setor_filtro if setor_filtro else 'Todos'}'")
    print(f"  - Data Início: '{data_inicio if data_inicio else 'Sem limite'}'")
    print(f"  - Data Fim: '{data_fim if data_fim else 'Sem limite'}'")

    pendentes = query_database(db_id, filter_body)
    results = pendentes.get('results', [])
    print(f"\nEncontrados {len(results)} artigos correspondentes aos critérios.")

    for page in results:
        processar_page(page, contexto)

if __name__ == "__main__":
    main()


