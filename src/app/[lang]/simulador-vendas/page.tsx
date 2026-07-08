import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { Lock, ShieldAlert, Award, Star, Volume2, Sparkles, MessageSquare } from 'lucide-react';
import BetaRequestForm from '@/components/forms/BetaRequestForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Simulador de Vendas por Voz — Nuelltech' : 'Voice Sales Simulator — Nuelltech',
    description: lang === 'pt'
      ? 'Treino comportamental por voz com inteligência artificial para equipas comerciais.'
      : 'AI voice-based behavioral training for sales teams.',
  };
}

export default async function SalesSimulatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const pt = lang === 'pt';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Simulador de Vendas por Voz / AI Sales Trainer',
    'operatingSystem': 'Cloud / Web-based',
    'applicationCategory': 'BusinessApplication',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'EUR',
      'price': '0',
      'description': 'Closed Beta access - Pricing determined on request',
    },
  };

  const verticals = pt ? [
    { name: 'Ramo Automóvel', desc: 'Lidar com objeções de preço, negociação de extras e prazos de entrega.' },
    { name: 'Ramo Imobiliário', desc: 'Simulação de angariação em exclusivo, negociação de comissões e fecho de propostas.' },
    { name: 'Propaganda Médica', desc: 'Treino de discurso rápido (elevator pitch) com médicos ocupados ou diretores clínicos.' }
  ] : [
    { name: 'Automotive Sector', desc: 'Handling price objections, optional package negotiations, and delivery terms.' },
    { name: 'Real Estate Sector', desc: 'Simulating exclusive listings, commission negotiations, and proposal closings.' },
    { name: 'Medical / Pharma Representatives', desc: 'Fast elevator pitch training tailored for busy physicians or clinical directors.' }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Header lang={lang as Locale} dict={dict} />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link href={`/${lang}`} className="text-xs font-mono text-brand-accent-soft hover:underline mb-8 inline-block">
            &larr; {pt ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Page Hero */}
          <div className="border-b border-brand-border/60 pb-8 mb-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-brand-warn uppercase tracking-wider bg-brand-warn/10 border border-brand-warn/25 px-2.5 py-0.5 rounded font-semibold flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {pt ? 'BETA FECHADA / ACESSO RESTRITO' : 'CLOSED BETA / RESTRICTED ACCESS'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-3 mb-4">
              Simulador de Vendas por Voz
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed max-w-2xl">
              {pt
                ? 'Treine a sua equipa comercial em cenários de negociação realistas e desconfortáveis. O nosso simulador usa inteligência artificial por voz para interpretar objeções, responder com tom realista e pontuar o desempenho da venda.'
                : 'Train your sales team in realistic, uncomfortable negotiation scenarios. Our simulator uses conversational voice AI to interpret objections, respond with a realistic client profile, and grade sales performance.'}
            </p>
          </div>

          {/* Interactive UI Mockup (Waveform & Scorecard) */}
          <div className="bg-[#05070D] border border-brand-border rounded-xl p-6 mb-12 box-glow">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-3 mb-5 text-[10px] font-mono text-brand-ink-dim">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-brand-accent-soft" />
                {pt ? 'Simulação de Chamada Ativa' : 'Active Call Simulation'}
              </span>
              <span className="bg-brand-risk/10 px-2 py-0.5 rounded text-brand-risk font-semibold">
                REC 02:45
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
              {/* Waveform graphic & dialogue */}
              <div className="flex flex-col justify-between h-[200px] bg-brand-card/30 border border-brand-border/50 rounded-lg p-4">
                <div>
                  <div className="text-[8px] font-mono text-brand-accent-soft uppercase">
                    {pt ? 'Perfil: Cliente Cético (Imobiliário)' : 'Profile: Skeptical Client (Real Estate)'}
                  </div>
                  <p className="text-[11px] text-brand-ink mt-2 leading-relaxed">
                    &ldquo;{pt 
                      ? 'Não percebo porque devo assinar um contrato em exclusivo convosco. A outra agência faz o mesmo sem exclusividade e cobra menos comissão.' 
                      : 'I don\'t understand why I should sign an exclusive contract with you. The other agency does the same without exclusivity and charges less commission.'}&rdquo;
                  </p>
                </div>

                {/* Animated Waveform representation */}
                <div className="flex items-center gap-1 h-8 justify-center my-3">
                  <span className="w-1 h-3 bg-brand-accent rounded animate-pulse" />
                  <span className="w-1 h-6 bg-brand-accent rounded animate-pulse" style={{ animationDelay: '100ms' }} />
                  <span className="w-1 h-4 bg-brand-accent rounded animate-pulse" style={{ animationDelay: '200ms' }} />
                  <span className="w-1 h-8 bg-brand-accent-soft rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-5 bg-brand-accent rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                  <span className="w-1 h-2 bg-brand-accent-soft rounded animate-pulse" />
                  <span className="w-1 h-6 bg-brand-accent rounded animate-pulse" style={{ animationDelay: '250ms' }} />
                  <span className="w-1 h-3 bg-brand-accent rounded" />
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-brand-ink-dim">
                  <span>ElevenLabs Multilingual V2</span>
                  <span>Claude 3.5 Sonnet Response</span>
                </div>
              </div>

              {/* Performance Scorecard */}
              <div className="bg-brand-card border border-brand-border rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[9px] font-mono text-brand-ok uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {pt ? 'Avaliação Parcial' : 'Current Grade'}
                  </h4>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-brand-ink font-mono text-glow">84</span>
                    <span className="text-brand-ink-dim text-[10px]">/ 100</span>
                  </div>

                  <div className="flex flex-col gap-2 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-brand-ink-dim">{pt ? 'Abertura & Empatia' : 'Opening & Empathy'}</span>
                      <span className="font-semibold text-brand-ok">90%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-ink-dim">{pt ? 'Contorno de Objeções' : 'Handling Objections'}</span>
                      <span className="font-semibold text-brand-warn">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-ink-dim">{pt ? 'Persuasão Comercial' : 'Commercial Persuasion'}</span>
                      <span className="font-semibold text-brand-ok">85%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-brand-border/40 pt-2 text-[9px] text-brand-ink-dim mt-3">
                  <span className="text-brand-warn font-semibold block mb-0.5">
                    {pt ? 'Ponto de Melhoria:' : 'Area for Improvement:'}
                  </span>
                  {pt 
                    ? 'Evitar interromper o cliente quando este apresenta a objeção de comissão. Deixe-o concluir antes de contra-argumentar.'
                    : 'Avoid interrupting the client when they raise the commission objection. Let them finish before presenting counterarguments.'}
                </div>
              </div>
            </div>
          </div>

          {/* Technical specification details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-lg font-bold font-display text-brand-ink mb-4">
                {pt ? 'Especificações da Tecnologia' : 'Technology Stack'}
              </h2>
              <div className="flex flex-col gap-4 text-xs text-brand-ink-dim leading-relaxed">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-4.5 h-4.5 text-brand-accent-soft mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-ink mb-1">{pt ? 'Conversação Realista por Voz' : 'Realistic Voice Conversation'}</h4>
                    <p>{pt ? 'Linguagem baseada em ElevenLabs (Voz para Texto e Texto para Voz) e Claude (LLM) que simula o ritmo, interrupções e tom de voz de um cliente real.' : 'Powered by ElevenLabs (Voice-to-Text and Text-to-Voice) and Claude (LLM), simulating the cadence, interruptions, and tone of a real buyer.'}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <MessageSquare className="w-4.5 h-4.5 text-brand-accent-soft mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-ink mb-1">{pt ? 'Perfis de Personalidade' : 'Personality Profiles'}</h4>
                    <p>{pt ? 'Treine com clientes agressivos, céticos, informados ou ocupados. Cada perfil reage de forma distinta às táticas de persuasão.' : 'Train with aggressive, skeptical, highly-informed, or extremely busy clients. Each profile responds differently to persuasion tactics.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold font-display text-brand-ink mb-4">
                {pt ? 'Verticais de Venda Disponíveis' : 'Available Verticals'}
              </h2>
              <div className="flex flex-col gap-3 text-xs">
                {verticals.map((vert, idx) => (
                  <div key={idx} className="bg-brand-card border border-brand-border p-4 rounded-xl">
                    <h4 className="font-bold text-brand-ink flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-brand-warn fill-current" />
                      {vert.name}
                    </h4>
                    <p className="text-[10px] text-brand-ink-dim mt-1 leading-relaxed">{vert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Capture Form for Beta request */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl glass">
            <div className="text-center mb-6 flex flex-col items-center">
              <ShieldAlert className="w-8 h-8 text-brand-accent-soft mb-2" />
              <h3 className="text-md font-bold font-display text-brand-ink">
                {pt ? 'Solicitar Acesso à Beta Fechada' : 'Request Access to Closed Beta'}
              </h3>
              <p className="text-xs text-brand-ink-dim max-w-sm leading-relaxed mt-1">
                {pt
                  ? 'O simulador encontra-se atualmente em fase de testes privados locais. Preencha o formulário para se candidatar à lista de espera.'
                  : 'The simulator is currently in private local testing. Fill out the form to apply for the waiting list.'}
              </p>
            </div>

            <BetaRequestForm lang={lang} />
          </div>
        </div>
      </main>

      <Footer lang={lang as Locale} dict={dict} />
      <NuellWidget lang={lang as Locale} />
    </>
  );
}
