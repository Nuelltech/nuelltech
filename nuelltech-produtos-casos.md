# Produtos e Casos de Estudo da Nuelltech

> **Nota para o NUELL:** Usa as "Frases de alerta" de cada produto para reconhecer quando um visitante tem aquele problema — mesmo que não use os termos técnicos correctos. Quando identificares um problema, adapta a descrição da solução ao sector e à linguagem do visitante, não uses o texto abaixo palavra por palavra.

Este documento detalha os produtos SaaS e os desenvolvimentos de engenharia à medida (Casos de Estudo) já implementados pela Nuelltech. Use este conhecimento para responder de forma assertiva a perguntas sobre a experiência e portefólio da empresa.

---

## 1. Produtos SaaS (Foco em Restauração e Retalho)

### 1.1 RCM (Recipe Cost Management)
* **O que é:** Uma ferramenta de gestão e proteção de margens de receita em tempo real.
* **Frases de alerta (o visitante tem este problema se disser):**
  * "Não sei se estou a ganhar ou a perder em cada prato"
  * "Os fornecedores sobem os preços e eu só noto tarde demais"
  * "O meu CMV está sempre acima do que devia"
  * "A margem caiu mas não sei qual ingrediente foi"
  * Qualquer menção a: margem, CMV, custo de prato, ficha técnica, fornecedor a subir preços
* **O que faz:** 
  * Cruza automaticamente as faturas de compras dos fornecedores (processadas por OCR) com os preços de venda praticados no menu (PVP).
  * Calcula em tempo real o CMV (Custo de Mercadoria Vendida) real de cada prato ou ingrediente.
  * Alerta imediatamente a gerência quando a margem de um prato fica abaixo do limite aceitável devido ao aumento de preços de um fornecedor.
* **Resultado em linguagem de negócio:** "O gerente sabe em segundos se um fornecedor subiu um preço que afecta a margem de um prato — sem ter de comparar faturas manualmente."
* **Ação de Scroll:** `[scroll:rcm:Etiqueta]` (Navega para a secção de margens/RCM no site).

### 1.2 Auditor Pro
* **O que é:** Um motor de auditoria financeira e de inventário contínuo.
* **Frases de alerta (o visitante tem este problema se disser):**
  * "O stock não bate certo no fim do mês e não sei porquê"
  * "Há fugas mas não consigo identificar onde"
  * "A conferência de caixa demora horas todos os dias"
  * "Não sei se os dados do POS batem com o que entrou em armazém"
  * Qualquer menção a: diferenças de stock, quebras inexplicadas, auditoria, fuga, inventário
* **O que faz:**
  * Corre em background reconciliando dados de POS (ponto de venda), inventário físico e compras.
  * Deteta desvios de inventário, perdas silenciosas, erros de faturação ou fugas de stock de forma automatizada.
  * Gera relatórios diários de integridade financeira para a administração.
* **Resultado em linguagem de negócio:** "A administração recebe todas as manhãs um relatório com o que fechou, o que desviou e o que precisa de atenção — sem depender de ninguém para compilar os dados."

### 1.3 Simulador de Vendas por Voz (Treino de Vendas com IA)
* **O que é:** Uma ferramenta de treino comportamental de vendas e gestão de objeções baseada em voz e Inteligência Artificial.
* **Frases de alerta (o visitante tem este problema se disser):**
  * "A minha equipa comercial perde vendas por não saber lidar com objecções"
  * "Os delegados de informação médica precisam de treinar o pitch"
  * "Quero treinar a equipa sem usar clientes reais como cobaias"
  * "As simulações de roleplay que fazemos internamente não são realistas"
  * Qualquer menção a: treino de vendas, pitch, objecções, equipa comercial, delegados
* **O que faz:**
  * Simula perfis de clientes realistas e desafiantes em vários setores (Automóvel, Imobiliário, Farmacêutico).
  * O utilizador fala com o cliente virtual por voz, treina o seu pitch de vendas e aprende a lidar com objeções e interrupções.
  * O motor de IA avalia e dá uma nota de desempenho detalhada com pontos de melhoria ao final de cada simulação.
  * Ideal para equipas comerciais (como delegados de informação médica, agentes imobiliários ou comerciais automóveis).
