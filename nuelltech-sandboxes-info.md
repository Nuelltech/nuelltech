# Detalhes das Sandboxes Interativas da Nuelltech

Este documento detalha o que o utilizador vê, faz e experimenta em cada uma das quatro sandboxes interativas disponíveis no site da Nuelltech. Use esta informação para explicar as demonstrações aos utilizadores de forma simples e contextualizada.

---

## 1. Sandbox de OCR (Leitura Automática de Documentos)
* **Identificador da Ação:** `[sandbox:ocr:Etiqueta]`
* **O que o utilizador faz na Sandbox:** O utilizador vê uma fatura real de fornecedor simulada e clica no botão "Analisar Fatura".
* **O que o utilizador vê acontecer:** O motor de OCR processa a fatura em segundos, extraindo dinamicamente o nome do fornecedor, data, artigos, quantidades, IVA e valores unitários. O sistema destaca visualmente um alerta a vermelho: uma divergência de preços (o fornecedor cobrou 2.50€ por um item cujo preço contratado na base de dados era de 2.20€).
* **Como ligar à necessidade do utilizador:**
  * **Problemas manuais:** Elimina a digitação manual de faturas no ERP.
  * **Controlo de custos:** Deteta automaticamente quando os fornecedores cobram valores acima do acordado, evitando prejuízos silenciosos.
  * **Exemplo de aplicação:** Clínicas (faturas de consumíveis), Farmácias (restocking slips), Restaurantes (faturas de ingredientes).

---

## 2. Sandbox de BI Preditivo (Gestão de Inventário e Quebras)
* **Identificador da Ação:** `[sandbox:bi:Etiqueta]`
* **O que o utilizador faz na Sandbox:** Vê um painel de Business Intelligence (BI) simulado que cruza o stock atual física com o ritmo de vendas. Tem um controlo deslizante (slider) para simular o crescimento de vendas.
* **O que o utilizador vê acontecer:** Ao mover o slider, o dashboard recalcula em tempo real o escoamento do stock e prevê o dia exato em que determinados artigos vão esgotar. O painel gera alertas automáticos de "Nível de Segurança Crítico" e sugere a quantidade exata a encomendar para repor o stock sem excessos.
* **Como ligar à necessidade do utilizador:**
  * **Prever roturas:** Evita que falte produto para venda (quebras de stock).
  * **Evitar desperdício:** Evita comprar em excesso produtos com datas de validade curtas.
  * **Sugestões automáticas:** Automatiza o cálculo de encomendas com base no ritmo real do negócio.
  * **Exemplo de aplicação:** Farmácias (medicamentos perto do fim da validade), Ginásios (controlo de stock de suplementos/merchandising), Distribuição (gestão de armazém).

---

## 3. Sandbox de Modernização de Excel (Tabelas vs. Dashboards)
* **Identificador da Ação:** `[sandbox:excel:Etiqueta]`
* **O que o utilizador faz na Sandbox:** O utilizador vê um slider visual de "Antes / Depois".
* **O que o utilizador vê acontecer:** Ao arrastar o slider, compara uma folha de cálculo Excel tradicional (cheia de linhas, fórmulas confusas e difícil de ler) com uma plataforma web moderna, limpa, com cartões de KPI dinâmicos e gráficos interativos atualizados em tempo real.
* **Como ligar à necessidade do utilizador:**
  * **Eliminar erros:** Previne erros humanos em fórmulas de Excel que corrompem dados.
  * **Visibilidade centralizada:** Permite que toda a equipa aceda aos mesmos dados de forma segura sem conflitos de edição.
  * **Automatização:** Transforma processos manuais lentos em relatórios automáticos.

---

## 4. Sandbox de API (Integração de Sistemas e ERPs)
* **Identificador da Ação:** `[sandbox:api:Etiqueta]`
* **O que o utilizador faz na Sandbox:** O utilizador vê uma consola de programador simulada e clica no botão "Enviar Pedido API".
* **O que o utilizador vê acontecer:** A consola simula o envio de um payload JSON e mostra a resposta de sucesso em tempo real, sincronizando dados entre o Primavera ERP e um portal de cliente.
* **Como ligar à necessidade do utilizador:**
  * **Sincronização automática:** Elimina a necessidade de passar dados manualmente de um software para o outro (ex: faturas do software de faturação para o software de contabilidade).
  * **Ligação a ERPs:** Ligamos Primavera, SAGE, PHC e outros sistemas legados a portais web ou assistentes de IA de forma segura.
