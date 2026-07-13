'use client';

import React, { useState } from 'react';

interface BetaRequestFormProps {
  lang: string;
}

export default function BetaRequestForm({ lang }: BetaRequestFormProps) {
  const pt = lang === 'pt';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sector: '',
    reps: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert(pt ? 'Por favor, preencha o Nome, E-mail e Contacto.' : 'Please fill in Name, Email, and Phone.');
      return;
    }

    setStatus('loading');

    try {
      const sessionId = 'form_beta_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      
      const payload = {
        sessionId,
        leadInfo: {
          name: formData.name,
          contact: `${formData.email} / ${formData.phone}`,
          sector: formData.sector || 'Não indicado',
          challenge: `Solicitação de Beta Fechada (Nº Vendedores: ${formData.reps || 'Não indicado'})`
        },
        messages: [
          { sender: 'system', text: `Candidatura à Beta Fechada do Simulador de Vendas por Voz enviada pelo utilizador.` }
        ],
        metadata: {
          device: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'Mobile' : 'Desktop') : 'Unknown',
          referrer: typeof document !== 'undefined' ? document.referrer : 'Direct',
          visitedSections: 'simulador-vendas',
          language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
          utmSource: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || '' : '',
          utmMedium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || '' : '',
          utmCampaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || '' : ''
        }
      };

      let resOk = true;
      const isExcluded = typeof window !== 'undefined' && localStorage.getItem('nuell_exclude_analytics') === 'true';

      if (!isExcluded) {
        const res = await fetch('/api/log-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        resOk = res.ok;
      } else {
        console.log('[Nuelltech Analytics] Simulação de envio da candidatura à Beta Fechada concluída (envio real omitido pelo filtro de exclusão).');
      }

      if (resOk) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#101F1C] border border-brand-ok/20 rounded-xl p-6 text-center text-brand-ink">
        <h4 className="font-bold text-sm text-brand-ok mb-2">
          {pt ? 'Candidatura Enviada!' : 'Application Submitted!'}
        </h4>
        <p className="text-xs text-brand-ink-dim leading-relaxed">
          {pt 
            ? 'Obrigado pelo seu interesse. A equipa da Nuelltech entrará em contacto assim que houver vagas disponíveis na beta fechada.'
            : 'Thank you for your interest. The Nuelltech team will contact you as soon as slots open up in the closed beta.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto grid grid-cols-1 gap-4 text-xs">
      <div>
        <label className="block text-[9px] font-mono text-brand-ink-dim uppercase mb-1">{pt ? 'Nome Completo' : 'Full Name'}</label>
        <input 
          type="text" 
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-brand-ink focus:outline-none focus:border-brand-accent-soft" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-mono text-brand-ink-dim uppercase mb-1">{pt ? 'E-mail Comercial' : 'Business Email'}</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-brand-ink focus:outline-none focus:border-brand-accent-soft" 
          />
        </div>
        <div>
          <label className="block text-[9px] font-mono text-brand-ink-dim uppercase mb-1">{pt ? 'Contacto Telefónico' : 'Phone Number'}</label>
          <input 
            type="text" 
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-brand-ink focus:outline-none focus:border-brand-accent-soft" 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-mono text-brand-ink-dim uppercase mb-1">{pt ? 'Setor do Negócio' : 'Business Sector'}</label>
          <input 
            type="text" 
            placeholder="Ex: Imobiliário" 
            value={formData.sector}
            onChange={e => setFormData({ ...formData, sector: e.target.value })}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-brand-ink focus:outline-none focus:border-brand-accent-soft" 
          />
        </div>
        <div>
          <label className="block text-[9px] font-mono text-brand-ink-dim uppercase mb-1">{pt ? 'Nº de Vendedores' : 'Number of Reps'}</label>
          <input 
            type="number" 
            placeholder="Ex: 5" 
            value={formData.reps}
            onChange={e => setFormData({ ...formData, reps: e.target.value })}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-brand-ink focus:outline-none focus:border-brand-accent-soft" 
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="mt-2 w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2.5 px-4 rounded-lg transition disabled:opacity-50"
      >
        {status === 'loading' ? (pt ? 'A enviar...' : 'Sending...') : (pt ? 'Enviar Candidatura de Acesso' : 'Send Access Request')}
      </button>
      {status === 'error' && (
        <p className="text-[10px] text-red-400 text-center mt-1">
          {pt ? 'Erro ao enviar. Por favor, tente novamente.' : 'Error sending. Please try again.'}
        </p>
      )}
    </form>
  );
}
