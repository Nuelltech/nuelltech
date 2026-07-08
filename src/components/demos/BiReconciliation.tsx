'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Database, RefreshCw, BarChart2, MessageSquare, Bot, User } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  stock: number;
  expiryDays: number;
}

interface SalesItem {
  id: string;
  name: string;
  sales30d: number;
  velocity: 'Alta' | 'Média' | 'Baixa' | 'High' | 'Medium' | 'Low';
}

interface ReconciliationResult {
  id: string;
  name: string;
  risk: 'crítico' | 'moderado' | 'seguro' | 'critical' | 'moderate' | 'safe';
  projectedLoss: number;
  reason: string;
  reasonEn: string;
  action: string;
  actionEn: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const stockData: StockItem[] = [
  { id: '101', name: 'Suplemento Whey 1KG', stock: 85, expiryDays: 140 },
  { id: '102', name: 'Barra Proteica Coco x12', stock: 150, expiryDays: 15 }, // CRITICAL
  { id: '103', name: 'Creatina Monohidrato', stock: 40, expiryDays: 95 },
  { id: '104', name: 'L-Carnitina Shot 60ml', stock: 240, expiryDays: 45 }, // MODERATE
];

const salesData: SalesItem[] = [
  { id: '101', name: 'Suplemento Whey 1KG', sales30d: 92, velocity: 'Alta' },
  { id: '102', name: 'Barra Proteica Coco x12', sales30d: 8, velocity: 'Baixa' },
  { id: '103', name: 'Creatina Monohidrato', sales30d: 35, velocity: 'Média' },
  { id: '104', name: 'L-Carnitina Shot 60ml', sales30d: 65, velocity: 'Média' },
];

const reconciliationResults: ReconciliationResult[] = [
  {
    id: '102',
    name: 'Barra Proteica Coco x12',
    risk: 'crítico',
    projectedLoss: 2250.00,
    reason: '150 caixas expiram em 15 dias, mas a velocidade de venda é de apenas 8 caixas/mês. Perda iminente de 95% do stock.',
    reasonEn: '150 boxes expire in 15 days, but sales velocity is only 8 boxes/month. Imminent loss of 95% of stock.',
    action: 'Campanha de Venda Cruzada: Oferecer 1 caixa na adesão anual ou desconto imediato de 40% na recepção.',
    actionEn: 'Cross-selling campaign: Offer 1 box on annual subscription or immediate 40% discount at front desk.',
  },
  {
    id: '104',
    name: 'L-Carnitina Shot 60ml',
    risk: 'moderado',
    projectedLoss: 980.00,
    reason: '240 unidades expiram em 45 dias, velocidade atual escoará apenas 98 unidades. Perda projetada de 142 unidades.',
    reasonEn: '240 units expire in 45 days, current velocity will clear only 98 units. Projected loss of 142 units.',
    action: 'Criar combo "Treino Verão": Associar à compra de Whey com desconto de 15%.',
    actionEn: 'Create "Summer Workout" combo: Bundle with Whey purchase at 15% discount.',
  },
];

export default function BiReconciliation({ pt = true }: { pt?: boolean }) {
  const [reconciling, setReconciling] = useState(false);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Q&A Chat States
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: 'assistant',
      content: pt 
        ? 'Olá! Sou o seu analista de IA. Posso interpretar a base de dados de stock e vendas em tempo real. Selecione um exemplo de pergunta abaixo para ver a análise.'
        : 'Hello! I am your AI analyst. I can interpret the stock and sales database in real time. Select a sample question below to view the analysis.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamically calculate the step message in render
  const stepMessage = 
    step === 1 
      ? (pt ? 'Lendo bases de dados independentes...' : 'Reading independent databases...')
      : step === 2
      ? (pt ? 'Cruzando ID de Stock com ID de Vendas...' : 'Cross-referencing Stock ID with Sales ID...')
      : step === 3
      ? (pt ? 'Calculando velocidade de escoamento e taxa de expiração...' : 'Calculating inventory depletion and expiry rates...')
      : '';

  const startReconciliation = () => {
    setReconciling(true);
    setStep(1);
    setShowResults(false);
  };

  useEffect(() => {
    if (!reconciling) return;

    if (step === 1) {
      const t = setTimeout(() => setStep(2), 800);
      return () => clearTimeout(t);
    } else if (step === 2) {
      const t = setTimeout(() => setStep(3), 800);
      return () => clearTimeout(t);
    } else if (step === 3) {
      const t = setTimeout(() => {
        setReconciling(false);
        setShowResults(true);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [step, reconciling]);



  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendPrompt = (text: string) => {
    if (isTyping) return;
    
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const normalizedText = text.toLowerCase();

      // Q1: Risco Financeiro
      if (normalizedText.includes('risco financeiro') || normalizedText.includes('financial risk')) {
        reply = pt 
          ? 'O produto com maior risco financeiro é a **Barra Proteica Coco x12** (ID: 102). Temos **150 caixas** que expiram em **15 dias**, mas a velocidade de venda é muito baixa (8/mês). Perda iminente projetada de **2.250,00 €**.'
          : 'The product with the highest financial risk is the **Protein Bar Coco x12** (ID: 102). We have **150 boxes** expiring in **15 days**, but sales velocity is extremely low (8/month). Projected imminent loss of **2,250.00 €**.';
      }
      // Q2: Campanha L-Carnitina
      else if (normalizedText.includes('l-carnitina') || normalizedText.includes('l-carnitine')) {
        reply = pt 
          ? 'Para a **L-Carnitina Shot 60ml** (ID: 104), temos **240 unidades** em stock com validade de **45 dias**. A velocidade atual escoará apenas 98 unidades. Recomendo criar a campanha **"Combo Treino Verão"** (desconto de 15% acoplado à compra de Whey) para escoar o excedente e reaver **980,00 €**.'
          : 'For the **L-Carnitine Shot 60ml** (ID: 104), we have **240 units** expiring in **45 days**. The current run-rate will clear only 98 units. I suggest launching the **"Summer Workout Combo"** (15% discount bundled with Whey) to clear the overstock and recover **980.00 €**.';
      }
      // Q3: Total em risco
      else if (normalizedText.includes('capital em risco') || normalizedText.includes('total em risco') || normalizedText.includes('capital at risk') || normalizedText.includes('total at risk')) {
        reply = pt 
          ? 'O capital total em risco de quebra devido a expiração de validade nas próximas semanas é de **3.230,00 €** (2.250,00 € nas Barras Proteicas e 980,00 € na L-Carnitina). A aplicação imediata das campanhas sugeridas pode mitigar até 100% deste valor.'
          : 'The total capital at risk due to expiration in the coming weeks is **3,230.00 €** (2,250.00 € on Protein Bars and 980.00 € on L-Carnitine). Immediate launch of the suggested campaigns can mitigate 100% of this loss.';
      }
      // Fallback
      else {
        reply = pt 
          ? `Compreendo a sua dúvida sobre "${text}". Cruzando as Tabelas A e B em tempo real, recomendo concentrar esforços promocionais nas **150 caixas de Barra Proteica Coco** (excedente crítico em 15 dias), pois representam 70% do risco financeiro do inventário atual.`
          : `I understand your question about "${text}". Cross-referencing Tables A and B in real time, I recommend focusing promotional efforts on the **150 boxes of Protein Bar Coco** (critical overstock in 15 days), representing 70% of the total financial risk of the inventory.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 1000);
  };



  return (
    <div className="w-full max-w-5xl mx-auto bg-brand-card rounded-2xl border border-brand-border p-6 box-glow glass flex flex-col gap-6">
      
      {/* Upper Grid: Source Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Table A: Physical Stock */}
        <div className="bg-[#05070D] rounded-xl border border-brand-border p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-3 border-b border-brand-border/60 pb-2">
            <Database className="w-4 h-4 text-brand-accent-soft" />
            <h4 className="text-xs font-semibold font-display text-brand-ink uppercase tracking-wide">
              {pt ? 'Tabela A: Stock Físico (ERP/Inventário)' : 'Table A: Physical Stock (ERP/Inventory)'}
            </h4>
          </div>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-border text-brand-ink-dim font-mono">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">{pt ? 'Produto' : 'Product'}</th>
                  <th className="pb-2 text-right">{pt ? 'Qtd Stock' : 'Stock Qty'}</th>
                  <th className="pb-2 text-right">{pt ? 'Validade (Dias)' : 'Expiry (Days)'}</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item) => (
                  <tr key={item.id} className="border-b border-brand-border/30 text-brand-ink">
                    <td className="py-2 font-mono text-brand-ink-dim">{item.id}</td>
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-right">{item.stock}</td>
                    <td className={`py-2 text-right font-semibold ${
                      item.expiryDays <= 15 ? 'text-brand-risk animate-pulse' : item.expiryDays <= 45 ? 'text-brand-warn' : 'text-brand-ink'
                    }`}>{item.expiryDays} {pt ? 'dias' : 'days'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table B: Sales History */}
        <div className="bg-[#05070D] rounded-xl border border-brand-border p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-3 border-b border-brand-border/60 pb-2">
            <BarChart2 className="w-4 h-4 text-brand-accent-soft" />
            <h4 className="text-xs font-semibold font-display text-brand-ink uppercase tracking-wide">
              {pt ? 'Tabela B: Velocidade de Vendas (POS/Faturação)' : 'Table B: Sales Run-Rate (POS/Billing)'}
            </h4>
          </div>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-border text-brand-ink-dim font-mono">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">{pt ? 'Produto' : 'Product'}</th>
                  <th className="pb-2 text-right">{pt ? 'Vendas (Últ. 30d)' : 'Sales (Last 30d)'}</th>
                  <th className="pb-2 text-right">{pt ? 'Velocidade' : 'Velocity'}</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item) => (
                  <tr key={item.id} className="border-b border-brand-border/30 text-brand-ink">
                    <td className="py-2 font-mono text-brand-ink-dim">{item.id}</td>
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-right">{item.sales30d}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-semibold ${
                        item.velocity === 'Alta' || item.velocity === 'High'
                          ? 'bg-brand-ok/10 text-brand-ok border border-brand-ok/20'
                          : item.velocity === 'Baixa' || item.velocity === 'Low'
                          ? 'bg-brand-risk/10 text-brand-risk border border-brand-risk/20'
                          : 'bg-brand-warn/10 text-brand-warn border border-brand-warn/20'
                      }`}>
                        {item.velocity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lower Row Split: Reconciler Left, Conversational AI Assistant Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 border-t border-brand-border/40 pt-6">
        
        {/* Left Side: Campaign Reconciler */}
        <div className="bg-[#05070D]/40 border border-brand-border/55 rounded-xl p-5 flex flex-col justify-between min-h-[340px]">
          <div>
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase tracking-wider block mb-2 font-semibold">
              {pt ? 'Módulo 1: Reconciliador de Stock & Campanhas' : 'Module 1: Stock Sync & Campaign Manager'}
            </span>

            {!reconciling && !showResults && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-brand-ink-dim select-none h-full">
                <Database className="w-10 h-10 text-brand-border/40 mb-3" />
                <p className="max-w-xs leading-relaxed mb-4">
                  {pt 
                    ? 'Inicie a reconciliação automática para comparar as validades do stock com o POS e detetar ruturas/perdas financeiras.' 
                    : 'Start automated reconciliation to cross-check stock expiry against sales speed and detect margin losses.'}
                </p>
                <button
                  onClick={startReconciliation}
                  className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-6 rounded-xl text-xs transition duration-200 shadow-md shadow-brand-accent/20 uppercase tracking-wide"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {pt ? 'Cruzar Bases de Dados' : 'Reconcile Databases'}
                </button>
              </div>
            )}

            {reconciling && (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4 h-full select-none">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-brand-accent/25 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-brand-accent/35 animate-pulse" />
                  <Database className="w-6 h-6 text-brand-accent-soft relative z-10 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-brand-accent-soft uppercase tracking-wider animate-pulse">{stepMessage}</div>
                  <div className="text-[9px] text-brand-ink-dim font-mono mt-1">
                    {pt ? 'Processamento Proprietário Nuelltech · Passo' : 'Nuelltech Engine Processing · Step'} {step} / 3
                  </div>
                </div>
              </div>
            )}

            {showResults && (
              <div className="animate-fade-in flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-brand-border/30 pb-2">
                    <h5 className="text-[10px] font-mono font-bold text-brand-ink uppercase tracking-wider">
                      {pt ? 'ALERTAS PREDITIVOS GERADOS' : 'PREDICTIVE ALERTS GENERATED'}
                    </h5>
                    <button
                      onClick={startReconciliation}
                      className="flex items-center gap-1.5 text-[9px] font-mono text-brand-accent-soft hover:underline font-bold"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {pt ? 'Recalcular' : 'Recalculate'}
                    </button>
                  </div>

                  {/* Results cards */}
                  <div className="flex flex-col gap-3">
                    {reconciliationResults.map((result) => (
                      <div
                        key={result.id}
                        className={`border rounded-xl p-3 text-[10px] flex flex-col justify-between transition ${
                          result.risk === 'crítico'
                            ? 'bg-brand-risk/5 border-brand-risk/20'
                            : 'bg-brand-warn/5 border-brand-warn/25'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-brand-ink font-mono text-xs">{result.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            result.risk === 'crítico' ? 'bg-brand-risk text-white' : 'bg-brand-warn text-brand-bg'
                          }`}>
                            {pt ? result.risk : result.risk === 'crítico' ? 'Critical' : 'Moderate'}
                          </span>
                        </div>
                        <p className="text-brand-ink-dim leading-relaxed mb-2 font-mono">
                          {pt ? result.reason : result.reasonEn}
                        </p>
                        <div className="border-t border-brand-border/20 pt-2 mt-1.5 flex justify-between items-center">
                          <span className="text-brand-ink font-medium">
                            💡 {pt ? result.action : result.actionEn}
                          </span>
                          <span className={`font-bold font-mono text-xs ${result.risk === 'crítico' ? 'text-brand-risk' : 'text-brand-warn'}`}>
                            +{result.projectedLoss.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-border/20 border border-brand-border/40 p-2.5 rounded-lg text-center text-[10px] text-brand-ink-dim mt-4 leading-relaxed">
                  {pt 
                    ? 'Este motor evitou perdas diretas de 3.230,00 € neste caso real de suplementos.' 
                    : 'This engine prevented direct losses of 3,230.00 € in this live sports supplement catalog.'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Conversational AI Database Analyst */}
        <div className="bg-[#05070D]/40 border border-brand-border/55 rounded-xl p-5 flex flex-col justify-between min-h-[340px] relative">
          
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b border-brand-border/30 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-accent-soft" />
              <span className="text-[10px] font-mono font-bold text-brand-ink uppercase tracking-wider">
                {pt ? 'Módulo 2: Interpretador de Base de Dados' : 'Module 2: Database AI Interpreter'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-soft animate-pulse" />
              <span className="text-[8px] font-mono text-brand-accent-soft uppercase font-bold">Online</span>
            </div>
          </div>

          {/* Chat log messages area */}
          <div className="flex-1 overflow-y-auto max-h-[170px] flex flex-col gap-3 pr-1 text-[10px] font-mono">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex gap-2 p-2.5 rounded-xl ${
                  msg.role === 'assistant' 
                    ? 'bg-[#090D1A] border border-brand-border/40 text-brand-ink' 
                    : 'bg-brand-accent/10 border border-brand-accent/20 text-brand-accent-soft'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-brand-accent-soft" /> : <User className="w-3.5 h-3.5 text-brand-accent-soft" />}
                </div>
                <div className="leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 p-2.5 rounded-xl bg-[#090D1A] border border-brand-border/40 text-brand-ink-dim items-center">
                <Bot className="w-3.5 h-3.5 text-brand-accent-soft animate-bounce" />
                <span className="animate-pulse">{pt ? 'IA a analisar bases de dados...' : 'AI analyzing databases...'}</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions prompts wrapper */}
          <div className="mt-3">
            <span className="text-[8px] font-mono text-brand-ink-dim uppercase block mb-1.5 font-bold">
              {pt ? 'Exemplos de Perguntas Disponíveis:' : 'Examples of Available Questions:'}
            </span>
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => handleSendPrompt(pt ? 'Qual o maior risco financeiro?' : 'What is the highest financial risk?')}
                className="w-full text-left bg-brand-card hover:bg-brand-border/30 border border-brand-border/40 text-brand-ink rounded px-2.5 py-1.5 text-[9px] transition font-medium"
              >
                💬 {pt ? 'Qual o maior risco financeiro no stock?' : 'What is the highest financial risk in stock?'}
              </button>
              <button 
                onClick={() => handleSendPrompt(pt ? 'Sugerir campanha para L-Carnitina' : 'Suggest campaign for L-Carnitine')}
                className="w-full text-left bg-brand-card hover:bg-brand-border/30 border border-brand-border/40 text-brand-ink rounded px-2.5 py-1.5 text-[9px] transition font-medium"
              >
                💬 {pt ? 'Sugerir campanha para a L-Carnitina' : 'Suggest campaign for L-Carnitine'}
              </button>
              <button 
                onClick={() => handleSendPrompt(pt ? 'Qual a faturação em risco total?' : 'What is the total revenue at risk?')}
                className="w-full text-left bg-brand-card hover:bg-brand-border/30 border border-brand-border/40 text-brand-ink rounded px-2.5 py-1.5 text-[9px] transition font-medium"
              >
                💬 {pt ? 'Qual a faturação em risco total de validade?' : 'What is the total revenue at risk of expiry?'}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
