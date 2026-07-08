import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { ArrowRight, Orbit, Compass, Cpu, FileText } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Laboratório R&D · VIUNU — Nuelltech' : 'R&D Laboratory · VIUNU — Nuelltech',
    description: lang === 'pt'
      ? 'Espaço de experimentação e prova de engenharia de integrações complexas de IA.'
      : 'Experimentation space showcasing complex AI integration capabilities.',
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const pt = lang === 'pt';

  return (
    <>
      <Header lang={lang as Locale} dict={dict} />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link href={`/${lang}`} className="text-xs font-mono text-brand-accent-soft hover:underline mb-8 inline-block">
            &larr; {pt ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Page Hero */}
          <div className="border-b border-brand-border/60 pb-8 mb-10">
            <span className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider font-semibold">
              {pt ? 'LABORATÓRIO R&D / PORTFÓLIO' : 'R&D LAB / PORTFOLIO'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              {pt ? 'Laboratório de Engenharia' : 'Engineering Lab'}
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed">
              {pt
                ? 'Espaço dedicado à experimentação de APIs complexas, pesquisa e desenvolvimento (R&D) e provas de conceito que atestam a nossa capacidade técnica fora do âmbito estritamente comercial.'
                : 'A dedicated space for complex API experiments, R&D research, and proof-of-concept setups that demonstrate our advanced technical capability beyond standard commercial flows.'}
            </p>
          </div>

          {/* Positioning disclaimer */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 mb-10 text-[11px] leading-relaxed text-brand-ink-dim">
            <span className="font-semibold text-brand-ink block mb-1">
              {pt ? 'Posicionamento Técnico' : 'Technical Positioning'}
            </span>
            {pt
              ? 'Os projetos aqui listados servem como portfólio de engenharia de integrações do fundador, demonstrando o rigor na manipulação de APIs científicas e a curadoria de prompts avançados, habitualmente valorizados em consultoria para grandes tecnológicas.'
              : 'The projects listed here act as an integration engineering portfolio for the founder, showcasing precision in scientific API handling and advanced prompt engineering curation, typically valued in enterprise tech consulting.'}
          </div>

          {/* VIUNU Project Details */}
          <div className="bg-[#090D1A] border border-brand-border rounded-2xl p-6 mb-12 relative overflow-hidden box-glow glass">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[80px]" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2054C7] to-[#5B9CF7] flex items-center justify-center text-white shadow-md">
                <Orbit className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h3 className="text-md font-bold font-display text-brand-ink">VIUNU</h3>
                <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                  {pt ? 'Prova de Integração Astrónomica + IA' : 'Astronomical API + AI Integration'}
                </span>
              </div>
            </div>

            <div className="text-xs text-brand-ink-dim leading-relaxed flex flex-col gap-4 mb-6">
              <p>
                {pt
                  ? 'O VIUNU é uma ferramenta de cálculo astrológico de alta precisão que se liga diretamente à API de efemérides astronómicas padrão de referência (usada pela NASA) para obter as posições exatas dos planetas em qualquer data e coordenada geográfica.'
                  : 'VIUNU is a high-precision astrological engine that connects directly to the reference standard astronomical ephemeris API (used by NASA) to obtain exact planetary positions for any date and coordinates.'}
              </p>
              <p>
                {pt
                  ? 'Os dados numéricos puros de declinação, latitude e longitude celeste são tratados, estruturados e enviados para interpretação através da API do Claude, utilizando prompts balizados para garantir que o resultado descritivo final é rigoroso e livre de alucinações matemáticas.'
                  : 'The raw numerical celestial data (declination, latitude, and longitude) is processed, structured, and sent to Claude\'s API using strict prompts to guarantee that the descriptive text is rigorous and free of mathematical hallucinations.'}
              </p>
            </div>

            {/* Freemium details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="bg-brand-card/50 border border-brand-border p-4 rounded-xl">
                <Compass className="w-4 h-4 text-brand-accent-soft mb-2" />
                <h4 className="font-bold text-brand-ink mb-1">{pt ? 'Modelo Gratuito' : 'Free Model'}</h4>
                <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Gera um resumo interpretativo simplificado imediato no ecrã.' : 'Generates a simplified interpretative summary instantly on screen.'}</p>
              </div>
              <div className="bg-brand-card/50 border border-brand-border p-4 rounded-xl">
                <FileText className="w-4 h-4 text-brand-accent-soft mb-2" />
                <h4 className="font-bold text-brand-ink mb-1">{pt ? 'Premium (PDF)' : 'Premium (PDF)'}</h4>
                <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Criação de relatório PDF formatado e enviado por email mediante pagamento.' : 'Creates a formatted PDF report emailed directly upon payment confirmation.'}</p>
              </div>
            </div>

            <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center text-[10px]">
              <span className="text-brand-ink-dim">{pt ? 'Tecnologias: Next.js API Routes, NASA Horizons, Claude API' : 'Tech Stack: Next.js API Routes, NASA Horizons, Claude API'}</span>
              <span className="bg-brand-ok/10 border border-brand-ok/20 px-2 py-0.5 rounded text-brand-ok font-semibold font-mono">
                {pt ? 'Live Demo' : 'Live Demo'}
              </span>
            </div>
          </div>

          {/* CTA consultoria */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <Cpu className="w-8 h-8 text-brand-accent-soft mb-4" />
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Precisa de integrar APIs científicas ou complexas?' : 'Need to integrate complex or scientific APIs?'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt
                ? 'Seja para fins comerciais ou de portfólio de I&D, ajudamos a estruturar conexões robustas com APIs externas de grande volume de dados e a ligá-las a LLMs.'
                : 'Whether for commercial or R&D portfolio projects, we help you structure robust connections to large-scale external APIs and connect them to LLMs.'}
            </p>
            <a
              href="https://calendly.com/nuelltech/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-8 rounded-xl text-xs transition duration-150 flex items-center gap-2"
            >
              {dict.custom.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer lang={lang as Locale} dict={dict} />
      <NuellWidget lang={lang as Locale} />
    </>
  );
}
