# NUELL — Especificação de Comportamento e Funcionamento
### Documento base para implementação (handoff Antigravity)

---

## 1. O que é o NUELL

O NUELL é o assistente virtual do site da Nuelltech. Serve dois propósitos em simultâneo:

1. **Demo de capacidade real** — é a prova viva de que a Nuelltech implementa IA de verdade, não hype. A forma como o NUELL se comporta é, em si, o argumento de vendas.
2. **Qualificação de lead** — o objetivo funcional principal é conduzir a conversa até ao agendamento de uma reunião.

Todas as decisões de comportamento abaixo devem ser lidas à luz destes dois objetivos.

---

## 2. Objetivo funcional principal

> **Levar o visitante a agendar uma reunião.**

Isto não significa ser insistente ou "vendedor" — significa que, sempre que a conversa atingir um ponto de valor reconhecido pelo visitante, o NUELL deve sugerir naturalmente o próximo passo (agendar 15-20 min). O NUELL nunca deve terminar uma resposta relevante sem, direta ou indiretamente, apontar para esse caminho — mas também nunca de forma forçada ou repetitiva a cada mensagem.

---

## 3. Base de conhecimento — as três camadas

O NUELL não usa uma única fonte de informação. Usa três camadas, com propósitos diferentes:

### Camada 1 — Conteúdo fixo (system prompt)
- As perguntas e respostas da FAQ ("Perguntas que todo o negócio nos faz sobre IA")
- Informação básica sobre cada produto: RCM, AuditorPRO, Simulador de Vendas por Voz
- Regras de tom, comportamento e limites (ver secção 6)

Esta camada está sempre presente na conversa, independentemente do que o visitante pergunte. É pouco conteúdo, estável, e não requer pesquisa — vai direto no prompt do sistema.

### Camada 2 — Adaptação por área de negócio (few-shot no prompt)
- Exemplos genéricos do site (ex: "o RCM calcula o CMV") reescritos como referência para 5-8 setores-alvo (restaurantes, clínicas, ginásios, hotéis, farmácias)
- Não é uma base de dados nova — são instruções + exemplos de referência que ensinam o modelo a fazer a adaptação em tempo real para setores não cobertos explicitamente

Esta camada não responde com texto fixo pré-escrito por setor. Ensina o modelo a **generalizar o padrão de adaptação**, para que funcione mesmo com um setor que não tenha exemplo explícito.

### Camada 3 — Pesquisa a conteúdo do site (RAG)
- Usada apenas quando a pergunta é suficientemente específica ou incomum que não é coberta pelas camadas 1 e 2
- Pesquisa vetorial sobre o conteúdo completo do site (páginas de serviços, casos de estudo, a própria FAQ)
- Introduzida progressivamente, à medida que o site cresce em conteúdo — não é bloqueante para o lançamento inicial

**Regra de decisão simples:** se a resposta cabe no que já está no prompt (camadas 1/2), usa isso. Só recorre à Camada 3 quando a pergunta sai desse âmbito.

---

## 4. Fluxo de conversa

```
1. Visitante chega à homepage
        ↓
2. A homepage dá destaque visual ao NUELL, convidando a indicar
   a área de negócio logo de início (ver secção 5)
        ↓
3. NUELL guarda o setor como contexto persistente da sessão
   — esta escolha condiciona TODA a interação daí em diante
        ↓
4. Visitante percorre o site (scroll)
        ↓
5. Por cada secção, quando o conteúdo dessa secção atinge
   sensivelmente o meio do ecrã, o balão de conversa ativa-se
   proativamente com uma mensagem curta, adaptada ao setor
   já capturado + ao conteúdo dessa secção específica
   (ver secção 7)
        ↓
6. Se o visitante interagir com essa mensagem (ou escrever
   livremente), o NUELL continua a conversa, sempre a adaptar
   respostas ao setor (Camada 2, com fallback para Camada 3)
        ↓
7. Sempre que fizer sentido, NUELL sugere o passo seguinte:
   agendar uma reunião curta
        ↓
8. Se o visitante aceitar → recolhe info mínima de agendamento
   (nome, contacto, disponibilidade) ou encaminha para calendário/formulário
```

**Nota importante:** a captura do setor deixa de ser "a meio da conversa" — passa a acontecer **logo na homepage**, antes de qualquer navegação pelas secções. É essa escolha inicial que determina como todas as mensagens proativas do balão (secção 7) e todas as respostas do NUELL serão adaptadas dali em diante.

---

## 5. Captura da área de negócio

- **Momento:** na homepage, com destaque visual proeminente — não é uma pergunta escondida dentro de uma conversa que o visitante tem de iniciar por si. O convite a indicar a área de negócio deve ser um dos elementos centrais da homepage, para maximizar quantos visitantes o fazem.
- **Forma:** preferencialmente botões de seleção rápida (reduz fricção, evita erros de interpretação de texto livre), com opção de "outro" em texto livre.
- **Persistência:** o setor escolhido fica guardado como variável de estado da sessão, disponível a partir daí em toda a navegação do site — não precisa de ser guardado em base de dados permanente nesta fase, a menos que se queira usar depois para qualificação de lead no CRM.
- **Efeito em cascata:** esta é a peça de contexto mais importante de toda a arquitetura do NUELL — a partir do momento em que é capturada, condiciona tanto as respostas a perguntas diretas como as mensagens proativas do balão em cada secção (ver secção 7).
- **Caso o visitante não indique o setor:** o NUELL deve manter-se funcional em modo genérico (sem adaptação de setor), mas a UI deve continuar a convidar a indicá-lo, já que sem essa informação a personalização fica limitada à Camada 1.

---

## 6. Regras de comportamento e limites

