'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, AlertTriangle, CheckCircle } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  nameEn: string;
  invoiceName: string;
  invoiceDate: string;
  items: { desc: string; qty: number; price: number; total: number }[];
  total: number;
}

interface ImpactData {
  type: 'success' | 'warning' | 'danger';
  title: string;
  desc: string;
  recommendation: string;
}

const scenarios: Scenario[] = [
  {
    id: 'margin',
    name: 'Alerta de Margens (Desvios de Custo)',
    nameEn: 'Margin Alert (Cost Deviations)',
    invoiceName: 'MacroFrutas Lda',
    invoiceDate: '03-07-2026',
    items: [
      { desc: 'Maçã de Alcobaça Especial', qty: 10, price: 15.50, total: 155.00 },
      { desc: 'Laranja Doce do Algarve', qty: 25, price: 2.10, total: 52.50 },
      { desc: 'Banana Importada Premium', qty: 15, price: 1.80, total: 27.00 },
    ],
    total: 234.50,
  },
  {
    id: 'payment',
    name: 'Programação de Pagamento Automático',
    nameEn: 'Automated Payment Scheduling',
    invoiceName: 'Bebidas do Centro Distribuição',
    invoiceDate: '01-07-2026',
    items: [
      { desc: 'Água das Pedras 25cl x24', qty: 10, price: 18.20, total: 182.00 },
      { desc: 'Cerveja Nacional Barril 50L', qty: 4, price: 110.00, total: 440.00 },
      { desc: 'Refrigerante Cola Lata x24', qty: 6, price: 14.50, total: 87.00 },
    ],
    total: 709.00,
  },
  {
    id: 'fraud',
    name: 'Auditoria & Fraude (Fatura vs Guia)',
    nameEn: 'Audit & Fraud (Invoice vs Delivery Slip)',
    invoiceName: 'Talhos Alentejanos Lda',
    invoiceDate: '02-07-2026',
    items: [
      { desc: 'Lombo de Porco Nacional (KG)', qty: 50, price: 7.80, total: 390.00 }, // Delivery guide has qty: 40!
      { desc: 'Peito de Frango do Campo (KG)', qty: 30, price: 5.40, total: 162.00 },
    ],
    total: 552.00,
  },
];

