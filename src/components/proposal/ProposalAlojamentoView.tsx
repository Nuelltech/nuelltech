'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Globe,
  Share2,
  Printer,
  ExternalLink,
  Lock,
  Server,
  Layers,
  MessageCircle,
  FileCheck,
  Check,
  Sparkles,
  Info,
  HelpCircle,
  Home,
  CreditCard,
  CalendarCheck,
  RefreshCw,
  Building2,
  Camera,
  MapPin,
} from 'lucide-react';
import { AlojamentoProposalData } from '@/data/proposals/types';

interface ProposalAlojamentoViewProps {
  proposal: AlojamentoProposalData;
  customClientName?: string;
}

export default function ProposalAlojamentoView({
  proposal,
  customClientName,
}: ProposalAlojamentoViewProps) {
  const [copied, setCopied] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opcao-b');

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-900 selection:text-white print:bg-white print:text-slate-900">
      {/* Top Clean Navigation Bar (Hidden in Print) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/90 px-4 sm:px-8 py-3 transition-all print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Nuelltech"
              width={140}
              height={36}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              Proposta Comercial • Alojamento Local
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
              title="Copiar link direto da proposta"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Partilhar Link</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
              title="Guardar como PDF ou imprimir"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Guardar PDF</span>
            </button>

            <a
              href="#agendamento"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('agendamento');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Reunião</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* HERO / DOCUMENT HEADER */}
        <section className="space-y-6 pt-2">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Lock className="w-3 h-3 text-slate-500" />
              Proposta Fechada
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
              <MapPin className="w-3 h-3 text-blue-600" />
              2 Apartamentos em Trancoso
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Válida até {proposal.validUntil}
            </span>
          </div>

          {/* Proposal Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight">
              {proposal.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-normal mt-3 max-w-3xl leading-relaxed">
              {proposal.subtitle}
            </p>
          </div>

          {/* Clean Executive Metadata Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                {customClientName ? 'Preparado Para' : 'Projeto & Âmbito'}
              </div>
              <div className="text-base font-semibold text-slate-900">
                {customClientName || 'Alojamento Local (2 Apartamentos)'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {proposal.location || 'Trancoso • Portugal'}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Apresentado Por
              </div>
              <div className="text-base font-semibold text-slate-900">
                Nuelltech
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {proposal.date}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Idiomas & Suporte
              </div>
              <div className="text-base font-semibold text-slate-900">
                Bilingue (PT / EN)
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Mobile-First, SEO Local e IA
              </div>
            </div>
          </div>

          {/* Summary / Enquadramento Callout */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-base sm:text-lg leading-relaxed space-y-2">
            <p className="font-medium text-slate-900">
              Obrigado pelo contacto e pela clareza e rigor com que apresentou os seus requisitos.
            </p>
            <p className="text-sm sm:text-base text-slate-600">
              É exatamente com este nível de organização e transparência que gostamos de trabalhar na Nuelltech. Abaixo apresentamos a nossa proposta comercial e técnica fechada, estruturada em duas opções distintas para a sua tomada de decisão.
            </p>
          </div>
        </section>

        {/* 1. MODELOS DE DESENVOLVIMENTO (OPÇÃO A vs OPÇÃO B) */}
        <section id="opcoes" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              01 • Estrutura de Investimento
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Duas Opções de Desenvolvimento
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Pode optar por um website focado em apresentação com reencaminhamento para o Airbnb ou, alternativamente, por um portal com motor de reservas próprio para captar reservas diretas e evitar o pagamento de comissões a intermediários:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-stretch">
            {proposal.options.map((option) => {
              const isRec = option.isRecommended;
              return (
                <div
                  key={option.id}
                  className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all ${
                    isRec
                      ? 'bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900/10'
                      : 'bg-white border border-slate-200 shadow-xs'
                  }`}
                >
                  {isRec && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Escolha Recomendada para Independência
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {option.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {option.tagline}
                      </p>
                    </div>

                    {/* Preço Fechado */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        Preço Fechado do Projeto
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                        {option.setupFormatted}
                        <span className="text-sm font-normal text-slate-500 ml-1.5">
                          + IVA
                        </span>
                      </div>
                      {option.setupWithVatFormatted && (
                        <div className="text-xs font-medium text-emerald-800 pt-1">
                          Total com IVA (23%): <strong>{option.setupWithVatFormatted}</strong>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Prazo de entrega:{' '}
                          <strong className="text-slate-800">
                            {option.id === 'opcao-a' ? '2 a 3 semanas' : '3 a 4 semanas'}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-900">Perfil: </strong>
                      {option.idealProfile}
                    </div>

                    {/* O que inclui */}
                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-wider font-semibold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-slate-700" />
                        <span>O que está incluído:</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-700">
                        {option.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                              ✓
                            </span>
                            <span className="leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Nota Importante / Salvaguarda */}
                    {option.importantNote && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed space-y-1">
                        <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Nota Importante:</span>
                        </div>
                        <p>{option.importantNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedOptionId(option.id);
                        scrollToSection('agendamento');
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isRec
                          ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>Avançar com {option.name.split(':')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. TABELA COMPARATIVA RESUMO */}
        <section id="comparativo" className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              02 • Resumo Executivo
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Comparativo Lado a Lado
            </h2>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                    <th className="py-3 px-4 font-semibold">Funcionalidade / Requisito</th>
                    <th className="py-3 px-4 font-semibold text-slate-900">Opção A: Apresentação</th>
                    <th className="py-3 px-4 font-semibold text-emerald-900 bg-emerald-50/50">
                      Opção B: Reservas Diretas ⭐
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Preço Fechado (+ IVA)</td>
                    <td className="py-3 px-4 font-bold text-slate-900">650,00 € (799,50 € c/ IVA)</td>
                    <td className="py-3 px-4 font-bold text-slate-950 bg-emerald-50/20">
                      1.250,00 € (1.537,50 € c/ IVA)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Prazo de Entrega Estimado</td>
                    <td className="py-3 px-4">2 a 3 semanas</td>
                    <td className="py-3 px-4 bg-emerald-50/20 font-medium">3 a 4 semanas</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Idiomas Incluídos</td>
                    <td className="py-3 px-4">Bilingue (Português e Inglês)</td>
                    <td className="py-3 px-4 bg-emerald-50/20">Bilingue (Português e Inglês)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Página por Apartamento (2 unidades)</td>
                    <td className="py-3 px-4">Sim, com galeria fotográfica</td>
                    <td className="py-3 px-4 bg-emerald-50/20">Sim, com galeria fotográfica</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Mapa de Localização e Acessibilidade</td>
                    <td className="py-3 px-4">Sim, integrado</td>
                    <td className="py-3 px-4 bg-emerald-50/20">Sim, integrado</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">SEO Local & Otimização para IA</td>
                    <td className="py-3 px-4">Sim (Google Maps + Assistentes IA)</td>
                    <td className="py-3 px-4 bg-emerald-50/20">Sim (Google Maps + Assistentes IA)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Botões de Reserva do Airbnb</td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">Sim (Link direto aos anúncios)</td>
                    <td className="py-3 px-4 bg-emerald-50/20">Sim (Opcional como canal secundário)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Motor de Reservas Próprio no Site</td>
                    <td className="py-3 px-4 text-slate-400">Não (Reserva no Airbnb)</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-800 font-bold">
                      ✓ Sim, incluído com calendário
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Sincronização iCal (Airbnb & Booking)</td>
                    <td className="py-3 px-4 text-slate-400">Não aplicável</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-800 font-bold">
                      ✓ Sim, automático (zero overbookings)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Pagamentos Online (Stripe / MBWay)</td>
                    <td className="py-3 px-4 text-slate-400">Não (Gerido pelo Airbnb)</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-800 font-bold">
                      ✓ Sim, checkout seguro próprio
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Licenças de Reservas (1.º ano)</td>
                    <td className="py-3 px-4 text-slate-400">Sem licenças necessárias</td>
                    <td className="py-3 px-4 bg-emerald-50/20 text-emerald-800 font-semibold">
                      ✓ 100% Incluídas no orçamento
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Domínio (.pt ou .com) no 1.º ano</td>
                    <td className="py-3 px-4 font-medium text-slate-900">Incluído</td>
                    <td className="py-3 px-4 bg-emerald-50/20 font-medium text-slate-900">Incluído</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Propriedade do Site & Acessos Admin</td>
                    <td className="py-3 px-4">100% Seu (Acesso total)</td>
                    <td className="py-3 px-4 bg-emerald-50/20">100% Seu (Acesso total)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. RESPOSTAS ESPECÍFICAS AOS REQUISITOS TÉCNICOS E ADMINISTRATIVOS */}
        <section id="respostas-tecnicas" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              03 • Transparência Total
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Respostas aos Seus Detalhes Técnicos e Administrativos
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Respondemos ponto por ponto a cada uma das suas questões para que tenha total clareza e previsibilidade:
            </p>
          </div>

          <div className="space-y-4">
            {proposal.technicalAnswers?.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0">
                      0{item.number}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.question}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                    {item.shortAnswer}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.details}
                </p>

                {item.bullets && item.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1 text-xs text-slate-700">
                    {item.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. PLANO DE MANUTENÇÃO & ALOJAMENTO */}
        {proposal.maintenancePlan && (
          <section id="manutencao" className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                04 • Continuidade Operacional
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
                Serviço de Manutenção Mensal e Alojamento
              </h2>
              <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
                Para que não tenha de se preocupar com servidores, atualizações técnicas ou cópias de segurança:
              </p>
            </div>

            <div className="rounded-3xl p-7 sm:p-9 bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
              <div className="space-y-4 max-w-xl">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Sem Fidelização • Cancele quando quiser
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-3">
                    Manutenção Proativa & Servidor Europeu de Alta Velocidade
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {proposal.maintenancePlan.freeMonthNote}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
                  {proposal.maintenancePlan.coverage.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 w-full md:w-auto text-center md:text-right space-y-1 shrink-0">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Mensalidade
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950">
                  {proposal.maintenancePlan.priceFormatted}
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    + IVA / mês
                  </span>
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  {proposal.maintenancePlan.priceWithVatFormatted} com IVA
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  1.º mês gratuito incluído
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. CONDIÇÕES DE PAGAMENTO (4 x 25%) */}
        <section id="pagamento" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              05 • Risco Partilhado
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Forma de Pagamento Diluída (4 Tranches de 25%)
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              O pagamento do valor fechado não é exigido de uma só vez, mas sim associado a 4 marcos reais de entrega aprovados por si:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {proposal.paymentTerms.map((term, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-900 text-sm">
                  {term.percentage}
                </div>
                <h3 className="text-sm font-semibold text-slate-900 pt-1">
                  {term.stage}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {term.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {proposal.guarantee?.title || 'Segurança & Rondas de Alteração'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {proposal.guarantee?.description}
              </p>
            </div>
          </div>
        </section>

        {/* 6. PRÓXIMOS PASSOS & AGENDAMENTO */}
        <section
          id="agendamento"
          className="rounded-3xl p-8 sm:p-12 bg-white border border-slate-200 text-center space-y-6 shadow-xs"
        >
          <div className="max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-800">
              Próximos Passos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
              Vamos conversar sobre o seu projeto?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {proposal.nextSteps.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={proposal.nextSteps.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Chamada de 15 Minutos</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`https://wa.me/${proposal.nextSteps.whatsappNumber}?text=${encodeURIComponent(
                proposal.nextSteps.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-sm transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Falar via WhatsApp</span>
            </a>
          </div>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 space-y-1">
            <div>
              Proposta válida até <strong>{proposal.validUntil}</strong>. Aos valores apresentados acresce IVA à taxa legal em vigor.
            </div>
            <div>
              Nuelltech • Contacto direto:{' '}
              <a
                href={`mailto:${proposal.nextSteps.email}`}
                className="text-slate-700 underline"
              >
                {proposal.nextSteps.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/90 py-8 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-5xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Nuelltech. Documento comercial confidencial.</p>
        </div>
      </footer>
    </div>
  );
}
