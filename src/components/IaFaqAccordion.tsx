'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';

interface FAQItem {
  id: string;
  ptQuestion: string;
  enQuestion: string;
  ptAnswer: string;
  enAnswer: string;
}

interface IaFaqAccordionProps {
  isPt: boolean;
}

const faqItems: FAQItem[] = [
  {
    id: 'ia-chatgpt',
    ptQuestion: '"Isto não é só um ChatGPT com outro nome?"',
    enQuestion: '"Isn\'t this just ChatGPT with another name?"',
    ptAnswer: 'Não. O ChatGPT (ou qualquer LLM genérico) não sabe nada sobre o seu negócio — não conhece os seus preços, o seu stock, os seus clientes, nem as suas regras internas. O que construímos é um sistema que conhece o seu negócio especificamente: os dados, os processos, os limites do que pode e não pode dizer. A IA generativa é só uma peça do motor — o valor está em tudo o que a rodeia e a torna fiável para o seu contexto.',
    enAnswer: 'No. ChatGPT (or any generic LLM) knows nothing about your business — it doesn\'t know your prices, your stock, your clients, or your internal rules. What we build is a system that knows your business specifically: your data, processes, and boundaries of what it can and cannot say. Generative AI is just one part of the engine — the value lies in everything that surrounds it and makes it reliable for your context.'
  },
  {
    id: 'ia-dependency',
    ptQuestion: '"Vou ficar dependente disto e depois não percebo nada do que está a acontecer?"',
    enQuestion: '"Will I become dependent on this and then not understand what is happening?"',
    ptAnswer: 'Essa é uma preocupação legítima e uma das razões pelas quais muitas implementações de IA falham — são "caixas negras" que ninguém na empresa entende ou controla. Trabalhamos ao contrário: explicamos o que cada parte faz, entregamos documentação clara, e o sistema fica com regras e limites que o dono do negócio compreende e pode ajustar. Não vendemos magia incompreensível.',
    enAnswer: 'This is a legitimate concern and one of the reasons many AI implementations fail — they are "black boxes" that no one in the company understands or controls. We work the other way around: we explain what each part does, deliver clear documentation, and the system is bounded by rules and limits that the business owner understands and can adjust. We do not sell incomprehensible magic.'
  },
  {
    id: 'ia-replace-staff',
    ptQuestion: '"Isto substitui os meus funcionários?"',
    enQuestion: '"Will this replace my employees?"',
    ptAnswer: 'Não é esse o objetivo, nem é isso que normalmente funciona bem. As implementações que têm sucesso tiram tarefas repetitivas e mecânicas (responder às mesmas perguntas, calcular margens, organizar reservas) para libertar tempo da equipa para o que só uma pessoa consegue fazer — atendimento, relação com o cliente, decisões. As que falham costumam ser as que tentam substituir julgamento humano por completo.',
    enAnswer: 'That is not the goal, nor is it what usually works well. Successful implementations remove repetitive and mechanical tasks (answering the same questions, calculating margins, organizing reservations) to free up team time for what only a human can do — customer service, building relationships, and critical decisions. The ones that fail are typically those that attempt to replace human judgment entirely.'
  },
  {
    id: 'ia-roi-time',
    ptQuestion: '"Quanto tempo até ver retorno?"',
    enQuestion: '"How long until I see a return?"',
    ptAnswer: 'Depende da complexidade da solução, mas somos diretos: não existe "ligar e no dia seguinte está a poupar dinheiro". Há sempre um período de ajuste — a testar, a corrigir, a adaptar ao dia a dia real do negócio. Preferimos dizer isto antecipadamente do que prometer resultados imediatos que depois não se cumprem.',
    enAnswer: 'It depends on the complexity of the solution, but we are direct: there is no such thing as "plug and play, and saving money the next day." There is always an adjustment period — testing, refining, and adapting to the real daily routine of the business. We prefer to say this upfront rather than promising immediate results that are not met.'
  },
  {
    id: 'ia-mistakes',
    ptQuestion: '"E se a IA disser uma asneira a um cliente meu?"',
    enQuestion: '"What if the AI says something stupid to my customer?"',
    ptAnswer: 'É por isso que não deixamos a IA "à solta". Definimos previamente o que o sistema pode e não pode responder, com base em regras e informação real do seu negócio — não em suposições do modelo. Quando a pergunta sai fora desses limites, o sistema sabe dizer "não sei" ou encaminhar para uma pessoa, em vez de inventar uma resposta.',
    enAnswer: 'That is why we do not leave the AI "unleashed." We predefine what the system can and cannot answer based on real rules and data from your business — not model assumptions. When a question falls outside those limits, the system knows to say "I don\'t know" or hand it over to a human, rather than fabricating an answer.'
  },
  {
    id: 'ia-data-safety',
    ptQuestion: '"Os meus dados são seguros? Onde ficam guardados?"',
    enQuestion: '"Are my data secure? Where are they stored?"',
    ptAnswer: 'Trabalhamos sempre com o objetivo de manter os seus dados isolados e protegidos, sem partilha entre clientes diferentes, e explicamos com clareza onde e como a informação é armazenada antes de qualquer implementação avançar. Se tiver requisitos específicos (ex: RGPD, sector regulado), tratamos isso como parte do desenho da solução, não como um extra.',
    enAnswer: 'We always work with the goal of keeping your data isolated and protected, with no sharing between different clients, and we clearly explain where and how the information is stored before any implementation begins. If you have specific requirements (e.g. GDPR, regulated sector), we address that as part of the solution design, not as an afterthought.'
  },
  {
    id: 'ia-failed-before',
    ptQuestion: '"Já tentei automatizar coisas antes e ninguém usou / não funcionou"',
    enQuestion: '"I have tried automating things before and no one used it / it did not work"',
    ptAnswer: 'É uma das situações mais comuns — e normalmente não é um problema da tecnologia em si, é um de três problemas: os dados de base estavam desorganizados, o processo que se tentou automatizar já não funcionava bem manualmente, ou a equipa nunca foi realmente envolvida na adoção. Começamos sempre por perceber qual destes três é o caso antes de propor qualquer solução — caso contrário, estaríamos só a repetir o erro com uma ferramenta diferente.',
    enAnswer: 'This is one of the most common situations — and it is usually not a technology problem itself; it is one of three issues: the baseline data was disorganized, the process chosen for automation did not work well manually, or the team was never truly engaged in the adoption. We always start by understanding which of these three is the case before proposing any solution — otherwise, we would just be repeating the mistake with a different tool.'
  }
];

