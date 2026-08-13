import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.error
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
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
    cleaned = id_or_url.strip().strip("'\" \t\r\n")
    # Procura por 32 ou 36 caracteres hexadecimais (com ou sem hífens)
    match = re.search(r'([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})', cleaned, re.IGNORECASE)
    if match:
        raw = match.group(1).replace("-", "")
        return f"{raw[:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:]}"
    last_part = cleaned.split('?')[0].split('/')[-1]
    match_last = re.search(r'([a-f0-9]{32})', last_part, re.IGNORECASE)
    if match_last:
        raw = match_last.group(1)
        return f"{raw[:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:]}"
    return last_part if len(last_part) in [32, 36] else ""

def normalizar_setor_notion(setor_input):
    if not setor_input:
        return ""
    s = setor_input.lower().strip().strip('\'" \t\r\n')
    if "farm" in s:
        return "farmacias"
    elif "clin" in s:
        return "clinicas"
    elif "rest" in s:
        return "restaurantes"
    elif "fabr" in s or "fábr" in s:
        return "fábricas"
    elif "ecom" in s:
        return "ecommerce"
    return s


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

def ler_pagina_notion(page_id):
    """
    Lê o conteúdo de texto de uma página do Notion a partir do seu ID.
    """
    clean_page_id = extract_notion_id(page_id)
    if not clean_page_id:
        return ""
    try:
        blocks = notion.blocks.children.list(block_id=clean_page_id)
        text_parts = []
        for b in blocks.get('results', []):
            btype = b.get('type')
            if btype and btype in b and 'rich_text' in b[btype]:
                part = "".join([t.get('plain_text', '') for t in b[btype]['rich_text']])
                if part:
                    text_parts.append(part)
        return "\n".join(text_parts).strip()
    except Exception as e:
        print(f"Aviso ao ler página do Notion ({page_id}): {e}")
        return ""

def load_pipeline_config():
    """
    Carrega todas as páginas de prompts, taxonomias e contextos do Notion uma única vez no arranque (Cache).
    """
    print("\n--- Carregando Configuração e Prompts do Notion (Startup Cache) ---")
    config = {}

    # Prompts de Camadas C1 a C7 e C8 Output
    prompt_secrets = {
        "C1": os.environ.get("NOTION_ANALISTA_C1", ""),
        "C2": os.environ.get("NOTION_ANALISTA_C2", ""),
        "C3": os.environ.get("NOTION_ANALISTA_C3", ""),
        "C4": os.environ.get("NOTION_ANALISTA_C4", ""),
        "C5": os.environ.get("NOTION_ANALISTA_C5", ""),
        "C6": os.environ.get("NOTION_ANALISTA_C6", ""),
        "C7": os.environ.get("NOTION_ANALISTA_C7", ""),
        "C8_OUTPUT": os.environ.get("NOTION_ANALISTA_C8_OUTPUT", ""),
    }

    for key, pid in prompt_secrets.items():
        content = ler_pagina_notion(pid) if pid else ""
        config[key] = content
        print(f"  - {key}: {'✓ Carregado' if content else '✗ Inacessível ou Vazio'}")

    # Contextos por Setor
    sec_secrets = {
        "farmacias": os.environ.get("NOTION_SEC_FARM", ""),
        "clinicas": os.environ.get("NOTION_SEC_CLI", ""),
        "restaurantes": os.environ.get("NOTION_SEC_REST", ""),
        "ecommerce": os.environ.get("NOTION_SEC_ECOM", ""),
    }
    config["SEC"] = {}
    for setor_key, pid in sec_secrets.items():
        content = ler_pagina_notion(pid) if pid else ""
        config["SEC"][setor_key] = content
        print(f"  - Contexto Setor '{setor_key}': {'✓ Carregado' if content else '✗ Vazio'}")

    # Taxonomias de Dores por Setor
    tax_secrets = {
        "farmacias": os.environ.get("NOTION_TAX_FARM", ""),
        "clinicas": os.environ.get("NOTION_TAX_CLI", ""),
        "restaurantes": os.environ.get("NOTION_TAX_REST", ""),
        "ecommerce": os.environ.get("NOTION_TAX_ECOM", ""),
    }
    config["TAX"] = {}
    for setor_key, pid in tax_secrets.items():
        content = ler_pagina_notion(pid) if pid else ""
        config["TAX"][setor_key] = content
        print(f"  - Taxonomia Setor '{setor_key}': {'✓ Carregado' if content else '✗ Vazio'}")

    # Catálogo Nuelltech (CONTEXTO_PAGE_ID ou NOTION_CONTEXTO_PAGE_ID)
    catalogo_pid = os.environ.get("CONTEXTO_PAGE_ID") or os.environ.get("NOTION_CONTEXTO_PAGE_ID", "")
    config["CATALOGO"] = ler_pagina_notion(catalogo_pid) if catalogo_pid else ""
    print(f"  - Catálogo Nuelltech: {'✓ Carregado' if config['CATALOGO'] else '✗ Vazio'}")
    print("------------------------------------------------------------------\n")

    return config

