import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { ArrowRight, BarChart3, Database, Calendar, Award } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Estudo de Caso: BI Pharma — Nuelltech' : 'Case Study: BI Pharma — Nuelltech',
    description: lang === 'pt'
      ? 'Como reduzimos a perda de stock farmacêutico integrando vendas e inventário.'
      : 'How we reduced pharmaceutical stock waste by merging sales and inventory databases.',
  };
}

export default async function BiPharmaPage({
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
          {/* Back button */}
          <Link href={`/${lang}/engenharia-a-medida`} className="text-xs font-mono text-brand-accent-soft hover:underline mb-8 inline-block">
            &larr; {pt ? 'Voltar para Engenharia à Medida' : 'Back to Custom Engineering'}
          </Link>

          {/* Page Hero */}
          <div className="border-b border-brand-border/60 pb-8 mb-10">
            <span className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider font-semibold">
              {pt ? 'ESTUDO DE CASO · FARMÁCIA' : 'CASE STUDY · PHARMACY'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              BI Pharma
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed">
              {pt
                ? 'Desenvolvimento específico de inteligência de negócio (BI) para uma farmácia, focado no cruzamento de dados de inventário e no planeamento automático de campanhas de vendas para evitar expiração de stock.'
                : 'Custom business intelligence (BI) engineering built for a pharmacy client, focused on database cross-referencing and automated sales campaign scheduling to prevent stock expiration.'}
            </p>
          </div>

          {/* Context box */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 mb-10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-brand-ink-dim font-mono block text-[9px] uppercase">{pt ? 'Cliente' : 'Client'}</span>
              <span className="font-semibold text-brand-ink">{pt ? 'Farmácia Independente' : 'Independent Pharmacy'}</span>
            </div>
            <div>
              <span className="text-brand-ink-dim font-mono block text-[9px] uppercase">{pt ? 'Estado' : 'Status'}</span>
              <span className="font-semibold text-brand-ok">{pt ? 'Implementado com Sucesso' : 'Successfully Implemented'}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="prose prose-invert text-xs leading-relaxed text-brand-ink-dim flex flex-col gap-6 mb-12">
            <div>
              <h3 className="text-sm font-bold font-display text-brand-ink mb-2">{pt ? 'O Desafio' : 'The Challenge'}</h3>
              <p>
                {pt
                  ? 'O cliente acumulava anualmente milhares de euros em perdas de stock devido a medicamentos e produtos cosméticos que expiravam na prateleira sem aviso prévio. O sistema de POS (faturação) e o ERP de inventário funcionavam de forma isolada, impedindo o gestor de identificar quais as referências em risco antes de ser tarde demais.'
                  : 'The client lost thousands of euros annually due to medicines and cosmetics expiring on the shelf. The POS system (sales) and ERP (inventory) were siloed, making it impossible to identify high-risk SKUs before it was too late.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold font-display text-brand-ink mb-2">{pt ? 'A Engenharia Implementada' : 'The Implemented Engineering'}</h3>
              <p className="mb-4">
                {pt
                  ? 'Criámos uma plataforma on-demand que extrai e limpa os dados de ambas as fontes e executa algoritmos de reconciliação:'
                  : 'We built an on-demand dashboard that extracts and cleans data from both sources to run reconciliation algorithms:'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-brand-ink">
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <Database className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Cruzamento Preditivo' : 'Predictive Matching'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Identifica o stock físico atual e estima a data de fim de vida do lote.' : 'Checks physical stock levels and calculates batch shelf life.'}</p>
                </div>
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Taxa de Escoamento' : 'Run-rate Analysis'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Compara a velocidade de vendas homóloga para estimar o desperdício financeiro.' : 'Compares current sales velocity to project financial losses.'}</p>
                </div>
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <Calendar className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Campanhas Inteligentes' : 'Smart Campaigns'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Sugere descontos cruzados automáticos com base no calendário de épocas do ano.' : 'Suggests bundle discounts based on seasonal calendars.'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold font-display text-brand-ink mb-2">{pt ? 'Os Resultados' : 'The Results'}</h3>
              <div className="bg-[#101F1C] border border-brand-ok/25 p-5 rounded-xl flex items-start gap-3">
                <Award className="w-5 h-5 text-brand-ok mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-ink font-semibold">
                    {pt ? 'Redução imediata de 68% no desperdício de stock.' : 'Immediate 68% reduction in stock waste.'}
                  </p>
                  <p className="text-[10px] text-brand-ink-dim mt-1.5 leading-relaxed">
                    {pt
                      ? 'No primeiro trimestre após implementação, a farmácia conseguiu reencaminhar cerca de 320 referências em risco de expiração para campanhas promocionais ativas e combos de venda cruzada, recuperando margens que seriam perdidas por completo.'
                      : 'In the first quarter post-launch, the pharmacy successfully redirected 320 high-risk SKUs into active promotions and cross-selling bundles, recovering margins that would have been completely written off.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Custom */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Interessado numa solução idêntica?' : 'Interested in a similar solution?'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt
                ? 'Este foi um projeto desenvolvido à medida para este cliente. Podemos desenhar uma solução idêntica adaptada às especificidades do seu negócio.'
                : 'This was a custom engineering project developed for this client. We can design a similar solution tailored to your operational needs.'}
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
