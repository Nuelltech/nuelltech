# Produtos e Casos de Estudo da Nuelltech

Este documento detalha os produtos SaaS e os desenvolvimentos de engenharia à medida (Casos de Estudo) já implementados pela Nuelltech. Use este conhecimento para responder de forma assertiva a perguntas sobre a experiência e portefólio da empresa.

---

## 1. Produtos SaaS (Foco em Restauração e Retalho)

### 1.1 RCM (Recipe Cost Management)
* **O que é:** Uma ferramenta de gestão e proteção de margens de receita em tempo real.
* **O que faz:** 
  * Cruza automaticamente as faturas de compras dos fornecedores (processadas por OCR) com os preços de venda praticados no menu (PVP).
  * Calcula em tempo real o CMV (Custo de Mercadoria Vendida) real de cada prato ou ingrediente.
  * Alerta imediatamente a gerência quando a margem de um prato fica abaixo do limite aceitável devido ao aumento de preços de um fornecedor.
* **Ação de Scroll:** `[scroll:rcm:Etiqueta]` (Navega para a secção de margens/RCM no site).

### 1.2 Auditor Pro
* **O que é:** Um motor de auditoria financeira e de inventário contínuo.
* **O que faz:**
  * Corre em background reconciliando dados de POS (ponto de venda), inventário físico e compras.
  * Deteta desvios de inventário, perdas silenciosas, erros de faturação ou fugas de stock de forma automatizada.
  * Gera relatórios diários de integridade financeira para a administração.

### 1.3 Simulador de Vendas por Voz (Treino de Vendas com IA)
* **O que é:** Uma ferramenta de treino comportamental de vendas e gestão de objeções baseada em voz e Inteligência Artificial.
* **O que faz:**
  * Simula perfis de clientes realistas e desafiantes em vários setores (Automóvel, Imobiliário, Farmacêutico).
  * O utilizador fala com o cliente virtual por voz, treina o seu pitch de vendas e aprende a lidar com objeções e interrupções.
  * O motor de IA avalia e dá uma nota de desempenho detalhada com pontos de melhoria ao final de cada simulação.
  * Ideal para equipas comerciais (como delegados de informação médica, agentes imobiliários ou comerciais automóveis).

---

## 2. Engenharia à Medida (Casos de Estudo Reais)

> [!IMPORTANT]
> **BI Pharma** e **Plataforma de Logística** NÃO são produtos prontos a vender com preço fixo. São exemplos de projetos à medida desenvolvidos para clientes específicos. O call-to-action correto ao falar deles é propor o agendamento de um **diagnóstico gratuito** para desenhar uma solução personalizada.

### 2.1 BI Pharma (Setor de Saúde / Farmácias)
* **O Desafio do Cliente:** Uma farmácia independente perdia milhares de euros anualmente com medicamentos que expiravam no armazém sem serem vendidos, e debatia-se com a falta de cruzamento entre o stock real e o histórico homólogo de vendas.
* **A Solução Nuelltech:**
  * Desenvolvemos um motor de reconciliação de bases de dados que cruza o inventário físico com o histórico de vendas.
  * O sistema prevê a velocidade de escoamento e gera alertas automáticos para SKUs (produtos) com alto risco de expiração nos meses seguintes.
  * Sugere automaticamente campanhas sazonais de venda cruzada baseadas no calendário civil (ex: promover protetor solar em junho ou antigripais em dezembro) para escoar stock em risco.
* **O Resultado:** No primeiro trimestre após o lançamento, a farmácia redirecionou com sucesso **320 SKUs de alto risco** para campanhas ativas, recuperando margens que seriam dadas como perda absoluta.

### 2.2 Plataforma de Logística (Setor de Distribuição Alimentar)
* **O Desafio do Cliente:** Um distribuidor alimentar geria todas as rotas diárias de entrega e reconciliações de pagamentos de motoristas através de múltiplos ficheiros Google Sheets partilhados. Isto causava conflitos frequentes de edição, exclusões acidentais de registos, falta de segurança em dados confidenciais e ausência total de auditoria das rotas na estrada.
* **A Solução Nuelltech:**
  * Construímos uma plataforma cloud responsiva (web e mobile) com dois níveis de acesso:
    1. *Administrador:* Cria, edita e monitoriza as rotas globais.
    2. *Motorista:* Vê no telemóvel apenas as suas entregas atribuídas do dia.
  * *Retro-compatibilidade:* Durante a fase de transição das equipas, a plataforma continuou a ler e escrever dados diretamente no Google Sheets para evitar fricção.
  * *Sync em tempo real:* Atualizações automáticas do estado da rota quando o motorista confirma a entrega no telemóvel com um clique.
* **O Resultado:** O processo tornou-se **100% auditável e livre de erros** de escrita humana. A administração **poupou cerca de 10 horas semanais** em conferência manual de caixa e pagamentos.
