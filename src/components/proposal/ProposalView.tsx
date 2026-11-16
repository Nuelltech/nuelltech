'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Calculator,
  TrendingUp,
  Share2,
  Printer,
  ExternalLink,
  Lock,
  Server,
  Users,
  Layers,
  MessageCircle,
  FileCheck,
  Check,
  Award,
  Info,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { ProposalData, InvestmentOption } from '@/data/proposals/types';

interface ProposalViewProps {
  proposal: ProposalData;
  customClientName?: string;
}

export default function ProposalView({
  proposal,
  customClientName,
}: ProposalViewProps) {
  const clientName = customClientName || proposal.clientName;
  const [copied, setCopied] = useState(false);
  const [familiesCount, setFamiliesCount] = useState<number>(
    proposal.roiSimulation.defaultFamiliesCount
  );
  const [monthlyCharge, setMonthlyCharge] = useState<number>(
    proposal.roiSimulation.defaultFamilyFee
  );

  // Cálculos do simulador de ROI
  const grossMonthlyRevenue = familiesCount * monthlyCharge;
  
  // Opção A: 5€ / paciente
  const costMonthlyA = familiesCount * 5;
  const netMonthlyA = Math.max(0, grossMonthlyRevenue - costMonthlyA);

  // Opção B: 2€ / paciente
  const costMonthlyB = familiesCount * 2;
  const netMonthlyB = Math.max(0, grossMonthlyRevenue - costMonthlyB);
  const paybackMonthsB = netMonthlyB > 0 ? (1500 / netMonthlyB).toFixed(1) : '—';
  const annualProfitB = netMonthlyB * 12;

  // Opção C: 120€ fixo
  const costMonthlyC = 120;
  const netMonthlyC = Math.max(0, grossMonthlyRevenue - costMonthlyC);

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
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Proposta Comercial</span>
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
              Documento Confidencial
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              Válida até {proposal.validUntil}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
              PWA Clínica & Famílias
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
                Preparado Para
              </div>
              <div className="text-base font-semibold text-slate-900">
                {clientName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {proposal.clientRole || 'Prática Clínica'}
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
                Prazo Estimado
              </div>
              <div className="text-base font-semibold text-slate-900">
                7 Semanas
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                3 Fases com validação passo a passo
              </div>
            </div>
          </div>

          {/* Clean Summary Callout */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 text-base sm:text-lg leading-relaxed">
            &ldquo;{proposal.summary}&rdquo;
          </div>
        </section>

        {/* 1. ESCOPO FUNCIONAL */}
        <section id="escopo" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              01 • Estrutura da Plataforma
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Escopo Funcional
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {proposal.executivePitch}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Módulo Psicólogo */}
            <div className="rounded-2xl p-6 sm:p-7 bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    Módulo Clínico
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mt-3">
                    {proposal.modules.psychologist.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {proposal.modules.psychologist.subtitle}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {proposal.modules.psychologist.description}
              </p>

              <div className="space-y-4 pt-3 border-t border-slate-100">
                {proposal.modules.psychologist.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Módulo Família */}
            <div className="rounded-2xl p-6 sm:p-7 bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    Módulo da Família
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mt-3">
                    {proposal.modules.family.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {proposal.modules.family.subtitle}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {proposal.modules.family.description}
              </p>

              <div className="space-y-4 pt-3 border-t border-slate-100">
                {proposal.modules.family.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Segurança & RGPD Box - Clean & Reassuring */}
          <div className="rounded-2xl p-6 sm:p-7 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {proposal.modules.securityRgpd.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {proposal.modules.securityRgpd.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full self-start sm:self-auto border border-emerald-200">
                Conformidade Europeia RGPD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {proposal.modules.securityRgpd.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evoluções Futuras */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-500" />
              {proposal.modules.futureEvolutions.title}
            </div>
            <p className="text-xs text-slate-500">
              {proposal.modules.futureEvolutions.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {proposal.modules.futureEvolutions.items.map((evo, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs shadow-2xs"
                >
                  {evo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. FASES DE DESENVOLVIMENTO E PRAZOS */}
        <section id="prazos" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              02 • Metodologia
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Fases de Desenvolvimento e Prazos
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              O projeto será desenvolvido de forma ágil num prazo total estimado de{' '}
              <strong className="text-slate-900 font-semibold">7 semanas</strong>,
              garantindo que valida cada passo antes de avançar para a fase seguinte:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proposal.phases.map((phase) => (
              <div
                key={phase.number}
                className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center">
                      0{phase.number}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {phase.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {phase.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {phase.deliverables}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span>Entrega sujeita a validação formal</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{proposal.phasesNotes}</span>
          </div>
        </section>

        {/* 3. MODELOS DE INVESTIMENTO */}
        <section id="investimento" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              03 • Modelos de Parceria
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Modelos de Investimento
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Três opções estruturadas para diferentes estratégias e perfis de risco.
              Escolha a que melhor se alinha com o crescimento da sua prática clínica:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {proposal.options.map((option) => {
              const isRec = option.isRecommended;
              return (
                <div
                  key={option.id}
                  className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                    isRec
                      ? 'bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900/10'
                      : 'bg-white border border-slate-200 shadow-xs'
                  }`}
                >
                  {isRec && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Escolha Recomendada
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {option.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {option.tagline}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-xs text-slate-400 font-medium">Investimento Inicial (Setup)</div>
                      <div className="text-3xl font-bold text-slate-950 tracking-tight">
                        {option.setupFormatted}
                        <span className="text-xs font-normal text-slate-500 ml-1">
                          + IVA
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-700">
                        <span className="text-slate-500">Mensalidade: </span>
                        <strong>{option.monthlyFee}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-900">Perfil: </strong>
                      {option.idealProfile}
                    </div>

                    {/* Specification list */}
                    <div className="space-y-2 text-xs pt-1">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Alojamento & RGPD:</span>
                        <span className="text-slate-800 font-medium">
                          {option.hostingAndRgpd}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Código-Fonte:</span>
                        <span className="text-slate-800 font-medium text-right">
                          {option.codeOwnership}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Dados dos Pacientes:</span>
                        <span className="text-slate-900 font-semibold">
                          {option.dataOwnership}
                        </span>
                      </div>
                      <div className="py-1">
                        <span className="text-slate-500 block mb-1">
                          Nível de Suporte:
                        </span>
                        <span className="text-slate-700 text-xs leading-relaxed block">
                          {option.supportLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <button
                      onClick={() => scrollToSection('agendamento')}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isRec
                          ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>Selecionar {option.name.split(':')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SIMULADOR DE RETORNO DO INVESTIMENTO (ROI) */}
        <section id="roi" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              04 • Rentabilização
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Retorno do Investimento (ROI)
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Ao disponibilizar a plataforma como um serviço digital às famílias
              (ex: 15 €/mês por acompanhamento contínuo), o custo da plataforma dilui-se,
              gerando uma <strong className="text-slate-900">nova receita líquida mensal</strong> para a sua prática:
            </p>
          </div>

          {/* Clean Calculator Card */}
          <div className="rounded-2xl p-6 sm:p-9 bg-white border border-slate-200 shadow-xs space-y-8">
            
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Families Count Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    Famílias Ativas na Plataforma
                  </label>
                  <span className="text-base font-bold text-slate-900 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    {familiesCount} crianças
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={familiesCount}
                  onChange={(e) => setFamiliesCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>5</span>
                  <span>20</span>
                  <span>40</span>
                  <span>60 famílias</span>
                </div>
              </div>

              {/* Monthly Fee Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    Valor Cobrado à Família / Mês
                  </label>
                  <span className="text-base font-bold text-slate-900 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    {monthlyCharge} € / mês
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="5"
                  value={monthlyCharge}
                  onChange={(e) => setMonthlyCharge(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>10 €</span>
                  <span>15 € (Sugerido)</span>
                  <span>20 €</span>
                  <span>30 €</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  Receita Bruta Gerada
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {grossMonthlyRevenue} €
                  <span className="text-xs font-normal text-slate-500"> /mês</span>
                </div>
                <div className="text-xs text-slate-400">
                  {familiesCount} famílias × {monthlyCharge} €
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  Custo Nuelltech (Opção B)
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {costMonthlyB} €
                  <span className="text-xs font-normal text-slate-500"> /mês</span>
                </div>
                <div className="text-xs text-slate-400">
                  {familiesCount} pacientes × 2 €
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  O Seu Lucro Líquido
                </div>
                <div className="text-2xl font-extrabold text-emerald-900">
                  +{netMonthlyB} €
                  <span className="text-xs font-normal text-emerald-700"> /mês</span>
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  ≈ {annualProfitB.toLocaleString('pt-PT')} € / ano limpos
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500 font-medium">
                  Recuperação do Setup
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {paybackMonthsB}
                  <span className="text-xs font-normal text-slate-500"> meses</span>
                </div>
                <div className="text-xs text-slate-400">
                  Amortização total de 1.500 €
                </div>
              </div>
            </div>

            {/* Static Reference Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 font-medium">Famílias Ativas</th>
                    <th className="py-2 font-medium">Receita Bruta (15€)</th>
                    <th className="py-2 font-medium">Lucro Opção A (5€)</th>
                    <th className="py-2 font-semibold text-slate-900">
                      Lucro Opção B (2€) ⭐
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[10, 20, 40].map((count) => {
                    const gross = count * 15;
                    const lA = gross - count * 5;
                    const lB = gross - count * 2;
                    return (
                      <tr
                        key={count}
                        className={
                          familiesCount === count ? 'bg-slate-50 font-semibold' : ''
                        }
                      >
                        <td className="py-2.5 text-slate-900">{count} famílias</td>
                        <td className="py-2.5">{gross} €</td>
                        <td className="py-2.5">+{lA} € /mês</td>
                        <td className="py-2.5 text-emerald-800 font-bold">
                          +{lB} € /mês
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              💡 <strong>Nota de Viabilidade:</strong> Com apenas 20 famílias ativas a utilizar o serviço,
              o investimento inicial da <strong>Opção B (1.500 €)</strong> fica integralmente recuperado
              em cerca de <strong>6 meses</strong> apenas com o lucro gerado pela app.
            </div>
          </div>
        </section>

        {/* 5. CONDIÇÕES DE PAGAMENTO E GARANTIA */}
        <section id="pagamento" className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              05 • Transparência
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-950 mt-1">
              Condições de Pagamento e Garantia
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl leading-relaxed">
              O pagamento do Investimento Inicial não é exigido à cabeça, mas sim
              diluído pelas 4 fases reais do projeto:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {proposal.paymentTerms.map((term, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-900 text-sm">
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
                {proposal.guarantee.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {proposal.guarantee.description}
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
              Agendar Breve Reunião
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para esclarecer qualquer questão técnica, rever os fluxos e selecionar a opção pretendida,
              basta agendarmos uma chamada de 15 minutos:
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
              <span>Falar via WhatsApp (+351 966 665 571)</span>
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
          <p>© {new Date().getFullYear()} Nuelltech. Documento confidencial.</p>
        </div>
      </footer>
    </div>
  );
}
