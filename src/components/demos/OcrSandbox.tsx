'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Database, 
  RefreshCw, 
  Play, 
  X, 
  Check, 
  Smartphone, 
  Laptop, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Mail,
  Camera,
  CheckCircle
} from 'lucide-react';

interface InvoiceItem {
  desc: string;
  qty: number;
  price: number;
  total: number;
}

interface Scenario {
  id: string;
  name: { pt: string; en: string };
  invoiceName: string;
  invoiceNum: string;
  invoiceDate: string;
  items: InvoiceItem[];
  total: number;
  iban: string;
  dueDays: number;
}

const scenarios: Scenario[] = [
  {
    id: 'margin',
    name: {
      pt: 'Alteração de Preços e Margens',
      en: 'Price & Margin Deviations'
    },
    invoiceName: 'MacroFrutas Lda',
    invoiceNum: 'FT/2026/942',
    invoiceDate: '03-07-2026',
    items: [
      { desc: 'Maçã de Alcobaça Especial (KG)', qty: 10, price: 15.50, total: 155.00 },
      { desc: 'Laranja Doce do Algarve (KG)', qty: 25, price: 2.10, total: 52.50 },
      { desc: 'Banana Importada Premium (KG)', qty: 15, price: 1.80, total: 27.00 }
    ],
    total: 234.50,
    iban: 'PT50 0033 0001 0293 8475 6201 0',
    dueDays: 30
  },
  {
    id: 'fraud',
    name: {
      pt: 'Auditoria com Encomendas e Receção',
      en: '3-Way Audit Matching (Invoice vs Delivery)'
    },
    invoiceName: 'Talhos Alentejanos Lda',
    invoiceNum: 'FT/2026/1842',
    invoiceDate: '02-07-2026',
    items: [
      { desc: 'Lombo de Porco Nacional (KG)', qty: 50, price: 7.80, total: 390.00 },
      { desc: 'Peito de Frango do Campo (KG)', qty: 30, price: 5.40, total: 162.00 }
    ],
    total: 552.00,
    iban: 'PT50 0018 0003 9482 1049 5820 1',
    dueDays: 45
  },
  {
    id: 'payment',
    name: {
      pt: 'Preparação para Pagamentos',
      en: 'Payment Scheduling & SEPA'
    },
    invoiceName: 'Bebidas do Centro Distribuição',
    invoiceNum: 'FT/2026/3041',
    invoiceDate: '01-07-2026',
    items: [
      { desc: 'Água das Pedras 25cl x24', qty: 10, price: 18.20, total: 182.00 },
      { desc: 'Cerveja Nacional Barril 50L', qty: 4, price: 110.00, total: 440.00 },
      { desc: 'Refrigerante Cola Lata x24', qty: 6, price: 14.50, total: 87.00 }
    ],
    total: 709.00,
    iban: 'PT50 0035 0002 9481 0582 9104 2',
    dueDays: 14
  }
];

