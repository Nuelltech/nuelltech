'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, ArrowLeft, Calendar, Globe, Sparkles } from 'lucide-react';
import NuellWidget from '@/components/widget/NuellWidget';

interface PresentationViewProps {
  lang: 'pt' | 'en';
}

export default function PresentationView({ lang }: PresentationViewProps) {
  const isPt = lang === 'pt';

  const handleOpenNuell = () => {
    window.dispatchEvent(new CustomEvent('nuell-open-chat'));
  };

  const handlePrint = () => {
    window.print();
  };

  const otherLang = isPt ? 'en' : 'pt';
  const otherLangLabel = isPt ? 'English' : 'Português';

  const projects = [
    {
      areaPt: 'Site e vendas',
      areaEn: 'Website & sales',
      problemPt: 'Atender os visitantes a qualquer hora, perceber quem tem interesse real e marcar reuniões. Saber, todos os dias, o que está a funcionar no site.',
      problemEn: 'Assist visitors 24/7, qualify genuine leads, and book meetings. Keep leadership informed daily on site performance.',
      solutionPt: 'Um assistente no site responde a dúvidas com base na informação oficial da empresa, identifica os contactos mais promissores e marca reuniões na própria conversa. Todas as manhãs, o gestor recebe por email um resumo em português com o que aconteceu e o que fazer a seguir.',
      solutionEn: 'An on-site assistant answers inquiries based on verified company data, qualifies high-intent prospects, and schedules meetings inside the chat. Every morning, managers receive an executive email summary of visitor interactions and clear next steps.',
    },
    {
      areaPt: 'Restauração',
      areaEn: 'Hospitality',
      problemPt: 'Proteger o lucro do restaurante e libertar o gestor de horas de trabalho administrativo. Reagir logo que os custos das matérias-primas sobem, antes que as margens fiquem negativas.',
      problemEn: 'Protect restaurant profits and eliminate hours of manual administrative paperwork. React instantly when raw material costs rise before margins turn negative.',
      solutionPt: 'A IA lê as faturas (em foto ou PDF) e as vendas e atualiza sozinha o custo de cada prato. Compara fornecedores e mostra quem tem o melhor preço para o mesmo produto. Avisa quando um prato deixa de dar lucro e simula o novo preço necessário para manter a margem pretendida.',
      solutionEn: 'AI reads supplier invoices (photo or PDF) and sales data, dynamically updating recipe costs. It compares suppliers to find the best price for each product, alerts when dishes lose profitability, and simulates the required price to maintain targeted margins.',
    },
    {
      areaPt: 'Farmácia: stock',
      areaEn: 'Pharmacy: stock',
      problemPt: 'Evitar dinheiro parado em stock e perdas por produtos que caducam.',
      problemEn: 'Avoid working capital tied up in excess stock and prevent losses from expired batches.',
      solutionPt: 'A IA cruza as vendas com as validades dos lotes e avisa com meses de antecedência que produtos, e que valor, estão em risco.',
      solutionEn: 'AI reconciles sales velocity with batch expiration dates and warns months in advance which products and capital value are at risk.',
    },
    {
      areaPt: 'Farmácia: contas e faturas',
      areaEn: 'Pharmacy: invoices & bills',
      problemPt: 'Ter controlo total de pagamentos e tesouraria, sem trabalho manual. Evitar faturas por pagar ou duplicadas e saber o que precisa de validação.',
      problemEn: 'Full control over payments and treasury without manual entry. Avoid overdue or duplicate invoices and flag discrepancies immediately.',
      solutionPt: 'A IA lê as faturas, regista as datas e os prazos de pagamento (30, 45 ou 60 dias) e mostra o que está pendente. Assinala o que parece errado (valores duvidosos, rasuras, notas de crédito por abater) para a equipa validar. O gestor pode perguntar em linguagem normal sobre as contas da farmácia e receber a resposta com base nos documentos originais.',
      solutionEn: 'AI reads invoices, logs payment terms (30, 45, or 60 days), and highlights pending liabilities. It flags anomalies (questionable values, pending credit notes) for team validation. Managers can ask questions in natural language and receive answers grounded in original source documents.',
    },
    {
      areaPt: 'Ginásio',
      areaEn: 'Gym & Fitness',
      problemPt: 'Perceber que sócios estão prestes a desistir, antes de pedirem o cancelamento, e ver como está a rentabilidade da equipa (PTs, nutrição, aulas de grupo).',
      problemEn: 'Detect members at risk of churning before they cancel, and monitor staff productivity (PTs, nutrition, group classes).',
      solutionPt: 'A IA acompanha a assiduidade de cada sócio e indica o nível de risco de abandono. A direção pode fazer perguntas em linguagem normal ("onde está o risco?", "qual o impacto na faturação?") e receber relatórios claros.',
      solutionEn: 'AI tracks member attendance frequency and indicates churn risk scores. Leadership can query in natural language ("Where is the churn risk?", "What is the revenue impact?") and receive clear structured reports.',
    },
  ];

  return (
    <div className="presentation-wrapper min-h-screen bg-[#e2e8f0] text-slate-900 font-sans antialiased selection:bg-[#f25c05] selection:text-white">
      {/* Estilos dedicados para A4 no ecrã e impressão rigorosa */}
      <style jsx global>{`
        /* Em ecrãs pequenos e médios (mobile/tablet), adapta-se a 100% da largura */
        .a4-page {
          width: 100%;
          max-width: 210mm;
          min-height: auto;
          box-sizing: border-box;
        }

        /* Em desktop (ecrãs grandes), mantém o rácio formal A4 */
        @media screen and (min-width: 1024px) {
          .a4-page {
            width: 210mm;
            min-height: 297mm;
          }
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .no-print,
          .print-hide {
            display: none !important;
          }
          .screen-wrapper {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
          }
          .a4-page {
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            width: 210mm !important;
            max-width: 210mm !important;
            padding: 16mm !important;
          }
          .a4-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      `}</style>

      {/* BARRA SUPERIOR DE UTILIDADES (visível no ecrã, oculta na impressão) */}
      <nav className="no-print sticky top-0 z-40 bg-[#0B1320]/95 backdrop-blur-md text-white border-b border-slate-700/80 px-3 sm:px-6 py-2.5 sm:py-3 transition shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs">
          {/* Voltar ao site */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-300 hover:text-white transition font-medium group text-[11px] sm:text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden xs:inline">{isPt ? 'Voltar ao Site' : 'Back to Site'}</span>
            <span className="xs:hidden">Site</span>
          </Link>

          {/* Ações Centrais / Direitas */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Comutador de Idioma */}
            <Link
              href={`/${otherLang}/apresentacao`}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title={isPt ? 'Mudar para Inglês' : 'Switch to Portuguese'}
            >
              <Globe className="w-3.5 h-3.5 text-[#f25c05]" />
              <span className="font-semibold uppercase text-[10px] sm:text-[11px]">
                {isPt ? 'EN' : 'PT'}
              </span>
            </Link>

            {/* Falar com o Nuell */}
            <button
              onClick={handleOpenNuell}
              type="button"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold transition shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer text-[11px] sm:text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPt ? 'Falar com Nuell' : 'Talk with Nuell'}</span>
            </button>

            {/* Imprimir / Guardar PDF */}
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#f25c05] hover:bg-[#d94f00] text-white font-semibold transition shadow-md shadow-[#f25c05]/20 active:scale-95 cursor-pointer text-[11px] sm:text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPt ? 'Guardar PDF' : 'Save PDF'}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* CONTAINER PRINCIPAL DAS 4 PÁGINAS */}
      <main className="screen-wrapper py-4 sm:py-8 lg:py-10 flex flex-col items-center gap-6 sm:gap-10 lg:gap-12 px-3 sm:px-6">
        
        {/* ========================================================= */}
        {/* PÁGINA 1: CAPA */}
        {/* ========================================================= */}
        <article className="a4-page bg-[#0B1320] text-white relative shadow-2xl rounded-2xl lg:rounded-none overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between min-h-[500px] sm:min-h-[600px] lg:min-h-[297mm]">
          <div className="flex flex-col items-center flex-grow justify-center py-10 sm:py-16 lg:py-0 lg:-mt-16 text-center">
            {/* Logótipo Branco */}
            <img
              src="/logo.png"
              alt="Nuelltech"
              className="h-24 sm:h-32 md:h-40 lg:h-44 w-auto filter invert brightness-0 saturate-100 mb-8 sm:mb-10 lg:mb-12 object-contain"
            />

            {/* Tipografia Central */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.35rem] leading-[1.2] lg:leading-[1.12] font-extrabold tracking-tight max-w-4xl text-center">
              {isPt ? (
                <>
                  A ponte entre o que o seu negócio precisa e o que a <br className="hidden sm:inline" />
                  <span className="text-[#f25c05]">IA pode fazer.</span>
                </>
              ) : (
                <>
                  The bridge between what your business needs and what <br className="hidden sm:inline" />
                  <span className="text-[#f25c05]">AI can achieve.</span>
                </>
              )}
            </h1>
          </div>

          {/* Rodapé da Capa */}
          <footer className="w-full">
            <div className="border-t border-slate-700/80 pt-6 sm:pt-8 flex flex-col items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs lg:text-[13px] tracking-wider sm:tracking-widest text-slate-300 uppercase font-semibold text-center">
              <div>
                info@nuelltech.com <span className="text-[#f25c05] mx-2 sm:mx-3">•</span> +351 916 665 887
              </div>
              <div>
                nuelltech.com <span className="text-[#f25c05] mx-2 sm:mx-3">•</span> Vila Real, Portugal
              </div>
            </div>
          </footer>
        </article>

        {/* ========================================================= */}
        {/* PÁGINA 2: SOBRE & SERVIÇOS */}
        {/* ========================================================= */}
        <article className="a4-page bg-white text-slate-900 relative shadow-2xl rounded-2xl lg:rounded-none overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between">
          <header className="mb-6 sm:mb-8 lg:mb-10 border-b-2 border-[#0B1320] pb-4 sm:pb-5 flex justify-between items-end">
            <div>
              <img src="/logo.png" alt="Nuelltech" className="h-10 sm:h-12 lg:h-14 w-auto mb-2 sm:mb-3 object-contain" />
              <h2 className="text-[11px] sm:text-xs lg:text-sm font-bold tracking-widest uppercase text-gray-400">
                {isPt ? 'O Problema & A Solução' : 'The Problem & The Solution'}
              </h2>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1320]">01</div>
          </header>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-10 flex-grow print:grid print:grid-cols-2 print:gap-10">
            {/* Coluna Esquerda */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <section>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B1320] mb-2 sm:mb-3">
                  {isPt ? 'Quem Somos' : 'About Us'}
                </h3>
                <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed mb-3">
                  {isPt
                    ? 'A Nuelltech é uma consultora tecnológica que ajuda PMEs a automatizar processos e a começar a usar IA de forma prática e gradual.'
                    : 'Nuelltech is a technology consultancy that helps SMEs automate processes and start deploying AI in a practical and gradual way.'}
                </p>
                <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed">
                  {isPt
                    ? 'O fundador, Nuno Rogério Miguel, tem mais de 15 anos de experiência em sistemas de retalho (Oracle Retail) e gestão de programas, com projetos para grandes operadores internacionais como Tesco, Morrisons, Ahold, Sonae, Despar, Dubai Duty Free e Mercal. A Nuelltech aplica essa disciplina à escala das PMEs.'
                    : 'Founder Nuno Rogério Miguel brings over 15 years of experience in enterprise retail systems (Oracle Retail) and programme management, delivering projects for major international operators such as Tesco, Morrisons, Ahold, Sonae, Despar, Dubai Duty Free, and Mercal. Nuelltech applies this discipline to the scale of SMEs.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B1320] mb-3 sm:mb-4">
                  {isPt ? 'O Problema que Resolvemos' : 'The Problems We Solve'}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f25c05] mt-2 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {isPt ? (
                        <>
                          <strong className="text-slate-800">Tempo perdido em tarefas repetitivas:</strong> faturas, encomendas, marcações, respostas a clientes.
                        </>
                      ) : (
                        <>
                          <strong className="text-slate-800">Time wasted on repetitive tasks:</strong> invoices, orders, bookings, and customer inquiries.
                        </>
                      )}
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f25c05] mt-2 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {isPt ? (
                        <>
                          <strong className="text-slate-800">Decisões lentas:</strong> a informação já existe, mas está em sistemas dispersos. Trabalhamos essa informação para a empresa decidir mais depressa.
                        </>
                      ) : (
                        <>
                          <strong className="text-slate-800">Slow decision-making:</strong> data already exists, but remains scattered across disconnected systems. We structure this data so businesses can decide faster.
                        </>
                      )}
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f25c05] mt-2 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {isPt ? (
                        <>
                          <strong className="text-slate-800">Segurança dos dados:</strong> a IA implementa-se com os dados da empresa protegidos.
                        </>
                      ) : (
                        <>
                          <strong className="text-slate-800">Data security:</strong> AI is deployed with enterprise-grade protection and full data confidentiality.
                        </>
                      )}
                    </p>
                  </li>
                  <li className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f25c05] mt-2 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {isPt ? (
                        <>
                          <strong className="text-slate-800">Equipas sem controlo:</strong> ajudamos as equipas a controlar os seus processos e o desenvolvimento das soluções de IA.
                        </>
                      ) : (
                        <>
                          <strong className="text-slate-800">Teams without control:</strong> we empower internal teams to master their processes and oversee AI solutions directly.
                        </>
                      )}
                    </p>
                  </li>
                </ul>
              </section>
            </div>

            {/* Coluna Direita */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <section>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B1320] mb-3 sm:mb-4">
                  {isPt ? 'O Que Fazemos' : 'What We Do'}
                </h3>
                <ul className="space-y-3.5 sm:space-y-4">
                  <li className="border-l-2 border-[#f25c05] pl-3.5 sm:pl-4">
                    <h4 className="font-bold text-[#0B1320] text-xs sm:text-sm">
                      {isPt ? 'Diagnóstico' : 'Diagnosis'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {isPt
                        ? 'Identificamos onde a empresa pode ganhar eficiência e ajudamos a definir os processos.'
                        : 'We identify where the company can gain efficiency and help define structured processes.'}
                    </p>
                  </li>
                  <li className="border-l-2 border-[#f25c05] pl-3.5 sm:pl-4">
                    <h4 className="font-bold text-[#0B1320] text-xs sm:text-sm">
                      {isPt ? 'Desenho da solução' : 'Solution Design'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {isPt
                        ? 'Definimos onde entra o colaborador humano e onde fica a componente de IA.'
                        : 'We define where human expertise intervenes and where the AI component takes over.'}
                    </p>
                  </li>
                  <li className="border-l-2 border-[#f25c05] pl-3.5 sm:pl-4">
                    <h4 className="font-bold text-[#0B1320] text-xs sm:text-sm">
                      {isPt ? 'Testes' : 'Testing'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {isPt
                        ? 'Testamos com volume e com vários departamentos envolvidos.'
                        : 'We test under real volume with cross-departmental involvement.'}
                    </p>
                  </li>
                  <li className="border-l-2 border-[#f25c05] pl-3.5 sm:pl-4">
                    <h4 className="font-bold text-[#0B1320] text-xs sm:text-sm">
                      {isPt ? 'Formação e acompanhamento' : 'Training & Support'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {isPt
                        ? 'Formamos as equipas e acompanhamos a evolução dos produtos.'
                        : 'We train internal teams and oversee continuous product evolution.'}
                    </p>
                  </li>
                </ul>
              </section>

              <section className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-100 mt-1">
                <h3 className="text-base sm:text-lg font-extrabold text-[#0B1320] mb-2 sm:mb-3 text-[#f25c05]">
                  {isPt ? 'Onde se Aplica' : 'Where It Applies'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                  {isPt
                    ? 'Os princípios aplicam-se a qualquer setor. Quase todos os negócios têm:'
                    : 'The principles apply across industries. Almost every business has:'}
                </p>
                <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700 font-semibold mb-2 sm:mb-3">
                  <li>• {isPt ? 'processos administrativos' : 'administrative workflows'}</li>
                  <li>• {isPt ? 'gestão de consumos' : 'cost & consumption'}</li>
                  <li>• {isPt ? 'logística e stocks' : 'logistics & stock'}</li>
                  <li>• {isPt ? 'vendas' : 'sales operations'}</li>
                </ul>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {isPt
                    ? 'O que é preciso é abertura à inovação: a IA entra onde há tarefas repetitivas, informação dispersa ou decisões lentas.'
                    : 'All that is needed is openness to innovation: AI adds value wherever there are repetitive tasks, dispersed data, or slow decisions.'}
                </p>
              </section>
            </div>
          </div>
        </article>

        {/* ========================================================= */}
        {/* PÁGINA 3: PROJETOS (CASOS PRÁTICOS) */}
        {/* ========================================================= */}
        <article className="a4-page bg-white text-slate-900 relative shadow-2xl rounded-2xl lg:rounded-none overflow-hidden p-6 sm:p-10 md:p-14 lg:px-16 lg:py-10 flex flex-col justify-between">
          <header className="mb-4 sm:mb-5 border-b-2 border-[#0B1320] pb-3 flex justify-between items-end">
            <div>
              <img src="/logo.png" alt="Nuelltech" className="h-10 sm:h-12 w-auto mb-2 object-contain" />
              <h2 className="text-[11px] sm:text-xs lg:text-sm font-bold tracking-widest uppercase text-gray-400">
                {isPt ? 'Casos Práticos' : 'Case Studies'}
              </h2>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1320]">02</div>
          </header>

          <section className="flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-end mb-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0B1320]">
                  {isPt ? 'Projetos em Implementação' : 'Projects in Implementation'}
                </h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 italic mb-4 sm:mb-5">
                {isPt
                  ? '* Os ganhos das análises são estimativas. Os resultados medidos juntam-se a esta tabela quando estiverem confirmados.'
                  : '* Analysis gains are estimates. Measured results will be updated as deployments are finalized.'}
              </p>

              {/* 1. VERSÃO TABELA: DESKTOP & IMPRESSÃO (MD+) */}
              <div className="hidden md:block print:block">
                {/* Cabeçalho Tabela */}
                <div className="grid grid-cols-12 gap-4 border-b-2 border-[#0B1320] pb-2 mb-3 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-400">
                  <div className="col-span-2">{isPt ? 'Área' : 'Area'}</div>
                  <div className="col-span-4">{isPt ? 'O que queremos resolver' : 'What we solve'}</div>
                  <div className="col-span-6">{isPt ? 'Como a IA ajuda' : 'How AI helps'}</div>
                </div>

                {/* Linhas da Tabela */}
                <div className="flex flex-col gap-3">
                  {projects.map((proj, idx) => (
                    <div
                      key={`desktop-proj-${idx}`}
                      className={`grid grid-cols-12 gap-4 ${
                        idx < projects.length - 1 ? 'border-b border-gray-100 pb-3' : ''
                      }`}
                    >
                      <div className="col-span-2 font-bold text-[#0B1320] text-xs sm:text-sm pt-0.5">
                        {isPt ? proj.areaPt : proj.areaEn}
                      </div>
                      <div className="col-span-4 text-xs sm:text-[12.5px] text-gray-600 leading-relaxed">
                        {isPt ? proj.problemPt : proj.problemEn}
                      </div>
                      <div className="col-span-6 text-xs sm:text-[12.5px] text-gray-600 leading-relaxed">
                        {isPt ? proj.solutionPt : proj.solutionEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. VERSÃO CARDS RESPONSIVA: MOBILE & TABLET (< MD) */}
              <div className="flex flex-col gap-3.5 md:hidden print:hidden">
                {projects.map((proj, idx) => (
                  <div
                    key={`mobile-proj-${idx}`}
                    className="p-3.5 sm:p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#0B1320]">
                        {isPt ? proj.areaPt : proj.areaEn}
                      </span>
                      <span className="text-[10px] font-mono text-[#f25c05] font-bold uppercase">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 leading-relaxed">
                      <strong className="text-slate-900 block font-semibold mb-0.5">
                        {isPt ? 'Desafio:' : 'Challenge:'}
                      </strong>
                      {isPt ? proj.problemPt : proj.problemEn}
                    </div>

                    <div className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 leading-relaxed mt-0.5">
                      <strong className="text-[#f25c05] block font-semibold mb-0.5">
                        {isPt ? 'Como a IA ajuda:' : 'How AI helps:'}
                      </strong>
                      {isPt ? proj.solutionPt : proj.solutionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </article>

        {/* ========================================================= */}
        {/* PÁGINA 4: DIFERENCIAÇÃO & CTA */}
        {/* ========================================================= */}
        <article className="a4-page bg-white text-slate-900 relative shadow-2xl rounded-2xl lg:rounded-none overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-between">
          <header className="mb-6 sm:mb-10 lg:mb-14 border-b-2 border-[#0B1320] pb-4 sm:pb-5 flex justify-between items-end">
            <div>
              <img src="/logo.png" alt="Nuelltech" className="h-10 sm:h-12 lg:h-14 w-auto mb-2 sm:mb-3 object-contain" />
              <h2 className="text-[11px] sm:text-xs lg:text-sm font-bold tracking-widest uppercase text-gray-400">
                {isPt ? 'Diferenciação' : 'Differentiation'}
              </h2>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1320]">03</div>
          </header>

          {/* Secção Superior: Diferenciação */}
          <section className="mb-auto">
            <h3 className="text-xl sm:text-2xl lg:text-[2rem] font-extrabold text-[#0B1320] mb-6 sm:mb-8 lg:mb-10 tracking-tight">
              {isPt ? 'Porquê a Nuelltech?' : 'Why Nuelltech?'}
            </h3>

            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-9">
              <div className="flex gap-3.5 sm:gap-5 items-start">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-200 flex-shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#0B1320] mb-1">
                    {isPt ? 'Começamos pelo negócio' : 'We start with the business'}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                    {isPt
                      ? 'Ajudamos a pensar o negócio e a resolver problemas operacionais ou financeiros, e só depois olhamos para a tecnologia como ferramenta de solução.'
                      : 'We start by understanding the business and solving operational or financial bottlenecks; only then do we deploy technology as the delivery vehicle.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-5 items-start">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-200 flex-shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#0B1320] mb-1">
                    {isPt ? 'Experiência com grandes grupos' : 'Enterprise retail pedigree'}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                    {isPt
                      ? 'Anos de trabalho no terreno com grandes operadores de retalho, metodologias robustas e escala, agora trazidos e adaptados para a realidade das PMEs.'
                      : 'Years of hands-on experience with tier-1 international retail operators, robust methodologies, and scale, now adapted for SMEs.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 sm:gap-5 items-start">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-200 flex-shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#0B1320] mb-1">
                    {isPt ? 'Agilidade' : 'Agility'}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                    {isPt
                      ? 'Projetos desenhados para serem iterativos. Focamo-nos num tempo mínimo até ao primeiro piloto para que a sua empresa consiga provar resultados reais rapidamente, antes de escalar o investimento.'
                      : 'Projects designed for rapid iterations. We focus on a minimum time to first pilot so your organization proves real ROI before scaling investment.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Caixa de CTA e Contactos */}
          <footer className="bg-slate-50 border border-slate-200 text-[#0B1320] rounded-2xl p-5 sm:p-7 lg:p-8 text-center relative overflow-hidden mt-6 sm:mt-8 shadow-sm">
            <h3 className="text-base sm:text-lg lg:text-xl font-extrabold mb-2 sm:mb-3 text-[#0B1320]">
              {isPt ? 'Próximo passo e contactos' : 'Next steps and contacts'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mb-5 sm:mb-6 leading-relaxed">
              {isPt
                ? 'Agende uma conversa de diagnóstico para percebermos juntos onde a tecnologia pode ajudar a otimizar a sua operação, sem qualquer compromisso.'
                : 'Schedule an obligation-free diagnostic session to explore how automation and AI can streamline your operations.'}
            </p>

            {/* BOTÕES INTERATIVOS (visíveis no ecrã) */}
            <div className="no-print flex flex-col sm:flex-row justify-center items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              {/* Botão Falar com o Nuell */}
              <button
                type="button"
                onClick={handleOpenNuell}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isPt ? 'Falar com o Nuell (Assistente IA)' : 'Talk with Nuell (AI Assistant)'}</span>
              </button>

              {/* Botão Calendly */}
              <a
                href="https://calendly.com/nuelltech/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#f25c05] hover:bg-[#d94f00] text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-[#f25c05]/20 transition active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{isPt ? 'Agendar Diagnóstico Gratuito' : 'Book Free Diagnosis'}</span>
              </a>
            </div>

            {/* Contactos em texto (sempre visível no ecrã e impresso no PDF) */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-y-1 sm:gap-y-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold border-t border-slate-200 pt-4 sm:pt-5">
              <span className="text-slate-800 font-bold">Nuno Rogério Miguel</span>
              <span className="hidden sm:inline text-[#f25c05] mx-2">•</span>
              <span>{isPt ? 'Sócio-Gerente' : 'Managing Partner'}</span>
              <span className="hidden sm:inline mx-2 text-slate-300">|</span>
              <span className="text-slate-700 font-medium">nuno.miguel@nuelltech.com</span>
              <span className="hidden sm:inline text-[#f25c05] mx-2">•</span>
              <span>+351 966 665 571</span>
              <span className="hidden sm:inline text-[#f25c05] mx-2">•</span>
              <span>nuelltech.com</span>
              <span className="hidden sm:inline text-[#f25c05] mx-2">•</span>
              <span>Vila Real</span>
            </div>
          </footer>
        </article>

      </main>

      {/* Assistente Nuell Interativo Flutuante (oculto automaticamente na impressão) */}
      <NuellWidget lang={lang} />
    </div>
  );
}
