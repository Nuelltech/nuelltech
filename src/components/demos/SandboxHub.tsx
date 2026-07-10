'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Database, 
  FileSpreadsheet, 
  Code,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import OcrSandbox from './OcrSandbox';
import BiReconciliation from './BiReconciliation';
import BeforeAfterSlider from './BeforeAfterSlider';
import ApiSandbox from './ApiSandbox';

interface SandboxHubProps {
  isPt: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

type TabType = 'ocr' | 'bi' | 'excel' | 'api';

export default function SandboxHub({ isPt }: SandboxHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ocr');
  
  // Custom states for each tab's detailed texts collapse
  const [expandedText, setExpandedText] = useState<Record<TabType, boolean>>({
    ocr: false,
    bi: false,
    excel: false,
    api: false
  });

  const toggleText = (tab: TabType) => {
    setExpandedText(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }));
  };

  // Listen to chat assistant widgets events to automatically switch active tabs
  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: TabType }>;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };
    
    window.addEventListener('nuell-switch-sandbox-tab', handleSwitchTab);
    return () => {
      window.removeEventListener('nuell-switch-sandbox-tab', handleSwitchTab);
    };
  }, []);

  return (
    <div id="demos-container" className="relative w-full bg-[#080B14]/95 border border-[#1E293B] rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.12)] glass text-left overflow-hidden">
      {/* Glowing backdrop halos inside the frame */}
      <div className="absolute -top-48 -right-48 w-[400px] h-[400px] bg-brand-accent/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6 md:gap-8">
        
        {/* Mobile swipe helper (Option C) */}
        <div className="md:hidden flex items-center justify-between text-[9px] font-mono text-brand-ink-dim uppercase tracking-wider mb-0.5 px-1 select-none">
          <span>{isPt ? 'Demonstrações Disponíveis' : 'Available Demos'}</span>
          <span className="flex items-center gap-1 text-brand-accent-soft animate-pulse">
            {isPt ? 'Deslizar' : 'Swipe'} ➔
          </span>
        </div>

        {/* 1. Tab Selector Bar - Premium GitHub style with right fade mask on mobile */}
        <div className="relative w-full z-20">
          <div className="flex flex-nowrap md:flex-wrap bg-[#05070C]/85 border border-[#172033] rounded-xl p-1.5 gap-1.5 overflow-x-auto scrollbar-none pr-8 md:pr-1.5">
            
            <button
              data-analytics-id="sandbox_tab_ocr"
              onClick={() => setActiveTab('ocr')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition duration-300 border cursor-pointer ${
                activeTab === 'ocr'
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span>{isPt ? 'OCR & Auditoria' : 'OCR & Audit'}</span>
            </button>

            <button
              data-analytics-id="sandbox_tab_bi"
              onClick={() => setActiveTab('bi')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition duration-300 border cursor-pointer ${
                activeTab === 'bi'
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
              }`}
            >
              <Database className="w-4 h-4 flex-shrink-0" />
              <span>{isPt ? 'Stock Preditivo' : 'Predictive Stock'}</span>
            </button>

            <button
              data-analytics-id="sandbox_tab_excel"
              onClick={() => setActiveTab('excel')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition duration-300 border cursor-pointer ${
                activeTab === 'excel'
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
              <span>{isPt ? 'Modernizar Excel' : 'Modernize Excel'}</span>
            </button>

            <button
              data-analytics-id="sandbox_tab_api"
              onClick={() => setActiveTab('api')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition duration-300 border cursor-pointer ${
                activeTab === 'api'
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
              }`}
            >
              <Code className="w-4 h-4 flex-shrink-0" />
              <span>{isPt ? 'Integração API' : 'API Integration'}</span>
            </button>

          </div>
          {/* Fade Overlay mask (Option A) */}
          <div className="md:hidden absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#080B14] via-[#080B14]/80 to-transparent pointer-events-none z-30 rounded-r-xl" />
        </div>

        {/* 2. SEO/GEO Hybrid Explanatory Panel (Positioned BEFORE Sandbox) */}
        {/* We keep all blocks in DOM for search engines (SEO/GEO) to crawl them, using conditional CSS for visual hiding */}
        <div className="bg-[#090D1A]/40 border border-brand-border/60 rounded-2xl p-6 glass">
          
          {/* OCR SEO Block */}
          <div className={activeTab === 'ocr' ? 'block animate-fade-in' : 'hidden'}>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] sm:text-xs font-mono text-brand-accent-soft uppercase font-bold tracking-wider sm:tracking-widest">
                {isPt ? 'Enquadramento Tecnológico · Visão Computacional' : 'Technology Context · Computer Vision'}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-brand-ink leading-tight">
                {isPt 
                  ? 'Como funciona a extração de dados e auditoria automática de faturas com Inteligência Artificial?' 
                  : 'How does automated invoice data extraction and AI auditing work?'}
              </h3>
              
              {/* Collapse/Expand details */}
              <button
                onClick={() => toggleText('ocr')}
                className="text-xs font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {expandedText.ocr ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {isPt ? 'Ocultar detalhes operacionais' : 'Hide technical details'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    {isPt ? 'Ver detalhes operacionais' : 'View technical details'}
                  </>
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedText.ocr ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-4 rounded-xl border border-brand-border/40">
                  {isPt ? (
                    <>
                      A extração de faturas da Nuelltech utiliza algoritmos avançados de visão computacional e processamento de linguagem natural para capturar e auditar automaticamente todos os campos de um documento (Fornecedor, NIF, Linhas de Artigos, Quantidades, Preços Unitários e IVA) em segundos. O motor cruza os preços faturados com os contratos de fornecimento acordados e as guias de transporte assinadas, isolando e resolvendo desvios de preços ou quantidades faturadas indevidamente. 
                      <span className="block mt-2 font-medium text-brand-ink">
                        O mesmo motor que lê uma fatura de fornecedor de restaurante lê também uma fatura de material clínico, uma renovação de fornecedor de ginásio, ou uma reposição de farmácia — o processo é idêntico, muda apenas o documento de entrada.
                      </span>
                    </>
                  ) : (
                    <>
                      Nuelltech&apos;s invoice extraction leverages advanced computer vision and natural language models to automatically capture and audit all fields from any document (Supplier, VAT, line items, quantities, and prices) in seconds. The engine cross-references billed rates against pre-agreed contract catalogs and signed delivery notes, isolating discrepancies on the fly.
                      <span className="block mt-2 font-medium text-brand-ink">
                        The same engine that reads a restaurant invoice can read medical supply invoices, gym membership renewals, or pharmacy restocking slips — the process is identical, only the input document changes.
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/30 mt-2">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-[#A0AEC0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? '99.7% Precisão na Extração' : '99.7% Extraction Accuracy'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Auditoria Automática contra Contrato & Guia' : 'Automated Slip & Catalog Matching'}</span>
                  </div>
                </div>
                <Link 
                  href={isPt ? "/pt/rcm" : "/en/rcm"}
                  className="text-xs font-mono text-brand-accent-soft hover:underline font-bold flex items-center gap-1.5 self-start sm:self-center"
                >
                  {isPt ? 'Esta é a mesma engenharia usada no RCM' : 'This is the same core engineering powering RCM'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* BI SEO Block */}
          <div className={activeTab === 'bi' ? 'block animate-fade-in' : 'hidden'}>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] sm:text-xs font-mono text-brand-accent-soft uppercase font-bold tracking-wider sm:tracking-widest">
                {isPt ? 'Enquadramento Tecnológico · Reconciliação Preditiva' : 'Technology Context · Predictive Reconciliation'}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-brand-ink leading-tight">
                {isPt 
                  ? 'Como prever desperdício e perdas de stock cruzando bases de dados de inventário e vendas?' 
                  : 'How to predict inventory waste by merging stock levels with sales run-rates?'}
              </h3>
              
              {/* Collapse/Expand details */}
              <button
                onClick={() => toggleText('bi')}
                className="text-xs font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {expandedText.bi ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {isPt ? 'Ocultar detalhes operacionais' : 'Hide technical details'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    {isPt ? 'Ver detalhes operacionais' : 'View technical details'}
                  </>
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedText.bi ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-4 rounded-xl border border-brand-border/40">
                  {isPt ? (
                    <>
                      A reconciliação preditiva cruza dados independentes do inventário físico (ERP) com o histórico de velocidade de escoamento de vendas (POS). A IA calcula a taxa de expiração de cada artigo e alerta o gestor sobre potenciais perdas de stock antes de expirar a validade, sugerindo campanhas promocionais dinâmicas de venda cruzada baseadas em tendências.
                      <span className="block mt-2 font-medium text-brand-ink">
                        O mesmo motor que cruza suplementos ou refeições num restaurante cruza também medicamentos de venda livre em farmácia, consumíveis em clínicas ou pacotes de adesão em ginásios.
                      </span>
                    </>
                  ) : (
                    <>
                      The predictive analytics hub merges physical inventory data (ERP) with sales run-rate history (POS). The AI calculates the expiration velocity of each item and warns the manager of potential losses before the shelf life expires, generating dynamic cross-selling promotion templates.
                      <span className="block mt-2 font-medium text-brand-ink">
                        The same engine that cross-references sports supplements can cross-reference over-the-counter medicine in pharmacies, clinic consumables, or gym membership packages.
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/30 mt-2">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-[#A0AEC0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Cálculo de Velocidade de Vendas & Run-rate' : 'Sales Run-Rate Modeling'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Geração de Promoções Dinâmicas Baseadas em Validades' : 'Automated Discount Prompts'}</span>
                  </div>
                </div>
                <Link 
                  href={isPt ? "/pt/engenharia-a-medida" : "/en/engenharia-a-medida"}
                  className="text-xs font-mono text-brand-accent-soft hover:underline font-bold flex items-center gap-1.5 self-start sm:self-center"
                >
                  {isPt ? 'Ver caso de estudo de engenharia à medida em farmácia' : 'View custom pharmacy engineering case study'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Excel SEO Block */}
          <div className={activeTab === 'excel' ? 'block animate-fade-in' : 'hidden'}>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] sm:text-xs font-mono text-brand-accent-soft uppercase font-bold tracking-wider sm:tracking-widest">
                {isPt ? 'Enquadramento Tecnológico · Modernização de Processos' : 'Technology Context · Process Modernization'}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-brand-ink leading-tight">
                {isPt 
                  ? 'Como converter planilhas manuais lentas em dashboards operacionais sincronizados?' 
                  : 'How to convert slow manual spreadsheets into synchronized operational dashboards?'}
              </h3>
              
              {/* Collapse/Expand details */}
              <button
                onClick={() => toggleText('excel')}
                className="text-xs font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {expandedText.excel ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {isPt ? 'Ocultar detalhes operacionais' : 'Hide technical details'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    {isPt ? 'Ver detalhes operacionais' : 'View technical details'}
                  </>
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedText.excel ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-4 rounded-xl border border-brand-border/40">
                  {isPt ? (
                    <>
                      A modernização converte o caos das planilhas de cálculo isoladas (como Excel) num dashboard operacional centralizado e colaborativo. A simulação demonstra a diferença de atualizar stocks de forma manual (conflitos de gravação multi-utilizador, erros de fórmula &apos;#VALOR!&apos; e falta de visibilidade de margens) contra a automação de dashboards (recalculo instantâneo de margens, alertas de stock mínimo e sugestão de novos PVPs).
                      <span className="block mt-2 font-medium text-brand-ink">
                        O mesmo motor de dashboard que consolida a faturação e stocks de restauração serve para clínicas de saúde, ginásios, escritórios de contabilidade ou retalhistas locais que queiram deixar folhas manuais.
                      </span>
                    </>
                  ) : (
                    <>
                      Modernization converts the chaos of isolated spreadsheets (like Excel) into a centralized, collaborative operational dashboard. The simulation demonstrates the contrast between manual stock updates (multi-user write conflicts, &apos;#VALUE!&apos; formula errors, and lack of margin visibility) and dashboard automation (instant margin recalculations, low stock alerts, and automated price suggests).
                      <span className="block mt-2 font-medium text-brand-ink">
                        The same dashboard engine that consolidates restaurant billing and inventory works for clinics, corporate gyms, accounting offices, or local retailers aiming to eliminate manual sheets.
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/30 mt-2">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-[#A0AEC0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Consolidação de Dados Multi-utilizador' : 'Multi-User Data Consolidation'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Alertas e Métricas Operacionais em Tempo Real' : 'Real-Time Operational Alerts'}</span>
                  </div>
                </div>
                <Link 
                  href={isPt ? "/pt/simulador-vendas" : "/en/simulador-vendas"}
                  className="text-xs font-mono text-brand-accent-soft hover:underline font-bold flex items-center gap-1.5 self-start sm:self-center"
                >
                  {isPt ? 'Experimente a nossa simulação de perdas de margem' : 'Try our interactive margin loss calculator'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* API SEO Block */}
          <div className={activeTab === 'api' ? 'block animate-fade-in' : 'hidden'}>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] sm:text-xs font-mono text-brand-accent-soft uppercase font-bold tracking-wider sm:tracking-widest">
                {isPt ? 'Enquadramento Tecnológico · Integração e APIs' : 'Technology Context · API & Integrations'}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-brand-ink leading-tight">
                {isPt 
                  ? 'Como sincronizar dados em tempo real entre softwares de faturação e portais digitais?' 
                  : 'How to synchronize real-time data between billing systems and digital portals?'}
              </h3>
              
              {/* Collapse/Expand details */}
              <button
                onClick={() => toggleText('api')}
                className="text-xs font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {expandedText.api ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {isPt ? 'Ocultar detalhes operacionais' : 'Hide technical details'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    {isPt ? 'Ver detalhes operacionais' : 'View technical details'}
                  </>
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedText.api ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <p className="text-xs sm:text-sm text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-4 rounded-xl border border-brand-border/40">
                  {isPt ? (
                    <>
                      A consola de APIs e Webhooks simula fluxos de sincronização de dados em tempo real. Permite testar integrações de inventário (API REST do ERP), pagamentos online (Stripe), consultas em lote (GraphQL) e orquestração de Agentes Inteligentes (APIs Model Context Protocol - MCP e LLMs Gemini).
                      <span className="block mt-2 font-medium text-brand-ink">
                        A mesma arquitetura de conexões que liga um estado de faturação ao Slack ou à base de dados de um restaurante liga sistemas de hospitais, ginásios corporativos ou retalhistas globais de comércio eletrónico.
                      </span>
                    </>
                  ) : (
                    <>
                      The API and Webhook console simulates real-time JSON data flows. It allows testing inventory integrations (ERP REST API), payment webhooks (Stripe), batch queries (GraphQL), and Agentic AI tool routing (Model Context Protocol - MCP and Gemini LLM APIs).
                      <span className="block mt-2 font-medium text-brand-ink">
                        The same API connectivity architecture that links invoice status to Slack or restaurant databases links hospital ERP systems, corporate gyms, or global e-commerce retailers.
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-brand-border/30 mt-2">
                <div className="flex flex-col gap-1.5 text-xs font-mono text-[#A0AEC0]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Integração de APIs REST, GraphQL e Webhooks' : 'REST, GraphQL, & Webhooks Sync'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                    <span>{isPt ? 'Orquestração de Agentes por Protocolo MCP' : 'MCP Protocol AI Orchestration'}</span>
                  </div>
                </div>
                <Link 
                  href={isPt ? "/pt/laboratorio" : "/en/laboratorio"}
                  className="text-xs font-mono text-brand-accent-soft hover:underline font-bold flex items-center gap-1.5 self-start sm:self-center"
                >
                  {isPt ? 'Esta é a mesma arquitetura que alimenta o laboratório' : 'This is the same connectivity architecture that powers the laboratory'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Interactive Workspace Pane (Positioned AFTER Explanatory Panel) */}
        <div className="w-full relative transition-all duration-300">
          
          {/* Tab 1: OCR Sandbox */}
          <div className={activeTab === 'ocr' ? 'block' : 'hidden'}>
            <OcrSandbox pt={isPt} />
          </div>

          {/* Tab 2: BI Reconciliation Sandbox */}
          <div className={activeTab === 'bi' ? 'block' : 'hidden'}>
            <BiReconciliation pt={isPt} />
          </div>

          {/* Tab 3: Excel Modernization Slider */}
          <div className={activeTab === 'excel' ? 'block' : 'hidden'}>
            <BeforeAfterSlider pt={isPt} />
          </div>

          {/* Tab 4: API Console Sandbox */}
          <div className={activeTab === 'api' ? 'block' : 'hidden'}>
            <ApiSandbox pt={isPt} />
          </div>

        </div>

      </div>
    </div>
  );
}
