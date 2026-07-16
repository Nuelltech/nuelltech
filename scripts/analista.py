import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def processar_noticia(titulo, conteudo):
    prompt = f"""
    Analisa este conteúdo de mercado: "{titulo} - {conteudo}"
    Age como Diretor de Estratégia da Nuelltech.
    Retorna APENAS um objeto JSON válido (sem texto adicional, sem blocos de pensamento): 
    {{
        "Dor": "Resumo da dor principal",
        "Sentimento": "Positivo, Neutro ou Negativo",
        "Oportunidade": "Como a Nuelltech ajuda com IA",
        "Intensidade": 8
    }}
    """
    
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Processa para garantir que apenas o JSON é retornado
    full_text = response.content[0].text
    # Procura a posição do '{' e '}' para extrair o JSON puro
    start = full_text.find('{')
    end = full_text.rfind('}') + 1
    json_str = full_text[start:end]
    
    return json.loads(json_str)
