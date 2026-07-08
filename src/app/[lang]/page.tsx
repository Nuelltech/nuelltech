import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SandboxHub from '@/components/demos/SandboxHub';
import NuellWidget from '@/components/widget/NuellWidget';
import IaFaqAccordion from '@/components/IaFaqAccordion';
import SectorSelector from '@/components/widget/SectorSelector';
import { ArrowRight, Sparkles, HelpCircle, Briefcase, ChevronRight, TrendingUp, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const isPt = lang === 'pt';

  const iaFaqEntities = [
    {
      q: isPt ? '"Isto não é só um ChatGPT com outro nome?"' : '"Isn\'t this just ChatGPT with another name?"',
      a: isPt 
        ? 'Não. O ChatGPT (ou qualquer LLM genérico) não sabe nada sobre o seu negócio — não conhece os seus preços, o seu stock, os seus clientes, nem as suas regras internas. O que construímos é um sistema que conhece o seu negócio especificamente: os dados, os processos, os limites do que pode e não pode dizer. A IA generativa é só uma peça do motor — o valor está em tudo o que a rodeia e a torna fiável para o seu contexto.'
        : 'No. ChatGPT (or any generic LLM) knows nothing about your business — it doesn\'t know your prices, your stock, your clients, or your internal rules. What we build is a system that knows your business specifically: your data, processes, and boundaries of what it can and cannot say. Generative AI is just one part of the engine — the value lies in everything that surrounds it and makes it reliable for your context.'
    },
    {
      q: isPt ? '"Vou ficar dependente disto e depois não percebo nada do que está a acontecer?"' : '"Will I become dependent on this and then not understand what is happening?"',
      a: isPt
        ? 'Essa é uma preocupação legítima e uma das razões pelas quais muitas implementações de IA falham — são "caixas negras" que ninguém na empresa entende ou controla. Trabalhamos ao contrário: explicamos o que cada parte faz, entregamos documentação clara, e o sistema fica com regras e limites que o dono do negócio compreende e pode ajustar. Não vendemos magia incompreensível.'
        : 'This is a legitimate concern and one of the reasons many AI implementations fail — they are "black boxes" that no one in the company understands or controls. We work the other way around: we explain what each part does, deliver clear documentation, and the system is bounded by rules and limits that the business owner understands and can adjust. We do not sell incomprehensible magic.'
    },
    {
      q: isPt ? '"Isto substitui os meus funcionários?"' : '"Will this replace my employees?"',
      a: isPt
        ? 'Não é esse o objetivo, nem é isso que normalmente funciona bem. As implementações que têm sucesso tiram tarefas repetitivas e mecânicas (responder às mesmas perguntas, calcular margens, organizar reservas) para libertar tempo da equipa para o que só uma pessoa consegue fazer — atendimento, relação com o cliente, decisões. As que falham costumam ser as que tentam substituir julgamento humano por completo.'
        : 'That is not the goal, nor is it what usually works well. Successful implementations remove repetitive and mechanical tasks (answering the same questions, calculating margins, organizing reservations) to free up team time for what only a human can do — customer service, building relationships, and critical decisions. The ones that fail are typically those that attempt to replace human judgment entirely.'
    },
    {
      q: isPt ? '"Quanto tempo até ver retorno?"' : '"How long until I see a return?"',
      a: isPt
        ? 'Depende da complexidade da solução, mas somos diretos: não existe "ligar e no dia seguinte está a poupar dinheiro". Há sempre um período de ajuste — a testar, a corrigir, a adaptar ao dia a dia real do negócio. Preferimos dizer isto antecipadamente do que prometer resultados imediatos que depois não se cumprem.'
        : 'It depends on the complexity of the solution, but we are direct: there is no such thing as "plug and play, and saving money the next day." There is always an adjustment period — testing, refining, and adapting to the real daily routine of the business. We prefer to say this upfront rather than promising immediate results that are not met.'
    },
    {
      q: isPt ? '"E se a IA disser uma asneira a um cliente meu?"' : '"What if the AI says something stupid to my customer?"',
      a: isPt
        ? 'É por isso que não deixamos a IA "à solta". Definimos previamente o que o sistema pode e não pode responder, com base em regras e informação real do seu negócio — não em suposições do modelo. Quando a pergunta sai fora desses limites, o sistema sabe dizer "não sei" ou encaminhar para uma pessoa, em vez de inventar uma resposta.'
        : 'That is why we do not leave the AI "unleashed." We predefine what the system can and cannot answer based on real rules and data from your business — not model assumptions. When a question falls outside those limits, the system knows to say "I don\'t know" or hand it over to a human, rather than fabricating an answer.'
    },
    {
      q: isPt ? '"Os meus dados são seguros? Onde ficam guardados?"' : '"Are my data secure? Where are they stored?"',
      a: isPt
        ? 'Trabalhamos sempre com o objetivo de manter os seus dados isolados e protegidos, sem partilha entre clientes diferentes, e explicamos com clareza onde e como a informação é armazenada antes de qualquer implementação avançar. Se tiver requisitos específicos (ex: RGPD, sector regulado), tratamos isso como parte do desenho da solução, não como um extra.'
        : 'We always work with the goal of keeping your data isolated and protected, with no sharing between different clients, and we clearly explain where and how the information is stored before any implementation begins. If you have specific requirements (e.g. GDPR, regulated sector), we address that as part of the solution design, not as an afterthought.'
    },
    {
      q: isPt ? '"Já tentei automatizar coisas antes e ninguém usou / não funcionou"' : '"I have tried automating things before and no one used it / it did not work"',
      a: isPt
        ? 'É uma das situações mais comuns — e normalmente não é um problema da tecnologia em si, é um de três problemas: os dados de base estavam desorganizados, o processo que se tentou automatizar já não funcionava bem manualmente, ou a equipa nunca foi realmente envolvida na adoção. Começamos sempre por perceber qual destes três é o caso antes de propor qualquer solução — caso contrário, estaríamos só a repetir o erro com uma ferramenta diferente.'
        : 'This is one of the most common situations — and it is usually not a technology problem itself; it is one of three issues: the baseline data was disorganized, the process chosen for automation did not work well manually, or the team was never truly engaged in the adoption. We always start by understanding which of these three is the case before proposing any solution — otherwise, we would just be repeating the mistake with a different tool.'
    }
  ];

  return (
    <>
      {/* Schema.org Organization and WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Nuelltech',
            'url': 'https://nuelltech.com',
            'logo': 'https://nuelltech.com/logo.png',
            'description': dict.meta.description,
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Vila Real',
              'addressCountry': 'PT',
            },
            'sameAs': [
              'https://linkedin.com/company/nuelltech',
            ],
          }),
        }}
      />

      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': dict.faq.q1,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': dict.faq.a1,
                },
              },
              {
                '@type': 'Question',
                'name': dict.faq.q2,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': dict.faq.a2,
                },
              },
              {
                '@type': 'Question',
                'name': dict.faq.q3,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': dict.faq.a3,
                },
              },
              {
                '@type': 'Question',
                'name': dict.faq.q4,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': dict.faq.a4,
                },
              },
              {
                '@type': 'Question',
                'name': dict.faq.q5,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': dict.faq.a5,
                },
              },
              ...iaFaqEntities.map(e => ({
                '@type': 'Question',
                'name': e.q,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': e.a
                }
              }))
            ],
          }),
        }}
      />

      <Header lang={lang as Locale} dict={dict} />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Glow decorative gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2054C7]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#5B9CF7]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Col 1: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="bg-brand-accent/10 border border-brand-accent/20 px-3.5 py-1 rounded-full text-xs font-mono font-semibold text-brand-accent-soft flex items-center gap-2 mb-6 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              {isPt ? 'Automação & IA para PMEs' : 'Automation & AI for SMEs'}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-[1.15] text-brand-ink mb-6 text-glow">
              {isPt 
                ? 'Decisões de Gestão Automatizadas com IA'
                : 'AI-Powered Business Management Automation'}
            </h1>

            <p className="text-sm sm:text-base text-brand-ink-dim leading-relaxed mb-10 max-w-xl">
              {isPt 
                ? 'A Nuelltech transforma dados dispersos e processos manuais de PMEs em fluxos automatizados. Reduza de 12 a 15 horas de trabalho semanal e proteja as suas margens com Inteligência Artificial aplicada ao seu negócio.'
                : 'Nuelltech transforms scattered data and manual processes of SMEs into automated workflows. Save 12 to 15 hours of manual work per week and protect your profit margins with Artificial Intelligence applied to your business.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full sm:w-auto">
              <a
                href="#demos"
                className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accent-dark text-[#04060C] font-bold py-3.5 px-8 rounded-xl text-xs transition duration-150 shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2"
              >
                {isPt ? 'Explorar Sandboxes' : 'Explore Sandboxes'}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://calendly.com/nuelltech/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-brand-accent/60 hover:border-brand-accent hover:bg-brand-accent/5 text-brand-accent-soft font-bold py-3.5 px-8 rounded-xl text-xs transition duration-150 flex items-center justify-center"
              >
                {isPt ? 'Reservar Demo' : 'Book a Demo'}
              </a>
            </div>
          </div>

          {/* Centered Logo: Stacked inline on mobile, floating glass badge on desktop */}
          {/* Mobile version */}
          <div className="flex justify-center items-center my-6 lg:hidden select-none">
            <Image
              src="/logo.png"
              alt="Nuelltech Logo"
              width={330}
              height={82}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          {/* Desktop version */}
          <div className="hidden lg:flex absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 z-30 select-none">
            <Image
              src="/logo.png"
              alt="Nuelltech Logo"
              width={360}
              height={90}
              className="h-16 w-auto object-contain hover:scale-[1.02] transition duration-200"
              priority
            />
          </div>

          {/* Col 2: High-End Floating Graphic Dashboard */}
          <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center lg:mt-0 mt-12 animate-float pointer-events-none select-none">
            {/* Background decorative glow */}
            <div className="absolute inset-0 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

            {/* Card 1: Main Dashboard (Reconciliation Engine) */}
            <div className="bg-brand-card/90 border border-brand-border/60 p-6 rounded-2xl glass shadow-2xl relative w-11/12 z-20 overflow-hidden gradient-border-card">
              <div className="flex justify-between items-center mb-4 border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-ok animate-pulse" />
                  <span className="text-[10px] font-mono text-brand-ink uppercase font-bold tracking-wider">Nuell Reconciler</span>
                </div>
                <span className="text-[9px] font-mono text-brand-accent-soft">v2.4.0</span>
              </div>

              {/* Mini chart */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-[9px] text-brand-ink-dim font-mono">
                  <span>{isPt ? 'Taxa de Margem Média' : 'Average Margin Rate'}</span>
                  <span className="text-brand-ok font-bold">+18.4%</span>
                </div>
                <div className="h-16 w-full flex items-end gap-1.5 pt-2 border-b border-brand-border/30">
                  <div className="bg-brand-border h-[40%] w-full rounded-t-sm" />
                  <div className="bg-brand-border h-[50%] w-full rounded-t-sm" />
                  <div className="bg-brand-border h-[45%] w-full rounded-t-sm" />
                  <div className="bg-brand-border h-[65%] w-full rounded-t-sm" />
                  <div className="bg-brand-accent/60 h-[75%] w-full rounded-t-sm" />
                  <div className="bg-brand-accent h-[90%] w-full rounded-t-sm" />
                </div>
              </div>

              {/* Warning box */}
              <div className="bg-brand-risk/10 border border-brand-risk/30 rounded-xl p-3 flex items-start gap-2.5 text-[10px] text-brand-risk animate-pulse mb-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-brand-risk" />
                <div>
                  <span className="font-bold block text-left">{isPt ? 'Alerta de Quebra de Margem' : 'Margin Leak Alert'}</span>
                  <span className="text-brand-ink-dim block text-[9px] mt-0.5 text-left">
                    {isPt ? 'Fatura Fornecedor #4829 detetou desvio de +23%' : 'Invoice #4829 detected +23% price deviation'}
                  </span>
                </div>
              </div>

              {/* Powered by Nuelltech watermark */}
              <div className="mt-3 border-t border-brand-border/30 pt-2 flex justify-between items-center text-[7.5px] font-mono text-brand-ink-dim uppercase select-none">
                <span>System Status: {isPt ? 'Ativo' : 'Active'}</span>
                <span>[powered_by: nuelltech]</span>
              </div>
            </div>

            {/* Card 2: OCR Extraction Floating Card */}
            <div className="absolute -bottom-4 -left-2 bg-brand-card/95 border border-brand-border/80 p-4 rounded-xl shadow-2xl w-2/3 z-30 animate-float-delayed flex flex-col gap-2 glass">
              <div className="flex items-center gap-2 border-b border-brand-border/30 pb-2">
                <FileText className="w-3.5 h-3.5 text-brand-accent-soft" />
                <span className="text-[9px] font-mono font-bold text-brand-ink">OCR Scanner</span>
              </div>
              <div className="flex flex-col gap-1 text-[9px] font-mono">
                <div className="flex justify-between text-brand-ink-dim">
                  <span>Doc:</span>
                  <span className="text-brand-ink">Fatura_Peixe.pdf</span>
                </div>
                <div className="flex justify-between text-brand-ink-dim">
                  <span>Status:</span>
                  <span className="text-brand-ok font-semibold">{isPt ? 'Extraído (99.7%)' : 'Parsed (99.7%)'}</span>
                </div>
                <div className="border-t border-brand-border/20 my-1" />
                <div className="flex justify-between text-brand-ink-dim">
                  <span>{isPt ? 'Linhas lidas:' : 'Parsed items:'}</span>
                  <span className="text-brand-ink">14</span>
                </div>
                <div className="flex justify-between text-brand-risk font-semibold">
                  <span>{isPt ? 'Desvios:' : 'Discrepancies:'}</span>
                  <span>+45.20 €</span>
                </div>
              </div>
            </div>

            {/* Card 3: Stock Forecast Floating Widget */}
            <div className="absolute -top-4 -right-2 bg-brand-card/95 border border-brand-border/80 p-3 rounded-xl shadow-xl w-1/2 z-10 flex flex-col gap-1 glass">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-brand-ink-dim uppercase">{isPt ? 'Previsão Rotura' : 'Stock Forecast'}</span>
                <CheckCircle2 className="w-3 h-3 text-brand-ok" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-bold text-brand-ink">94%</span>
                <span className="text-[8px] text-brand-ok font-mono font-bold">+12%</span>
              </div>
              <div className="w-full bg-brand-border/50 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-brand-ok h-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 SECTOR SELECTION PANEL (NUELL CONTEXT INITIALIZER) */}
      <SectorSelector isPt={isPt} />

      {/* 2. O PROBLEMA SECTION (PAIN) */}
      <section id="problem" className="py-24 px-6 bg-[#04060C] relative">
        {/* Subtle red background glow for risk context */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[35%] h-[35%] bg-brand-risk/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-brand-border/20 pb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-risk animate-pulse" />
                <span className="text-[10px] font-mono text-brand-risk uppercase tracking-wider font-bold">
                  {isPt ? 'O Desperdício Operacional' : 'Operational Waste'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink">
                {dict.problem.title}
              </h2>
              <p className="text-xs sm:text-sm text-brand-ink-dim max-w-xl leading-relaxed mt-2 text-left">
                {isPt 
                  ? 'Substitua tarefas mecânicas e processos cegos por fluxos integrados que trabalham por si 24/7.'
                  : 'Replace mechanical tasks and blind processes with integrated workflows that work for you 24/7.'}
              </p>
            </div>
            <div className="text-[9px] font-mono text-brand-ink-dim uppercase tracking-wider flex items-center gap-1.5 select-none bg-brand-border/20 px-3 py-1.5 rounded-full border border-brand-border/40">
              <span>{isPt ? 'Arraste para explorar' : 'Swipe to explore'}</span>
              <span className="animate-bounce-horizontal">➔</span>
            </div>
          </div>
          
          {/* Horizontal scroll cards */}
          <div className="flex overflow-x-auto gap-6 pb-8 pt-2 scrollbar-thin snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 relative z-10">
            
            {/* Card 1: Processos Manuais */}
            <div className="flex-shrink-0 w-[295px] sm:w-[350px] snap-start bg-brand-card/60 border border-brand-border rounded-xl p-6 glass hover:border-brand-risk/40 transition duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[8px] font-mono text-brand-risk uppercase tracking-wider font-semibold block mb-3 bg-brand-risk/10 border border-brand-risk/20 px-2 py-0.5 rounded-md w-fit">
                  {isPt ? 'Fuga 01 · Processos Manuais' : 'Leak 01 · Manual Processes'}
                </span>
                <p className="text-xs text-brand-ink leading-relaxed font-sans">
                  {dict.problem.p1}
                </p>
              </div>
              <span className="text-[8px] font-mono text-brand-ink-dim uppercase mt-4 block border-t border-brand-border/30 pt-3">
                {isPt ? 'Impacto: Margem & Tempo' : 'Impact: Margin & Time'}
              </span>
            </div>

            {/* Card 2: Falta de Reconciliação */}
            <div className="flex-shrink-0 w-[295px] sm:w-[350px] snap-start bg-brand-card/60 border border-brand-border rounded-xl p-6 glass hover:border-brand-risk/40 transition duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[8px] font-mono text-brand-risk uppercase tracking-wider font-semibold block mb-3 bg-brand-risk/10 border border-brand-risk/20 px-2 py-0.5 rounded-md w-fit">
                  {isPt ? 'Fuga 02 · Falta de Reconciliação' : 'Leak 02 · No Reconciliation'}
                </span>
                <p className="text-xs text-brand-ink leading-relaxed font-sans">
                  {dict.problem.p2}
                </p>
              </div>
              <span className="text-[8px] font-mono text-brand-ink-dim uppercase mt-4 block border-t border-brand-border/30 pt-3">
                {isPt ? 'Impacto: Decisão Cega' : 'Impact: Blind Decision'}
              </span>
            </div>

            {/* Card 3: Desperdício de Trabalho Repetitivo */}
            <div className="flex-shrink-0 w-[295px] sm:w-[350px] snap-start bg-brand-card/60 border border-brand-border rounded-xl p-6 glass hover:border-brand-risk/40 transition duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[8px] font-mono text-brand-risk uppercase tracking-wider font-semibold block mb-3 bg-brand-risk/10 border border-brand-risk/20 px-2 py-0.5 rounded-md w-fit">
                  {isPt ? 'Fuga 03 · Trabalho de Robô' : 'Leak 03 · Repetitive Labor'}
                </span>
                <p className="text-xs text-brand-ink leading-relaxed font-sans">
                  {isPt 
                    ? 'Profissionais qualificados gastam horas diárias em tarefas mecânicas de "copiar e colar" (copy-paste) dados entre e-mails, folhas de cálculo Excel e sistemas ERP legados.'
                    : 'Qualified professionals spend hours daily on mechanical "copy-paste" tasks transferring data between emails, Excel spreadsheets, and legacy ERP systems.'}
                </p>
              </div>
              <span className="text-[8px] font-mono text-brand-ink-dim uppercase mt-4 block border-t border-brand-border/30 pt-3">
                {isPt ? 'Impacto: Produtividade' : 'Impact: Productivity'}
              </span>
            </div>

            {/* Card 4: Gestão de Stock às Cegas */}
            <div className="flex-shrink-0 w-[295px] sm:w-[350px] snap-start bg-brand-card/60 border border-brand-border rounded-xl p-6 glass hover:border-brand-risk/40 transition duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[8px] font-mono text-brand-risk uppercase tracking-wider font-semibold block mb-3 bg-brand-risk/10 border border-brand-risk/20 px-2 py-0.5 rounded-md w-fit">
                  {isPt ? 'Fuga 04 · Inventário Cego' : 'Leak 04 · Blind Inventory'}
                </span>
                <p className="text-xs text-brand-ink leading-relaxed font-sans">
                  {isPt
                    ? 'Falta de alertas preditivos para gerir o inventário em tempo real, resultando em capital de caixa imobilizado em excesso de stock ou ruturas de fornecimento de produtos populares.'
                    : 'Lack of predictive alerts to manage inventory in real-time, resulting in cash capital tied up in excess inventory or supply stockouts of popular items.'}
                </p>
              </div>
              <span className="text-[8px] font-mono text-brand-ink-dim uppercase mt-4 block border-t border-brand-border/30 pt-3">
                {isPt ? 'Impacto: Capital Preso' : 'Impact: Tied Capital'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DEMOS SECTION (PROOF) */}
      <section id="demos" className="py-24 px-6 relative">
        {/* Subtle backdrop glow */}
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 border-b border-brand-border/40 pb-8">
            <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
              {isPt ? 'Prova de Valor Interativa' : 'Interactive Proof of Value'}
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink mb-4">
              {dict.demos.header}
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed max-w-3xl">
              {dict.demos.generalization}
            </p>
          </div>

          {/* Sandbox Modular Hub (2x2 grid and modals) */}
          <SandboxHub dict={dict} isPt={isPt} />
        </div>
      </section>

      {/* PATHWAY TO EFFICIENCY (IMPLEMENTATION METHOD) */}
      <section className="py-20 px-6 bg-[#04060C] border-y border-brand-border/40 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
              {isPt ? 'Metodologia de Sucesso' : 'Success Methodology'}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold font-display text-brand-ink mb-3 text-glow">
              {isPt ? 'O Caminho para a Eficiência' : 'The Pathway to Efficiency'}
            </h2>
            <p className="text-xs text-brand-ink-dim leading-relaxed">
              {isPt 
                ? 'Uma jornada simplificada desde o diagnóstico inicial de gargalos operacionais até à automação total do seu negócio.'
                : 'A streamlined journey from conceptual diagnosis of bottlenecks to full-scale automated operation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent-soft font-mono font-bold text-xs shadow-[0_0_6px_rgba(0,242,254,0.15)]">
                  01
                </div>
                <h3 className="font-bold text-brand-ink font-display text-sm">
                  {isPt ? 'Diagnóstico (Consult)' : 'Consult'}
                </h3>
              </div>
              <p className="text-xs text-brand-ink-dim leading-relaxed pl-11">
                {isPt 
                  ? 'Analisamos o seu fluxo administrativo atual e identificamos os principais pontos de fuga de margem que a IA pode automatizar de imediato.'
                  : 'We analyze your existing workflows and identify high-leverage bottlenecks that AI can automate immediately.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent-soft font-mono font-bold text-xs shadow-[0_0_6px_rgba(0,242,254,0.15)]">
                  02
                </div>
                <h3 className="font-bold text-brand-ink font-display text-sm">
                  {isPt ? 'Piloto Interativo (Sandbox)' : 'Sandbox'}
                </h3>
              </div>
              <p className="text-xs text-brand-ink-dim leading-relaxed pl-11">
                {isPt 
                  ? 'Criamos uma demonstração interativa local com dados do seu setor para que possa experimentar a exatidão da IA antes de qualquer contrato.'
                  : 'We build a localized, interactive sandbox module to demonstrate real-world ROI and accuracy with your sector data.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent-soft font-mono font-bold text-xs shadow-[0_0_6px_rgba(0,242,254,0.15)]">
                  03
                </div>
                <h3 className="font-bold text-brand-ink font-display text-sm">
                  {isPt ? 'Implementação (Deploy)' : 'Deploy'}
                </h3>
              </div>
              <p className="text-xs text-brand-ink-dim leading-relaxed pl-11">
                {isPt 
                  ? 'Fazemos a integração nativa da IA nos seus ERPs ou bases de dados de produção, acompanhando e otimizando o seu desempenho.'
                  : 'Seamless integration into your production environment with continuous monitoring and optimization.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUÇÕES SECTION (SaaS PRODUCTS) */}
      <section id="rcm" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-2">
              SaaS Solutions
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink">
              {dict.solutions.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* RCM Card */}
            <div className="bg-brand-card/60 border border-brand-border rounded-xl p-6 flex flex-col justify-between hover:border-brand-accent/50 transition duration-300 glass relative group">
              <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-semibold">
                {isPt ? 'Restauração' : 'Restaurant'}
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                  {dict.solutions.rcmContext}
                </span>
                <h3 className="text-base font-bold font-display text-brand-ink mt-1.5 mb-3 group-hover:text-brand-accent-soft transition duration-200">
                  {dict.solutions.rcmName}
                </h3>
                <p className="text-xs text-brand-ink-dim leading-relaxed mb-6">
                  {dict.solutions.rcmDesc}
                </p>
              </div>
              <Link href={`/${lang}/rcm`} className="text-[10px] font-mono font-semibold text-brand-accent-soft hover:underline flex items-center gap-1 mt-auto">
                {dict.solutions.rcmLink} &rarr;
              </Link>
            </div>

            {/* Auditor Pro Card */}
            <div className="bg-brand-card/60 border border-brand-border rounded-xl p-6 flex flex-col justify-between hover:border-brand-accent/50 transition duration-300 glass relative group">
              <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-semibold">
                {isPt ? 'Financeiro' : 'Financial'}
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                  {dict.solutions.auditorContext}
                </span>
                <h3 className="text-base font-bold font-display text-brand-ink mt-1.5 mb-3 group-hover:text-brand-accent-soft transition duration-200">
                  {dict.solutions.auditorName}
                </h3>
                <p className="text-xs text-brand-ink-dim leading-relaxed mb-6">
                  {dict.solutions.auditorDesc}
                </p>
              </div>
              <Link href={`/${lang}/auditor-pro`} className="text-[10px] font-mono font-semibold text-brand-accent-soft hover:underline flex items-center gap-1 mt-auto">
                {dict.solutions.auditorLink} &rarr;
              </Link>
            </div>

            {/* Sales Simulator Card */}
            <div className="bg-brand-card/60 border border-brand-border rounded-xl p-6 flex flex-col justify-between hover:border-brand-accent/50 transition duration-300 glass relative group">
              <div className="absolute top-4 right-4 bg-brand-risk/10 border border-brand-risk/20 px-2 py-0.5 rounded text-[8px] font-mono text-brand-risk uppercase font-semibold">
                {dict.solutions.badgeBeta}
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                  {dict.solutions.salesContext}
                </span>
                <h3 className="text-base font-bold font-display text-brand-ink mt-1.5 mb-3 group-hover:text-brand-accent-soft transition duration-200">
                  {dict.solutions.salesName}
                </h3>
                <p className="text-xs text-brand-ink-dim leading-relaxed mb-6">
                  {dict.solutions.salesDesc}
                </p>
              </div>
              <Link href={`/${lang}/simulador-vendas`} className="text-[10px] font-mono font-semibold text-brand-accent-soft hover:underline flex items-center gap-1 mt-auto">
                {dict.solutions.salesLink} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ENGENHARIA À MEDIDA SECTION */}
      <section id="custom" className="py-24 px-6 bg-[#04060C] border-y border-brand-border/40 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-12 items-start mb-12">
            {/* Left Column: Headline and intro */}
            <div>
              <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
                {isPt ? 'Engenharia Dedicada' : 'Dedicated Engineering'}
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink mb-4">
                {dict.custom.title}
              </h2>
              <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed mb-6">
                {dict.custom.subtitle}
              </p>
              <div className="w-max">
                <a
                  href="https://calendly.com/nuelltech/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-8 rounded-xl text-xs transition flex items-center gap-2 shadow-md shadow-brand-accent/15"
                >
                  {dict.custom.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Case Studies List */}
            <div className="flex flex-col gap-6">
              {/* Case 1: BI Pharma */}
              <div className="bg-brand-card border border-brand-border p-6 rounded-xl glass hover:border-brand-accent/50 transition duration-300 relative">
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
                  {isPt ? 'Setor: Saúde / Farmácias' : 'Sector: Health / Pharmacies'}
                </span>
                <h3 className="text-base font-bold font-display text-brand-ink mb-2">
                  {dict.custom.biPharmaName}
                </h3>
                <p className="text-xs text-brand-ink-dim leading-relaxed mb-4">
                  {dict.custom.biPharmaDesc}
                </p>
                <Link href={`/${lang}/engenharia-a-medida/bi-pharma`} className="text-[10px] font-mono text-brand-accent-soft hover:underline flex items-center gap-1">
                  {isPt ? 'Ver Estudo de Caso' : 'View Case Study'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Case 2: Logistics Platform */}
              <div className="bg-brand-card border border-brand-border p-6 rounded-xl glass hover:border-brand-accent/50 transition duration-300 relative">
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
                  {isPt ? 'Setor: Distribuição Alimentar' : 'Sector: Food Distribution'}
                </span>
                <h3 className="text-base font-bold font-display text-brand-ink mb-2">
                  {dict.custom.logisticsName}
                </h3>
                <p className="text-xs text-brand-ink-dim leading-relaxed mb-4">
                  {dict.custom.logisticsDesc}
                </p>
                <Link href={`/${lang}/engenharia-a-medida/logistica`} className="text-[10px] font-mono text-brand-accent-soft hover:underline flex items-center gap-1">
                  {isPt ? 'Ver Estudo de Caso' : 'View Case Study'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVEN IN THE FIELD (STATS & TESTIMONIAL) */}
      {/* TEMPORARILY HIDDEN: Social proof section to be restored when real client testimonials are available.
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-[-10%] w-[35%] h-[35%] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
            
            <div className="flex flex-col gap-6 text-left">
              <div>
                <span className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider font-semibold block mb-2">
                  {isPt ? 'Resultados Reais' : 'Real Results'}
                </span>
                <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink">
                  {isPt ? 'Resultados Comprovados em Operação' : 'Proven in the Field'}
                </h2>
                <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed mt-3">
                  {isPt 
                    ? 'Os nossos clientes não compram apenas tecnologia. Reclamam horas de trabalho manual e impulsionam o seu crescimento operacional.'
                    : 'Our clients don\'t just adopt technology. They reclaim critical hours and unlock real bottom-line growth.'}
                </p>
              </div>

              <div className="flex gap-12 border-t border-brand-border/30 pt-6 mt-2 font-display">
                <div>
                  <span className="block text-3xl sm:text-4xl font-black text-brand-accent-soft text-glow">
                    45%
                  </span>
                  <span className="block text-[10px] font-mono text-brand-ink-dim uppercase font-bold tracking-wider mt-1">
                    {isPt ? 'Ganho de Eficiência' : 'Efficiency Gain'}
                  </span>
                </div>
                <div>
                  <span className="block text-3xl sm:text-4xl font-black text-brand-accent-soft text-glow">
                    10k+
                  </span>
                  <span className="block text-[10px] font-mono text-brand-ink-dim uppercase font-bold tracking-wider mt-1">
                    {isPt ? 'Horas Salvas/Ano' : 'Hours Saved/Year'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brand-card/65 border border-brand-border/60 p-6 rounded-xl glass hover:border-brand-accent/30 transition duration-300 relative flex flex-col justify-between h-full min-h-[180px] shadow-lg">
              <div className="flex gap-1 text-brand-accent-soft mb-4">
                <span className="text-xs">★</span>
                <span className="text-xs">★</span>
                <span className="text-xs">★</span>
                <span className="text-xs">★</span>
                <span className="text-xs">★</span>
              </div>
              <p className="text-xs sm:text-sm text-brand-ink leading-relaxed italic mb-6">
                {isPt 
                  ? '"A Nuelltech transformou o nosso processo de reconciliação de faturas logística de uma tarefa manual de 3 dias numa verificação automática de 10 minutos. O retorno de investimento foi imediato nas primeiras semanas."'
                  : '"Nuelltech transformed our logistics reconciliation from a 3-day manual process to a 10-minute automated sweep. The ROI was clear within weeks."'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center font-bold text-[10px] text-brand-accent-soft">
                  EV
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-brand-ink">Elena Vasile</span>
                  <span className="block text-[9px] text-brand-ink-dim font-mono">
                    {isPt ? 'Diretora de Operações, LogiClean' : 'Director of Operations, LogiClean'}
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      */}

      {/* 6. TRAJETÓRIA / SOBRE (CONCENTRADO) SECTION */}
      <section id="sobre" className="py-24 px-6 border-t border-brand-border/40 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left Column: Section Title */}
            <div>
              <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
                {dict.about.title}
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink mb-4">
                {isPt ? 'De Sistemas Oracle à Automação com IA' : 'From Oracle Systems to AI Automation'}
              </h2>
              <div className="w-max mt-6">
                <Link href={`/${lang}/sobre`} className="text-xs font-mono font-semibold text-brand-accent-soft hover:underline">
                  {dict.about.link} &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Founder's Story Card */}
            <div className="bg-[#090D1A] border border-brand-border rounded-xl p-8 glass relative flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-accent-soft" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-brand-ink">Nuno Rogério</span>
                  <span className="block text-[10px] text-brand-ink-dim font-mono">{isPt ? 'Fundador da Nuelltech' : 'Founder of Nuelltech'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs sm:text-sm leading-relaxed">
                <p className="text-brand-ink font-medium">
                  {dict.about.pedigree}
                </p>
                <p className="text-brand-ink-dim">
                  {dict.about.progression}
                </p>
              </div>

              {/* Corporate pedigree logo list */}
              <div className="border-t border-brand-border/30 pt-6 mt-2">
                <span className="block text-[8px] font-mono text-brand-ink-dim uppercase tracking-wider mb-4 font-semibold">
                  {isPt ? 'Experiência Profissional Implementada em' : 'Professional Experience Implemented at'}
                </span>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-black text-[#2A344A]">
                  <span className="hover:text-brand-ink-dim transition tracking-wider">TESCO</span>
                  <span className="hover:text-brand-ink-dim transition tracking-wider">MORRISONS</span>
                  <span className="hover:text-brand-ink-dim transition tracking-wider">SONAE</span>
                  <span className="hover:text-brand-ink-dim transition tracking-wider">AHOLD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 IA DOUBTS FAQ SECTION */}
      <section id="ia-doubts" className="py-24 px-6 relative border-t border-brand-border/40">
        <div className="absolute top-[20%] left-[-10%] w-[35%] h-[35%] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
              {isPt ? 'Desmistificar a IA' : 'Demystifying AI'}
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink mb-4">
              {isPt ? 'Perguntas que todo o negócio nos faz' : 'Questions every business asks us'}
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed">
              {isPt 
                ? 'Sem discurso de vendas. Estas são as dúvidas reais que ouvimos antes de qualquer negócio avançar — e as respostas diretas.'
                : 'No sales pitch. These are the real questions we hear before any business moves forward — and the direct answers.'}
            </p>
          </div>

          <IaFaqAccordion isPt={isPt} />
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 bg-[#04060C] border-t border-brand-border/40 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left Column: Heading and info */}
            <div>
              <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-3">
                FAQ
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight text-brand-ink mb-4">
                {dict.faq.title}
              </h2>
              <p className="text-xs text-brand-ink-dim leading-relaxed max-w-sm">
                {isPt 
                  ? 'Tem dúvidas sobre como aplicar a automação ao seu modelo de negócio específico? Fale diretamente com o nosso assistente inteligente NUELL no canto inferior direito ou agende um diagnóstico.'
                  : 'Have questions about applying automation to your specific business model? Speak directly with our intelligent assistant NUELL in the bottom-right corner or book a diagnostic.'}
              </p>
            </div>

            {/* Right Column: FAQ Accordion items */}
            <div className="flex flex-col gap-4 font-sans text-xs">
              {/* Q1 */}
              <div className="bg-brand-card/65 border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition duration-200">
                <h3 className="font-bold text-brand-ink flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-brand-accent-soft flex-shrink-0" />
                  {dict.faq.q1}
                </h3>
                <p className="text-brand-ink-dim leading-relaxed pl-7">{dict.faq.a1}</p>
              </div>
              {/* Q2 */}
              <div className="bg-brand-card/65 border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition duration-200">
                <h3 className="font-bold text-brand-ink flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-brand-accent-soft flex-shrink-0" />
                  {dict.faq.q2}
                </h3>
                <p className="text-brand-ink-dim leading-relaxed pl-7">{dict.faq.a2}</p>
              </div>
              {/* Q3 */}
              <div className="bg-brand-card/65 border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition duration-200">
                <h3 className="font-bold text-brand-ink flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-brand-accent-soft flex-shrink-0" />
                  {dict.faq.q3}
                </h3>
                <p className="text-brand-ink-dim leading-relaxed pl-7">{dict.faq.a3}</p>
              </div>
              {/* Q4 */}
              <div className="bg-brand-card/65 border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition duration-200">
                <h3 className="font-bold text-brand-ink flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-brand-accent-soft flex-shrink-0" />
                  {dict.faq.q4}
                </h3>
                <p className="text-brand-ink-dim leading-relaxed pl-7">{dict.faq.a4}</p>
              </div>
              {/* Q5 */}
              <div className="bg-brand-card/65 border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition duration-200">
                <h3 className="font-bold text-brand-ink flex items-center gap-2.5 mb-2">
                  <HelpCircle className="w-4.5 h-4.5 text-brand-accent-soft flex-shrink-0" />
                  {dict.faq.q5}
                </h3>
                <p className="text-brand-ink-dim leading-relaxed pl-7">{dict.faq.a5}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL SECTION */}
      <section className="py-20 px-6 relative overflow-hidden border-t border-brand-border/60">
        <div className="absolute top-[-30%] right-[-10%] w-[55%] h-[55%] bg-[#2054C7]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-brand-ink mb-4 text-glow">
            {dict.ctaFinal.title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed mb-8 max-w-xl">
            {dict.ctaFinal.text}
          </p>

          <a
            href="https://calendly.com/nuelltech/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3.5 px-10 rounded-xl text-xs transition duration-150 shadow-lg shadow-brand-accent/20 flex items-center gap-2 uppercase tracking-wide"
          >
            {dict.ctaFinal.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer lang={lang as Locale} dict={dict} />
      
      {/* NUELL AI Assistant Widget */}
      <NuellWidget lang={lang as Locale} />
    </>
  );
}
