import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Receipt, TrendingUp } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'RCM · Restaurant Cost Management — Nuelltech' : 'RCM · Restaurant Cost Management — Nuelltech',
    description: lang === 'pt' 
      ? 'Controlo automático de custos e foodcost para restaurantes por leitura OCR de faturas.'
      : 'Automatic cost and foodcost control for restaurants using invoice OCR scanning.',
  };
}

export default async function RcmPage({
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
    'name': 'RCM - Restaurant Cost Management',
    'operatingSystem': 'Cloud / Web-based',
    'applicationCategory': 'BusinessApplication',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'EUR',
      'price': '0', // Remit to diagnosis
      'description': 'Pricing determined after free business diagnosis session',
    },
  };

  const features = pt ? [
    'OCR inteligente de faturas de fornecedores com atualização imediata de fichas técnicas.',
    'Alerta automático de subidas de preços em ingredientes, prevenindo compressão de margens.',
    'Engenharia de Menu avançada: identifica pratos populares vs. pratos rentáveis.',
    'Geração automatizada de listas de compras a partir dos pratos selecionados no dia.',
    'Cálculo de ponto de equilíbrio diário (Despesas de estrutura vs. Faturação real).',
    'Interface clean e mobile-friendly para uso direto na cozinha ou escritório do gestor.'
  ] : [
    'Smart OCR parsing of supplier invoices with immediate update of recipe costs.',
    'Automatic price increase alerts for ingredients, preventing profit margin compression.',
    'Advanced Menu Engineering: identifies high-popularity vs. high-margin dishes.',
    'Automated shopping list generation based on daily selected dishes.',
    'Daily break-even point analysis (Fixed structural costs vs. real sales invoicing).',
    'Clean, mobile-friendly interface for use in the kitchen or manager office.'
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
          {/* Back button */}
          <Link href={`/${lang}`} className="text-xs font-mono text-brand-accent-soft hover:underline mb-8 inline-block">
            &larr; {pt ? 'Voltar ao Início' : 'Back to Home'}
          </Link>

          {/* Page Hero */}
          <div className="border-b border-brand-border/60 pb-8 mb-10">
            <span className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider font-semibold">
              {pt ? 'PRODUTO SAAS' : 'SAAS PRODUCT'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              RCM · Restaurant Cost Management
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed max-w-2xl">
              {pt
                ? 'RCM é o motor inteligente de gestão para a restauração que elimina a introdução manual de dados. Ao ler faturas de fornecedores por OCR, recalcula custos e alerta-o assim que um ingrediente põe em risco a rentabilidade do prato.'
                : 'RCM is the smart management engine for food & beverage businesses that eliminates manual data entry. By scanning supplier invoices via OCR, it recalculates recipe costs and alerts you when ingredients jeopardize dish profitability.'}
            </p>
          </div>

          {/* Grid key stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-start gap-3">
              <Receipt className="w-5 h-5 text-brand-accent-soft mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-brand-ink text-xs">{pt ? 'OCR Automático' : 'Automated OCR'}</h4>
                <p className="text-[10px] text-brand-ink-dim mt-1">{pt ? 'Adeus às folhas Excel manuais.' : 'Say goodbye to manual Excel files.'}</p>
              </div>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-brand-ok mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-brand-ink text-xs">{pt ? 'Prevenção de Margem' : 'Margin Protection'}</h4>
                <p className="text-[10px] text-brand-ink-dim mt-1">{pt ? 'Alertas imediatos de inflação.' : 'Immediate inflation alerts.'}</p>
              </div>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-accent-soft mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-brand-ink text-xs">{pt ? 'Rigor de Custos' : 'Cost Accuracy'}</h4>
                <p className="text-[10px] text-brand-ink-dim mt-1">{pt ? 'Fichas técnicas sempre certas.' : 'Always accurate recipe costs.'}</p>
              </div>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-display text-brand-ink mb-6">
              {pt ? 'Funcionalidades Completas' : 'Complete Features'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-[#090D1A] p-4 rounded-xl border border-brand-border/40">
                  <CheckCircle2 className="w-4 h-4 text-brand-ok mt-0.5 flex-shrink-0" />
                  <span className="text-brand-ink leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <Zap className="w-8 h-8 text-brand-accent-soft mb-4" />
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Proteja a rentabilidade do seu restaurante hoje' : 'Protect your restaurant profitability today'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt 
                ? 'Agende um diagnóstico gratuito com os nossos engenheiros de dados para mapear o seu processo atual e descobrir quanto pode poupar nas compras.'
                : 'Schedule a free diagnosis with our data engineers to map your current process and discover how much you can save in purchases.'}
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
      <NuellWidget lang={lang as Locale} />
    </>
  );
}