export default function OcrSandbox({ pt = true }: { pt?: boolean }) {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [desktopTab, setDesktopTab] = useState<'terminal' | 'auditoria'>('terminal');
  const [mobileTab, setMobileTab] = useState<'camera' | 'alerts' | 'results'>('camera');
  
  // Simulation actions state
  const [marginFixed, setMarginFixed] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [sepaDownloaded, setSepaDownloaded] = useState(false);

  // Tinder Swiper States
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState<Record<number, 'left' | 'right'>>({});
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  // Mobile camera flash animation
  const [cameraFlash, setCameraFlash] = useState(false);

  // Toasts
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const startScanSimulation = () => {
    setScanStatus('scanning');
    setProgress(0);
    setLogs([
      pt 
        ? `[INICIANDO] Conexão segura estabelecida com motor OCR.` 
        : `[STARTING] Secure connection to OCR engine established.`,
      pt
        ? `[PROCESSANDO] Carregando documento em memória buffer...`
        : `[PROCESSING] Loading document into buffer memory...`
    ]);
    setDesktopTab('terminal');
  };

  const triggerMobileCamera = () => {
    setCameraFlash(true);
    setTimeout(() => setCameraFlash(false), 250);
    
    setScanStatus('scanning');
    setProgress(0);
    setLogs([
      pt 
        ? `[FOTO CAPTURADA] Processando imagem móvel...` 
        : `[PHOTO CAPTURED] Processing mobile image...`
    ]);
  };

  useEffect(() => {
    if (scanStatus !== 'scanning') return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 10;
        
        if (next === 20) {
          setLogs(l => [...l, pt ? `[VISÃO] Detetado cabeçalho e emitente: "${activeScenario.invoiceName}"` : `[VISION] Detected header and issuer: "${activeScenario.invoiceName}"`]);
        } else if (next === 40) {
          setLogs(l => [...l, pt ? `[OCR] NIF: 509284102 | Fatura: ${activeScenario.invoiceNum}` : `[OCR] VAT: 509284102 | Invoice: ${activeScenario.invoiceNum}`]);
        } else if (next === 60) {
          setLogs(l => [...l, pt ? `[OCR] Extraindo artigos da tabela...` : `[OCR] Extracting line items...`]);
          activeScenario.items.forEach(item => {
            setLogs(l => [...l, `  → ${item.desc} | Qtd: ${item.qty} | Preço: ${item.price.toFixed(2)}€`]);
          });
        } else if (next === 80) {
          setLogs(l => [...l, pt ? `[INTEGRAÇÃO] Reconciliando com histórico da base de dados...` : `[INTEGRATION] Cross-referencing database logs...`]);
          if (activeScenario.id === 'margin') {
            setLogs(l => [...l, pt ? `[ALERTA] Desvio de preço de custo detetado no artigo "Maçã de Alcobaça"!` : `[WARNING] Cost deviation detected in item "Maçã de Alcobaça"!`]);
          } else if (activeScenario.id === 'fraud') {
            setLogs(l => [...l, pt ? `[ALERTA] Cruzando com Guia de Receção do Winphar... FALTAM 10 KG!` : `[WARNING] Cross-referencing with Winphar Delivery Slip... 10 KG MISSING!`]);
          } else {
            setLogs(l => [...l, pt ? `[SISTEMA] IBAN verificado com sucesso. Sem alertas.` : `[SYSTEM] IBAN verified successfully. No warnings.`]);
          }
        }

        if (next >= 100) {
          clearInterval(interval);
          setScanStatus('done');
          setDesktopTab('auditoria');
          if (mobileTab === 'camera') {
            setMobileTab('alerts');
          }
          triggerToast(pt ? "Leitura concluída!" : "Scan completed!");
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [scanStatus, activeScenario, pt, mobileTab]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Reset states when changing scenarios
  const changeScenario = (scen: Scenario) => {
    setActiveScenario(scen);
    setScanStatus('idle');
    setProgress(0);
    setLogs([]);
    setMarginFixed(false);
    setShowDisputeModal(false);
    setSepaDownloaded(false);
    setActiveCardIndex(0);
    setSwipedCards({});
    setMobileTab('camera');
  };

  const handleMobileSwipe = (dir: 'left' | 'right') => {
    if (activeCardIndex >= activeScenario.items.length) return;
    setSwipedCards(prev => ({ ...prev, [activeCardIndex]: dir }));
    
    const item = activeScenario.items[activeCardIndex];
    const msg = dir === 'right'
      ? (pt ? `Aprovado: ${item.desc}` : `Approved: ${item.desc}`)
      : (pt ? `Contestado: ${item.desc}` : `Disputed: ${item.desc}`);
    
    triggerToast(msg);
    setTimeout(() => {
      setActiveCardIndex(prev => prev + 1);
      if (activeCardIndex + 1 >= activeScenario.items.length) {
        setMobileTab('results');
      }
    }, 300);
  };

  // Compliance calculations for mobile
  const getComplianceScore = () => {
    if (activeScenario.id === 'margin') return 78;
    if (activeScenario.id === 'fraud') return 60;
    return 100;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden relative font-sans text-xs">
      
      {/* =============================================================== */}
      {/* DESKTOP LAYOUT (visible on medium/large screens)               */}
      {/* =============================================================== */}
      <div className="hidden md:flex flex-col w-full">
        {/* Desktop Header */}
        <header className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#0284c7] shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Nuelltech" className="h-7 w-auto object-contain" />
            <div className="w-[1px] bg-slate-700 h-5" />
            <span className="font-display font-semibold text-base text-sky-400">Auditor & OCR</span>
          </div>
          <div className="bg-sky-500/10 border border-sky-400/30 text-sky-300 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-sky-400 before:rounded-full before:animate-ping">
            {pt ? 'Demonstração Interativa' : 'Interactive Demo'}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] flex-1 min-h-[500px]">
          
          {/* Sidebar Scenarios */}
          <div className="bg-slate-100 p-5 border-r border-slate-200 flex flex-col gap-2.5 text-left">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-bold">
              {pt ? 'Cenários Disponíveis' : 'Available Scenarios'}
            </span>
            {scenarios.map(scen => (
              <button
                key={scen.id}
                onClick={() => changeScenario(scen)}
                className={`text-left p-3.5 rounded-xl border text-xs font-semibold transition duration-150 cursor-pointer ${
                  activeScenario.id === scen.id
                    ? 'bg-white border-[#0284c7] text-[#0284c7] shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {pt ? scen.name.pt : scen.name.en}
              </button>
            ))}

            <button
              onClick={startScanSimulation}
              disabled={scanStatus === 'scanning'}
              className="mt-8 flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 px-5 rounded-full text-xs transition duration-200 shadow-md shadow-sky-400/20 uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {scanStatus === 'scanning' ? (pt ? 'A Ler...' : 'Reading...') : (pt ? 'Iniciar Leitura OCR' : 'Start OCR Scan')}
            </button>
          </div>

          {/* Workspace */}
          <div className="p-6 bg-slate-200 flex flex-col lg:flex-row gap-6">
            
            {/* Left Pane: Simulated Invoice Document */}
            <div className="flex-1 bg-white border border-slate-350 rounded-xl p-5 shadow-md flex flex-col justify-between relative min-h-[360px] max-w-[420px] mx-auto lg:mx-0 select-none overflow-hidden">
              
              {/* Laser scan animation overlay */}
              {scanStatus === 'scanning' && (
                <>
                  <div className="w-full h-0.5 bg-sky-500 shadow-[0_0_12px_rgba(2,132,199,0.9)] animate-scanner-line top-0 left-0 absolute z-20" />
                  <div className="absolute inset-0 bg-sky-500/5 z-10 pointer-events-none" />
                </>
              )}

              {/* Bounding box zone indicators */}
              {scanStatus === 'done' && (
                <>
                  {/* Supplier bounding box */}
                  <div className="absolute top-4 left-4 border border-dashed border-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded text-[8px] font-mono text-emerald-700 font-bold z-20">
                    Supplier: OK (99.8%)
                  </div>
                  {/* Date bounding box */}
                  <div className="absolute top-14 right-4 border border-dashed border-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded text-[8px] font-mono text-emerald-700 font-bold z-20">
                    Date: OK (99.4%)
                  </div>
                  {/* Scenario specific target alerts */}
                  {activeScenario.id === 'margin' && (
                    <div className="absolute top-[162px] left-4 right-4 border-2 border-dashed border-red-500 bg-red-500/5 h-[28px] rounded z-20 pointer-events-none flex items-center justify-end pr-2">
                      <span className="bg-red-500 text-white font-mono font-bold text-[7px] px-1 rounded">DEVIATION +55%</span>
                    </div>
                  )}
                  {activeScenario.id === 'fraud' && (
                    <div className="absolute top-[162px] left-4 right-4 border-2 border-dashed border-red-500 bg-red-500/5 h-[28px] rounded z-20 pointer-events-none flex items-center justify-end pr-2">
                      <span className="bg-red-500 text-white font-mono font-bold text-[7px] px-1 rounded">DISCREPANCY -10KG</span>
                    </div>
                  )}
                </>
              )}

              <div className="text-left">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <h3 className="font-display font-black text-slate-800 text-sm tracking-tight">{activeScenario.invoiceName}</h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">NIF: 509 284 102 · Lisboa</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">{pt ? 'Fatura' : 'Invoice'}</span>
                    <span className="font-bold text-slate-800 font-mono text-xs">{activeScenario.invoiceNum}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mb-5 font-mono">
                  <span>{pt ? 'Data Emissão:' : 'Date Issued:'} {activeScenario.invoiceDate}</span>
                  <span>{pt ? 'Vencimento: 30 dias' : 'Terms: Net 30'}</span>
                </div>

                <table className="w-full border-collapse text-[10px] text-slate-600 mb-6 text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2">{pt ? 'Descrição' : 'Item Description'}</th>
                      <th className="p-2 text-center">{pt ? 'Qtd' : 'Qty'}</th>
                      <th className="p-2 text-right">{pt ? 'Preço' : 'Price'}</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeScenario.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-medium">{item.desc}</td>
                        <td className="p-2 text-center font-mono">{item.qty}</td>
                        <td className="p-2 text-right font-mono">{item.price.toFixed(2)} €</td>
                        <td className="p-2 text-right font-mono font-semibold">{item.total.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-left">
                <div>
                  <span className="text-[8px] uppercase font-bold text-slate-400 font-mono block">{pt ? 'IBAN Fornecedor' : 'Supplier IBAN'}</span>
                  <span className="font-mono text-[9px] text-slate-500">{activeScenario.iban.substring(0, 18)}...</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{pt ? 'Total Cobrado' : 'Total Due'}</span>
                  <span className="text-base font-extrabold text-[#0284c7] font-mono">{activeScenario.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Right Pane: Auditing Results Panel */}
            <div className="flex-1 bg-white border border-slate-250 rounded-xl p-5 shadow-md flex flex-col justify-between min-h-[360px] text-left">
              <div>
                {/* Tabs selection */}
                <div className="flex border-b border-slate-200 pb-3 mb-4">
                  <button
                    onClick={() => setDesktopTab('terminal')}
                    className={`flex items-center gap-1.5 pb-2 border-b-2 font-bold text-xs uppercase tracking-wider transition ${
                      desktopTab === 'terminal' 
                        ? 'border-[#0284c7] text-[#0284c7]' 
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    } mr-6 cursor-pointer`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {pt ? 'Terminal de Extração' : 'Extraction Logs'}
                  </button>
                  <button
                    onClick={() => { if (scanStatus === 'done') setDesktopTab('auditoria'); }}
                    disabled={scanStatus !== 'done'}
                    className={`flex items-center gap-1.5 pb-2 border-b-2 font-bold text-xs uppercase tracking-wider transition ${
                      scanStatus !== 'done'
                        ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400'
                        : desktopTab === 'auditoria'
                        ? 'border-[#0284c7] text-[#0284c7] cursor-pointer'
                        : 'border-transparent text-slate-400 hover:text-slate-600 cursor-pointer'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {pt ? 'Cruzamento de Auditoria' : 'Audit Verification'}
                  </button>
                </div>

                {/* Tab Content 1: Extraction logs */}
                {desktopTab === 'terminal' && (
                  <div ref={terminalRef} className="bg-[#0f172a] text-slate-300 p-4 rounded-lg font-mono text-[10px] min-h-[220px] max-h-[240px] overflow-y-auto shadow-inner flex flex-col gap-1.5 border border-slate-800 scroll-smooth">
                    {logs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-slate-500 animate-pulse select-none text-center">
                        <Terminal className="w-8 h-8 mb-2 opacity-50" />
                        <p>{pt ? 'Aguardando início de leitura OCR...' : 'Waiting for OCR scan initiation...'}</p>
                      </div>
                    ) : (
                      <>
                        {logs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed border-l-2 border-sky-500/35 pl-2">{log}</div>
                        ))}
                        {scanStatus === 'scanning' && (
                          <div className="flex items-center gap-1.5 text-sky-400 animate-pulse mt-1 pl-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                            <span>{pt ? 'A ler faturas...' : 'Reading invoice...'}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Tab Content 2: Audit checks */}
                {desktopTab === 'auditoria' && scanStatus === 'done' && (
                  <div className="animate-fade-in flex flex-col gap-4 text-left">
                    
                    {/* SCENARIO 1: MARGIN CHECKS */}
                    {activeScenario.id === 'margin' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Desvio Crítico de Preço de Custo' : 'Critical Cost Price Deviation'}</h4>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {pt 
                                ? 'A Maçã de Alcobaça sofreu um aumento silencioso de 10,00€/KG para 15,50€/KG (+55%). Isso reduziu a margem do prato "Torta de Maçã Especial" para 42%.' 
                                : 'Apple cost price silently increased from 10.00€/KG to 15.50€/KG (+55%). This compresses the margin of the "Special Apple Tart" to 42%.'}
                            </p>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                            {pt ? 'Impacto na Margem Comercial' : 'Impact on Commercial Margin'}
                          </span>
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-500 font-medium">
                              {pt ? 'Margem Atual: ' : 'Current Margin: '}{marginFixed ? (pt ? '65% (Ajustada)' : '65% (Adjusted)') : (pt ? '42% (Espremida)' : '42% (Squeezed)')}
                            </span>
                            <span className="text-slate-500 font-medium">
                              {pt ? 'PVP Recomendado: ' : 'Rec. Retail Price: '}{marginFixed ? '4,80 €' : '3,50 €'}
                            </span>
                          </div>
                          
                          {/* Margin bar */}
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                            <div 
                              style={{ width: marginFixed ? '65%' : '42%' }} 
                              className={`h-full transition-all duration-500 ${marginFixed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            />
                          </div>

                          <button
                            onClick={() => {
                              setMarginFixed(true);
                              triggerToast(pt ? "Margens reequilibradas e preço atualizado no POS!" : "Margins rebalanced and POS price updated!");
                            }}
                            disabled={marginFixed}
                            className="mt-2 flex items-center justify-center gap-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2.5 px-4 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <TrendingUp className="w-4 h-4" />
                            {marginFixed ? (pt ? 'Preço de Venda Corrigido' : 'Retail Price Updated') : (pt ? 'Corrigir Margem no POS (Ajustar PVP para 4,80€)' : 'Fix POS Margin (Adjust Retail to 4.80€)')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SCENARIO 2: 3-WAY MATCH FRAUD AUDIT */}
                    {activeScenario.id === 'fraud' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Discrepância de Auditoria Encontrada' : 'Audit Discrepancy Found'}</h4>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {pt 
                                ? 'A fatura cobra 50 KG de Lombo de Porco (390.00€), mas a Guia de Remessa signed à porta pelo funcionário apenas regista a entrega de 40 KG.' 
                                : 'The invoice charges for 50 KG of Pork Loin (390.00€), but the Delivery Guide signed at reception only registers 40 KG delivered.'}
                            </p>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full border-collapse text-[10px] text-slate-600 text-left">
                            <thead>
                              <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                                <th className="p-2">{pt ? 'Documento' : 'Document'}</th>
                                <th className="p-2 text-center">{pt ? 'Quantidade' : 'Quantity'}</th>
                                <th className="p-2 text-right">{pt ? 'Valor Associado' : 'Value'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-100">
                                <td className="p-2">{pt ? 'Fatura Recebida (OCR)' : 'Billed Invoice (OCR)'}</td>
                                <td className="p-2 text-center font-mono font-semibold">50 KG</td>
                                <td className="p-2 text-right font-mono">390,00 €</td>
                              </tr>
                              <tr className="border-b border-slate-100 bg-red-50">
                                <td className="p-2 text-red-600 font-medium">{pt ? 'Guia de Receção (Winphar)' : 'Delivery Slip (Winphar)'}</td>
                                <td className="p-2 text-center font-mono font-bold text-red-600">40 KG</td>
                                <td className="p-2 text-right font-mono text-red-600 font-bold">312,00 €</td>
                              </tr>
                              <tr className="border-b border-slate-100 font-bold text-red-600">
                                <td className="p-2">{pt ? 'Quebra / Diferença' : 'Discrepancy / Gap'}</td>
                                <td className="p-2 text-center font-mono">-10 KG</td>
                                <td className="p-2 text-right font-mono">-78,00 €</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <button
                          onClick={() => setShowDisputeModal(true)}
                          className="flex items-center justify-center gap-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2.5 px-4 rounded-lg transition cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                          {pt ? 'Gerar Reclamação de Crédito (78,00 €)' : 'Generate Credit Dispute Email (78.00 €)'}
                        </button>
                      </div>
                    )}

                    {/* SCENARIO 3: PAYMENT SCHEDULING */}
                    {activeScenario.id === 'payment' && (
                      <div className="flex flex-col gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Documento Conciliado & Seguro' : 'Document Matched & Safe'}</h4>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {pt 
                                ? 'Fatura validada sem discrepâncias. O IBAN corresponde ao registo de fornecedor e a data de vencimento foi detetada com precisão.' 
                                : 'Invoice validated with zero errors. IBAN matches supplier records and due date was detected accurately.'}
                            </p>
                          </div>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2.5 text-left text-[11px]">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="text-slate-400 font-medium">{pt ? 'Fornecedor:' : 'Vendor:'}</span>
                            <span className="font-bold text-slate-800">{activeScenario.invoiceName}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span className="text-slate-400 font-medium">{pt ? 'IBAN Destino:' : 'Destination IBAN:'}</span>
                            <span className="font-mono text-slate-800">{activeScenario.iban.substring(0, 18)}...</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">{pt ? 'Vencimento Programado:' : 'Scheduled Due Date:'}</span>
                            <span className="font-mono font-bold text-slate-800">15-07-2026</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSepaDownloaded(true);
                            triggerToast(pt ? "Ficheiro SEPA gerado com sucesso!" : "SEPA XML File generated successfully!");
                          }}
                          disabled={sepaDownloaded}
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          {sepaDownloaded ? (pt ? 'Ficheiro SEPA Descarregado' : 'SEPA Batch File Downloaded') : (pt ? 'Gerar Lote de Pagamento (SEPA XML)' : 'Generate SEPA XML Batch File')}
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>

              <div className="bg-slate-100 border border-slate-200 p-3 rounded-lg text-center text-[10px] text-slate-500 leading-normal">
                {activeScenario.id === 'margin' && (pt ? 'Este simulador protege a sua margem recomendando reajustes imediatos no POS.' : 'This simulator protects your margin by recommending immediate retail adjustments.')}
                {activeScenario.id === 'fraud' && (pt ? 'O motor de cruzamento a 3 vias deteta quebras de fornecedores e previne perdas financeiras.' : 'The 3-way cross-reference flags vendor leaks and prevents direct financial write-offs.')}
                {activeScenario.id === 'payment' && (pt ? 'Extraia dados de vencimento e IBAN e automatize a liquidação bancária sem faturas soltas.' : 'Extract IBAN and due dates to automate batch bank payments directly.')}
              </div>

            </div>

          </div>

        </div>

        {/* Dispute Email Mock Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white border border-slate-250 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-left">
              <button 
                onClick={() => setShowDisputeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
              >
                ×
              </button>
              <h3 className="font-display font-extrabold text-slate-800 text-sm mb-2">
                {pt ? 'Reclamação de Divergência Gerada' : 'Discrepancy Dispute Generated'}
              </h3>
              <p className="text-[10px] text-slate-400 mb-4">
                {pt ? 'Draft gerado automaticamente para o email comercial do fornecedor:' : 'Draft generated automatically for the supplier\'s sales email:'}
              </p>
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-[10px] text-slate-600 mb-5 leading-relaxed">
                <div><b>{pt ? 'De:' : 'From:'}</b> auditoria@nuelltech.com</div>
                <div><b>{pt ? 'Para:' : 'To:'}</b> comercial@talhosalentejanos.pt</div>
                <div><b>{pt ? 'Assunto:' : 'Subject:'}</b> {pt ? 'Divergência Fatura' : 'Invoice Discrepancy'} {activeScenario.invoiceNum}</div>
                <div className="border-t border-slate-200 my-2 pt-2">
                  {pt ? (
                    <>
                      Exmos. Senhores,<br/><br/>
                      Identificámos uma discrepância na Fatura <b>{activeScenario.invoiceNum}</b>. Cobraram <b>50 KG</b> de Lombo de Porco, no entanto a Guia de Remessa assinada regista apenas a receção de <b>40 KG</b>.<br/><br/>
                      Solicitamos a emissão de uma Nota de Crédito no valor de <b>78,00 €</b> correspondente aos 10 KG em falta.<br/><br/>
                      Melhores cumprimentos,<br/>
                      Auditoria Automática Nuelltech.
                    </>
                  ) : (
                    <>
                      Dear Sirs,<br/><br/>
                      We have identified a discrepancy in Invoice <b>{activeScenario.invoiceNum}</b>. You charged for <b>50 KG</b> of Pork Loin, however the signed Delivery Slip only registers <b>40 KG</b> delivered.<br/><br/>
                      We kindly request a Credit Note of <b>78.00 €</b> corresponding to the missing 10 KG.<br/><br/>
                      Best regards,<br/>
                      Nuelltech Automated Auditor.
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition text-[10.5px] cursor-pointer"
                >
                  {pt ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    setShowDisputeModal(false);
                    triggerToast(pt ? "E-mail de disputa enviado com sucesso!" : "Dispute email sent successfully!");
                  }}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition text-[10.5px] cursor-pointer"
                >
                  {pt ? 'Enviar E-mail' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Toast */}
        <div className={`fixed bottom-6 right-6 bg-white shadow-2xl border-l-4 border-[#10b981] p-4 rounded-lg flex items-center gap-3 z-50 transition-all duration-300 max-w-sm ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`} id="analysis-toast">
          <div className="flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-full p-1.5 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs text-slate-800">
              {pt ? 'Auditor & OCR Nuelltech' : 'Auditor & OCR Nuelltech'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {toastMsg}
            </span>
          </div>
          <button className="text-slate-400 text-sm font-bold ml-auto hover:text-slate-600 cursor-pointer pl-2" onClick={() => setShowToast(false)}>×</button>
        </div>

      </div>

      {/* =============================================================== */}
      {/* MOBILE LAYOUT (visible on small viewports)                     */}
      {/* =============================================================== */}
      <div className="flex md:hidden flex-col w-full min-h-[500px] bg-slate-100 pb-16 relative">
        {/* Camera capture screen flash overlay */}
        {cameraFlash && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-300" />}

        {/* Mobile Header */}
        <div className="mob-header bg-[#0f172a] text-white px-4 py-3 flex justify-between items-center border-b-2 border-sky-500 z-30">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-sky-400" />
            <span className="mob-title font-display font-extrabold text-sm uppercase tracking-wider">Auditor OCR</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-sky-400 font-bold text-[10px]">N</div>
        </div>

        {/* Mobile Scenario Selector top bar */}
        <div className="bg-white border-b border-slate-200 p-2 overflow-x-auto flex gap-2 whitespace-nowrap z-20">
          {scenarios.map(scen => (
            <button
              key={scen.id}
              onClick={() => changeScenario(scen)}
              className={`py-1.5 px-3 rounded-full text-[10px] font-bold border transition ${
                activeScenario.id === scen.id
                  ? 'bg-sky-500/10 border-sky-500 text-[#0284c7]'
                  : 'bg-transparent border-slate-200 text-slate-400'
              }`}
            >
              {pt ? scen.name.pt.split(' ')[0] : scen.name.en.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content Viewports */}
        <div className="flex-1 p-4 overflow-y-auto">
          
          {/* CAMERA SHUTTER VIEW */}
          {mobileTab === 'camera' && (
            <div className="flex flex-col items-center justify-between h-full min-h-[350px] animate-fade-in relative text-center">
              
              {/* Camera viewport mock */}
              <div className="w-[280px] h-[220px] bg-slate-900 border-4 border-slate-400 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner my-auto">
                {/* Viewfinder crosshairs */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-sky-400" />
                
                {/* Mini mock PDF preview inside viewfinder */}
                <div className="w-[180px] h-[140px] bg-white opacity-40 rounded border border-slate-350 p-2 flex flex-col justify-between text-left text-[6px] text-slate-800 scale-90">
                  <div className="border-b border-slate-300 pb-1 mb-1 font-bold text-[8px]">{activeScenario.invoiceName}</div>
                  <div className="h-10 bg-slate-100 rounded-sm mb-2" />
                  <div className="flex justify-between font-bold text-[#0284c7]">
                    <span>Total Cobrado:</span>
                    <span>{activeScenario.total.toFixed(2)} €</span>
                  </div>
                </div>

                {scanStatus === 'scanning' && (
                  <div className="absolute inset-0 bg-sky-500/10 flex flex-col items-center justify-center gap-2 z-20">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white text-[9px] font-mono animate-pulse">{pt ? 'A digitalizar...' : 'Scanning document...'}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2.5 w-full mt-4">
                <p className="text-[10px] text-slate-500 leading-normal max-w-xs">
                  {pt ? 'Enquadre a fatura do fornecedor no visor e dispare a câmara para auditar automaticamente.' : 'Position the vendor invoice within the frame and click below to run instant audit.'}
                </p>
                <button
                  onClick={triggerMobileCamera}
                  disabled={scanStatus === 'scanning'}
                  className="w-14 h-14 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition cursor-pointer disabled:opacity-40"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

            </div>
          )}

          {/* TINDER SWIPER validation */}
          {mobileTab === 'alerts' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] animate-fade-in relative">
              {activeCardIndex < activeScenario.items.length ? (
                <>
                  <div className="relative w-[280px] h-[300px] flex justify-center items-center">
                    {activeScenario.items.map((item, idx) => {
                      if (idx < activeCardIndex) return null;
                      
                      const isTop = idx === activeCardIndex;
                      const isNext = idx === activeCardIndex + 1;
                      const isThird = idx === activeCardIndex + 2;
                      const swipeDir = swipedCards[idx];

                      let transformStyle = '';
                      let opacityStyle = '1';
                      let zIndexStyle = 5;

                      if (isTop) {
                        zIndexStyle = 5;
                        if (swipeDir === 'left') {
                          transformStyle = 'translate(-380px, -20px) rotate(-15deg)';
                          opacityStyle = '0';
                        } else if (swipeDir === 'right') {
                          transformStyle = 'translate(380px, -20px) rotate(15deg)';
                          opacityStyle = '0';
                        } else {
                          transformStyle = 'scale(1) translateY(0)';
                        }
                      } else if (isNext) {
                        transformStyle = 'scale(0.95) translateY(12px)';
                        opacityStyle = '0.9';
                        zIndexStyle = 4;
                      } else if (isThird) {
                        transformStyle = 'scale(0.9) translateY(24px)';
                        opacityStyle = '0.7';
                        zIndexStyle = 3;
                      } else {
                        transformStyle = 'scale(0.85) translateY(36px)';
                        opacityStyle = '0';
                        zIndexStyle = 2;
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            transform: transformStyle,
                            opacity: opacityStyle,
                            zIndex: zIndexStyle,
                          }}
                          className="absolute w-[280px] h-[290px] bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all duration-300 transform-gpu text-left"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-display font-extrabold text-slate-800 text-[12px] leading-tight max-w-[70%]">{item.desc}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              activeScenario.id === 'fraud' && idx === 0 
                                ? 'bg-red-50 text-red-600 border border-red-200' 
                                : activeScenario.id === 'margin' && idx === 0
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}>
                              {activeScenario.id === 'fraud' && idx === 0 
                                ? (pt ? 'Divergência' : 'Discrepancy') 
                                : activeScenario.id === 'margin' && idx === 0
                                ? (pt ? 'Preço Alto' : 'High Price')
                                : (pt ? 'Conforme' : 'Matched')}
                            </span>
                          </div>

                          <div className="bg-slate-100 rounded-xl p-3 flex justify-between text-center text-[10px]">
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">{pt ? 'Faturado' : 'Billed'}</h5>
                              <p className="font-bold text-slate-700 mt-0.5">{item.qty} un.</p>
                            </div>
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">{pt ? 'Preço' : 'Price'}</h5>
                              <p className="font-bold text-slate-700 mt-0.5">{item.price.toFixed(2)} €</p>
                            </div>
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">Total</h5>
                              <p className="font-bold text-[#0284c7] mt-0.5">{item.total.toFixed(2)} €</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setDrawerIndex(idx)}
                            className="flex items-center justify-center gap-1 border border-sky-500/50 text-[#0284c7] py-2 rounded-lg text-[10px] font-bold hover:bg-sky-50 transition w-full bg-white cursor-pointer"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            {pt ? 'Ver Registo de Compras' : 'View Database History'}
                          </button>

                          <div className="border-t border-dashed border-slate-200 pt-3 mt-auto text-left">
                            <span className="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">Auditoria da IA</span>
                            <p className="text-[11px] text-slate-700 leading-snug">
                              {activeScenario.id === 'margin' && idx === 0 && (pt ? '<b>Alerta:</b> Preço subiu 55% face ao histórico de 10,00€. Margem comprimida.' : '<b>Alert:</b> Cost up 55% from history of 10.00€. Margin compressed.')}
                              {activeScenario.id === 'fraud' && idx === 0 && (pt ? '<b>Erro:</b> A guia registou 40 KG entregues, mas cobram 50 KG na fatura.' : '<b>Error:</b> Slip records 40 KG delivered, but invoice charges 50 KG.')}
                              {!(activeScenario.id === 'margin' && idx === 0) && !(activeScenario.id === 'fraud' && idx === 0) && (pt ? '<b>Conforme:</b> Preço e quantidades batem certo com a encomenda.' : '<b>Matched:</b> Cost and quantities align with PO.')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => handleMobileSwipe('left')}
                      className="w-12 h-12 rounded-full border border-red-200 bg-red-50 text-red-500 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => handleMobileSwipe('right')}
                      className="w-12 h-12 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* SCREEN 3: MOBILE RESULTS */}
          {mobileTab === 'results' && (
            <div className="flex flex-col gap-4 animate-fade-in text-left">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg width="64" height="64" className="-rotate-90">
                    <circle className="stroke-slate-100 fill-none" strokeWidth="5" cx="32" cy="32" r="28" />
                    <circle 
                      className="fill-none transition-all duration-1000 ease-in-out" 
                      strokeWidth="5" 
                      cx="32" 
                      cy="32" 
                      r="28"
                      stroke={getComplianceScore() === 100 ? '#10b981' : getComplianceScore() >= 70 ? '#f59e0b' : '#ef4444'}
                      strokeDasharray="176"
                      strokeDashoffset={176 - (176 * getComplianceScore() / 100)}
                    />
                  </svg>
                  <span className="absolute font-display font-extrabold text-slate-800 text-sm">{getComplianceScore()}%</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-display font-bold text-slate-800 text-xs mb-1">
                    {pt ? 'Índice de Conformidade' : 'Compliance Index'}
                  </h3>
                  <p className="text-slate-500 text-[10px] leading-relaxed">
                    {activeScenario.id === 'margin' && (pt ? 'Desvio detetado nas margens de retalho.' : 'Price deviation detected in retail margins.')}
                    {activeScenario.id === 'fraud' && (pt ? 'Quebra de fornecedor detetada (-10 KG).' : 'Vendor supply discrepancy detected (-10 KG).')}
                    {activeScenario.id === 'payment' && (pt ? 'Fatura 100% conforme para pagamento.' : 'Invoice 100% compliant for payment.')}
                  </p>
                </div>
              </div>

              {activeScenario.id === 'margin' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Correção de Preços (POS)' : 'Retail Adjustments (POS)'}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {pt ? 'Ajuste automático do PVP para manter a margem estável em 65%.' : 'Auto-adjust retail prices to maintain a 65% target margin.'}
                  </p>
                  <button 
                    onClick={() => {
                      setMarginFixed(true);
                      triggerToast(pt ? "POS Atualizado!" : "POS Updated!");
                    }}
                    disabled={marginFixed}
                    className="py-3 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer disabled:opacity-40"
                  >
                    {marginFixed ? (pt ? 'POS Atualizado' : 'POS Updated') : (pt ? 'Corrigir Margem (PVP 4,80€)' : 'Fix Margin (Retail 4.80€)')}
                  </button>
                </div>
              )}

              {activeScenario.id === 'fraud' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Disputa de Fatura' : 'Invoice Dispute'}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {pt ? 'Envie a reclamação dos 10 KG em falta diretamente para o email do fornecedor.' : 'Send discrepancy claim for 10 KG missing to vendor.'}
                  </p>
                  <button 
                    onClick={() => {
                      triggerToast(pt ? "E-mail de disputa enviado!" : "Dispute email sent!");
                    }}
                    className="py-3 px-4 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer"
                  >
                    {pt ? 'Reclamar Crédito (78,00 €)' : 'Dispute Claim (78.00 €)'}
                  </button>
                </div>
              )}

              {activeScenario.id === 'payment' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <h4 className="font-bold text-slate-800 text-xs">{pt ? 'Liquidação Automática' : 'Automated Settlement'}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {pt ? 'Gerar o ficheiro XML de pagamentos SEPA em lote.' : 'Download SEPA payment batch file.'}
                  </p>
                  <button 
                    onClick={() => {
                      setSepaDownloaded(true);
                      triggerToast(pt ? "XML SEPA Descarregado!" : "SEPA XML Downloaded!");
                    }}
                    disabled={sepaDownloaded}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer disabled:opacity-40"
                  >
                    {sepaDownloaded ? (pt ? 'SEPA Descarregado' : 'SEPA Downloaded') : (pt ? 'Descarregar XML SEPA' : 'Download SEPA XML')}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Mobile Detail Drawer Bottom-Sheet */}
        <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 transition-opacity duration-300 ${
          drawerIndex !== null ? 'opacity-100 block' : 'opacity-0 hidden'
        }`} onClick={() => setDrawerIndex(null)} />
        
        <div className={`fixed left-0 right-0 bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl p-5 z-50 flex flex-col justify-between transition-all duration-300 ${
          drawerIndex !== null ? 'bottom-0 h-[280px]' : '-bottom-[320px] h-[280px]'
        }`}>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setDrawerIndex(null)} />
          {drawerIndex !== null && (
            <>
              <div className="font-display font-bold text-slate-800 text-xs mb-3 text-left">
                {activeScenario.items[drawerIndex].desc}
              </div>
              
              <table className="w-full border-collapse text-[10.5px] text-slate-600 mb-3 text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2">{pt ? 'Documento Encomendado' : 'Database PO Logs'}</th>
                    <th className="p-2 text-center">{pt ? 'Qtd' : 'Qty'}</th>
                    <th className="p-2 text-right">{pt ? 'Custo Un.' : 'Unit Cost'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2">{pt ? 'Histórico Compras' : 'PO History'}</td>
                    <td className="p-2 text-center font-mono">
                      {activeScenario.id === 'margin' && drawerIndex === 0 ? '10' : activeScenario.items[drawerIndex].qty}
                    </td>
                    <td className="p-2 text-right font-mono">
                      {activeScenario.id === 'margin' && drawerIndex === 0 ? '10.00 €' : `${activeScenario.items[drawerIndex].price.toFixed(2)} €`}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[10px] text-slate-400 leading-normal mb-3 text-left">
                {activeScenario.id === 'margin' && drawerIndex === 0 && (pt ? '*O custo histórico registado era de 10.00€. O fornecedor faturou 15.50€ sem aviso prévio.' : '*Historical cost was 10.00€. Vendor billed 15.50€ without notification.')}
                {activeScenario.id === 'fraud' && drawerIndex === 0 && (pt ? '*O funcionário registou e assinou apenas 40 KG entregues na Guia de Remessa nº 9482.' : '*Staff only checked and signed for 40 KG delivered on Delivery Guide #9482.')}
                {!(activeScenario.id === 'margin' && drawerIndex === 0) && !(activeScenario.id === 'fraud' && drawerIndex === 0) && (pt ? '*Os custos e quantidades encontram-se perfeitamente alinhados com o histórico de encomendas.' : '*PO records and quantities are perfectly matched against billing history.')}
              </p>

              <button 
                onClick={() => setDrawerIndex(null)}
                className="w-full py-2.5 rounded-lg bg-[#0f172a] text-white text-[10.5px] font-bold uppercase tracking-wide hover:bg-slate-800 cursor-pointer"
              >
                {pt ? 'Fechar Detalhes' : 'Close Details'}
              </button>
            </>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="mob-nav fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center pb-2 z-40 shadow-inner">
          <button 
            onClick={() => setMobileTab('camera')}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition cursor-pointer ${
              mobileTab === 'camera' ? 'text-[#0284c7]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Camera className="w-5 h-5" />
            Câmara
          </button>
          <button 
            onClick={() => { if (scanStatus === 'done') setMobileTab('alerts'); }}
            disabled={scanStatus !== 'done'}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition ${
              scanStatus !== 'done'
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : mobileTab === 'alerts'
                ? 'text-[#0284c7] cursor-pointer'
                : 'text-slate-400 hover:text-slate-600 cursor-pointer'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            Validação
          </button>
          <button 
            onClick={() => { if (scanStatus === 'done') setMobileTab('results'); }}
            disabled={scanStatus !== 'done'}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition ${
              scanStatus !== 'done'
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : mobileTab === 'results'
                ? 'text-[#0284c7] cursor-pointer'
                : 'text-slate-400 hover:text-slate-600 cursor-pointer'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Resultados
          </button>
        </div>
      </div>

    </div>
  );
}
