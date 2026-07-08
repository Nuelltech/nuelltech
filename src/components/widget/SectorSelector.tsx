'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Zap, Info, Loader2, X } from 'lucide-react';

interface SectorSelectorProps {
  isPt: boolean;
}

export default function SectorSelector({ isPt }: SectorSelectorProps) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate sector from sessionStorage on mount and ensure hydration safety
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedSector = sessionStorage.getItem('nuell_selected_sector');
      const savedMessages = sessionStorage.getItem('nuell_custom_messages');
      if (savedSector) {
        setSelectedSector(savedSector);
        setInputValue(savedSector);
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            // Wait a brief moment for NuellWidget to register listener, then dispatch
            const timer = setTimeout(() => {
              window.dispatchEvent(new CustomEvent('nuell-sector-customized', {
                detail: { sector: savedSector, messages: parsed }
              }));
            }, 600);
            return () => clearTimeout(timer);
          } catch (e) {
            console.error('Failed to parse saved customization messages:', e);
          }
        }
      }
    }
  }, []);

  // Listen for reset events to display the banner again
  useEffect(() => {
    const handleReset = () => {
      setSelectedSector(null);
      setInputValue('');
    };
    window.addEventListener('nuell-sector-reset', handleReset);
    return () => window.removeEventListener('nuell-sector-reset', handleReset);
  }, []);

  const triggerCustomization = async (sectorName: string) => {
    if (!sectorName.trim()) return;
    const name = sectorName.trim();
    setIsCustomizing(true);

    try {
      const response = await fetch('/api/chat-customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: name, lang: isPt ? 'pt' : 'en' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setSelectedSector(name);
          sessionStorage.setItem('nuell_selected_sector', name);
          sessionStorage.setItem('nuell_custom_messages', JSON.stringify(data.messages));
          window.dispatchEvent(new CustomEvent('nuell-sector-customized', {
            detail: { sector: name, messages: data.messages }
          }));
          window.dispatchEvent(new CustomEvent('nuell-open-chat'));
        }
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Mock customization values locally
      const mockCustom: Record<string, string> = isPt ? {
        hero: `Tem dúvidas sobre a gestão do seu negócio de ${name}? Fale comigo.`,
        problem: `Perdas de margem e stock em ${name} são evitáveis com automação de processos.`,
        ocr: `OCR em ${name}: Extração de faturas de fornecedores e aviso imediato de desvios.`,
        bi: `Com base em ${name}: Cruzamos stock e histórico para evitar desperdício de inventário.`,
        excel: `Migre o seu Excel de ${name} para base de dados. Poupe horas de digitação manual.`,
        api: `Ligamos o seu ERP de ${name} (Sage, Primavera) a Stripe ou modelos de IA via APIs.`,
        rcm: `Otimize custos de receitas e proteja margens no seu negócio de ${name} hoje.`,
        custom: `Precisa de uma ferramenta personalizada de dados para o setor de ${name}?`,
        sobre: `Oracle Retail e sistemas complexos adaptados ao seu contexto de ${name}.`,
        faq: `Quer saber prazos ou como funciona a automação em ${name}?`,
      } : {
        hero: `Have questions about managing your ${name} business? Talk to me.`,
        problem: `Margin and inventory leaks in ${name} are preventable with workflow automation.`,
        ocr: `OCR in ${name}: Supplier invoice extraction and instant discrepancy alerts.`,
        bi: `For ${name}: We cross stock and history to prevent inventory waste.`,
        excel: `Migrate your manual ${name} Excel sheets to secure databases. Save hours of typing.`,
        api: `We connect your ${name} ERP (Sage, Primavera) to Stripe or AI APIs.`,
        rcm: `Optimize recipe costs and protect margins in your ${name} business today.`,
        custom: `Need a custom data or AI tool tailored for ${name}?`,
        sobre: `Oracle Retail systems and complex data tools customized for ${name}.`,
        faq: `Want to know timelines or how automation works in ${name}?`,
      };

      setSelectedSector(name);
      sessionStorage.setItem('nuell_selected_sector', name);
      sessionStorage.setItem('nuell_custom_messages', JSON.stringify(mockCustom));
      window.dispatchEvent(new CustomEvent('nuell-sector-customized', {
        detail: { sector: name, messages: mockCustom }
      }));
      window.dispatchEvent(new CustomEvent('nuell-open-chat'));
    } finally {
      setIsCustomizing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    triggerCustomization(inputValue);
  };

  // Hide floating card if user has already filled it out, or dismissed it, or if not mounted yet (hydration safety)
  if (!isMounted || selectedSector || isDismissed) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-12 relative z-30">
      {/* Deep Violet AI theme container to differentiate from dark blue homepage background */}
      <div className="bg-[#0A071E]/90 border border-[#7C3AED]/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(124,58,237,0.15)] backdrop-blur-md flex flex-col md:flex-row items-center gap-6">
        
        {/* Nuell Avatar Orb (Brain Icon with Green indicator) */}
        <div className="relative w-11 h-11 rounded-full border border-[#7C3AED]/35 bg-[#080516] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Brain className="w-5 h-5 text-[#A78BFA] animate-pulse" />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#0A071E]" />
        </div>

        {/* Action Prompt */}
        <div className="text-left flex-1 min-w-[200px]">
          <span className="text-[8px] font-mono text-[#A78BFA] uppercase font-bold tracking-wider block mb-1">
            {isPt ? 'LIGAR AO CÉREBRO DO NUELL ✨' : 'CONNECT TO NUELL AI BRAIN ✨'}
          </span>
          <p className="text-[10px] text-brand-ink leading-relaxed font-semibold">
            {isPt 
              ? 'O Nuell explica como estes conceitos se aplicam à realidade do seu negócio:' 
              : 'Nuell explains how these concepts apply to your business:'}
          </p>
          <p className="text-[8px] text-brand-ink-dim flex items-center gap-1 mt-1 font-mono">
            <Info className="w-2.5 h-2.5 text-[#A78BFA] flex-shrink-0" />
            <span>
              {isPt 
                ? 'O Nuell irá adaptar a conversa especificamente para o seu negócio.' 
                : 'Nuell will adapt the conversation specifically for your business.'}
            </span>
          </p>
        </div>

        {/* Input Form & Submit */}
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto flex-1 sm:flex-initial">
          <div className="flex flex-col gap-1 flex-1 sm:flex-initial">
            <span className="text-[8px] font-mono text-brand-ink-dim uppercase font-bold tracking-wider">
              {isPt ? 'EM QUE ÁREA DE NEGÓCIO ATUA?' : 'WHAT IS YOUR INDUSTRY?'}
            </span>
            <input
              type="text"
              required
              disabled={isCustomizing}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isPt 
                ? 'Área de negócio (ex: Imobiliária...)' 
                : 'Industry (e.g. Real Estate...)'}
              className="w-full sm:w-60 bg-[#060413] border border-[#7C3AED]/30 rounded-xl px-3 py-2 text-xs text-brand-ink placeholder-brand-ink-dim focus:outline-none focus:border-[#A78BFA] disabled:opacity-50 min-h-[38px]"
            />
          </div>
          
          {/* Submit button: mint colored with Zap icon to match mockup */}
          <button
            type="submit"
            disabled={isCustomizing}
            className="bg-[#3CDDA7] hover:bg-[#2BCFA1] disabled:opacity-50 text-[#07090F] font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-[#3CDDA7]/20 whitespace-nowrap min-h-[38px] cursor-pointer"
          >
            {isCustomizing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-current" />
            )}
            {isPt ? 'Conectar' : 'Connect'}
          </button>
        </form>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#8B92A5] hover:text-[#E7E9EE] transition p-1.5 hover:bg-white/10 rounded-lg flex-shrink-0"
          title={isPt ? 'Fechar' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
