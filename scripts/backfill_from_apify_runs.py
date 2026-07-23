"""
Script único (não recorrente) para recuperar dados já pagos em runs anteriores
da Apify, que nunca chegaram a ser gravados no Notion por causa de timeouts
do lado do GitHub Actions. Reler datasets já processados não tem custo —
só correr o actor de novo é que custa.

Uso:
    python scripts/backfill_from_apify_runs.py
"""
import os
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse

NOTION_TOKEN   = os.environ["NOTION_TOKEN"]
LEADS_DB_ID    = os.environ["LEADS_DB_ID"]
APIFY_TOKEN    = os.environ["APIFY_API_TOKEN"]

NOTION_VERSION = "2022-06-28"

GMAPS_ACTOR    = "compass~crawler-google-places"
CONTACTS_ACTOR = "vdrmota~contact-info-scraper"

COL_EMPRESA  = "Empresa / Organização"
COL_EMAIL    = "E-mail"
COL_LINKEDIN = "Perfil LinkedIn"
COL_INSTAGRAM = "Instagram"


def apify_get(path):
    url = f"https://api.apify.com/v2/{path}{'&' if '?' in path else '?'}token={APIFY_TOKEN}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def listar_runs_concluidos(actor_id, limite=20):
    dados = apify_get(f"acts/{actor_id}/runs?limit={limite}&desc=true&status=SUCCEEDED")
    return dados.get("data", {}).get("items", [])


def obter_dataset_items(dataset_id):
    dados = apify_get(f"datasets/{dataset_id}/items")
    return dados if isinstance(dados, list) else []


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
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"  [NOTION ERROR {e.code}] {e.read().decode('utf-8')[:400]}")
        raise


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
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"  [NOTION ERROR {e.code}] {e.read().decode('utf-8')[:400]}")
        raise


def encontrar_pagina_por_empresa(nome_empresa):
    resultado = notion_post(f"databases/{LEADS_DB_ID}/query", {
        "filter": {"property": COL_EMPRESA, "rich_text": {"equals": nome_empresa}}
    })
    resultados = resultado.get("results", [])
    return resultados[0]["id"] if resultados else None


def dominio_de(url):
    if not url:
        return ""
    return urlparse(url).netloc.replace("www.", "")


def main():
    print("A listar runs concluídos do Google Maps Scraper...")
    website_por_dominio_para_nome = {}
    for run in listar_runs_concluidos(GMAPS_ACTOR):
        dataset_id = run.get("defaultDatasetId")
        if not dataset_id:
            continue
        for item in obter_dataset_items(dataset_id):
            nome = (item.get("title") or "").strip()
            website = (item.get("website") or "").strip()
            dominio = dominio_de(website)
            if nome and dominio:
                website_por_dominio_para_nome[dominio] = nome
    print(f"  {len(website_por_dominio_para_nome)} empresas mapeadas por domínio.")

    print("\nA listar runs concluídos do Contact Details Scraper...")
    contactos_por_dominio = {}
    for run in listar_runs_concluidos(CONTACTS_ACTOR):
        dataset_id = run.get("defaultDatasetId")
        if not dataset_id:
            continue
        for item in obter_dataset_items(dataset_id):
            pagina_url = item.get("url") or item.get("referrerUrl") or ""
            dominio = dominio_de(pagina_url)
            if not dominio:
                continue
            entrada = contactos_por_dominio.setdefault(dominio, {"email": "", "linkedin": "", "instagram": ""})
            emails = item.get("emails") or ([item["email"]] if item.get("email") else [])
            if emails and not entrada["email"]:
                entrada["email"] = emails[0]
            linkedins = item.get("linkedIns") or item.get("linkedins") or []
            if linkedins and not entrada["linkedin"]:
                entrada["linkedin"] = linkedins[0]
            instagrams = item.get("instagrams") or []
            if instagrams and not entrada["instagram"]:
                entrada["instagram"] = instagrams[0]
    print(f"  {len(contactos_por_dominio)} domínios com contactos recolhidos.")

    print("\nA atualizar leads no Notion...")
    atualizados = 0
    for dominio, contactos in contactos_por_dominio.items():
        nome_empresa = website_por_dominio_para_nome.get(dominio)
        if not nome_empresa:
            continue
        if not (contactos["email"] or contactos["linkedin"] or contactos["instagram"]):
            continue

        page_id = encontrar_pagina_por_empresa(nome_empresa)
        if not page_id:
            print(f"  '{nome_empresa}' não encontrada no Notion (talvez tenha sido apagada).")
            continue

        properties = {}
        if contactos["email"]:
            properties[COL_EMAIL] = {"email": contactos["email"]}
        if contactos["linkedin"]:
            properties[COL_LINKEDIN] = {"url": contactos["linkedin"]}
        if contactos["instagram"]:
            properties[COL_INSTAGRAM] = {"url": contactos["instagram"]}

        try:
            notion_patch(f"pages/{page_id}", {"properties": properties})
            atualizados += 1
            print(f"  ✓ Atualizado: {nome_empresa} | email: {contactos['email'] or 'N/D'} "
                  f"| linkedin: {'sim' if contactos['linkedin'] else 'N/D'} "
                  f"| instagram: {'sim' if contactos['instagram'] else 'N/D'}")
        except Exception as e:
            print(f"  Erro ao atualizar '{nome_empresa}': {e}")

    print(f"\nConcluído. {atualizados} leads atualizados com dados já pagos.")


if __name__ == "__main__":
    main()
