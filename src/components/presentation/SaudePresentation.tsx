'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  ArrowRight
} from 'lucide-react';

interface SaudePresentationProps {
  lang: 'pt' | 'en';
}

export default function SaudePresentation({ lang }: SaudePresentationProps) {
  const isPt = lang === 'pt';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalSlides = 10;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Is dark slide for counter contrast
  const isDarkSlide = [0, 3, 7, 9].includes(currentSlide);

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen min-h-[100dvh] bg-[#131b2f] text-slate-800 overflow-hidden font-sans select-none"
    >
      {/* Top Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-1 bg-[#14b8a6] transition-all duration-500 ease-out z-50 shadow-[0_0_10px_rgba(20,184,166,0.6)]"
        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
      />

      {/* Global Header Bar: Logo Nuelltech (SEM a etiqueta) */}
      <div className="absolute top-6 sm:top-8 left-6 sm:left-10 z-50 flex items-center">
        <Link 
          href={`/${lang}`} 
          className="group transition-transform hover:scale-105 block"
          title="Nuelltech"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Nuelltech"
            className="h-12 sm:h-16 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Fullscreen toggle button on top right */}
      <div className="absolute top-6 sm:top-8 right-6 sm:right-10 z-50">
        <button
          onClick={toggleFullscreen}
          aria-label="Alternar ecrã inteiro"
          className={`p-2.5 rounded-full border transition-all ${
            isDarkSlide 
              ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700' 
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm'
          }`}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Navigation Controls (Previous / Next) */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 z-50 flex items-center gap-3">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Slide anterior"
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
            currentSlide === 0 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-[#131b2f] text-white border-white/20 hover:bg-[#1e293b] active:scale-95 shadow-lg'
          }`}
        >
          {isPt ? 'Anterior' : 'Previous'}
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          aria-label="Próximo slide"
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
            currentSlide === totalSlides - 1 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-[#131b2f] text-white border-white/20 hover:bg-[#1e293b] active:scale-95 shadow-lg'
          }`}
        >
          {isPt ? 'Próximo' : 'Next'}
        </button>
      </div>

      {/* Slide Counter (Left Bottom) */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 z-50 pointer-events-none">
        <span className={`font-mono font-semibold text-sm transition-colors ${
          isDarkSlide ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>

      {/* ======================================================== */}
      {/* SLIDE 1: Capa (Dark Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 0 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white`}
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 my-auto py-20">
          <div className="w-12 h-[3px] bg-[#14b8a6] mb-8" />
          <span className="text-[#14b8a6] font-bold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            {isPt ? 'Governação & Rentabilidade' : 'Governance & Profitability'}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 tracking-wide text-white">
            {isPt ? 'Inteligência Ativa na Saúde' : 'Active Intelligence in Healthcare'}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-300 max-w-2xl leading-relaxed">
            {isPt 
              ? 'A IA como parte integrante da gestão: potenciar a decisão e dar visibilidade a informação desintegrada.'
              : 'AI as a core pillar of management: empowering decisions and bringing visibility to fragmented data.'}
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 2: O Dilema Atual (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 my-auto py-20">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-6 block">
            {isPt ? 'O Dilema Atual' : 'The Current Dilemma'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[3.25rem] font-serif font-bold leading-tight mb-12 sm:mb-20 max-w-4xl tracking-wide text-[#131b2f]">
            {isPt 
              ? 'A fragmentação da informação limita a decisão.'
              : 'Information fragmentation limits decision-making.'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" opacity="0.3"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 00-12.728 0m12.728 0A9 9 0 0118.364 19.792m-12.728-14.156a9 9 0 000 12.728m12.728-12.728l-12.728 12.728"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">
                {isPt ? 'Sistemas Fragmentados' : 'Fragmented Systems'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'ERPs e softwares clínicos não dialogam. Dependência total de folhas de cálculo.'
                  : 'ERPs and clinical software do not communicate. Total dependence on spreadsheets.'}
              </p>
            </div>

            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">
                {isPt ? 'Dashboards Estáticos' : 'Static Dashboards'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'A gestão consome reports fixos. Qualquer questão ou interpretação complementar exige extrações manuais demoradas.'
                  : 'Management relies on static reports. Any followup query requires slow manual exports.'}
              </p>
            </div>

            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0.8"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">
                {isPt ? 'Risco "Shadow AI"' : '"Shadow AI" Risk'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'Colaboradores já usam IA isoladamente (prompts, vibecoding). Sem método institucional, o risco de fuga e não-conformidade dispara.'
                  : 'Employees already use public AI tools informally. Without governance, leak and compliance risks skyrocket.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 3: A Solução (Slate-50) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 2 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-slate-50 text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 my-auto py-20">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            {isPt ? 'A Solução' : 'The Solution'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wide text-[#131b2f]">
            {isPt ? 'Inteligência Institucional com Governação' : 'Institutional Intelligence with Governance'}
          </h2>
          <p className="text-base sm:text-lg text-teal-600 mb-12 sm:mb-20 font-medium tracking-wide">
            {isPt 
              ? 'O futuro imediato: Redesenho de processos assente em IA governada.'
              : 'The immediate future: Process redesign built on governed AI.'}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto text-center gap-6 md:gap-0">
            <div className="flex flex-col items-center w-full md:w-1/3 px-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-[#131b2f] mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-xl font-serif font-bold text-[#131b2f] mb-3">
                {isPt ? 'Dados Certificados' : 'Certified Data'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'Zero alucinações. Acesso apenas a catálogos oficiais.'
                  : 'Zero hallucinations. Grounded strictly in validated internal records.'}
              </p>
            </div>

            <div className="w-16 flex-shrink-0 text-slate-300 md:rotate-0 rotate-90 my-2 md:my-0">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>

            <div className="flex flex-col items-center w-full md:w-1/3 px-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-teal-600 mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-xl font-serif font-bold text-[#131b2f] mb-3">
                {isPt ? 'Proposta da Máquina' : 'Machine Proposal'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'Cruzamento de variáveis e recomendação económica.'
                  : 'Multi-variable reconciliation and quantified economic recommendation.'}
              </p>
            </div>

            <div className="w-16 flex-shrink-0 text-slate-300 md:rotate-0 rotate-90 my-2 md:my-0">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>

            <div className="flex flex-col items-center w-full md:w-1/3 px-4">
              <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-3xl font-bold text-white mb-6 shadow-lg transform md:scale-110">
                3
              </div>
              <h3 className="text-xl font-serif font-bold text-[#131b2f] mb-3">
                {isPt ? 'Validação Humana' : 'Human Validation'}
              </h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {isPt 
                  ? 'O humano valida as opções e decide o rumo. O processo é redesenhado para a ação.'
                  : 'Management validates options and directs execution. Designed specifically for action.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 4: Prova Viva (Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 3 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white text-center`}
      >
        <div className="max-w-4xl mx-auto w-full px-8 my-auto py-20 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#14b8a6] mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.5)] transform hover:scale-105 transition-transform">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.6 5.5l7.9 7.9c1.6 1.6 1.6 4.1 0 5.7s-4.1 1.6-5.7 0l-7.9-7.9c-1.6-1.6-1.6-4.1 0-5.7s4.1-1.6 5.7 0zm-1.4 1.4c-.8-.8-2.1-.8-2.9 0s-.8 2.1 0 2.9l2.8 2.8 2.9-2.9-2.8-2.8zm7.1 7.1l-2.8-2.8-2.9 2.9 2.8 2.8c.8.8 2.1.8 2.9 0s.8-2.1 0-2.9z" />
            </svg>
          </div>
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            {isPt ? 'A Prova Viva' : 'Living Proof'}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-8 tracking-wide text-white">
            {isPt ? 'O Caso Prático: BI Pharma' : 'The Practical Case: BI Pharma'}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
            {isPt 
              ? 'A demonstração real de como a IA transforma os fluxos de gestão de inventário em farmácias, gerando ganhos medidos em múltiplos departamentos.'
              : 'A real demonstration of how AI transforms healthcare inventory and cash-flow management, generating measured returns across multiple departments.'}
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 5: Gestão Conversa Copilot com Vídeo 1 (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 4 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-[90rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-4 sm:px-8 my-auto py-16">
          <div className="lg:col-span-5">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
              {isPt ? 'Evolução do Interface' : 'Interface Evolution'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 tracking-wide text-[#131b2f]">
              {isPt ? 'Gestão ao Ritmo de uma Conversa' : 'Management at the Pace of a Conversation'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 border-l-2 border-teal-500 pl-6 font-light">
              {isPt 
                ? 'O futuro imediato: obtenha diagnósticos financeiros instantâneos sem depender de extrações de dados ou relatórios formatados.'
                : 'The immediate future: obtain instant financial diagnostics without depending on manual data extracts or formatted reports.'}
            </p>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 mt-1 font-bold text-slate-600 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f]">
                    {isPt ? 'A Pergunta de Negócio' : 'The Business Question'}
                  </h3>
                  <p className="text-slate-600 font-light text-sm mt-1">
                    {isPt 
                      ? 'O decisor dialoga com o sistema em linguagem natural. Ex: "Quais os produtos sem vendas há mais de 3 meses que nos pesam mais nas contas?"'
                      : 'Leadership converses naturally with the system. E.g.: "Which stagnant products have the heaviest impact on our working capital?"'}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mr-4 mt-1 font-bold text-teal-600 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f]">
                    {isPt ? 'Diagnóstico Instantâneo' : 'Instant Diagnostic'}
                  </h3>
                  <p className="text-slate-600 font-light text-sm mt-1">
                    {isPt 
                      ? 'A IA cruza o histórico de vendas, fornecedores e caducidades, processando o impacto exato na tesouraria em segundos.'
                      : 'AI reconciles sales history, suppliers, and expiration dates, computing precise treasury impact in seconds.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative w-full lg:col-span-7">
            <div className="absolute inset-0 bg-teal-500 rounded-3xl transform rotate-2 scale-[1.03] opacity-20"></div>
            <div 
              className="relative bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-200"
              style={{ boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
                  BI Pharma Copilot
                </div>
              </div>
              <div className="bg-slate-50 w-full relative flex items-center justify-center">
                <video 
                  src="/videos/saude/copilot.mp4" 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 6: Folha Ações da Semana com Vídeo 2 (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 5 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col justify-between my-auto py-12" style={{ minHeight: '85vh' }}>
          
          <div className="text-center mb-6">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3 block">
              {isPt ? 'Fluxo Multidepartamental' : 'Cross-Departmental Workflow'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-serif font-bold mb-3 tracking-wide text-[#131b2f]">
              {isPt ? 'Da Decisão à "Folha de Ações da Semana"' : 'From Decision to the "Weekly Action Sheet"'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-3xl mx-auto">
              {isPt 
                ? 'A aprovação do gestor transforma-se imediatamente em tarefas para as equipas operacionais e de marketing, acelerando a execução.'
                : 'Management approval immediately translates into tasks for procurement, operational, and marketing teams.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 z-10">
            <div className="bg-white border-t-[4px] border-[#e11d48] p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4 text-[#e11d48]">
                <svg className="w-5 h-5 text-[#e11d48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 00-12.728 0m12.728 0A9 9 0 0118.364 19.792m-12.728-14.156a9 9 0 000 12.728m12.728-12.728l-12.728 12.728"></path>
                </svg>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">
                {isPt ? 'O que NÃO encomendar' : 'What NOT to order'}
              </h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                {isPt 
                  ? 'Bloqueio inteligente de compras aos fornecedores, justificado ativamente pelo sistema.'
                  : 'Intelligent veto on redundant supplier purchase orders, actively justified by verified inventory.'}
              </p>
            </div>

            <div className="bg-white border-t-[4px] border-amber-500 p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">
                {isPt ? 'Escoar Stock Parado' : 'Clear Stagnant Stock'}
              </h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                {isPt 
                  ? 'Priorização de inventário e identificação de produtos próximos do risco de caducidade.'
                  : 'Inventory prioritization and early batch expiry triage before capital loss.'}
              </p>
            </div>

            <div className="bg-white border-t-[4px] border-teal-500 p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-600">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">
                {isPt ? 'Marketing e Vendas' : 'Marketing & Sales'}
              </h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                {isPt 
                  ? 'Sugestão de campanhas cruzando produtos parados com o calendário civil.'
                  : 'Contextual campaigns aligning dormant stock with calendar and seasonal demand.'}
              </p>
            </div>
          </div>

          {/* Video Container do Slide 6 conforme o original */}
          <div className="flex-1 relative w-full min-h-[300px] border border-slate-200 rounded-xl bg-black flex items-center justify-center overflow-hidden shadow-2xl">
            <video 
              src="/videos/saude/acoes_semana.mp4" 
              controls 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover aspect-video"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 7: Orquestração Silenciosa (Slate-50) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 6 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-slate-50 text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full text-center mb-12 sm:mb-16 px-4 sm:px-8 my-auto py-16">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            {isPt ? 'Orquestração Silenciosa' : 'Silent Orchestration'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide text-[#131b2f]">
            {isPt ? 'Visão Adaptativa & Impacto' : 'Adaptive Vision & Impact'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-light">
            {isPt 
              ? 'O BI Pharma ramifica a sua decisão de forma automática, garantindo que nenhum departamento fica desfasado.'
              : 'BI Pharma automatically routes decisions across departments, ensuring total alignment from procurement to front-desk.'}
          </p>

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center mt-12">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-teal-500 shadow-sm relative text-left">
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                {isPt ? 'Decisão Gestão' : 'Executive Decision'}
              </h3>
              <p className="text-sm text-slate-500 font-light">
                {isPt ? 'Administração aprova plano proposto pelo Copilot.' : 'Leadership validates plan proposed by Copilot.'}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                {isPt ? 'Compras' : 'Procurement'}
              </h3>
              <p className="text-sm text-slate-500 font-light">
                {isPt ? 'Bloqueio automático de encomendas redundantes.' : 'Automated veto on redundant purchase orders.'}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                {isPt ? 'Inventário' : 'Inventory'}
              </h3>
              <p className="text-sm text-slate-500 font-light">
                {isPt ? 'Ajuste de mínimos e parametrização de stocks.' : 'Dynamic reorder threshold adjustments.'}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                {isPt ? 'App Terreno' : 'Floor App'}
              </h3>
              <p className="text-sm text-slate-500 font-light">
                {isPt ? 'Tarefas operacionais e promos enviadas para a equipa.' : 'Operational tasks and promos routed to frontline teams.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 8: Ação no Terreno com Telemóvel Android e Vídeo 3 (Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 7 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white`}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 sm:px-8 my-auto py-16">
          <div className="lg:pr-12">
            <span className="text-teal-500 font-bold tracking-widest uppercase text-xs mb-4 block">
              {isPt ? 'A Última Milha' : 'The Last Mile'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 tracking-wide text-white">
              {isPt ? 'Execução Direta no Balcão' : 'Direct Front-Desk Execution'}
            </h2>
            <p className="text-base sm:text-lg font-light text-slate-300 mb-8 sm:mb-12 border-l-2 border-teal-500 pl-6 leading-relaxed">
              {isPt 
                ? 'A IA não fica confinada à gestão. O sistema distribui microtarefas guiadas diretamente para os telemóveis das equipas operacionais.'
                : 'AI does not stay in the back office. The system routes structured micro-tasks directly to operational staff on their smartphones.'}
            </p>
            <ul className="space-y-6 sm:space-y-8 text-slate-300 font-light">
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">
                    {isPt ? 'Priorização Automática' : 'Automated Prioritization'}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {isPt 
                      ? 'Tarefas de risco organizadas por categorias de urgência: Validades a expirar e Ruturas de stock inadiáveis.'
                      : 'High-risk tasks organized by urgency: near-expiry batches and critical stockouts.'}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">
                    {isPt ? 'Ação Específica e Guiada' : 'Specific Guided Action'}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {isPt 
                      ? "Instruções claras e diretas, como 'Separar fisicamente da prateleira' ou colocar em destaque imediato."
                      : "Clear, actionable directives like 'Physically isolate from shelf' or 'Place on counter spotlight'."}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">
                    {isPt ? 'Motivação Financeira (Gamification)' : 'Financial Motivation (Gamification)'}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {isPt 
                      ? 'A equipa visualiza no topo da App os Euros poupados em tempo real pelas suas ações diárias.'
                      : 'Staff monitor preserved capital in real-time right at the top of their app.'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* MOCKUP EXATO DO CÓDIGO ORIGINAL COM NOTCH E BOTÕES ANDROID */}
          <div className="relative mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-20 transform scale-90"></div>
            <div 
              className="relative w-[375px] h-[600px] bg-black border-[12px] border-slate-800 overflow-hidden flex flex-col shadow-2xl rounded-[2.5rem]"
              style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.1)' }}
            >
              {/* Phone Notch conforme original */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[24px] bg-[#0f172a] rounded-b-2xl z-20"
              />

              {/* Video container com pb-12 e h-[calc(100%+3rem)] conforme original */}
              <div className="flex-1 w-full relative flex items-center justify-center bg-black pb-12 overflow-hidden">
                <video 
                  src="/videos/saude/mobile_balcao.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute top-0 left-0 w-full h-[calc(100%+3rem)] object-contain"
                />
              </div>

              {/* Botões Android inferiores conforme o código original */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-black flex items-center justify-around px-10 z-30 border-t border-slate-900">
                <svg className="w-6 h-6 text-slate-400 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                </svg>
                <div className="w-4 h-4 rounded-full border-[2.5px] border-slate-400 opacity-80"></div>
                <div className="w-4 h-4 border-[2.5px] border-slate-400 rounded-sm opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 9: Aplicabilidade no Ecossistema com Diagrama (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 8 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-center px-4 sm:px-8 text-center my-auto py-12" style={{ minHeight: '85vh' }}>
          <div className="mb-12 sm:mb-16">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
              {isPt ? 'Escala & Expansão' : 'Scale & Expansion'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-serif font-bold mb-4 tracking-wide text-[#131b2f]">
              {isPt ? 'Aplicabilidade no Ecossistema de Saúde' : 'Applicability Across the Healthcare Ecosystem'}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-4xl mx-auto leading-relaxed">
              {isPt 
                ? 'A arquitetura BI Pharma é a prova de conceito. O fluxo de inteligência governada aplica-se a qualquer unidade com elevada densidade de dados e capital intensivo.'
                : 'The BI Pharma architecture is an empirical proof-of-concept. The governed intelligence pipeline applies to any high-data, capital-intensive healthcare vertical.'}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl relative gap-8 md:gap-0">
            <div className="flex flex-col space-y-4 w-full md:w-1/3 relative z-10">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                {isPt ? 'Hospitais / Blocos' : 'Hospitals / Operating Theatres'}
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                {isPt ? 'Clínicas' : 'Clinics'}
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                {isPt ? 'Laboratórios' : 'Laboratories'}
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                {isPt ? 'Faturação / Glosas' : 'Billing / Claim Denials'}
              </div>
            </div>
            
            <div className="flex-1 flex justify-center items-center relative px-8">
              <div className="hidden md:block absolute w-full h-[2px] bg-gradient-to-r from-slate-200 via-teal-400 to-teal-200 top-1/2 left-0 -translate-y-1/2 z-0"></div>
              <div className="bg-[#131b2f] text-white p-6 rounded-full border-[6px] border-[#14b8a6] shadow-xl flex flex-col items-center justify-center w-36 h-36 sm:w-40 sm:h-40 relative z-10 transform hover:scale-105 transition-transform">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 mb-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
                <span className="font-bold tracking-widest text-xs uppercase">Motor IA</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center relative z-10">
              <div className="bg-teal-600 text-white p-6 rounded-2xl shadow-lg text-center border border-teal-700 w-full transform hover:-translate-y-1 transition-transform">
                <svg className="w-12 h-12 mx-auto mb-4 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="font-serif font-bold text-xl mb-2 text-white">
                  {isPt ? 'Decisão Humana' : 'Human Decision'}
                </h3>
                <p className="text-sm font-light text-teal-100 leading-relaxed">
                  {isPt 
                    ? 'Validação estratégica e de risco baseada nas ações processadas pela IA.'
                    : 'Strategic risk and priority validation grounded in deep automated intelligence.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 10: Call to Action Final (Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 9 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white text-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-teal-500/10 blur-3xl rounded-full w-[800px] h-[800px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto w-full px-8 relative z-10 flex flex-col items-center justify-center my-auto py-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide leading-tight text-white">
            {isPt 
              ? 'O Próximo Passo na Governação da Sua Instituição'
              : 'The Next Step in Your Institution’s Governance'}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 font-light mb-12 sm:mb-16 leading-relaxed max-w-2xl mx-auto">
            {isPt 
              ? 'Implementação controlada. Impacto financeiro imediato. Agende uma sessão de demonstração para mapear o diagnóstico operacional da sua unidade.'
              : 'Controlled deployment. Immediate financial impact. Schedule an executive demo to map your operational diagnostic.'}
          </p>
          <a 
            href="https://calendly.com/nuelltech/30min?month=2026-11" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 font-bold text-white bg-[#14b8a6] rounded-full overflow-hidden transition-all duration-300 hover:bg-teal-400 hover:scale-105 shadow-[0_10px_40px_-10px_rgba(20,184,166,0.7)]"
          >
            <span className="mr-3 font-sans text-base sm:text-lg tracking-wide uppercase">
              {isPt ? 'Agendar Demonstração' : 'Schedule Demo'}
            </span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
          <div className="mt-12 text-slate-500 text-sm font-light uppercase tracking-widest">
            Nuelltech • {isPt ? 'Estratégia & Automação AI' : 'AI Strategy & Automation'}
          </div>
        </div>
      </section>
    </div>
  );
}
