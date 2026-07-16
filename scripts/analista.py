import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def processar_noticia(titulo, conteudo):
    prompt = f"""
    Analisa este conteúdo de mercado: "{titulo} - {conteudo}"
    Age como Diretor de Estratégia da Nuelltech.
    Retorna APENAS um JSON: 
    {{
        "Dor": "Resumo curto",
        "Sentimento": "Positivo, Neutro ou Negativo",
        "Oportunidade": "Como a Nuelltech ajuda",
        "Intensidade": 8  // Retorna um número de 1 a 10
    }}
    """
    
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extrai e limpa
    texto = response.content[0].text
    json_str = texto.replace("```json", "").replace("```", "").strip()
    return json.loads(json_str)
