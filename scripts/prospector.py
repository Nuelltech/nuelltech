import os
import json
import re
import urllib.request
from anthropic import Anthropic

# 1. Carregar Variáveis de Ambiente (Injetadas pelo GitHub Actions)
NOTION_TOKEN      = os.environ.get("NOTION_API_KEY")   # Mapeado de secrets.NOTION_TOKEN no workflow
INBOX_DB_ID_RAW   = os.environ.get("INBOX_DB_ID", "")
CAMPANHAS_DB_ID_RAW = os.environ.get("CAMPANHAS_DB_ID", "")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

NOTION_VERSION = "2022-06-28"

anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

# ---------------------------------------------------------------------------
# Utilitário: extrair UUID limpo a partir de URL ou ID do Notion
# ---------------------------------------------------------------------------
def extract_notion_id(id_or_url):
    if not id_or_url:
        return ""
    cleaned = id_or_url.strip().strip("'\"")
    match = re.search(
        r'([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})',
        cleaned, re.IGNORECASE
    )
    if match:
        return match.group(1)
    return cleaned.split('?')[0].split('/')[-1]

INBOX_DB_ID     = extract_notion_id(INBOX_DB_ID_RAW)
CAMPANHAS_DB_ID = extract_notion_id(CAMPANHAS_DB_ID_RAW)

# ---------------------------------------------------------------------------
# Utilitário: chamada HTTP ao Notion (sem requests, usa stdlib)
# ---------------------------------------------------------------------------
def notion_post(path, payload):
    url = f"https://api.notion.com/v1/{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))

