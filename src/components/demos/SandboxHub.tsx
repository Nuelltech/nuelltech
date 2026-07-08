'use client';

import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, ArrowRight, FileText, Code, CheckCircle, AlertTriangle, FileSpreadsheet, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import OcrModal from './OcrModal';
import BiModal from './BiModal';
import ExcelModal from './ExcelModal';
import ApiModal from './ApiModal';

interface SandboxHubProps {
  dict?: unknown;
  isPt: boolean;
}

export default function SandboxHub({ isPt }: SandboxHubProps) {
  const [activeModal, setActiveModal] = useState<'ocr' | 'bi' | 'excel' | 'api' | null>(null);
  
  // Collapsible text states for SEO/GEO hybrid model
  const [expandedText, setExpandedText] = useState<Record<'ocr' | 'bi' | 'excel' | 'api', boolean>>({
    ocr: false,
    bi: false,
    excel: false,
    api: false,
  });

  const toggleText = (card: 'ocr' | 'bi' | 'excel' | 'api') => {
    setExpandedText(prev => ({ ...prev, [card]: !prev[card] }));
  };

  useEffect(() => {
    const handleOpenSandbox = (e: Event) => {
      const customEvent = e as CustomEvent<{ sandbox: 'ocr' | 'bi' | 'excel' | 'api' }>;
      if (customEvent.detail && customEvent.detail.sandbox) {
        setActiveModal(customEvent.detail.sandbox);
      }
    };
    window.addEventListener('nuell-open-sandbox', handleOpenSandbox);
    return () => {
      window.removeEventListener('nuell-open-sandbox', handleOpenSandbox);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
        
        {/* Card 1: OCR Intelligent Processing */}
        <div id="ocr" className="bg-brand-card/60 border border-brand-border rounded-2xl p-6 hover:border-brand-accent/50 transition duration-300 glass flex flex-col justify-between relative group shadow-lg">
          <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
            {isPt ? 'LEITURA REAL' : 'LIVE DEMO'}
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-4 text-brand-accent-soft">
              <FileText className="w-5 h-5" />
            </div>
            
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
              {isPt ? 'Varredura Óptica & OCR' : 'Optical Scanning & OCR'}
            </span>
            
            {/* Question-based title for SEO/GEO */}
            <h3 className="text-sm font-bold font-display text-brand-ink mb-3 group-hover:text-brand-accent-soft transition duration-200">
              {isPt 
                ? 'Como funciona a extração de dados e auditoria automática de faturas com Inteligência Artificial?' 
                : 'How does automated invoice data extraction and AI auditing work?'}
            </h3>

            {/* Premium Mockup Visual representation */}
            <div className="w-full bg-[#05070C] border border-brand-border/40 rounded-xl p-3.5 mb-4 flex items-center justify-between text-[10px] font-mono select-none overflow-hidden h-24 relative pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <div className="flex flex-col gap-1 w-[45%] opacity-75">
                <span className="text-[7px] text-brand-ink-dim border-b border-brand-border/30 pb-0.5 mb-1 font-bold">FATURA_COMPRA.pdf</span>
                <span className="text-brand-ink truncate">Fornecedor: Peixaria Mar</span>
                <span className="text-brand-ink truncate">Robalo Mar: 12.50€/Kg</span>
                <span className="text-brand-ink truncate">Qtd: 20 Kg | Total: 250.00€</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent-soft animate-pulse">
                  &rarr;
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[45%] bg-brand-card/50 border border-brand-accent/20 rounded p-1.5 shadow-inner">
                <span className="text-[7px] text-brand-accent-soft uppercase font-bold">JSON Extraído</span>
                <span className="text-[8px] text-brand-ok">"vendor": "Peixaria Mar"</span>
                <span className="text-[8px] text-brand-ok">"price": 12.50</span>
                <span className="text-[8px] text-brand-risk">"deviation": "+2.10€"</span>
              </div>
            </div>
            
            {/* Accordion link to expand/collapse SEO paragraph */}
            <button
              onClick={() => toggleText('ocr')}
              className="text-[10px] font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1 mb-4"
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
            
            {/* Detailed Static explanatory paragraph for crawlers (SEO/GEO) */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedText.ocr ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <p className="text-[11px] text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-3 rounded-lg border border-brand-border/40">
                {isPt ? (
                  <>
                    A extração de faturas da Nuelltech utiliza algoritmos avançados de visão computacional e processamento de linguagem natural para capturar e auditar automaticamente todos os campos de um documento (Fornecedor, NIF, Linhas de Artigos, Quantidades, Preços Unitários e IVA) em segundos. O motor cruza os preços faturados com os contratos de fornecimento acordados e as guias de transporte assinadas, isolando e resolvendo desvios de preços ou quantidades faturadas indevidamente. 
                    <span className="block mt-2 font-medium text-brand-ink">
                      O mesmo motor que lê uma fatura de fornecedor de restaurante lê também uma fatura de material clínico, uma renovação de fornecedor de ginásio, ou uma reposição de farmácia — o processo é idêntico, muda só o documento.
                    </span>
                  </>
                ) : (
                  <>
                    Nuelltech&apos;s invoice extraction leverages advanced computer vision and natural language models to automatically capture and audit all fields from any document (Supplier, VAT, line items, quantities, and prices) in seconds. The engine cross-references billed rates against pre-agreed contract catalogs and signed delivery notes, isolating discrepancies on the fly.
                    <span className="block mt-2 font-medium text-brand-ink">
                      The same engine that reads a restaurant invoice can read medical supply invoices, gym membership renewals, or pharmacy restocking slips — the process is identical, only the document changes.
                    </span>
                  </>
                )}
              </p>
            </div>
            
            {/* Product anchor links */}
            <div className="mb-6">
              <Link 
                href={isPt ? "/pt/rcm" : "/en/rcm"}
                className="text-[10px] font-mono text-brand-accent-soft hover:underline font-bold"
              >
                &rarr; {isPt ? 'Esta é a mesma engenharia usada no RCM' : 'This is the same core engineering powering RCM'}
              </Link>
            </div>
            
            {/* Features check list */}
            <div className="flex flex-col gap-2 font-mono text-[9px] text-[#A0AEC0] mb-6 border-t border-brand-border/30 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? '99.7% Precisão na Extração' : '99.7% Extraction Accuracy'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Auditoria Automática contra Contrato & Guia' : 'Automated Slip & Catalog Matching'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('ocr')}
            className="w-full bg-[#090D1A] border border-brand-border hover:bg-brand-border/40 text-brand-ink font-bold py-3 rounded-xl text-xs transition duration-150 uppercase tracking-wide flex justify-center items-center gap-1.5 mt-auto pointer-events-auto"
          >
            {isPt ? 'Abrir Sandbox OCR' : 'Launch OCR Sandbox'}
            <ArrowRight className="w-3.5 h-3.5 text-brand-accent-soft" />
          </button>
        </div>

        {/* Card 2: Predictive Analytics Hub */}
        <div id="bi" className="bg-brand-card/60 border border-brand-border rounded-2xl p-6 hover:border-brand-accent/50 transition duration-300 glass flex flex-col justify-between relative group shadow-lg">
          <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
            {isPt ? 'INVENTÁRIO' : 'BETA'}
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-4 text-brand-accent-soft">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
              {isPt ? 'Reconciliador de Dados Preditivos' : 'Predictive Data Sync'}
            </span>

            {/* Question-based title for SEO/GEO */}
            <h3 className="text-sm font-bold font-display text-brand-ink mb-3 group-hover:text-brand-accent-soft transition duration-200">
              {isPt 
                ? 'Como prever desperdício e perdas de stock cruzando bases de dados de inventário e vendas?' 
                : 'How to predict inventory waste by merging stock levels with sales run-rates?'}
            </h3>

            {/* Premium Mockup Visual representation */}
            <div className="w-full bg-[#05070C] border border-brand-border/40 rounded-xl p-3.5 mb-4 flex flex-col justify-between text-[10px] font-mono select-none h-24 relative overflow-hidden pointer-events-none">
              <div className="flex justify-between items-center text-[7px] text-brand-ink-dim">
                <span>Escoamento Preditivo (POS vs ERP)</span>
                <span className="text-brand-warn font-bold animate-pulse">Rotura em 4 dias</span>
              </div>
              <div className="flex items-end justify-between h-10 pt-2 gap-1.5 border-b border-brand-border/30">
                <div className="bg-brand-ok/70 h-[80%] w-full rounded-t-sm" />
                <div className="bg-brand-ok/70 h-[65%] w-full rounded-t-sm" />
                <div className="bg-brand-warn/70 h-[45%] w-full rounded-t-sm animate-pulse" />
                <div className="bg-brand-risk/70 h-[25%] w-full rounded-t-sm animate-pulse" />
                <div className="bg-brand-risk/30 h-[10%] w-full rounded-t-sm" />
              </div>
              <div className="flex justify-between text-[7px] text-brand-accent-soft mt-1">
                <span>Hoje</span>
                <span>Dia +3</span>
                <span>Dia +5 (Rotura)</span>
              </div>
            </div>

            {/* Accordion link to expand/collapse SEO paragraph */}
            <button
              onClick={() => toggleText('bi')}
              className="text-[10px] font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1 mb-4"
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

            {/* Detailed Static explanatory paragraph for crawlers */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedText.bi ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <p className="text-[11px] text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-3 rounded-lg border border-brand-border/40">
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

            {/* Product anchor links */}
            <div className="mb-6">
              <Link 
                href={isPt ? "/pt/engenharia-a-medida" : "/en/engenharia-a-medida"}
                className="text-[10px] font-mono text-brand-accent-soft hover:underline font-bold"
              >
                &rarr; {isPt ? 'Este é o motor construído à medida para um caso real em farmácia — aplicável ao seu negócio' : 'This is the custom engine built for a live pharmacy use case — fully adaptable to your business'}
              </Link>
            </div>

            {/* Features check list */}
            <div className="flex flex-col gap-2 font-mono text-[9px] text-[#A0AEC0] mb-6 border-t border-brand-border/30 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Cálculo de Velocidade de Vendas & Run-rate' : 'Sales Run-Rate Modeling'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Geração de Promoções Dinâmicas Baseadas em Validades' : 'Automated Discount Prompts'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('bi')}
            className="w-full bg-[#090D1A] border border-brand-border hover:bg-brand-border/40 text-brand-ink font-bold py-3 rounded-xl text-xs transition duration-150 uppercase tracking-wide flex justify-center items-center gap-1.5 mt-auto pointer-events-auto"
          >
            {isPt ? 'Abrir Sandbox BI' : 'Enter Hub'}
            <ArrowRight className="w-3.5 h-3.5 text-brand-accent-soft" />
          </button>
        </div>

        {/* Card 3: Legacy Modernization */}
        <div id="excel" className="bg-brand-card/60 border border-brand-border rounded-2xl p-6 hover:border-brand-accent/50 transition duration-300 glass flex flex-col justify-between relative group shadow-lg">
          <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
            {isPt ? 'EFICIÊNCIA' : 'EXCEL'}
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-4 text-brand-accent-soft">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
              {isPt ? 'Planilha vs. Painel' : 'Spreadsheet vs. Dashboard'}
            </span>

            {/* Question-based title for SEO/GEO */}
            <h3 className="text-sm font-bold font-display text-brand-ink mb-3 group-hover:text-brand-accent-soft transition duration-200">
              {isPt 
                ? 'Como converter planilhas manuais lentas em dashboards operacionais sincronizados?' 
                : 'How to convert slow manual spreadsheets into synchronized operational dashboards?'}
            </h3>

            {/* Premium Mockup Visual representation */}
            <div className="w-full bg-[#05070C] border border-brand-border/40 rounded-xl p-3.5 mb-4 flex items-center justify-between text-[9px] font-mono select-none h-24 relative overflow-hidden pointer-events-none">
              <div className="flex flex-col gap-1 w-[45%] bg-red-950/10 border border-brand-risk/20 rounded p-1.5 opacity-80">
                <span className="text-[6.5px] text-brand-risk uppercase font-bold">Excel Manual</span>
                <div className="grid grid-cols-2 gap-0.5 text-[6.5px] text-brand-ink-dim">
                  <span>Robalo:</span><span className="text-brand-risk font-semibold">#VALOR!</span>
                  <span>Stock:</span><span>Erro_Soma</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent-soft">
                  &rarr;
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[45%] bg-brand-card/50 border border-brand-ok/20 rounded p-1.5 shadow-inner">
                <span className="text-[6.5px] text-brand-ok uppercase font-bold">Painel Nuell</span>
                <div className="flex flex-col gap-0.5 text-[6.5px]">
                  <span className="text-brand-ink">Robalo: 12.50€</span>
                  <span className="text-brand-ok font-bold">Reconciliado</span>
                </div>
              </div>
            </div>

            {/* Accordion link to expand/collapse SEO paragraph */}
            <button
              onClick={() => toggleText('excel')}
              className="text-[10px] font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1 mb-4"
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

            {/* Detailed Static explanatory paragraph for crawlers */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedText.excel ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <p className="text-[11px] text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-3 rounded-lg border border-brand-border/40">
                {isPt ? (
                  <>
                    A modernização converte o caos das planilhas de cálculo isoladas (como Excel) num dashboard operacional centralizado e colaborativo. A simulação demonstra a diferença de atualizar stocks de forma manual (conflitos de gravação multi-utilizador, erros de fórmula &apos;#VALOR!&apos; e falta de visibilidade de margens) contra a automação de dashboards (recalculo instantâneo de margens, alertas de stock mínimo e sugestão de novos PVPs).
                    <span className="block mt-2 font-medium text-brand-ink">
                      O mesmo motor de dashboard que consolida a faturação e stocks de restauração serve para clínicas de saúde, ginásios, escritórios de contabilidade ou retalhistas locais.
                    </span>
                  </>
                ) : (
                  <>
                    Modernization converts the chaos of isolated spreadsheets (like Excel) into a collaborative, centralized dashboard. The simulation shows the difference between manual spreadsheet updates (multi-user locks, broken &apos;#VALUE!&apos; formulas, lack of margin visibility) against automated dashboards (real-time margin recalculation, critical reorder alerts, and suggested pricing).
                    <span className="block mt-2 font-medium text-brand-ink">
                      The same dashboard engine that consolidates restaurant stock and sales serves healthcare clinics, gyms, accounting firms, or local retailers.
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Product anchor links */}
            <div className="mb-6">
              <Link 
                href={isPt ? "/pt/sobre" : "/en/sobre"}
                className="text-[10px] font-mono text-brand-accent-soft hover:underline font-bold"
              >
                &rarr; {isPt ? 'Esta é a mesma disciplina de engenharia que moderniza processos legacy' : 'This is the same engineering discipline that modernizes legacy workflows'}
              </Link>
            </div>

            {/* Features check list */}
            <div className="flex flex-col gap-2 font-mono text-[9px] text-[#A0AEC0] mb-6 border-t border-brand-border/30 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Fim dos Conflitos de Ficheiros & Erros de Digitação' : 'Eradicates Manual Typing Leaks'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Recalculo de PVPs Automático contra Inflação' : 'Real-Time Margin Safeguards'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('excel')}
            className="w-full bg-[#090D1A] border border-brand-border hover:bg-brand-border/40 text-brand-ink font-bold py-3 rounded-xl text-xs transition duration-150 uppercase tracking-wide flex justify-center items-center gap-1.5 mt-auto pointer-events-auto"
          >
            {isPt ? 'Comparar Planilha' : 'Modernize Now'}
            <ArrowRight className="w-3.5 h-3.5 text-brand-accent-soft" />
          </button>
        </div>

        {/* Card 4: API Integration Hub */}
        <div id="api" className="bg-brand-card/60 border border-brand-border rounded-2xl p-6 hover:border-brand-accent/50 transition duration-300 glass flex flex-col justify-between relative group shadow-lg">
          <div className="absolute top-4 right-4 bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-0.5 rounded text-[8px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
            {isPt ? 'INTEGRAÇÕES' : 'API SANDBOX'}
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-4 text-brand-accent-soft">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold block mb-1">
              {isPt ? 'REST APIs & Webhooks' : 'REST APIs & Webhooks'}
            </span>

            {/* Question-based title for SEO/GEO */}
            <h3 className="text-sm font-bold font-display text-brand-ink mb-3 group-hover:text-brand-accent-soft transition duration-200">
              {isPt 
                ? 'Como interligar sistemas ERP, bases de dados e serviços de IA usando APIs e Webhooks?' 
                : 'How to connect ERP software, databases, and AI models using APIs & Webhooks?'}
            </h3>

            {/* Premium Mockup Visual representation */}
            <div className="w-full bg-[#05070C] border border-brand-border/40 rounded-xl p-3.5 mb-4 flex items-center justify-between text-[8px] font-mono select-none h-24 relative overflow-hidden pointer-events-none">
              <div className="flex items-center justify-around w-full relative z-10">
                <div className="flex flex-col items-center p-1 border border-brand-border/60 rounded bg-brand-card">
                  <span>Sage API</span>
                  <span className="text-[6px] text-brand-ok">Active</span>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-brand-accent/40 relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent absolute -top-1 left-1/2 -translate-x-1/2 animate-ping" />
                </div>
                <div className="flex flex-col items-center p-1 border border-brand-accent/30 rounded bg-brand-card text-brand-accent-soft">
                  <span>Nuell AI</span>
                  <span className="text-[6px] text-brand-ok">MCP</span>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-brand-accent/40 relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent absolute -top-1 left-1/2 -translate-x-1/2 animate-ping" />
                </div>
                <div className="flex flex-col items-center p-1 border border-brand-border/60 rounded bg-brand-card">
                  <span>Stripe</span>
                  <span className="text-[6px] text-brand-ok">Webhook</span>
                </div>
              </div>
            </div>

            {/* Accordion link to expand/collapse SEO paragraph */}
            <button
              onClick={() => toggleText('api')}
              className="text-[10px] font-mono text-brand-accent-soft hover:text-brand-accent flex items-center gap-1 mb-4"
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

            {/* Detailed Static explanatory paragraph for crawlers */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedText.api ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <p className="text-[11px] text-brand-ink-dim leading-relaxed bg-[#05070C]/50 p-3 rounded-lg border border-brand-border/40">
                {isPt ? (
                  <>
                    A consola de APIs e Webhooks demonstra o fluxo e intercâmbio de dados estruturados JSON em tempo real. Permite simular a receção de dados de stocks (ERP REST API), processamento de pagamentos automáticos (Stripe Webhooks), consultas estruturadas de catálogos (GraphQL) e orquestração de servidores de IA para agentes de decisão (Model Context Protocol - MCP e Gemini LLM API).
                    <span className="block mt-2 font-medium text-brand-ink">
                      A mesma arquitetura de conectividade API que liga faturas a canais de Slack ou bases de dados de restauração liga também sistemas ERP hospitalares, ginásios corporativos ou retalhistas de e-commerce global.
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

            {/* Product anchor links */}
            <div className="mb-6">
              <Link 
                href={isPt ? "/pt/laboratorio" : "/en/laboratorio"}
                className="text-[10px] font-mono text-brand-accent-soft hover:underline font-bold"
              >
                &rarr; {isPt ? 'Esta é a mesma arquitetura de conectividade que alimenta o laboratório' : 'This is the same connectivity architecture that powers the laboratory'}
              </Link>
            </div>

            {/* Features check list */}
            <div className="flex flex-col gap-2 font-mono text-[9px] text-[#A0AEC0] mb-6 border-t border-brand-border/30 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Integração de APIs REST, GraphQL e Webhooks' : 'REST, GraphQL, & Webhooks Sync'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft" />
                <span>{isPt ? 'Orquestração de Agentes por Protocolo MCP' : 'MCP Protocol AI Orchestration'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('api')}
            className="w-full bg-[#090D1A] border border-brand-border hover:bg-brand-border/40 text-brand-ink font-bold py-3 rounded-xl text-xs transition duration-150 uppercase tracking-wide flex justify-center items-center gap-1.5 mt-auto pointer-events-auto"
          >
            {isPt ? 'Abrir Consola de API' : 'Launch API Sandbox'}
            <ArrowRight className="w-3.5 h-3.5 text-brand-accent-soft" />
          </button>
        </div>

      </div>

      {/* Modals rendering */}
      <OcrModal isOpen={activeModal === 'ocr'} onClose={() => setActiveModal(null)} pt={isPt} />
      <BiModal isOpen={activeModal === 'bi'} onClose={() => setActiveModal(null)} pt={isPt} />
      <ExcelModal isOpen={activeModal === 'excel'} onClose={() => setActiveModal(null)} pt={isPt} />
      <ApiModal isOpen={activeModal === 'api'} onClose={() => setActiveModal(null)} pt={isPt} />
    </>
  );
}
