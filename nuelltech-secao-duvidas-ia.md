# Secção: "Perguntas que todo o negócio nos faz sobre IA"
### Guia de conteúdo para handoff — Antigravity

---

## 1. Objetivo da secção

Diferenciar a Nuelltech do hype genérico de IA (ChatGPT, "wrappers"), respondendo às dúvidas reais e não-ditas que donos de negócio (restaurantes, clínicas, ginásios, hotéis, farmácias) têm antes de decidir avançar. Tom: direto, sem jargão técnico, sem vender — informar e construir confiança.

**Não é uma secção de vendas. É uma secção de honestidade.** O objetivo é que o visitante pense "finalmente alguém que não está só a tentar vender-me fumo".

---

## 2. Onde colocar na página

Sugestão: depois da secção de posicionamento/soluções, antes do CTA final ou antes do NUELL (o assistente pode inclusive usar estas perguntas como prompts sugeridos de arranque de conversa).

---

## 3. Formato de UI

- **Accordion / FAQ expansível** — não texto corrido.
- Uma pergunta visível de cada vez fechada; ao clicar, expande a resposta.
- Título da secção fixo, subtítulo curto, depois a lista.
- Mobile-first: cada item deve ser tocável, com área de toque confortável.
- Sem hidden text / sem conteúdo cloaked — todo o texto das respostas deve estar no DOM (consistente com a decisão arquitetural já tomada para o NUELL).

---

## 4. Copy — Cabeçalho da secção

**Título:**
> Perguntas que todo o negócio nos faz

**Subtítulo:**
> Sem discurso de vendas. Estas são as dúvidas reais que ouvimos antes de qualquer negócio avançar — e as respostas diretas.

---

## 5. Copy — Perguntas e Respostas (conteúdo final)

### P1. "Isto não é só um ChatGPT com outro nome?"

Não. O ChatGPT (ou qualquer LLM genérico) não sabe nada sobre o seu negócio — não conhece os seus preços, o seu stock, os seus clientes, nem as suas regras internas. O que construímos é um sistema que **conhece o seu negócio especificamente**: os dados, os processos, os limites do que pode e não pode dizer. A IA generativa é só uma peça do motor — o valor está em tudo o que a rodeia e a torna fiável para o seu contexto.

### P2. "Vou ficar dependente disto e depois não percebo nada do que está a acontecer?"

Essa é uma preocupação legítima e uma das razões pelas quais muitas implementações de IA falham — são "caixas negras" que ninguém na empresa entende ou controla. Trabalhamos ao contrário: explicamos o que cada parte faz, entregamos documentação clara, e o sistema fica com regras e limites que o dono do negócio compreende e pode ajustar. Não vendemos magia incompreensível.

### P3. "Isto substitui os meus funcionários?"

Não é esse o objetivo, nem é isso que normalmente funciona bem. As implementações que têm sucesso tiram tarefas repetitivas e mecânicas (responder às mesmas perguntas, calcular margens, organizar reservas) para libertar tempo da equipa para o que só uma pessoa consegue fazer — atendimento, relação com o cliente, decisões. As que falham costumam ser as que tentam substituir julgamento humano por completo.

### P4. "Quanto tempo até ver retorno?"

Depende da complexidade da solução, mas somos diretos: não existe "ligar e no dia seguinte está a poupar dinheiro". Há sempre um período de ajuste — a testar, a corrigir, a adaptar ao dia a dia real do negócio. Preferimos dizer isto antecipadamente do que prometer resultados imediatos que depois não se cumprem.

### P5. "E se a IA disser uma asneira a um cliente meu?"

É por isso que não deixamos a IA "à solta". Definimos previamente o que o sistema pode e não pode responder, com base em regras e informação real do seu negócio — não em suposições do modelo. Quando a pergunta sai fora desses limites, o sistema sabe dizer "não sei" ou encaminhar para uma pessoa, em vez de inventar uma resposta.

### P6. "Os meus dados são seguros? Onde ficam guardados?"

