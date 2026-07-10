'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Zap, Loader2, X } from 'lucide-react';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // Track the selected sector in the database session
    try {
      const sessionId = localStorage.getItem('nuell_session_id');
      if (sessionId) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, type: 'sector', sector: name }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Analytics sector tracking failed:', err);
    }

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
        api: `Ligamos o seu ERP e software de faturação de ${name} a Stripe ou modelos de IA via APIs.`,
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
        api: `We connect your ${name} ERP and POS software to Stripe or AI APIs.`,
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-12 relative z-30">
      {/* Deep Violet AI theme container */}
      <div className="bg-[#0A071E]/95 border-2 border-[#7C3AED]/50 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(124,58,237,0.25)] backdrop-blur-md relative flex flex-col gap-6">
        
        {/* Close Button - Positioned absolutely so it doesn't disrupt the flow */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 text-[#8B92A5] hover:text-[#E7E9EE] transition p-1.5 hover:bg-white/10 rounded-full cursor-pointer"
          title={isPt ? 'Fechar' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Content Row: Mascot + Hook Text */}
        <div className="flex items-start sm:items-center gap-4 text-left pr-6">
          {/* Stylized Nuell Mascot Orb */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#7C3AED] bg-[#0E0B25] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7C3AED]/20 animate-pulse">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-[#A78BFA]" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#0A071E]" />
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black text-brand-ink leading-tight tracking-tight">
              {isPt ? 'Qual é a sua área de negócio?' : 'What is your business area?'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-dim mt-1.5 leading-relaxed max-w-2xl font-medium">
              {isPt 
                ? 'Veja como aplicar Inteligência Artificial e automatizar processos na sua realidade.' 
                : 'See how to apply Artificial Intelligence and automate processes in your reality.'}
            </p>
          </div>
        </div>

        {/* Input Form & Submit */}
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 w-full border-t border-[#7C3AED]/20 pt-5">
          <input
            type="text"
            required
            disabled={isCustomizing}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isPt 
              ? 'Área de negócio (ex: Imobiliária, Clínica, Restauração...)' 
              : 'Industry (e.g. Real Estate, Clinic, Restaurant...)'}
            className="flex-1 bg-[#060413] border border-[#7C3AED]/40 rounded-xl px-4 py-3 text-sm text-brand-ink placeholder-brand-ink-dim/80 focus:outline-none focus:border-[#A78BFA] focus:ring-1 focus:ring-[#A78BFA] disabled:opacity-50 min-h-[46px]"
          />
          
          <button
            type="submit"
            disabled={isCustomizing}
            className="bg-[#3CDDA7] hover:bg-[#2BCFA1] disabled:opacity-50 text-[#07090F] font-extrabold px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#3CDDA7]/20 whitespace-nowrap min-h-[46px] cursor-pointer"
          >
            {isCustomizing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-current" />
            )}
            {isPt ? 'Conectar' : 'Connect'}
          </button>
        </form>

      </div>
    </div>
  );
}