def call_claude_json(system_prompt, user_prompt, max_tokens=2000):
    """
    Executa chamada à API do Claude e devolve objeto JSON.
    Possui 1 retry se a resposta de JSON for inválida.
    """
    default_system = "És um assistente especializado que responde EXCLUSIVAMENTE em formato JSON válido. Não incluas introduções, explicações nem texto fora das chaves JSON."
    sys_p = f"{default_system}\n{system_prompt}".strip() if system_prompt else default_system

    def execute_call():
        messages = [{"role": "user", "content": user_prompt}]
        kwargs = {
            "model": "claude-sonnet-4-6",
            "max_tokens": max_tokens,
            "system": sys_p,
            "messages": messages
        }
            
        resp = anthropic.messages.create(**kwargs)
        content = resp.content[0].text if resp.content else ""

        start_idx = content.find('{')
        end_idx = content.rfind('}')

        if start_idx == -1 or end_idx == -1 or start_idx > end_idx:
            print(f"  [DEBUG RESPOSTA BRUTA CLAUDE]: '{content}'")
            raise ValueError(f"Resposta do Claude não contém chaves JSON '{{' e '}}'. Resposta bruta: {content[:300]}")

        json_str = content[start_idx:end_idx+1]
        return json.loads(json_str)

    try:
        return execute_call()
    except Exception as first_error:
        print(f"  [Aviso] Falha na primeira tentativa JSON: {first_error}. A tentar 1 retry...")
        try:
            return execute_call()
        except Exception as retry_error:
            raise ValueError(f"Falha ao obter JSON válido do Claude após retry: {retry_error}")

def clean_str(val):
    if not val:
        return ""
    return val.strip('\'" \t\r\n')