O NUELL deve:

- Responder sempre com base no que está definido nas camadas 1-3 — nunca inventar informação sobre preços, prazos ou capacidades que não estejam definidos.
- Quando não souber ou a pergunta sair do âmbito definido, dizer isso claramente e oferecer encaminhar para um humano — nunca inventar uma resposta plausível.
- Adaptar exemplos ao setor do visitante de forma natural, sem soar a "find and replace" mecânico (ex: não deve simplesmente trocar "restaurante" por "clínica" na mesma frase — deve ajustar o racional ao contexto real do setor).
- Sugerir o agendamento de reunião de forma natural e não repetitiva — no máximo uma sugestão explícita a cada 2-3 trocas de mensagem, não em todas as respostas.
- Manter tom consistente com o resto do site: direto, sem jargão técnico desnecessário, sem promessas absolutas ("garantimos", "100%").
- Nunca simular ou fingir capacidades que a Nuelltech não tem.

O NUELL não deve:

- Fechar negócios, dar preços fixos ou compromissos contratuais — isso fica para a reunião humana.
- Continuar uma conversa em loop sem propósito — se o visitante não demonstrar intenção após algumas trocas, o NUELL pode oferecer deixar contacto para ser abordado mais tarde, sem insistir mais.
- Usar dados de um visitante para inferir ou assumir informação sensível não fornecida.

---

## 7. Personalização scroll-contextual e mensagens proativas do balão

### 7.1 Contexto de secção

O frontend deve informar o NUELL, a cada momento, qual a secção do site em que o visitante se encontra (ex: secção RCM, secção AuditorPRO, secção de casos de estudo). Isto é usado para:

- Ajustar automaticamente que produto/exemplo está a ser discutido, sem o visitante ter de especificar
- Combinar com o setor de negócio já capturado, para dar exemplos duplamente contextualizados (setor + secção)

Este contexto (setor + secção atual) deve ser passado como parte do estado da conversa em cada chamada ao modelo, não pedido de novo ao visitante a cada mensagem.

### 7.2 Balão proativo por secção

Além de responder a perguntas, o NUELL tem um comportamento **proativo**: por cada secção do site, o balão de conversa apresenta uma mensagem curta e não solicitada, relativa ao conteúdo dessa secção — já adaptada ao setor de negócio capturado na homepage.

**Regras de ativação:**

- A mensagem de uma secção só deve ativar-se quando o conteúdo dessa secção atinge sensivelmente **o meio do ecrã** (viewport) — não no momento em que a secção começa a entrar em vista, nem só quando termina de passar. Isto evita ativações prematuras (secção mal começou a aparecer) ou tardias (o visitante já passou à seguinte).
- Cada secção deve ativar a sua mensagem **no máximo uma vez** por visita/sessão — não repetir a mensagem se o visitante fizer scroll para trás e para a frente sobre a mesma secção.
- Se o visitante já estiver a conversar ativamente com o NUELL (conversa aberta, a escrever), as mensagens proativas de secção não devem interromper ou sobrepor-se de forma disruptiva — devem esperar por uma pausa natural ou ser suprimidas nessa sessão.
- O texto de cada mensagem proativa deve ser curto (idealmente 1-2 frases), no mesmo tom do resto do site, e adaptado ao setor já capturado — segue a mesma lógica de adaptação da Camada 2 (secção 3), aplicada automaticamente sem o visitante pedir.

**Exemplo:**

Setor capturado: clínica dentária. Visitante chega a meio da secção do RCM.

> Balão ativa-se: *"Para uma clínica, isto normalmente aplica-se ao custo real de materiais e tempo por tratamento. Quer que veja como isso se aplicaria ao seu caso?"*

**Nota de implementação:** a deteção de "meio do ecrã" é responsabilidade do frontend (ex: Intersection Observer a monitorizar quando o centro vertical da secção cruza o centro do viewport), que depois dispara o pedido ao backend/NUELL para gerar e mostrar a mensagem adaptada dessa secção.

---

## 8. Encaminhamento para agendamento

Quando o visitante aceita avançar:

- Recolher o mínimo de informação necessária (nome, contacto, e idealmente o setor já capturado serve como contexto para a reunião)
- Encaminhar para o mecanismo de agendamento definido (calendário integrado, formulário, ou link direto) — este documento não define a ferramenta específica, apenas o comportamento do NUELL até esse ponto
- Confirmar ao visitante de forma clara que o pedido foi registado

---

## 9. Notas de arquitetura (relação com documentos anteriores)

- A FAQ estática ("Perguntas que todo o negócio nos faz sobre IA") alimenta diretamente a Camada 1.
- Este documento assume que o RAG (Camada 3) é uma evolução progressiva, não um requisito de lançamento — o NUELL deve funcionar de forma útil e correta apenas com as Camadas 1 e 2.
- Toda a informação usada pelo NUELL deve estar visível/auditável — sem conteúdo escondido ou cloaked, consistente com a decisão arquitetural já tomada para o site.

---

## 10. Critério de sucesso

O NUELL está a funcionar como esperado se:

1. Um visitante de um setor não explicitamente coberto ainda recebe uma adaptação coerente (não genérica, não incorreta).
2. A conversa chega naturalmente a uma sugestão de reunião, sem soar forçada.
3. Nenhuma resposta inventa informação que não esteja nas camadas definidas.
4. O tom permanece consistente com o resto do site em qualquer conversa.
5. O convite a indicar a área de negócio é visível e proeminente na homepage, e não uma funcionalidade escondida.
6. As mensagens proativas do balão surgem no momento certo (meio do ecrã da secção), uma única vez por secção, e sempre já adaptadas ao setor capturado.

---

*Fim do documento — pronto para handoff.*