export default function IaFaqAccordion({ isPt }: IaFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {faqItems.map((item) => {
        const isOpen = openId === item.id;
        const question = isPt ? item.ptQuestion : item.enQuestion;
        const answer = isPt ? item.ptAnswer : item.enAnswer;

        return (
          <div 
            key={item.id}
            className={`bg-[#05070D]/60 border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-brand-accent/50 bg-[#070B14]/40 shadow-md' : 'border-brand-border/60 hover:border-brand-accent/30'}`}
          >
            {/* Accordion header button */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 focus:outline-none min-h-[48px] group"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-xs sm:text-[13px] text-brand-ink group-hover:text-brand-accent-soft transition duration-150 leading-snug">
                {question}
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-brand-ink-dim flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent-soft' : 'group-hover:text-brand-ink'}`} 
              />
            </button>

            {/* Accordion content body */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-brand-border/40' : 'max-h-0'}`}
            >
              <div className="p-5 text-xs text-brand-ink-dim leading-relaxed bg-[#04060C]/20">
                {answer}
              </div>
            </div>
          </div>
        );
      })}

      {/* Microcopy footer linking to CTA */}
      <div className="mt-6 p-4 border border-brand-border/40 rounded-xl bg-brand-card/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <MessageSquare className="w-5 h-5 text-brand-accent-soft flex-shrink-0" />
          <p className="text-xs text-brand-ink-dim leading-relaxed">
            {isPt 
              ? 'Se a sua dúvida não está aqui, é provavelmente a pergunta mais importante de todas.' 
              : 'If your question is not here, it is probably the most important question of all.'}
          </p>
        </div>
        <a
          href="https://calendly.com/nuelltech/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-[#070A14] border border-brand-border hover:bg-brand-border/50 text-brand-ink hover:text-brand-accent-soft px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isPt ? 'Fale Connosco' : 'Talk to Us'}
          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
        </a>
      </div>
    </div>
  );
}