def processar_page(page, config):
    page_id = extract_notion_id(page['id'])
    try:
        titulo = page['properties']['Nome']['title'][0]['text']['content']
    except (KeyError, IndexError):
        titulo = "Artigo sem título"

    try:
        fonte_url = page['properties']['Fonte']['url'] or ""
    except (KeyError, IndexError):
        fonte_url = ""

    # Extrai o corpo do texto da página no Notion
    corpo_pagina = ler_pagina_notion(page_id)
    parts = [f"Título: {titulo}"]
    if fonte_url:
        parts.append(f"URL/Fonte: {fonte_url}")
    if corpo_pagina:
        parts.append(f"Conteúdo:\n{corpo_pagina}")

    texto_completo = "\n\n".join(parts)


    print(f"\n==================================================")
    print(f"Iniciando Pipeline v2 para: '{titulo}' ({page_id[:8]}...)")
    print(f"  [Info Artigo] Tamanho do Texto Completo: {len(texto_completo)} caracteres")
    print(f"  [Info Artigo] Primeiros 150 caracteres: '{texto_completo[:150]}...'")
    print(f"==================================================")

    data_hoje = datetime.now().strftime("%Y-%m-%d")

    # Helper para marcar Erro Técnico no Notion
    def marcar_erro_tecnico(motivo):
        print(f"  [ERRO TÉCNICO] {motivo}")
        notion.pages.update(
            page_id=page_id,
            properties={
                "Status": {"select": {"name": "Erro"}},
                "Data_Resumo": {"date": {"start": data_hoje}},
                "Dor/Problema": {"rich_text": [{"text": {"content": f"[ERRO TÉCNICO] {motivo}"[:2000]}}]}
            }
        )

    # ----------------------------------------------------
    # CAMADA 1: Triagem
    # ----------------------------------------------------
    prompt_c1 = config.get("C1", "")
    if not prompt_c1:
        marcar_erro_tecnico("Prompt da Camada 1 (C1) inacessível ou vazio")
        return

    p1 = prompt_c1.replace("{{contexto_setor_farmacias}}", config["SEC"].get("farmacias", ""))
    p1 = p1.replace("{{contexto_setor_clinicas}}", config["SEC"].get("clinicas", ""))
    p1 = p1.replace("{{contexto_setor_restaurantes}}", config["SEC"].get("restaurantes", ""))
    p1 = p1.replace("{{contexto_setor_ecommerce}}", config["SEC"].get("ecommerce", ""))
    p1 = p1.replace("{{titulo}}", titulo)
    p1 = p1.replace("{{texto_completo}}", texto_completo)

    # Prevenir que o Claude copie o literal do schema de opções
    p1 = p1.replace('"Setor": "Farmácias | Clínicas | Restaurantes | E-commerce | Nenhum"',
                    '"Setor": "<escolhe exatamente UM destes valores: Farmácias, Clínicas, Restaurantes, E-commerce, Nenhum — nunca copies a lista, escreve só o valor escolhido>"')

    print("  [C1] Executando Triagem...")
    try:
        c1_output = call_claude_json(system_prompt="", user_prompt=p1)
    except Exception as e:
        marcar_erro_tecnico(f"Erro na Camada 1 (Triagem): {e}")
        return

    print(f"  [C1 JSON Bruto Devolvido pelo Claude]: {json.dumps(c1_output, ensure_ascii=False)}")

    setor = clean_str(c1_output.get("Setor", "Nenhum"))
    score_relevance = c1_output.get("Score_Relevancia", 0)
    avanca = c1_output.get("Avanca_Pipeline", True)

    # Validação de robustez: se o modelo devolveu o template com pipe "|" ou valor fora da lista válida, é um Erro Técnico!
    setores_validos = ["farmácias", "clínicas", "restaurantes", "e-commerce", "nenhum", "farmacias", "clinicas", "fábricas", "fabricas", "ecommerce"]
    setor_limpo = setor.lower().strip()

    if "|" in setor or (setor_limpo not in setores_validos and not any(k in setor_limpo for k in ["farm", "clin", "rest", "ecom", "fabr", "nenhum"])):
        marcar_erro_tecnico(f"Modelo devolveu valor de Setor inválido/template na Camada 1: '{setor}'")
        return

    print(f"  [C1 Output Avaliado] Setor: '{setor}' | Score: {score_relevance} | Avança: {avanca}")

    # Se Avanca_Pipeline for False, Score < 40 ou Setor == "Nenhum", marca como "Não Relevante" e encerra
    if not avanca or score_relevance < 40 or "nenhum" in setor_limpo:
        print(f"  --> Notícia considerada 'Não Relevante' (Score: {score_relevance}/100, Setor: '{setor}', Avança: {avanca}). Parando pipeline.")
        setor_key_temp = normalizar_setor_notion(setor)
        setor_gravacao = setor_key_temp if setor_key_temp in ["farmacias", "clinicas", "restaurantes", "ecommerce", "fábricas"] else "farmacias"
        notion.pages.update(
            page_id=page_id,
            properties={
                "Status": {"select": {"name": "Não Relevante"}},
                "Setor": {"select": {"name": setor_gravacao}},
                "Data_Resumo": {"date": {"start": data_hoje}},
                "Dor/Problema": {"rich_text": [{"text": {"content": f"Pontuação de Relevância: {score_relevance}/100 (Abaixo do limiar de 40). Tipo Fonte: {c1_output.get('Tipo_Fonte', '')}"[:2000]}}]}
            }
        )
        return


    # Normalizar chave do setor para taxonomias/contextos
    setor_norm = setor.lower().strip()
    if "farm" in setor_norm:
        setor_key = "farmacias"
    elif "clin" in setor_norm:
        setor_key = "clinicas"
    elif "rest" in setor_norm:
        setor_key = "restaurantes"
    elif "ecom" in setor_norm:
        setor_key = "ecommerce"
    else:
        setor_key = "farmacias"

    # ----------------------------------------------------
    # CAMADA 2: Extração Factual Ancorada
    # ----------------------------------------------------
    prompt_c2 = config.get("C2", "")
    if not prompt_c2:
        marcar_erro_tecnico("Prompt da Camada 2 (C2) inacessível ou vazio")
        return

    p2 = prompt_c2.replace("{{titulo}}", titulo).replace("{{texto_completo}}", texto_completo)

    print("  [C2] Executando Extração Factual...")
    try:
        c2_output = call_claude_json(system_prompt="", user_prompt=p2)
    except Exception as e:
        marcar_erro_tecnico(f"Erro na Camada 2 (Extração Factual): {e}")
        return

    # ----------------------------------------------------
    # CAMADA 3: Diagnóstico da Dor
    # ----------------------------------------------------
    prompt_c3 = config.get("C3", "")
    if not prompt_c3:
        marcar_erro_tecnico("Prompt da Camada 3 (C3) inacessível ou vazio")
        return

    taxonomia_setor = config["TAX"].get(setor_key, "")
    p3 = prompt_c3.replace("{{setor}}", setor)
    p3 = p3.replace("{{taxonomia_dores_setor}}", taxonomia_setor)
    p3 = p3.replace("{{output_camada_2}}", json.dumps(c2_output, ensure_ascii=False, indent=2))

    print(f"  [C3] Executando Diagnóstico da Dor para o setor '{setor}'...")
    try:
        c3_output = call_claude_json(system_prompt="", user_prompt=p3)
    except Exception as e:
        marcar_erro_tecnico(f"Erro na Camada 3 (Diagnóstico da Dor): {e}")
        return

    # ----------------------------------------------------
    # CAMADAS 4 & 5 (PARALELO): Resumo Executivo & Oportunidade Estratégica
    # ----------------------------------------------------
    prompt_c4 = config.get("C4", "")
    prompt_c5 = config.get("C5", "")

    if not prompt_c4 or not prompt_c5:
        marcar_erro_tecnico("Prompt da Camada 4 ou 5 inacessível ou vazio")
        return

    intensidade_info = c3_output.get("Intensidade", {})
    intensidade_val = intensidade_info.get("valor", 0) if isinstance(intensidade_info, dict) else 0
    intensidade_just = intensidade_info.get("justificacao", "") if isinstance(intensidade_info, dict) else ""

    p4 = prompt_c4.replace("{{setor}}", setor)
    p4 = p4.replace("{{output_camada_2}}", json.dumps(c2_output, ensure_ascii=False, indent=2))
    p4 = p4.replace("{{categoria_dor}}", c3_output.get("Categoria_Dor", ""))
    p4 = p4.replace("{{intensidade}}", str(intensidade_val))
    p4 = p4.replace("{{justificacao_intensidade}}", intensidade_just)
    p4 = p4.replace("{{evidencia}}", c3_output.get("Evidencia", ""))

    p5 = prompt_c5.replace("{{catalogo_nuelltech}}", config.get("CATALOGO", ""))
    p5 = p5.replace("{{setor}}", setor)
    p5 = p5.replace("{{categoria_dor}}", c3_output.get("Categoria_Dor", ""))
    p5 = p5.replace("{{intensidade}}", str(intensidade_val))
    p5 = p5.replace("{{evidencia}}", c3_output.get("Evidencia", ""))

    print("  [C4 & C5] Executando Resumo Executivo e Oportunidade Estratégica em paralelo...")
    try:
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_c4 = executor.submit(call_claude_json, "", p4)
            future_c5 = executor.submit(call_claude_json, "", p5)
            c4_output = future_c4.result()
            c5_output = future_c5.result()
    except Exception as e:
        marcar_erro_tecnico(f"Erro na execução paralela de C4/C5: {e}")
        return

    # ----------------------------------------------------
    # CAMADA 6: Ação Comercial Imediata
    # ----------------------------------------------------
    prompt_c6 = config.get("C6", "")
    if not prompt_c6:
        marcar_erro_tecnico("Prompt da Camada 6 (C6) inacessível ou vazio")
        return

    sec_context = config["SEC"].get(setor_key, "")

    p6 = prompt_c6.replace("{{setor}}", setor)
    p6 = p6.replace("{{ciclo_vendas_setor}}", sec_context)
    p6 = p6.replace("{{status_quo_setor}}", sec_context)
    p6 = p6.replace("{{estrutura_decisao_setor}}", sec_context)
    p6 = p6.replace("{{categoria_dor}}", c3_output.get("Categoria_Dor", ""))
    p6 = p6.replace("{{intensidade}}", str(intensidade_val))
    p6 = p6.replace("{{solucao_nuelltech}}", c5_output.get("Solucao_Nuelltech", ""))
    p6 = p6.replace("{{fit_portefolio}}", str(c5_output.get("Fit_Portefolio", True)))
    p6 = p6.replace("{{justificacao_fit}}", c5_output.get("Justificacao_Fit", ""))
    p6 = p6.replace("{{argumentario_transversal}}", config.get("CATALOGO", ""))

    print("  [C6] Executando Ação Comercial Imediata...")
    try:
        c6_output = call_claude_json(system_prompt="", user_prompt=p6)
    except Exception as e:
        marcar_erro_tecnico(f"Erro na Camada 6 (Ação Comercial): {e}")
        return

    # ----------------------------------------------------
    # CAMADA 7: QA / Quarentena
    # ----------------------------------------------------
    prompt_c7 = config.get("C7", "")
    if not prompt_c7:
        marcar_erro_tecnico("Prompt da Camada 7 (C7) inacessível ou vazio")
        return

    p7 = prompt_c7.replace("{{setor}}", setor)
    p7 = p7.replace("{{score_relevancia}}", str(score_relevance))
    p7 = p7.replace("{{apto_conteudo_publico}}", json.dumps(c1_output.get("Apto_Conteudo_Publico", {}), ensure_ascii=False))
    p7 = p7.replace("{{output_camada_2}}", json.dumps(c2_output, ensure_ascii=False, indent=2))
    p7 = p7.replace("{{categoria_dor}}", c3_output.get("Categoria_Dor", ""))
    p7 = p7.replace("{{intensidade}}", str(intensidade_val))
    p7 = p7.replace("{{evidencia}}", c3_output.get("Evidencia", ""))
    p7 = p7.replace("{{solucao_nuelltech}}", c5_output.get("Solucao_Nuelltech", ""))
    p7 = p7.replace("{{fit_portefolio}}", str(c5_output.get("Fit_Portefolio", True)))
    p7 = p7.replace("{{prova_aplicavel}}", c5_output.get("Prova_Aplicavel", ""))

    print("  [C7] Executando QA / Quarentena...")
    try:
        c7_output = call_claude_json(system_prompt="", user_prompt=p7)
    except Exception as e:
        marcar_erro_tecnico(f"Erro na Camada 7 (QA): {e}")
        return

    flag_revisao = c7_output.get("Flag_Revisao_Humana", False)
    motivo_flag = c7_output.get("Motivo_Flag", "Sem inconsistências detetadas")
    confianca = c7_output.get("Confianca", "alta")

    status_final = "Quarentena" if flag_revisao else "Processado"
    print(f"  [C7 Output] Status Final: '{status_final}' | Confiança: {confianca} | Flag: {flag_revisao} ({motivo_flag})")

    # ----------------------------------------------------
    # CAMADA 8: Consolidação e Escrita no Notion
    # ----------------------------------------------------
    dor_texto = (
        f"Categoria: {c3_output.get('Categoria_Dor', '')}\n"
        f"Intensidade: {intensidade_val}/5 ({intensidade_just})\n"
        f"Evidência: {c3_output.get('Evidencia', '')}\n\n"
        f"Factos Extraídos:\n" + "\n".join([f"- {f}" for f in c2_output.get("Factos_Extraidos", [])])
    )

    oportunidade_texto = (
        f"Solução: {c5_output.get('Solucao_Nuelltech', '')}\n"
        f"Fit no Portefólio: {'Sim' if c5_output.get('Fit_Portefolio') else 'Não / Transferível'}\n"
        f"Justificação: {c5_output.get('Justificacao_Fit', '')}\n"
        f"Prova Aplicável: {c5_output.get('Prova_Aplicavel', '')}"
    )

    objecoes = c6_output.get("Objecoes_Antecipadas", [])
    objecoes_str = "\n".join([f"- {o}" for o in objecoes]) if isinstance(objecoes, list) else str(objecoes)

    acao_texto = (
        f"Ângulo de Venda: {c6_output.get('Angulo_Venda', '')}\n\n"
        f"Objeções Antecipadas:\n{objecoes_str}\n\n"
        f"Próximo Passo: {c6_output.get('Proximo_Passo', '')}"
    )

    if flag_revisao:
        acao_texto += f"\n\n[MOTIVO QUARENTENA]: {motivo_flag}"

    # Atualiza Notion
    notion.pages.update(
        page_id=page_id,
        properties={
            "Dor/Problema":           {"rich_text": [{"text": {"content": dor_texto[:2000]}}]},
            "Resumo_Executivo":        {"rich_text": [{"text": {"content": c4_output.get('Resumo_Executivo', '')[:2000]}}]},
            "Oportunidade_Estrategica":{"rich_text": [{"text": {"content": oportunidade_texto[:2000]}}]},
            "Acao_Imediata":           {"rich_text": [{"text": {"content": acao_texto[:2000]}}]},
            "Status":                  {"select": {"name": status_final}},
            "Setor":                   {"select": {"name": setor_key}},
            "Data_Resumo":             {"date": {"start": data_hoje}}
        }
    )
    print(f"✓ Sucesso! Notícia '{titulo[:30]}...' gravada como '{status_final}' no Notion.\n")

