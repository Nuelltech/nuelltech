'use client';

import React from 'react';
import { X } from 'lucide-react';
import BiReconciliation from './BiReconciliation';

interface BiModalProps {
  isOpen: boolean;
  onClose: () => void;
  pt: boolean;
}

export default function BiModal({ isOpen, onClose, pt }: BiModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-[#04060C] border border-brand-border/60 rounded-2xl w-full max-w-5xl h-[85vh] max-h-[750px] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border/60 bg-[#090D1A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-soft animate-pulse" />
            <h2 className="text-sm font-mono font-bold text-brand-ink uppercase tracking-wider">
              {pt ? 'Predictive Analytics Hub · Sandbox BI' : 'Predictive Analytics Hub · BI Sandbox'}
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
        <div className="flex-1 p-6 overflow-y-auto bg-[#04060C] flex flex-col justify-between">
          <div className="max-w-3xl mx-auto w-full mb-6 text-center lg:text-left">
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase tracking-wider bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded font-semibold inline-block">
              {pt ? 'Simulador de Inventário' : 'Inventory Simulation'}
            </span>
            <h3 className="text-lg font-bold font-display text-brand-ink mt-2 mb-1.5">
              {pt ? 'Previsão de Excedente e Ações Promocionais' : 'Wastage Prediction & Promotional Actions'}
            </h3>
            <p className="text-xs text-brand-ink-dim leading-relaxed">
              {pt
                ? 'Simule o cruzamento da base de dados de stock físico contra a velocidade de escoamento real de vendas para identificar e escoar produtos em risco de validade antes que gerem perdas de margem.'
                : 'Simulate merging physical inventory records with actual sales velocity to identify and clear high-risk expiration stock before margin loss occurs.'}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-4xl">
              <BiReconciliation pt={pt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
