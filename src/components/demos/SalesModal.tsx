'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Lock } from 'lucide-react';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pt: boolean;
}

export default function SalesModal({ isOpen, onClose, pt }: SalesModalProps) {
  const [formData, setFormData] = useState({ name: '', company: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.company && formData.email) {
      setSubmitted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-[#04060C] border border-brand-border/60 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border/60 bg-[#090D1A]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-risk" />
            <h2 className="text-sm font-mono font-bold text-brand-ink uppercase tracking-wider">
              {pt ? 'Sales Simulator · Acesso Fechado' : 'Sales Simulator · Closed Beta'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-ink-dim hover:text-brand-ink transition p-1 hover:bg-brand-border/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="p-6 bg-[#04060C] flex flex-col items-center text-center">
          
          <div className="w-12 h-12 rounded-full bg-brand-risk/10 border border-brand-risk/20 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-brand-risk" />
          </div>

          <h3 className="text-xl font-bold font-display text-brand-ink mb-2">
            {pt ? 'Simulador de Vendas Inteligente' : 'Intelligent Sales Agent Trainer'}
          </h3>

          <p className="text-xs text-brand-ink-dim leading-relaxed mb-6 max-w-sm">
            {pt 
              ? 'O nosso simulador de voz interativo com IA (ElevenLabs + Claude 3.5) está em fase de acesso restrito (Closed Beta) para empresas selecionadas.'
              : 'Our interactive voice simulation trainer (ElevenLabs + Claude 3.5) is currently in closed beta access for selected enterprise clients.'}
          </p>

          {submitted ? (
            <div className="bg-brand-card border border-brand-ok/40 p-6 rounded-xl w-full flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-ok/10 flex items-center justify-center text-brand-ok">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-brand-ink">
                {pt ? 'Pedido Recebido com Sucesso!' : 'Request Successfully Received!'}
              </p>
              <p className="text-[10px] text-brand-ink-dim leading-relaxed">
                {pt 
                  ? 'A nossa equipa técnica entrará em contacto nas próximas 24 horas para agendar a sua demonstração de voz e analisar o seu portfólio de produtos.'
                  : 'Our technical team will reach out within the next 24 hours to schedule your voice demo and analyze your product catalog.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left font-sans text-xs">
              <div>
                <label className="block text-[10px] font-mono text-brand-ink-dim uppercase tracking-wider mb-1.5 font-bold">
                  {pt ? 'Nome Completo' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={pt ? 'Ex: Carlos Silva' : 'e.g. John Doe'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#090D1A] border border-brand-border rounded-lg px-3.5 py-2.5 text-brand-ink focus:outline-none focus:border-brand-accent/65"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-brand-ink-dim uppercase tracking-wider mb-1.5 font-bold">
                  {pt ? 'Empresa' : 'Company'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={pt ? 'Ex: LogiClean Lda' : 'e.g. Acme Corp'}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#090D1A] border border-brand-border rounded-lg px-3.5 py-2.5 text-brand-ink focus:outline-none focus:border-brand-accent/65"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-brand-ink-dim uppercase tracking-wider mb-1.5 font-bold">
                  {pt ? 'E-mail Corporativo' : 'Corporate Email'}
                </label>
                <input 
                  type="email" 
                  required
                  placeholder={pt ? 'Ex: carlos.silva@empresa.com' : 'e.g. john@company.com'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#090D1A] border border-brand-border rounded-lg px-3.5 py-2.5 text-brand-ink focus:outline-none focus:border-brand-accent/65"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs transition duration-150 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-2 uppercase tracking-wide mt-2"
              >
                {pt ? 'Pedir Acesso ao Simulador' : 'Request Simulator Access'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