def main():
    parser = argparse.ArgumentParser(description="Analista Brain v2 - Pipeline Multi-Camadas (C0 a C8).")
    parser.add_argument("--setor", "-s", type=str, default="", help="Filtrar por setor (ex: farmacias, restaurantes). Vazio para todos.")
    parser.add_argument("--status", "-st", type=str, default="Novo", help="Filtrar por status (ex: Novo, Teste, Processado). Padrão: Novo.")
    parser.add_argument("--data-inicio", "-di", type=str, default="", help="Filtrar artigos criados a partir desta data (YYYY-MM-DD).")
    parser.add_argument("--data-fim", "-df", type=str, default="", help="Filtrar artigos criados até esta data (YYYY-MM-DD).")
    parser.add_argument("target_id", nargs="?", type=str, default="", help="ID ou URL de uma página específica no Notion a processar.")

    args = parser.parse_args()

    db_id = extract_notion_id(os.environ["NOTION_DATABASE_ID"])
    print(f"Database ID (primeiros 8 chars): {db_id[:8]}...")

    # Carregar todas as configurações e prompts uma única vez no arranque (Cache)
    config = load_pipeline_config()

    if args.target_id:
        target_id = extract_notion_id(args.target_id)
        print(f"Processando página específica: {target_id[:8]}...")
        page = notion.pages.retrieve(page_id=target_id)
        processar_page(page, config)
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
    setor_filtro = normalizar_setor_notion(args.setor)
    if setor_filtro:
        filters.append({
            "property": "Setor",
            "select": {"equals": setor_filtro}
        })


    # 3. Filtros de Data (opcional, YYYY-MM-DD)
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
        processar_page(page, config)

if __name__ == "__main__":
    main()
