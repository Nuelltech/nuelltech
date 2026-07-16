import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def processar_noticia(titulo, conteudo):
    prompt = f"""
    Analisa este conteúdo de mercado: "{titulo} - {conteudo}"
    Age como Diretor de Estratégia da Nuelltech.
    Retorna apenas um objeto JSON (sem texto adicional): 
    {{
        "Dor": "Resumo da dor principal (máximo 100 caracteres)",
        "Sentimento": "Positivo", "Neutro" ou "Negativo",
        "Oportunidade": "Como a Nuelltech pode resolver isto com AI ou automação",
        "Intensidade": "Alta", "Media" ou "Baixa"
    }}
    """
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Limpa a resposta do Claude
    texto = response.content[0].text
    # Garante que extraímos apenas o JSON
    json_str = texto.replace("```json", "").replace("```", "").strip()
    return json.loads(json_str)
