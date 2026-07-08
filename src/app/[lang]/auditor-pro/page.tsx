import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import AuditorCalculator from '@/components/demos/AuditorCalculator';
import NuellWidget from '@/components/widget/NuellWidget';
import { ArrowRight, Landmark, Scale, ShieldAlert } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Auditor Pro · Simulação Financeira — Nuelltech' : 'Auditor Pro · Financial Simulation — Nuelltech',
    description: lang === 'pt'
      ? 'Calcule o rendimento real do seu restaurante e simule o impacto de aumentos de custos.'
      : 'Calculate your restaurant real profit and simulate the impact of cost increases.',
  };
}

export default async function AuditorProPage({
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
    'name': 'Auditor Pro',
    'operatingSystem': 'Cloud / Web-based',
    'applicationCategory': 'BusinessApplication',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'EUR',
      'price': '0',
      'description': 'Pricing determined after free business diagnosis session',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
              {pt ? 'SIMULADOR FINANCEIRO' : 'FINANCIAL SIMULATOR'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              Auditor Pro
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed max-w-2xl">
              {pt
                ? 'Evite surpresas no fecho do mês. O Auditor Pro ajuda PMEs da restauração a calcular a rentabilidade real do negócio instantaneamente e a simular cenários futuros — como a subida do preço da eletricidade ou inflação de fornecedores.'
                : 'Avoid end-of-month surprises. Auditor Pro helps F&B SMEs calculate real business profit instantly and simulate future scenarios — such as rising electricity costs or supplier inflation.'}
            </p>
          </div>

          {/* Interactive Calculator widget */}
          <div className="mb-16">
            <div className="text-center mb-6">
              <h3 className="text-md font-bold font-display text-brand-ink">
                {pt ? 'Faça uma simulação rápida com os seus dados' : 'Run a quick simulation with your details'}
              </h3>
              <p className="text-[10px] text-brand-ink-dim mt-1">
                {pt ? 'Preencha os valores da sua operação e alterne os controlos de inflação.' : 'Fill in your operational numbers and toggle the inflation sliders.'}
              </p>
            </div>
            <AuditorCalculator pt={pt} />
          </div>

          {/* Content info columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 text-xs leading-relaxed text-brand-ink-dim">
            <div className="bg-brand-card border border-brand-border p-6 rounded-xl">
              <h4 className="font-bold text-brand-ink text-sm flex items-center gap-2 mb-3">
                <Scale className="w-4 h-4 text-brand-accent-soft" />
                {pt ? 'Simulação de Ponto de Equilíbrio' : 'Break-even Simulation'}
              </h4>
              <p>
                {pt
                  ? 'A maioria dos negócios falha porque desconhece o seu ponto de equilíbrio diário (break-even). Com o Auditor Pro, sabe exatamente quantos pratos/clientes adicionais precisa de servir cada dia para compensar o aumento de 10% nas despesas de pessoal.'
                  : 'Most businesses fail because they do not know their daily break-even point. With Auditor Pro, you know exactly how many additional plates/clients you need to serve each day to offset a 10% staff cost increase.'}
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-6 rounded-xl">
              <h4 className="font-bold text-brand-ink text-sm flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-brand-accent-soft" />
                {pt ? 'Auditoria Rápida Sem Complicações' : 'Quick Compliance Without Hassle'}
              </h4>
              <p>
                {pt
                  ? 'Nascido da experiência em auditorias reais, o Auditor Pro não exige que passe semanas a introduzir fichas técnicas de ingredientes detalhadas. Basta introduzir as despesas gerais e faturação agregada para obter um raio-X financeiro.'
                  : 'Born from real auditing experience, Auditor Pro does not require you to spend weeks entering detailed ingredient specifications. Just key in overall expenses and aggregate billing to get a financial X-ray.'}
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <ShieldAlert className="w-8 h-8 text-brand-warn mb-4" />
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Antecipe os riscos financeiros da sua empresa' : 'Anticipate your company\'s financial risks'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt
                ? 'Agende o seu diagnóstico gratuito. Analisamos os dados passados da sua faturação para estruturar simulações de stress-test mais avançadas no Auditor Pro.'
                : 'Schedule your free diagnosis. We analyze your past sales data to set up more advanced financial stress-test simulations in Auditor Pro.'}
            </p>
            <a
              href="https://calendly.com/nuelltech/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-8 rounded-xl text-xs transition duration-150 flex items-center gap-2"
            >
              {dict.hero.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer lang={lang as Locale} dict={dict} />
      <Nuellwidget lang={lang as Locale} />
    </>
  );
}

// Simple internal lowercase wrapper handle to avoid compiler casing warning
function Nuellwidget(props: { lang: 'pt' | 'en' }) {
  return <NuellWidget {...props} />;
}