Trabalhamos sempre com o objetivo de manter os seus dados isolados e protegidos, sem partilha entre clientes diferentes, e explicamos com clareza onde e como a informação é armazenada antes de qualquer implementação avançar. Se tiver requisitos específicos (ex: RGPD, sector regulado), tratamos isso como parte do desenho da solução, não como um extra.

### P7. "Já tentei automatizar coisas antes e ninguém usou / não funcionou"

É uma das situações mais comuns — e normalmente não é um problema da tecnologia em si, é um de três problemas: os dados de base estavam desorganizados, o processo que se tentou automatizar já não funcionava bem manualmente, ou a equipa nunca foi realmente envolvida na adoção. Começamos sempre por perceber qual destes três é o caso antes de propor qualquer solução — caso contrário, estaríamos só a repetir o erro com uma ferramenta diferente.

---

## 6. Notas de tom (para consistência com o resto da página)

- Frases curtas. Sem jargão técnico (nada de "LLM", "embeddings", "fine-tuning" nesta secção — isso fica para conteúdo mais técnico/blog se existir).
- Nunca prometer resultados absolutos ("garantimos", "100%") — usar linguagem realista ("normalmente", "o objetivo é", "trabalhamos para").
- Primeira pessoa do plural ("trabalhamos", "construímos") — reforça que há uma equipa por trás, não só uma ferramenta.
- Nenhuma resposta deve soar defensiva — o tom é de transparência, não de justificação.

---

## 7. Sugestão de microcopy adicional (opcional, fim da secção)

**Linha de fecho, antes do CTA:**
> Se a sua dúvida não está aqui, é provavelmente a pergunta mais importante de todas. Fale connosco.

(Liga ao CTA de contacto ou abre o NUELL diretamente com esta pergunta pré-carregada, se a arquitetura do assistente permitir.)

---

## 8. Dados estruturados (SEO/GEO)

Dado o objetivo de otimização para GEO (Generative Engine Optimization) já definido no brief, esta secção presta-se naturalmente a marcação **FAQPage schema.org**. Sugestão de implementação:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Isto não é só um ChatGPT com outro nome?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[texto da resposta P1 acima, sem formatação]"
      }
    }
    // ... repetir para P2 a P7
  ]
}
```

Isto aumenta a probabilidade de estas respostas serem citadas diretamente por motores de resposta generativa (ChatGPT, Perplexity, AI Overviews), que é precisamente o objetivo GEO do projeto — e mantém-se coerente com a decisão de não usar cloaking, porque o conteúdo do schema é idêntico ao conteúdo visível.

---

## 9. Nota técnica — relação com o NUELL e RAG

Esta secção de FAQ é **conteúdo estático e fixo** (7 perguntas, texto conhecido antecipadamente). Não requer RAG (Retrieval-Augmented Generation) — o texto completo pode ser incluído diretamente no contexto/prompt do sistema sempre que necessário, sem custo relevante.

**Distinção importante para a equipa de desenvolvimento:**

- **Esta secção (FAQ estática):** conteúdo fixo, pode ir directo no prompt do NUELL ou ser servido como HTML normal. Sem necessidade de pesquisa vetorial.
- **NUELL (assistente geral do site):** à medida que o site cresce (mais páginas de serviços, casos de estudo, SaaS products), o conteúdo deixa de caber de forma eficiente num prompt fixo. Nessa altura, faz sentido introduzir RAG — indexar o conteúdo do site numa base de dados vetorial, e o NUELL passa a "procurar" os trechos relevantes antes de responder, em vez de ter tudo memorizado no prompt.

Esta distinção é relevante para não sobre-arquitetar a secção de FAQ (que não precisa de RAG) nem sub-arquitetar o NUELL a longo prazo (que provavelmente vai precisar, conforme o site cresce). Ver conversa/documento à parte para o desenho da arquitetura RAG do NUELL.

---

*Fim do documento — pronto para handoff.*