def notion_patch(path, payload):
    url = f"https://api.notion.com/v1/{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="PATCH",
        headers={
            "Authorization": f"Bearer {NOTION_TOKEN}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))

# ---------------------------------------------------------------------------
# 1. Obter artigos processados da Inbox_Mercado para um setor
# ---------------------------------------------------------------------------
def obter_artigos_processados(setor_alvo):
    print(f"A procurar artigos processados para o setor: {setor_alvo}...")
    resultado = notion_post(f"databases/{INBOX_DB_ID}/query", {
        "filter": {
            "and": [
                {"property": "Status", "select": {"equals": "Processado"}},
                {"property": "Setor",  "select": {"equals": setor_alvo}}
            ]
        }
    })

    resultados = resultado.get("results", [])

    if not resultados:
        print(f"  Sem artigos processados para '{setor_alvo}'.")
        return None, []

    contexto_para_claude = ""
    artigos_ids = []

    for pagina in resultados:
        artigos_ids.append(pagina["id"])
        props = pagina["properties"]

        try:
            nome = props["Nome"]["title"][0]["text"]["content"]
        except (KeyError, IndexError):
            nome = "Artigo sem título"

        try:
            dor = props["Dor/Problema"]["rich_text"][0]["text"]["content"]
        except (KeyError, IndexError):
            dor = ""

        try:
            resumo = props["Resumo_Executivo"]["rich_text"][0]["text"]["content"]
        except (KeyError, IndexError):
            resumo = ""

        try:
            oportunidade = props["Oportunidade_Estrategica"]["rich_text"][0]["text"]["content"]
        except (KeyError, IndexError):
            oportunidade = ""

        contexto_para_claude += (
            f"Artigo: {nome}\n"
            f"  Dor/Problema: {dor}\n"
            f"  Resumo: {resumo}\n"
            f"  Oportunidade: {oportunidade}\n\n"
        )

    print(f"  Encontrados {len(artigos_ids)} artigos para '{setor_alvo}'.")
    return contexto_para_claude, artigos_ids

# ---------------------------------------------------------------------------
# 2. Chamar Claude para gerar a campanha de prospeção
# ---------------------------------------------------------------------------
def gerar_campanha_com_claude(setor, contexto):
    print(f"  A gerar campanha com Claude para o setor: {setor}...")

    prompt = f"""
    És um especialista em vendas B2B para PMEs portuguesas.
    A Nuelltech é uma empresa de automação e IA que resolve problemas operacionais em PMEs.

    Com base nos seguintes artigos e dores identificadas no setor de {setor}:
    {contexto}

    Gera uma campanha de prospeção. Retorna APENAS um objeto JSON válido, sem texto antes ou depois.
    {{
        "tema_central": "O padrão de dor comum identificado em 1 frase.",
        "draft_email": "Email de prospeção frio (máx 150 palavras). Tom direto, sem floreados. Menciona a dor específica do setor.",
        "draft_linkedin": "Mensagem LinkedIn de prospeção (máx 80 palavras). Tom mais informal mas profissional."
    }}
    """

    response = anthropic.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.content[0].text
    json_str = content[content.find('{'):content.rfind('}')+1]
    return json.loads(json_str)

# ---------------------------------------------------------------------------
# 3. Criar campanha na tabela Campanhas_Prospector no Notion
# ---------------------------------------------------------------------------
def criar_campanha_notion(setor, tema, draft_email, draft_linkedin, ids_origem):
    print("  A injetar nova campanha na tabela Campanhas_Prospector...")

    relation_data = [{"id": page_id} for page_id in ids_origem]

    payload = {
        "parent": {"database_id": CAMPANHAS_DB_ID},
        "properties": {
            "Nome da Campanha": {"title": [{"text": {"content": f"Campanha {setor.capitalize()} - Automática"}}]},
            "Setor_Alvo":       {"select": {"name": setor}},
            "Status_Campanha":  {"select": {"name": "Rascunho Pronto"}},
            "Tema_Central":     {"rich_text": [{"text": {"content": tema[:2000]}}]},
            "Draft_Email":      {"rich_text": [{"text": {"content": draft_email[:2000]}}]},
            "Draft_LinkedIn":   {"rich_text": [{"text": {"content": draft_linkedin[:2000]}}]},
            "Artigos_Origem":   {"relation": relation_data}
        }
    }

    try:
        notion_post("pages", payload)
        print(f"  Campanha criada com sucesso para '{setor}'.")
        return True
    except Exception as e:
        print(f"  Erro ao criar campanha para '{setor}': {e}")
        return False

# ---------------------------------------------------------------------------
# 4. Arquivar artigos usados (Status → "Utilizado")
# ---------------------------------------------------------------------------
def arquivar_artigos_usados(ids_origem):
    print("  A marcar artigos como 'Utilizado' na Inbox_Mercado...")
    for page_id in ids_origem:
        try:
            notion_patch(f"pages/{page_id}", {
                "properties": {
                    "Status": {"select": {"name": "Utilizado"}}
                }
            })
        except Exception as e:
            print(f"  Aviso ao arquivar {page_id[:8]}...: {e}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    try:
        with open("scripts/alvos.json", "r", encoding="utf-8") as f:
            setores_ativos = json.load(f)["setores"]
    except Exception:
        setores_ativos = ["restaurantes", "farmacias", "clinicas", "fábricas"]

    print(f"Prospector iniciado. Setores: {setores_ativos}")
    print(f"INBOX_DB_ID     (8 chars): {INBOX_DB_ID[:8]}...")
    print(f"CAMPANHAS_DB_ID (8 chars): {CAMPANHAS_DB_ID[:8] if CAMPANHAS_DB_ID else 'NÃO DEFINIDO'}...")

    for setor in setores_ativos:
        print(f"\n--- Setor: {setor.upper()} ---")
        contexto, ids = obter_artigos_processados(setor)

        if not contexto:
            continue

        try:
            dados = gerar_campanha_com_claude(setor, contexto)
        except Exception as e:
            print(f"  Erro ao chamar Claude para '{setor}': {e}")
            continue

        sucesso = criar_campanha_notion(
            setor,
            dados.get("tema_central", ""),
            dados.get("draft_email", ""),
            dados.get("draft_linkedin", ""),
            ids
        )

        if sucesso:
            arquivar_artigos_usados(ids)
            print(f"  Pipeline completo para o setor: {setor} ✓")

    print("\nProspector concluído.")

if __name__ == "__main__":
    main()
