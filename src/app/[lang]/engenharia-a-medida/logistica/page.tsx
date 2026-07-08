import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { ArrowRight, Share2, Shield, FileSpreadsheet, Lock } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Estudo de Caso: Plataforma de Logística — Nuelltech' : 'Case Study: Logistics Platform — Nuelltech',
    description: lang === 'pt'
      ? 'Como substituímos planilhas Google Sheets por um sistema de entregas cloud multi-utilizador.'
      : 'How we replaced manual Google Sheets with a secure multi-user cloud delivery platform.',
  };
}

export default async function LogisticsPage({
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
              {pt ? 'ESTUDO DE CASO · DISTRIBUIÇÃO' : 'CASE STUDY · DISTRIBUTION'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              Plataforma de Logística
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed">
              {pt
                ? 'Substituição de processos descentralizados baseados em Google Sheets por uma plataforma web integrada com acessos de permissão para administradores e funcionários de entregas.'
                : 'Replacement of decentralized processes based on Google Sheets with an integrated web application featuring permissions for administrators and delivery staff.'}
            </p>
          </div>

          {/* Context box */}
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 mb-10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-brand-ink-dim font-mono block text-[9px] uppercase">{pt ? 'Cliente' : 'Client'}</span>
              <span className="font-semibold text-brand-ink">{pt ? 'Distribuição Alimentar' : 'Food Distributor'}</span>
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
                  ? 'O cliente geria todas as rotas diárias de entrega e reconciliações de pagamentos de motoristas usando múltiplos arquivos Google Sheets partilhados. Isto resultava em frequentes conflitos de edição de células, exclusões acidentais de registros, falta de segurança nos dados confidenciais de faturamento e total ausência de auditoria das rotas feitas pelos motoristas na estrada.'
                  : 'The client managed all daily delivery routes and driver payment reconciliations using multiple shared Google Sheets files. This caused frequent cellular edit conflicts, accidental deletions of records, security risks for billing data, and a complete lack of audit trails for route completions.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold font-display text-brand-ink mb-2">{pt ? 'A Engenharia Implementada' : 'The Implemented Engineering'}</h3>
              <p className="mb-4">
                {pt
                  ? 'Construímos uma plataforma cloud dedicada com interface responsiva (web + mobile), focada em três pontos:'
                  : 'We built a dedicated cloud platform with responsive interface (desktop + mobile), prioritizing three pillars:'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-brand-ink">
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <Lock className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Níveis de Permissão' : 'Access Control'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'O administrador controla as rotas; o motorista apenas vê as suas entregas do dia.' : 'Admin controls the routes; drivers only see their own daily assigned stops.'}</p>
                </div>
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <FileSpreadsheet className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Retro-compatibilidade' : 'Sheet Compatibility'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Escreve e lê dados diretamente do Google Sheets na fase de transição de equipas.' : 'Reads and writes directly to Google Sheets for smooth staff onboarding.'}</p>
                </div>
                <div className="bg-[#05070D] border border-brand-border p-4 rounded-lg">
                  <Share2 className="w-4 h-4 text-brand-accent-soft mb-2" />
                  <h4 className="font-bold text-[11px] mb-1">{pt ? 'Sync em Tempo Real' : 'Real-time Sync'}</h4>
                  <p className="text-[10px] text-brand-ink-dim leading-relaxed">{pt ? 'Atualizações automáticas da rota quando o motorista confirma a entrega no telemóvel.' : 'Instant route status updates when a driver marks a delivery complete on mobile.'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold font-display text-brand-ink mb-2">{pt ? 'Os Resultados' : 'The Results'}</h3>
              <div className="bg-[#101F1C] border border-brand-ok/25 p-5 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-brand-ok mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-brand-ink font-semibold">
                    {pt ? 'Processo 100% auditável e livre de erros de escrita.' : '100% auditable process, free of editing errors.'}
                  </p>
                  <p className="text-[10px] text-brand-ink-dim mt-1.5 leading-relaxed">
                    {pt
                      ? 'Ao retirar o acesso de escrita livre das planilhas aos motoristas, eliminou-se o erro operacional na entrada de faturas e pagamentos de clientes. A administração poupa cerca de 10 horas semanais em conferência manual de caixa.'
                      : 'By removing free-write sheet access for drivers, manual input errors on customer invoices and payments were completely eliminated. Admin saves approximately 10 hours weekly on manual cash reconciliation.'}
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
