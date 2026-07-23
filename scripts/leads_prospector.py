import os
import requests

# Carregamento das variáveis de ambiente / GitHub Secrets
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY")
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
DATABASE_ID = os.getenv("LEADS_DB_ID")

def search_apollo_decision_makers(job_titles, industry_keyword, limit=5):
    """
    Pesquisa decisores na API do Apollo.io com base em cargos e setor.
    """
    url = "https://api.apollo.io/v1/mixed_people/search"
    
    headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": APOLLO_API_KEY
    }
    
    payload = {
        "api_key": APOLLO_API_KEY,
        "person_titles": job_titles,  # Ex: ["Director", "Chief Financial Officer", "IT Director"]
        "q_organization_keyword": industry_keyword, # Ex: "Clinics", "Restaurants"
        "per_page": limit,
        "person_locations": ["Portugal"] # Focado no mercado local
    }
    
    print(f"A pesquisar no Apollo.io por '{industry_keyword}' (Cargos: {job_titles})...")
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        leads = []
        for person in data.get("people", []):
            leads.append({
                "name": person.get("name"),
                "company": person.get("organization", {}).get("name"),
                "title": person.get("title"),
                "email": person.get("email"),
                "linkedin": person.get("linkedin_url")
            })
        print(f"Encontrados {len(leads)} contactos com sucesso.")
        return leads
    else:
        print(f"Erro na API do Apollo: {response.status_code} - {response.text}")
        return []

def save_lead_to_notion(lead):
    """
    Insere o lead recolhido na base de dados 'Leads_Prospector' no Notion.
    """
    url = "https://api.notion.com/v1/pages"
    
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    payload = {
        "parent": {"database_id": DATABASE_ID},
        "properties": {
            "Name": {
                "title": [{"text": {"content": lead.get("name", "Desconhecido")}}]
            },
            "Company": {
                "rich_text": [{"text": {"content": lead.get("company", "Desconhecida")}}]
            },
            "Email": {
                "email": lead.get("email")
            },
            "LinkedIn": {
                "url": lead.get("linkedin")
            },
            "Status": {
                "status": {"name": "New"}
            }
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        print(f"-> Lead guardado no Notion: {lead.get('name')} ({lead.get('company')})")
    else:
        print(f"-> Erro ao guardar no Notion para {lead.get('name')}: {response.status_code} - {response.text}")

def main():
    # Validação rápida de segurança das chaves
    if not APOLLO_API_KEY or not NOTION_API_KEY or not DATABASE_ID:
        print("Erro: Certifica-te de que todas as variáveis de ambiente (APOLLO_API_KEY, NOTION_API_KEY, LEADS_DB_ID) estão configuradas.")
        return

    # Exemplo de execução para um dos setores-alvo (ex: Clínicas / Diretores e IT/Financeiro)
    cargos_alvo = ["Director", "Chief Financial Officer", "IT Director"]
    setor_alvo = "Clinics"
    
    # 1. Obter decisores do Apollo
    decisores = search_apollo_decision_makers(job_titles=cargos_alvo, industry_keyword=setor_alvo, limit=5)
    
    # 2. Filtrar e registar apenas quem tem e-mail válido diretamente no Notion
    for lead in decisores:
        if lead.get("email"):
            save_lead_to_notion(lead)
        else:
            print(f"-> Ignorado (sem e-mail visível): {lead.get('name')}")

if __name__ == "__main__":
    main()S
