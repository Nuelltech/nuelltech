'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Maximize, 
  Minimize, 
  ArrowRight,
  TrendingDown,
  Megaphone,
  Ban,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowDown,
  Activity,
  Sparkles,
  Boxes,
  Users,
  Zap
} from 'lucide-react';

export default function PitchEnterprise() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalSlides = 11;

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

  const isDarkSlide = [0, 4, 8, 10].includes(currentSlide);

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

      {/* Global Header Bar: Logo Nuelltech */}
      <div className="absolute top-6 sm:top-8 left-6 sm:left-10 z-50 flex items-center">
        <Link 
          href="/" 
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
      <div className="absolute top-6 sm:top-8 right-6 sm:right-10 z-50 flex items-center gap-3">
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
          Anterior
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
          Próximo
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
            Governação & Eficiência Operacional
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 tracking-wide text-white">
            Inteligência Institucional
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-300 max-w-2xl leading-relaxed">
            Otimização de processos multi-departamento e apoio à decisão estratégica construídos sobre os sistemas de informação que a sua empresa já utiliza.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 2: O Paradigma Atual / A Dor (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 my-auto py-20">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-6 block">
            O Paradigma Atual
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[3.25rem] font-serif font-bold leading-tight mb-12 sm:mb-20 max-w-4xl tracking-wide text-[#131b2f]">
            A informação existe, mas a decisão esbarra em departamentos isolados.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">Ilhas de Informação</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Forte investimento em ERPs, Faturação e Logística, mas os sistemas e os departamentos não dialogam de forma ágil.
              </p>
            </div>

            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">Decisões Morosas</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                As equipas perdem dias a extrair e cruzar ficheiros de Excel. O tempo de resposta penaliza as oportunidades de negócio.
              </p>
            </div>

            <div className="border-l-2 border-[#e11d48] pl-6">
              <svg className="w-8 h-8 text-[#e11d48] mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0.8"></path>
              </svg>
              <h3 className="text-xl font-serif font-bold mb-3 text-[#131b2f]">Risco &ldquo;Shadow AI&rdquo;</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                Colaboradores expõem dados sensíveis em plataformas abertas (ex: ChatGPT) devido à falta de uma infraestrutura corporativa segura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 3: Posicionamento da Nuelltech (Slate-50) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 2 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-slate-50 text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 my-auto py-20">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            Posicionamento Nuelltech
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-12 sm:mb-16 tracking-wide text-[#131b2f]">
            Foco nas Operações e no Capital
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border-t-[4px] border-slate-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-500">O que NÃO fazemos</h3>
              </div>
              <p className="text-slate-500 font-light leading-relaxed text-sm sm:text-base">
                Não criamos apenas chatbots genéricos de atendimento ao cliente ou geradores de imagens para marketing. A nossa intervenção atua estritamente na resolução de estrangulamentos operacionais e logísticos.
              </p>
            </div>

            <div className="bg-[#131b2f] text-white p-8 sm:p-10 rounded-2xl shadow-xl border-t-[4px] border-[#14b8a6] transform md:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#14b8a6]/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">O que Construímos</h3>
              </div>
              <p className="text-slate-300 font-light leading-relaxed text-sm sm:text-base">
                Implementamos uma <strong className="text-white">camada de Inteligência Analítica e Segura</strong> que se liga aos sistemas que já possui. A IA faz o trabalho pesado de cruzar dados de logística, canais de vendas e stocks, fornecendo respostas cirúrgicas à gestão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 4: Valor no Terreno / Decisão (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 3 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 sm:px-8 my-auto py-16">
          <div className="lg:pr-12">
            <span className="text-teal-500 font-bold tracking-widest uppercase text-xs mb-4 block">
              Valor no Terreno
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 tracking-wide text-[#131b2f]">
              Apoio Direto à Decisão Executiva
            </h2>
            <p className="text-base sm:text-lg font-light text-slate-600 mb-8 sm:mb-12 border-l-2 border-teal-500 pl-6 leading-relaxed">
              A IA liberta o administrador da dependência de relatórios formatados, permitindo uma gestão ao ritmo de uma conversa.
            </p>
            
            <ul className="space-y-6 sm:space-y-8 text-slate-700 font-light">
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f] mb-1">Análise de Vendas e Stocks</h3>
                  <p className="text-sm leading-relaxed text-slate-500">Identificação instantânea dos canais mais rentáveis, origens de perdas logísticas e mapeamento de capital imobilizado em armazém.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f] mb-1">Diagnóstico Instantâneo</h3>
                  <p className="text-sm leading-relaxed text-slate-500">Interrogue o sistema em linguagem natural. A IA extrai e cruza milhares de linhas de dados para devolver o impacto financeiro em segundos, não em dias.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mt-1 mr-4 flex-shrink-0 text-teal-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f] mb-1">Decisão Exclusivamente Humana</h3>
                  <p className="text-sm leading-relaxed text-slate-500">A máquina faz a recolha e propõe cenários económicos. O decisor foca-se na validação estratégica. A execução flui nativamente para as equipas.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="relative mx-auto flex items-center justify-center w-full h-full">
            <div className="w-full max-w-xl bg-gradient-to-br from-[#0c1322] via-[#131b2f] to-[#0f172a] rounded-3xl border border-slate-700/80 p-5 sm:p-7 relative shadow-2xl overflow-hidden text-white">
              {/* Background ambient lighting & grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#14b8a6 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}
              />
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Technical Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                    Pipeline de Inteligência Ativa
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[10px] font-mono text-slate-300">
                  <Activity className="w-3 h-3 text-teal-400" />
                  Tempo Real
                </span>
              </div>

              {/* Tier 1: Ingestion Sources */}
              <div className="relative z-10 mb-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Fontes de Dados (Conectores Diretos)
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-colors p-3 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-1.5">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-white">Vendas (ERP)</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">Faturação & Margens</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-colors p-3 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1.5">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-white">Stocks & WMS</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">Lotes & Validades</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 transition-colors p-3 rounded-xl flex flex-col items-center text-center shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs text-white">CRM & Procura</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">Rotatividade Real</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Connecting Lines into Engine */}
              <div className="relative z-10 flex flex-col items-center my-1">
                <div className="w-full flex items-center justify-center relative py-1">
                  <div className="h-4 border-l-2 border-dashed border-teal-500/50"></div>
                  <span className="absolute bg-[#0f172a] px-2.5 py-0.5 rounded-full border border-teal-500/30 text-[9px] font-mono text-teal-300 uppercase tracking-wider">
                    Ingestão & Cruzamento Contínuo
                  </span>
                </div>
              </div>

              {/* Tier 2: Nuelltech AI Core Engine */}
              <div className="relative z-10 my-2">
                <div className="bg-gradient-to-r from-teal-950/60 via-slate-900/90 to-teal-950/60 border border-teal-500/50 rounded-2xl p-4 shadow-[0_0_25px_rgba(20,184,166,0.2)] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-md">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                          Motor Nuelltech AI Core
                          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div className="text-[10px] text-teal-300 font-mono">Dedução Económica & Previsão</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 border border-slate-700 px-2 py-0.5 rounded bg-slate-800/80">
                      Zero Alucinações
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-light">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal-400 flex-shrink-0" />
                      <span>Deteção de Anomalias & Risco</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal-400 flex-shrink-0" />
                      <span>Simulação de Cenários de Caixa</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting line to decision */}
              <div className="relative z-10 flex flex-col items-center my-1">
                <div className="w-full flex items-center justify-center relative py-1">
                  <div className="h-4 border-l-2 border-dashed border-teal-500/50"></div>
                  <span className="absolute bg-[#0f172a] px-2.5 py-0.5 rounded-full border border-teal-500/30 text-[9px] font-mono text-teal-300 uppercase tracking-wider">
                    Proposta Estratégica
                  </span>
                </div>
              </div>

              {/* Tier 3: Human Executive Validation Cockpit */}
              <div className="relative z-10 mt-1">
                <div className="bg-gradient-to-r from-teal-600 to-[#0d9488] rounded-xl p-3.5 sm:p-4 shadow-lg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-teal-100 flex-shrink-0" />
                      <span className="font-serif font-bold text-sm sm:text-base">
                        Validação & Decisão Executiva
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white font-medium">
                      Humano no Controlo
                    </span>
                  </div>
                  <p className="text-xs text-teal-50 font-light mb-2.5 leading-relaxed">
                    A máquina calcula e recomenda os melhores cenários; a liderança valida com 1 clique e dispara a execução direta.
                  </p>
                  
                  {/* Downstream branches */}
                  <div className="flex items-center justify-between pt-2 border-t border-teal-400/40 text-[10px] font-mono text-teal-100 gap-1">
                    <span className="truncate">→ Veto a Compras</span>
                    <span>•</span>
                    <span className="truncate">→ Ajuste Stock</span>
                    <span>•</span>
                    <span className="truncate">→ Tarefas Equipa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 5: Transição: A Prova de Conceito (Dark Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 4 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white text-center`}
      >
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 my-auto py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#14b8a6] mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)] transform hover:scale-105 transition-transform">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            A Prova de Conceito
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-8 tracking-wide text-white">
            O Caso Prático: BI Pharma
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-10 sm:mb-12 max-w-4xl mx-auto">
            Veja o funcionamento real de como a nossa IA transforma os fluxos de gestão no retalho farmacêutico, orquestrando desde a pergunta do decisor até à tarefa da equipa no terreno.
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl w-full max-w-3xl mx-auto flex items-center justify-center text-teal-300 font-serif text-base sm:text-lg italic">
            &ldquo;Uma prova de conceito de governação inteligente, desenhada para ser escalada a processos de Logística, Distribuição e Indústria.&rdquo;
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 6: Gestão Conversa Copilot - Vídeo (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 5 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-[90rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-4 sm:px-8 my-auto py-16">
          <div className="lg:col-span-5">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
              Evolução do Interface
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 tracking-wide text-[#131b2f]">
              Gestão ao Ritmo de uma Conversa
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 border-l-2 border-teal-500 pl-6 font-light">
              Obtenha diagnósticos financeiros instantâneos sem depender de extrações de dados ou relatórios formatados.
            </p>
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4 mt-1 font-bold text-slate-600 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f]">A Pergunta de Negócio</h3>
                  <p className="text-slate-600 font-light text-sm mt-1">
                    O decisor dialoga com o sistema em linguagem natural. Ex: <em>&ldquo;Quais os produtos sem vendas há mais de 3 meses que nos pesam mais nas contas?&rdquo;</em>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mr-4 mt-1 font-bold text-teal-600 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#131b2f]">Diagnóstico Instantâneo</h3>
                  <p className="text-slate-600 font-light text-sm mt-1">
                    A IA cruza o histórico de vendas, fornecedores e caducidades, processando o impacto exato na tesouraria em segundos.
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
                  Copilot Executivo
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
      {/* SLIDE 7: Da Decisão à "Folha de Ações" - Vídeo 16:9 (White) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 6 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col justify-between my-auto py-12" style={{ minHeight: '85vh' }}>
          <div className="text-center mb-6">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3 block">
              Fluxo Multidepartamental
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-serif font-bold mb-3 tracking-wide text-[#131b2f]">
              Da Decisão à &ldquo;Folha de Ações&rdquo;
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-3xl mx-auto">
              A aprovação do gestor transforma-se imediatamente em tarefas para as equipas operacionais, bloqueando compras erradas e focando no escoamento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 z-10">
            <div className="bg-white border-t-[4px] border-[#e11d48] p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4 text-[#e11d48]">
                <Ban className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">O que NÃO encomendar</h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                Bloqueio inteligente de compras aos fornecedores, justificado ativamente pelo sistema.
              </p>
            </div>

            <div className="bg-white border-t-[4px] border-amber-500 p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">Escoar Stock Parado</h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                Priorização de inventário e identificação de produtos próximos do risco de caducidade.
              </p>
            </div>

            <div className="bg-white border-t-[4px] border-[#14b8a6] p-6 rounded-b-xl shadow-lg flex flex-col items-start border border-slate-100">
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-600">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#131b2f] mb-2">Marketing e Vendas</h3>
              <p className="text-slate-500 font-light leading-relaxed text-xs">
                Sugestão de campanhas cruzando produtos parados com o calendário civil.
              </p>
            </div>
          </div>

          {/* VÍDEO FOLHA AÇÕES (conforme o original) */}
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
      {/* SLIDE 8: Orquestração Silenciosa (Slate-50) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 7 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-slate-50 text-[#131b2f]`}
      >
        <div className="max-w-6xl mx-auto w-full text-center mb-12 sm:mb-16 px-4 sm:px-8 my-auto py-16">
          <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            Orquestração Silenciosa
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide text-[#131b2f]">
            Visão Adaptativa & Impacto
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-light">
            O BI Pharma ramifica a sua decisão de forma automática, garantindo que nenhum departamento fica desfasado.
          </p>

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center mt-12">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-teal-500 shadow-sm relative text-left">
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                Decisão Gestão
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Administração aprova plano proposto pelo Copilot.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                Compras
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Bloqueio automático de encomendas redundantes.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                Inventário
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Ajuste de mínimos e parametrização de stocks.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-t-2 border-[#e11d48] shadow-sm relative text-left mt-0 sm:mt-6">
              <div className="hidden lg:block absolute -top-6 left-1/2 w-[1px] h-6 bg-[#e11d48] opacity-50"></div>
              <h3 className="font-serif font-bold text-[#131b2f] mb-3 text-lg">
                App Terreno
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Tarefas operacionais e promos enviadas para a equipa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 9: Ação no Terreno com Telemóvel Android e Vídeo 3 (Navy) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 8 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white`}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 sm:px-8 my-auto py-16">
          <div className="lg:pr-12">
            <span className="text-teal-500 font-bold tracking-widest uppercase text-xs mb-4 block">
              A Última Milha
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 tracking-wide text-white">
              Execução Direta no Balcão
            </h2>
            <p className="text-base sm:text-lg font-light text-slate-300 mb-8 sm:mb-12 border-l-2 border-teal-500 pl-6 leading-relaxed">
              A IA não fica confinada à gestão. O sistema distribui microtarefas guiadas diretamente para os telemóveis das equipas operacionais.
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
                    Priorização Automática
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Tarefas de risco organizadas por categorias de urgência: Validades a expirar e Ruturas de stock inadiáveis.
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
                    Ação Específica e Guiada
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Instruções claras e diretas, como &ldquo;Separar fisicamente da prateleira&rdquo; ou colocar em destaque imediato.
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
                    Motivação Financeira (Gamification)
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    A equipa visualiza no topo da App os Euros poupados em tempo real pelas suas ações diárias.
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
      {/* SLIDE 10: Aplicabilidade no Tecido Empresarial (White - GENÉRICO) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 9 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-white text-[#131b2f]`}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-center px-4 sm:px-8 text-center my-auto py-12" style={{ minHeight: '85vh' }}>
          <div className="mb-10 sm:mb-12">
            <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3 block">
              Escala & Expansão
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[3rem] font-serif font-bold mb-3 tracking-wide text-[#131b2f]">
              Aplicabilidade no Tecido Empresarial
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-light max-w-4xl mx-auto leading-relaxed">
              O fluxo de inteligência governada adapta-se de forma direta a qualquer setor estratégico de elevada densidade de dados e capital intensivo.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl relative gap-8 md:gap-0">
            {/* Grelha de 5 Setores */}
            <div className="flex flex-col space-y-3 w-full md:w-1/3 relative z-10">
              <div className="bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                Banca & Seguros
              </div>
              <div className="bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                Logística & Portos
              </div>
              <div className="bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                Distribuição & Retalho
              </div>
              <div className="bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                Indústria & Manufatura
              </div>
              <div className="bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl shadow-sm text-center font-serif font-bold text-[#131b2f] hover:border-teal-400 transition-colors">
                Saúde & Farmácias
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
                <h3 className="font-serif font-bold text-xl mb-2 text-white">Decisão Humana</h3>
                <p className="text-sm font-light text-teal-100 leading-relaxed">
                  Validação executiva de Risco e Compliance, com ajuste rigoroso à realidade operacional da sua organização.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLIDE 11: Sessão de Diagnóstico Executivo (Dark Navy - GENÉRICO) */}
      {/* ======================================================== */}
      <section 
        className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-20 transition-opacity duration-700 overflow-y-auto ${
          currentSlide === 10 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
        } bg-[#131b2f] text-white text-center relative overflow-hidden`}
      >
        <div className="max-w-4xl mx-auto w-full px-8 relative z-10 flex flex-col items-center justify-center my-auto py-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide leading-tight text-white">
            Sessão de Diagnóstico Executivo
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 font-light mb-12 sm:mb-16 leading-relaxed max-w-2xl mx-auto">
            Queremos ouvir os desafios operacionais e financeiros da sua empresa. Uma reunião exploratória para mapear como a IA pode desbloquear eficiência e capital nos seus processos atuais.
          </p>
          <a 
            href="https://calendly.com/nuelltech/30min?month=2026-11" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 font-bold text-white bg-[#14b8a6] rounded-full overflow-hidden transition-all duration-300 hover:bg-teal-400 hover:scale-105 shadow-[0_10px_40px_-10px_rgba(20,184,166,0.7)] cursor-pointer z-50"
          >
            <span className="mr-3 font-sans text-base sm:text-lg tracking-wide uppercase">
              Agendar Reunião de Descoberta
            </span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </a>
          <div className="mt-12 text-slate-400 text-xs sm:text-sm font-light uppercase tracking-widest">
            Nuelltech • Estratégia e Governação AI
          </div>
        </div>
      </section>
    </div>
  );
}
