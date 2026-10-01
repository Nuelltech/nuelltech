'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowUp,
  Brain,
  Sparkles,
  FileSpreadsheet,
  FileText,
  TrendingDown,
  Layers,
  Loader2,
  ChevronDown,
  Mic,
} from 'lucide-react';

interface HeroAiChatProps {
  isPt: boolean;
}

export default function HeroAiChat({ isPt }: HeroAiChatProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'deep' | 'fast'>('deep');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Core business pain points that AI solves (Direct & actionable)
  const quickActions = isPt
    ? [
        {
          icon: <FileText className="w-4 h-4 text-cyan-400" />,
          title: 'Auditar faturas e fornecedores (OCR)',
          desc: 'Detetar aumentos de preço e erros de faturação automaticamente',
          promptText: 'Quero automatizar a leitura de faturas PDF de fornecedores e detetar aumentos de preços ou erros de valores.',
        },
        {
          icon: <TrendingDown className="w-4 h-4 text-emerald-400" />,
          title: 'Prever stock e evitar perdas',
          desc: 'Cruzar histórico de vendas com inventário para evitar ruturas e prazos de validade',
          promptText: 'Como posso usar IA para cruzar o histórico de vendas com o stock atual e prever compras sem desperdício?',
        },
        {
          icon: <FileSpreadsheet className="w-4 h-4 text-amber-400" />,
          title: 'Eliminar tarefas manuais em Excel',
          desc: 'Substituir horas de copy-paste entre ERPs e folhas de cálculo',
          promptText: 'A minha equipa perde horas a passar dados entre folhas de Excel e o software de faturação. Como automatizar?',
        },
        {
          icon: <Layers className="w-4 h-4 text-purple-400" />,
          title: 'Automatizar leads e agendamentos',
          desc: 'Atendimento inteligente 24/7 que qualifica clientes e marca reuniões',
          promptText: 'Quero um agente de IA para qualificar pedidos de clientes e agendar reuniões/serviços automaticamente.',
        },
      ]
    : [
        {
          icon: <FileText className="w-4 h-4 text-cyan-400" />,
          title: 'Audit supplier invoices (OCR)',
          desc: 'Catch price hikes and billing errors automatically',
          promptText: 'I want to automate reading supplier PDF invoices and detect price discrepancies or billing errors.',
        },
        {
          icon: <TrendingDown className="w-4 h-4 text-emerald-400" />,
          title: 'Forecast inventory & prevent waste',
          desc: 'Reconcile sales history with stock to prevent stockouts and expiry loss',
          promptText: 'How can we use AI to reconcile sales history with current stock and predict purchasing needs accurately?',
        },
        {
          icon: <FileSpreadsheet className="w-4 h-4 text-amber-400" />,
          title: 'Eliminate manual Excel copy-paste',
          desc: 'Replace hours of manual data entry between ERPs and spreadsheets',
          promptText: 'Our team spends hours copying data between Excel sheets and our ERP. How can we automate this workflow?',
        },
        {
          icon: <Layers className="w-4 h-4 text-purple-400" />,
          title: 'Automate lead qualification & bookings',
          desc: '24/7 intelligent agent that pre-qualifies prospects and schedules meetings',
          promptText: 'I need an AI agent to handle initial client inquiries, qualify them, and schedule appointments automatically.',
        },
      ];

  const handleSubmitPrompt = async (inputText: string) => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);

    // Track analytics
    try {
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('nuell_session_id') : null;
      const isExcluded = typeof window !== 'undefined' && localStorage.getItem('nuell_exclude_analytics') === 'true';
      if (sessionId && !isExcluded) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, type: 'hero_llm_prompt', prompt: text }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Analytics tracking error:', err);
    }

    try {
      const response = await fetch('/api/chat-customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: text, lang: isPt ? 'pt' : 'en' }),
      });

      if (response.ok) {
        const data = await response.json();
        const shortSector = text.split(' ').slice(0, 4).join(' ');

        sessionStorage.setItem('nuell_selected_sector', shortSector);
        if (data.messages) {
          sessionStorage.setItem('nuell_custom_messages', JSON.stringify(data.messages));
        }

        window.dispatchEvent(
          new CustomEvent('nuell-sector-customized', {
            detail: {
              sector: shortSector,
              challenge: text,
              messages: data.messages,
              initialUserPrompt: text,
            },
          })
        );
        window.dispatchEvent(new CustomEvent('nuell-open-chat'));
      } else {
        throw new Error('API failed');
      }
    } catch {
      const shortSector = text.split(' ').slice(0, 4).join(' ');
      window.dispatchEvent(
        new CustomEvent('nuell-sector-customized', {
          detail: {
            sector: shortSector,
            challenge: text,
            initialUserPrompt: text,
          },
        })
      );
      window.dispatchEvent(new CustomEvent('nuell-open-chat'));
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPrompt(prompt);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center mt-2 z-20">
      {/* ========================================================================= */}
      {/* 1. NATIVE LLM INPUT BOX (Exact modern ChatGPT / Claude / Gemini aesthetic) */}
      {/* ========================================================================= */}
      <div className="w-full rounded-[28px] bg-[#141721]/95 border border-white/15 hover:border-white/25 focus-within:border-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-500/10 shadow-2xl backdrop-blur-xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px] transition-all duration-200 group">
        
        {/* Top Textarea Area */}
        <div className="w-full">
          <textarea
            ref={textareaRef}
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              isPt
                ? 'Descreva o problema que gostava de resolver na sua empresa...'
                : 'Describe the problem you would like to solve in your business...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400/80 resize-none focus:outline-none leading-relaxed font-sans"
          />
        </div>

        {/* Bottom Toolbar Row (Exactly like Claude/ChatGPT/Gemini) */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/[0.06] text-xs">
          
          {/* Left Controls: Model Tag */}
          <div className="flex items-center gap-2">
            {/* Model Pill Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-white">NUELL</span>
              <span className="text-cyan-400 font-medium">Business AI</span>
            </div>
          </div>

          {/* Right Controls: Reasoning mode + Mic + Send Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveEngine(activeEngine === 'deep' ? 'fast' : 'deep')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition cursor-pointer ${
                activeEngine === 'deep'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title="Modo de análise aprofundada de processos"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isPt ? 'Diagnóstico IA' : 'AI Diagnostic'}</span>
            </button>

            {/* Submit Arrow Button */}
            <button
              type="button"
              onClick={() => handleSubmitPrompt(prompt)}
              disabled={!prompt.trim() || isLoading}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                prompt.trim() && !isLoading
                  ? 'bg-white text-black hover:bg-slate-200 active:scale-95 cursor-pointer shadow-white/20'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              }`}
              title={isPt ? 'Enviar mensagem' : 'Send message'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE 4 CORE PROBLEMS AI SOLVES (Clear, Actionable, Clean List)          */}
      {/* ========================================================================= */}
      <div className="w-full mt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            {isPt ? 'O que a IA resolve na sua empresa:' : 'What AI solves in your business:'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(action.promptText);
                handleSubmitPrompt(action.promptText);
              }}
              disabled={isLoading}
              className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#11141E]/80 hover:bg-[#181C2B] border border-white/[0.08] hover:border-cyan-500/30 text-left transition-all duration-150 group active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-[13px] font-bold text-white group-hover:text-cyan-300 transition truncate">
                  {action.title}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  {action.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