export default function OcrSandbox({ pt = true }: { pt?: boolean }) {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [mobileTab, setMobileTab] = useState<'doc' | 'terminal' | 'impact'>('doc');

  const startScan = () => {
    setScanStatus('scanning');
    setProgress(0);
    setImpactData(null);
    setMobileTab('doc');
    setLogs([
      `${new Date().toLocaleTimeString('pt-PT')} ${pt ? '[INICIANDO] Conexão segura estabelecida com motor OCR.' : '[STARTING] Secure connection to OCR engine established.'}`,
      `${new Date().toLocaleTimeString('pt-PT')} ${pt ? '[PROCESSANDO] Carregando documento em memória...' : '[PROCESSING] Loading document into memory...'}`
    ]);
  };

  const log = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString('pt-PT')} ${msg}`]);
  }, []);

  const triggerImpact = useCallback(() => {
    if (activeScenario.id === 'margin') {
      setImpactData({
        type: 'warning',
        title: pt ? 'Desvio de Preço Crítico (+55%)' : 'Critical Price Deviation (+55%)',
        desc: pt 
          ? 'O fornecedor aumentou o custo da Maçã de Alcobaça de 10,00€/KG para 15,50€/KG. Isso comprimiu a margem do prato "Torta de Maçã Especial" de 65% para 42%.'
          : 'Supplier increased apple cost from 10.00€/KG to 15.50€/KG. This compressed "Special Apple Tart" margin from 65% to 42%.',
        recommendation: pt 
          ? 'Recomendação: Ajustar PVP do prato para 4.80€ ou contactar fornecedor alternativo.'
          : 'Recommendation: Adjust dish price to 4.80€ or contact alternative supplier.',
      });
    } else if (activeScenario.id === 'payment') {
      setImpactData({
        type: 'success',
        title: pt ? 'Pagamento Agendado (Automático)' : 'Payment Scheduled (Automated)',
        desc: pt 
          ? 'Fatura validada e reconciliada. Vencimento detetado para 15-07-2026. Submetida na fila bancária para aprovação imediata.'
          : 'Invoice validated and reconciled. Due date detected for 15-07-2026. Submitted in banking queue for immediate approval.',
        recommendation: pt 
          ? 'Recomendação: Nenhuma ação manual necessária. Poupança de 15 minutos.'
          : 'Recommendation: No manual action needed. Saves 15 minutes.',
      });
    } else if (activeScenario.id === 'fraud') {
      setImpactData({
        type: 'danger',
        title: pt ? 'Discrepância de Auditoria Encontrada' : 'Audit Discrepancy Found',
        desc: pt 
          ? 'A fatura cobra 50 KG de Lombo de Porco (390.00€), mas a Guia de Remessa nº 9482 assinada à porta pelo funcionário apenas regista a entrega de 40 KG.'
          : 'Invoice charges for 50 KG of Pork Loin (390.00€), but Delivery Guide #9482 signed by staff only registers delivery of 40 KG.',
        recommendation: pt 
          ? 'Recomendação: Reclamar nota de crédito de 78.00€ (10 KG em falta) ao fornecedor.'
          : 'Recommendation: Claim credit note of 78.00€ (10 KG missing) from supplier.',
      });
    }
  }, [activeScenario, pt]);

  useEffect(() => {
    if (scanStatus !== 'scanning') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        
        // Trigger logs based on progress percentage
        const step = Math.floor(next);
        if (step === 15) {
          log(pt ? '[VISÃO] Executando segmentação de documento layout.' : '[VISION] Running layout document segmentation.');
          log(pt ? '[OCR] Detetado cabeçalho: Fornecedor encontrado.' : '[OCR] Header detected: Supplier found.');
        } else if (step === 35) {
          log(pt ? `[OCR] Emitente: "${activeScenario.invoiceName}".` : `[OCR] Issuer: "${activeScenario.invoiceName}".`);
          log(pt ? `[OCR] Data Emissão: ${activeScenario.invoiceDate}.` : `[OCR] Invoice Date: ${activeScenario.invoiceDate}.`);
        } else if (step === 55) {
          log(pt ? '[OCR] Extraindo tabela de artigos e preços...' : '[OCR] Extracting line items and prices...');
          activeScenario.items.forEach((item) => {
            log(`  → "${item.desc}" | Qtd: ${item.qty} | Preço: ${item.price.toFixed(2)}€`);
          });
        } else if (step === 75) {
          log(pt ? '[INTEGRAÇÃO] Reconciliando com base de dados de compras...' : '[INTEGRATION] Reconciling against purchase database...');
          if (activeScenario.id === 'margin') {
            log(pt ? '[ALERTA] Histórico indica desvio significativo no artigo "Maçã de Alcobaça"!' : '[WARNING] History indicates significant deviation in item "Maçã de Alcobaça"!');
          } else if (activeScenario.id === 'payment') {
            log(pt ? '[SISTEMA] Validando IBAN e prazos de liquidação...' : '[SYSTEM] Validating IBAN and settlement terms...');
          } else if (activeScenario.id === 'fraud') {
            log(pt ? '[ALERTA] Cruzando com Guia de Remessa nº 9482...' : '[WARNING] Cross-referencing with Delivery Guide #9482...');
          }
        } else if (step === 90) {
          log(pt ? '[SISTEMA] Calculando impacto financeiro e margens...' : '[SYSTEM] Calculating financial impact and margins...');
        }

        if (next >= 100) {
          clearInterval(interval);
          setScanStatus('done');
          triggerImpact();
          setMobileTab('impact');
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [scanStatus, triggerImpact, log, activeScenario, pt]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-brand-card rounded-2xl border border-brand-border overflow-hidden box-glow glass">
      {/* Selector and Title */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-b border-brand-border">
        {/* Sidebar Scenario Selection */}
        <div className="bg-[#090D1A] p-4 border-r border-brand-border flex flex-col gap-2">
          <div className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider mb-2">
            {pt ? 'Cenários do Simulador' : 'Simulator Scenarios'}
          </div>
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => {
                setActiveScenario(scen);
                setScanStatus('idle');
                setProgress(0);
                setLogs([]);
                setImpactData(null);
              }}
              className={`text-left p-3 rounded-lg text-xs font-medium transition duration-200 border ${
                activeScenario.id === scen.id
                  ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
                  : 'bg-brand-card/50 border-transparent text-brand-ink-dim hover:bg-brand-border/40 hover:text-brand-ink'
              }`}
            >
              {pt ? scen.name : scen.nameEn}
            </button>
          ))}

          {/* Action button */}
          <button
            onClick={startScan}
            disabled={scanStatus === 'scanning'}
            className="mt-6 flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition duration-200 shadow-lg disabled:opacity-50"
          >
            {scanStatus === 'scanning' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {pt ? 'Processando...' : 'Processing...'}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {pt ? 'Iniciar Leitura OCR' : 'Start OCR Scan'}
              </>
            )}
          </button>
        </div>

        {/* Live Workspace */}
        <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6">
          
          {/* Mobile Segmented Control */}
          <div className="lg:hidden flex bg-[#05070C]/85 border border-[#172033] rounded-xl p-1 gap-1 w-full">
            <button
              onClick={() => setMobileTab('doc')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                mobileTab === 'doc'
                  ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent-soft'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
              }`}
            >
              📄 {pt ? 'Fatura' : 'Invoice'}
            </button>
            <button
              onClick={() => setMobileTab('terminal')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                mobileTab === 'terminal'
                  ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent-soft'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
              }`}
            >
              💻 {pt ? 'Terminal' : 'Terminal'}
            </button>
            <button
              onClick={() => setMobileTab('impact')}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                mobileTab === 'impact'
                  ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent-soft'
                  : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
              }`}
            >
              📊 {pt ? 'Resolução' : 'Impact'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* Mock Document Viewer (Visual Invoice) */}
            <div className={`bg-[#05070D] rounded-xl border border-brand-border p-4 md:p-5 relative overflow-hidden flex flex-col justify-between h-[340px] text-[10px] ${mobileTab === 'doc' ? 'flex' : 'hidden lg:flex'}`}>
              {/* Scanner line animation */}
              {scanStatus === 'scanning' && (
                <div
                  className="absolute left-0 right-0 h-1 bg-brand-accent-soft shadow-[0_0_15px_rgba(96,165,250,0.8)] z-10 animate-pulse pointer-events-none"
                  style={{
                    top: `${progress}%`,
                    transition: 'top 0.15s linear',
                  }}
                />
              )}

              {/* Document Header */}
              <div>
                <div className="flex justify-between items-center border-b border-brand-border/80 pb-2 mb-3">
                  <span className="font-mono text-brand-ink-dim uppercase">Fatura Virtual PDF</span>
                  <span className="font-semibold text-brand-accent-soft">{activeScenario.invoiceName}</span>
                </div>
                <div className="flex justify-between text-brand-ink-dim mb-3">
                  <span>Nº Fatura: FT/2026/0842</span>
                  <span>{pt ? 'Data' : 'Date'}: {activeScenario.invoiceDate}</span>
                </div>

                {/* Items Table - Desktop only */}
                <div className="hidden sm:block">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-ink-dim">
                        <th className="text-left pb-1 font-medium">{pt ? 'Artigo' : 'Item'}</th>
                        <th className="text-right pb-1 font-medium">Qtd</th>
                        <th className="text-right pb-1 font-medium">{pt ? 'Preço' : 'Price'}</th>
                        <th className="text-right pb-1 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeScenario.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`border-b border-brand-border/30 ${
                            activeScenario.id === 'margin' && item.desc.includes('Maçã') && scanStatus === 'done'
                              ? 'bg-brand-risk/10 text-brand-risk font-semibold'
                              : activeScenario.id === 'fraud' && item.desc.includes('Lombo') && scanStatus === 'done'
                              ? 'bg-brand-warn/10 text-brand-warn font-semibold'
                              : 'text-brand-ink'
                          }`}
                        >
                          <td className="py-2">{item.desc}</td>
                          <td className="text-right py-2">{item.qty}</td>
                          <td className="text-right py-2">{item.price.toFixed(2)} €</td>
                          <td className="text-right py-2">{item.total.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Items List - Mobile only */}
                <div className="block sm:hidden flex flex-col gap-2 overflow-y-auto max-h-[170px] pr-1 scrollbar-thin">
                  {activeScenario.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border border-brand-border/40 flex flex-col gap-1 ${
                        activeScenario.id === 'margin' && item.desc.includes('Maçã') && scanStatus === 'done'
                          ? 'bg-brand-risk/10 border-brand-risk/30 text-brand-risk font-medium'
                          : activeScenario.id === 'fraud' && item.desc.includes('Lombo') && scanStatus === 'done'
                          ? 'bg-brand-warn/10 border-brand-warn/30 text-brand-warn font-medium'
                          : 'bg-brand-card/30 text-brand-ink'
                      }`}
                    >
                      <div className="font-bold text-[9.5px] truncate">{item.desc}</div>
                      <div className="flex justify-between text-[8px] text-brand-ink-dim font-mono mt-0.5">
                        <span>Qtd: <strong className="text-brand-ink">{item.qty}</strong></span>
                        <span>Custo: <strong className="text-brand-ink">{item.price.toFixed(2)}€</strong></span>
                        <span>Total: <strong className="text-brand-ink">{item.total.toFixed(2)}€</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Sign */}
              <div className="border-t border-brand-border pt-2 flex justify-between items-center">
                <div>
                  <div className="text-brand-ink-dim text-[8px]">
                    IBAN: PT50 0033 0000 1234 5678 9012 3
                  </div>
                  {activeScenario.id === 'fraud' && (
                    <div className="text-brand-warn text-[8px] mt-0.5">
                      {pt ? '*Guia de Remessa anexa: 40 KG Lombo' : '*Delivery Slip attached: 40 KG Loin'}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-brand-ink-dim mr-2 font-mono">TOTAL:</span>
                  <span className="text-sm font-bold text-brand-ink">{activeScenario.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Terminal Console Logs & Impact Box */}
            <div className={`flex flex-col justify-between h-[340px] ${mobileTab === 'terminal' || mobileTab === 'impact' ? 'flex' : 'hidden lg:flex'}`}>
              {/* Terminal logs */}
              <div className={`bg-[#05070D] border border-brand-border rounded-xl p-4 flex-1 overflow-y-auto font-mono text-[9px] text-[#A6E22E] flex flex-col gap-1.5 scrollbar-thin ${mobileTab === 'terminal' ? 'flex' : 'hidden lg:flex'}`}>
                <div className="text-brand-ink-dim text-[8px] font-semibold border-b border-brand-border/40 pb-1.5 mb-1.5 flex justify-between items-center">
                  <span>TERMINAL LOG</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-ok animate-ping" />
                </div>
                {logs.length === 0 ? (
                  <div className="text-brand-ink-dim italic text-center py-12">
                    {pt ? 'Aguardando início de processamento...' : 'Waiting to start processing...'}
                  </div>
                ) : (
                  logs.map((lg, idx) => <div key={idx}>{lg}</div>)
                )}
              </div>

              {/* Impact Box */}
              <div className={`mt-4 ${mobileTab === 'impact' ? 'block' : 'hidden lg:block'}`}>
                {scanStatus === 'scanning' && (
                  <div className="bg-brand-card border border-brand-border p-4 rounded-xl flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-brand-ink-dim">
                      {pt ? `Análise em progresso: ${progress}%` : `Analysis in progress: ${progress}%`}
                    </span>
                  </div>
                )}

                {scanStatus === 'done' && impactData && (
                  <div
                    className={`border p-4 rounded-xl animate-fade-in ${
                      impactData.type === 'success'
                        ? 'bg-brand-ok/10 border-brand-ok/30'
                        : impactData.type === 'danger'
                        ? 'bg-brand-risk/10 border-brand-risk/30'
                        : 'bg-brand-warn/10 border-brand-warn/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {impactData.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-brand-ok flex-shrink-0" />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${impactData.type === 'danger' ? 'text-brand-risk' : 'text-brand-warn'}`} />
                      )}
                      <h5
                        className={`text-sm sm:text-base font-extrabold ${
                          impactData.type === 'success'
                            ? 'text-brand-ok'
                            : impactData.type === 'danger'
                            ? 'text-brand-risk'
                            : 'text-brand-warn'
                        }`}
                      >
                        {impactData.title}
                      </h5>
                    </div>
                    <p className="text-[12.5px] sm:text-sm text-brand-ink/90 leading-relaxed mb-2.5">
                      {impactData.desc}
                    </p>
                    <div className="text-[11px] sm:text-xs font-mono text-brand-ink font-black border-t border-brand-border/40 pt-2 mt-2">
                      {impactData.recommendation}
                    </div>
                  </div>
                )}

                {scanStatus === 'idle' && (
                  <div className="bg-brand-card border border-brand-border border-dashed p-4 rounded-xl text-center text-xs text-brand-ink-dim">
                    {pt ? 'Clique no botão acima para ler a fatura' : 'Click the button above to scan the invoice'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
