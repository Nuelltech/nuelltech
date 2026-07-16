import os
import json
from anthropic import Anthropic

# Inicializa o cliente do Claude com a chave de ambiente
client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def processar_noticia(titulo, conteudo):
    prompt = f"""
    Analisa este conteúdo de mercado: "{titulo} - {conteudo}"
    Age como Diretor de Estratégia da Nuelltech, uma empresa focada em implementação de IA para PMEs.
    
    Retorna APENAS um objeto JSON válido (sem qualquer texto introdutório ou markdown): 
    {{
        "Dor": "Resumo da dor principal do cliente (máximo 100 caracteres)",
        "Sentimento": "Positivo, Neutro ou Negativo",
        "Oportunidade": "Como a Nuelltech pode resolver isto com AI ou automação (max 200 caracteres)",
        "Intensidade": "Alta, Media ou Baixa"
    }}
    """
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extrai e limpa a resposta para garantir um JSON puro
    texto = response.content[0].text
    json_str = texto.replace("```json", "").replace("```", "").strip()
    return json.loads(json_str)
