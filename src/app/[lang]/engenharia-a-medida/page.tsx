import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { ArrowRight, Cpu, Layers, GitCompare, ChevronRight, MessageSquareCode } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Engenharia de Dados à Medida — Nuelltech' : 'Custom Data Engineering — Nuelltech',
    description: lang === 'pt'
      ? 'Construímos soluções exclusivas de integração de dados e automação de processos para PMEs.'
      : 'We build custom data integration and process automation solutions for SMEs.',
  };
}

export default async function CustomEngineeringPage({
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
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href={`/${lang}`} className="text-xs font-mono text-brand-accent-soft hover:underline mb-8 inline-block">
            &larr; {pt ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Page Hero */}
          <div className="border-b border-brand-border/60 pb-8 mb-10">
            <span className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider font-semibold">
              {pt ? 'SOLUÇÕES EXCLUSIVAS' : 'CUSTOM SOLUTIONS'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              {pt ? 'Engenharia à Medida' : 'Custom Engineering'}
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed max-w-2xl">
              {pt
                ? 'Quando as ferramentas prontas de mercado não resolvem os seus problemas de dados ou processos manuais, criamos soluções à medida. Desde a ligação de bases de dados incompatíveis até à automatização de fluxos de decisão complexos com Inteligência Artificial.'
                : 'When off-the-shelf market tools don\'t solve your data issues or manual process pains, we build to measure. From connecting incompatible databases to automating complex decision-making workflows using Artificial Intelligence.'}
            </p>
          </div>

          {/* Core pillars of custom engineering */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <GitCompare className="w-5 h-5 text-brand-accent-soft mb-3" />
              <h4 className="font-bold text-brand-ink text-xs mb-1.5">{pt ? 'Integração de APIs' : 'API Integrations'}</h4>
              <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Ligamos o seu ERP, POS e CRM a motores inteligentes de processamento de dados.' : 'We connect your ERP, POS, and CRM to smart data processing engines.'}</p>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <Layers className="w-5 h-5 text-brand-accent-soft mb-3" />
              <h4 className="font-bold text-brand-ink text-xs mb-1.5">{pt ? 'Bases de Dados' : 'Database Merging'}</h4>
              <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Reconciliamos fontes de dados incompatíveis para prever e otimizar stocks.' : 'We reconcile incompatible data sources to predict and optimize stock.'}</p>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <Cpu className="w-5 h-5 text-brand-accent-soft mb-3" />
              <h4 className="font-bold text-brand-ink text-xs mb-1.5">{pt ? 'Agentes Inteligentes' : 'Intelligent Agents'}</h4>
              <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Desenvolvemos assistentes de IA treinados com a base de conhecimento específica da empresa.' : 'We develop custom AI assistants trained on your specific business knowledge base.'}</p>
            </div>
          </div>

          {/* Cases Grid */}
          <div className="mb-16">
            <h2 className="text-lg font-bold font-display text-brand-ink mb-6">
              {pt ? 'Estudos de Caso Reais' : 'Real-world Case Studies'}
            </h2>
            <div className="flex flex-col gap-6">
              {/* Case 1 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-accent/30 transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                      {pt ? 'Estudo de Caso · Farmácia' : 'Case Study · Pharmacy'}
                    </span>
                    <h3 className="text-sm font-bold font-display text-brand-ink mt-1.5 mb-2">
                      BI Pharma
                    </h3>
                    <p className="text-xs text-brand-ink-dim leading-relaxed max-w-2xl mb-4">
                      {pt
                        ? 'Cruzamento de tabelas de vendas homólogas com datas de validade de stock físico para identificar perdas potenciais de produtos e antecipar campanhas promocionais.'
                        : 'Cross-referencing historical sales tables with physical stock expiration dates to identify potential product losses and automate promo campaigns.'}
                    </p>
                    <Link
                      href={`/${lang}/engenharia-a-medida/bi-pharma`}
                      className="text-[10px] font-mono font-semibold text-brand-accent-soft hover:underline flex items-center gap-1"
                    >
                      {pt ? 'Ler Estudo de Caso Completo' : 'Read Full Case Study'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Case 2 */}
              <div className="bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-accent/30 transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-semibold">
                      {pt ? 'Estudo de Caso · Distribuição Alimentar' : 'Case Study · Food Distribution'}
                    </span>
                    <h3 className="text-sm font-bold font-display text-brand-ink mt-1.5 mb-2">
                      Plataforma de Logística
                    </h3>
                    <p className="text-xs text-brand-ink-dim leading-relaxed max-w-2xl mb-4">
                      {pt
                        ? 'Transição de folhas manuais Google Sheets para uma plataforma web segura multi-utilizador, com permissões dedicadas de admin/funcionário.'
                        : 'Transitioning manual Google Sheets workflows to a secure, multi-user web platform featuring dedicated admin and driver roles.'}
                    </p>
                    <Link
                      href={`/${lang}/engenharia-a-medida/logistica`}
                      className="text-[10px] font-mono font-semibold text-brand-accent-soft hover:underline flex items-center gap-1"
                    >
                      {pt ? 'Ler Estudo de Caso Completo' : 'Read Full Case Study'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Custom */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <MessageSquareCode className="w-8 h-8 text-brand-accent-soft mb-4" />
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Tem um desafio específico no seu negócio?' : 'Have a specific business challenge?'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt
                ? 'Agende um diagnóstico gratuito. Analisamos a arquitetura de sistemas atual da sua empresa e indicamos a viabilidade de integração.'
                : 'Schedule a free diagnosis. We analyze your company\'s current systems architecture and map out the integration feasibility.'}
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