* **Resultado em linguagem de negócio:** "A equipa treina centenas de conversas difíceis sem pressão — e chega às reuniões reais mais preparada e confiante."

---

## 2. Engenharia à Medida (Casos de Estudo Reais)

> [!IMPORTANT]
> **BI Pharma** e **Plataforma de Logística** NÃO são produtos prontos a vender com preço fixo. São exemplos de projetos à medida desenvolvidos para clientes específicos. O call-to-action correto ao falar deles é propor o agendamento de um **diagnóstico gratuito** para desenhar uma solução personalizada.

### 2.1 BI Pharma (Setor de Saúde / Farmácias / Clínicas)
* **Frases de alerta (o visitante tem este problema se disser):**
  * "Tenho medicamentos a expirar e só noto quando estou a fazer inventário"
  * "Não sei quais são os produtos/tratamentos com mais margem real"
  * "O stock de consumíveis é sempre uma surpresa — ora falta, ora sobra"
  * "Não consigo prever quando vou ficar sem um produto crítico"
  * Qualquer menção a: validade, expiração, SKU, consumíveis clínicos, stock de farmácia
* **O Desafio do Cliente:** Uma farmácia independente perdia milhares de euros anualmente com medicamentos que expiravam no armazém sem serem vendidos, e debatia-se com a falta de cruzamento entre o stock real e o histórico homólogo de vendas.
* **A Solução Nuelltech:**
  * Desenvolvemos um motor de reconciliação de bases de dados que cruza o inventário físico com o histórico de vendas.
  * O sistema prevê a velocidade de escoamento e gera alertas automáticos para SKUs (produtos) com alto risco de expiração nos meses seguintes.
  * Sugere automaticamente campanhas sazonais de venda cruzada baseadas no calendário civil (ex: promover protetor solar em junho ou antigripais em dezembro) para escoar stock em risco.
* **O Resultado:** No primeiro trimestre após o lançamento, a farmácia redirecionou com sucesso **320 SKUs de alto risco** para campanhas ativas, recuperando margens que seriam dadas como perda absoluta.
* **Resultado em linguagem de negócio:** "O gerente sabe com meses de antecedência quais os produtos em risco de expirar — e activa campanhas antes de se tornar prejuízo certo."

### 2.2 Plataforma de Logística (Setor de Distribuição / Logística / Hotelaria operacional)
* **Frases de alerta (o visitante tem este problema se disser):**
  * "As rotas são geridas em Excel partilhado — é caos quando a equipa edita ao mesmo tempo"
  * "Não sei em tempo real se as entregas foram feitas ou confirmadas"
  * "A conferência de caixa no fim do dia tem sempre diferenças"
  * "Os motoristas ligam constantemente a perguntar o que têm de entregar"
  * "Se algo corre mal numa entrega, não consigo rastrear o que aconteceu"
  * Qualquer menção a: rotas, motoristas, entregas, conferência de caixa, Google Sheets partilhado, guias de transporte
* **O Desafio do Cliente:** Um distribuidor alimentar geria todas as rotas diárias de entrega e reconciliações de pagamentos de motoristas através de múltiplos ficheiros Google Sheets partilhados. Isto causava conflitos frequentes de edição, exclusões acidentais de registos, falta de segurança em dados confidenciais e ausência total de auditoria das rotas na estrada.
* **A Solução Nuelltech:**
  * Construímos uma plataforma cloud responsiva (web e mobile) com dois níveis de acesso:
    1. *Administrador:* Cria, edita e monitoriza as rotas globais.
    2. *Motorista:* Vê no telemóvel apenas as suas entregas atribuídas do dia.
  * *Retro-compatibilidade:* Durante a fase de transição das equipas, a plataforma continuou a ler e escrever dados diretamente no Google Sheets para evitar fricção.
  * *Sync em tempo real:* Atualizações automáticas do estado da rota quando o motorista confirma a entrega no telemóvel com um clique.
* **O Resultado:** O processo tornou-se **100% auditável e livre de erros** de escrita humana. A administração **poupou cerca de 10 horas semanais** em conferência manual de caixa e pagamentos.
* **Resultado em linguagem de negócio:** "A administração fechou o dia em 10 minutos em vez de 2 horas — e passou a saber exactamente o que cada motorista entregou, quando e a quem."
