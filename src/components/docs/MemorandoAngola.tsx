'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Printer, Share2, ArrowLeft, Check, Download } from 'lucide-react';

export default function MemorandoAngola() {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://nuelltech.com/docs/estrategia/memorando_angola';
    const title = 'Memorando Estratégico — Nuelltech Angola';
    const text = 'Plano de Abordagem ao Mercado Angolano • Otimização Institucional através de Inteligência Artificial';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex flex-col items-center py-4 sm:py-8 px-2 sm:px-4 text-[#1e293b] font-sans">
      {/* Botões Flutuantes de Ação (Ocultos na Impressão) */}
      <aside aria-label="Ações do documento" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 print:hidden">
        <button
          onClick={handleShare}
          title="Copiar ou Partilhar Link"
          className="p-3 sm:px-4 sm:py-3 rounded-full bg-white text-slate-800 font-semibold text-sm shadow-xl border border-slate-300 hover:bg-slate-50 transition active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#14b8a6]" />}
          <span className="hidden sm:inline">{copied ? 'Link Copiado' : 'Partilhar'}</span>
        </button>

        <button
          onClick={handlePrint}
          title="Guardar este documento em formato PDF ou Imprimir"
          className="px-5 py-3 rounded-full bg-[#14b8a6] hover:bg-[#0d9488] text-white font-semibold text-sm sm:text-base shadow-xl shadow-teal-500/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>Guardar como PDF</span>
        </button>
      </aside>

      {/* Folha do Documento (A4 Formal em Desktop, Fluido e Responsivo em Mobile) */}
      <main className="page-sheet bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-12 md:p-[25mm] shadow-2xl md:shadow-[0_10px_35px_rgba(0,0,0,0.12)] rounded-lg md:rounded-none box-border my-auto">
        {/* Cabeçalho Formal */}
        <header className="border-b-[3px] border-[#131b2f] pb-4 mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="relative h-14 sm:h-[75px] w-40 sm:w-52">
            <Image
              src="/logo.png"
              alt="Nuelltech"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="text-left sm:text-right text-[#131b2f]">
            <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide m-0 mb-1">
              Memorando Estratégico
            </h1>
            <p className="m-0 text-xs font-semibold text-[#64748b] uppercase tracking-widest">
              Documento Executivo
            </p>
          </div>
        </header>

        {/* Bloco de Metainformação do Projeto */}
        <div className="bg-[#f8fafc] border-l-4 border-[#14b8a6] p-4 sm:p-5 mb-8 sm:mb-10 rounded-r-lg">
          <p className="my-1 text-xs sm:text-[10.5pt] leading-relaxed">
            <span className="font-bold text-[#131b2f] inline-block w-24">PROJETO:</span>
            Otimização Institucional através de Inteligência Artificial
          </p>
          <p className="my-1 text-xs sm:text-[10.5pt] leading-relaxed">
            <span className="font-bold text-[#131b2f] inline-block w-24">FOCO:</span>
            Plano de Abordagem ao Mercado Angolano
          </p>
          <p className="my-1 text-xs sm:text-[10.5pt] leading-relaxed">
            <span className="font-bold text-[#131b2f] inline-block w-24">DATA:</span>
            Novembro de 2026
          </p>
        </div>

        {/* 1. Visão Executiva e Enquadramento */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131b2f] mt-6 mb-3">
            1. Visão Executiva e Enquadramento
          </h2>
          <p className="text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify mb-4">
            A economia angolana atravessa um momento em que a eficiência de capital, o rigor na gestão de risco, a redução da carga administrativa burocrática e a velocidade de execução logística são fatores críticos de crescimento e estabilidade. As médias e grandes empresas no país já investiram de forma expressiva em sistemas de informação core (ERPs, Faturação, Core Banking e Logística), contudo, a tomada de decisão esbarra frequentemente na fragmentação dos dados em <strong className="text-[#131b2f]">&ldquo;ilhas de informação&rdquo;</strong> e departamentos isolados.
          </p>
          <p className="text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify">
            A <strong className="text-[#131b2f]">Nuelltech</strong> aborda o mercado angolano não como um fornecedor tradicional de software, mas como um parceiro estratégico de governação e eficiência. O nosso objetivo é implementar uma camada de Inteligência Artificial analítica e segura sobre os sistemas que as empresas já utilizam, orquestrando fluxos multidepartamento para permitir à Administração decidir e agir numa fração do tempo.
          </p>
        </section>

        {/* 2. A Proposta de Valor */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131b2f] mt-8 mb-3">
            2. A Proposta de Valor
          </h2>
          <p className="text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify mb-3">
            Distanciamo-nos de soluções genéricas de IA, sendo que o nosso foco é exclusivamente o motor central das operações de negócio:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-3 text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify">
            <li>
              <strong className="text-[#131b2f]">Eliminação das Ilhas de Informação:</strong> A Inteligência Institucional audita e cruza em tempo real as áreas de finanças, inventários, canais de vendas e perfis de risco.
            </li>
            <li>
              <strong className="text-[#131b2f]">Diagnóstico ao Ritmo de Conversa:</strong> Os decisores não aguardam dias por extrações morosas de Excel. O sistema é interrogado em linguagem natural, processando cruzamentos complexos e devolvendo cenários económicos de imediato.
            </li>
            <li>
              <strong className="text-[#131b2f]">Da Decisão à Execução Acompanhada:</strong> A estratégia validada pelo executivo é convertida automaticamente em microtarefas distribuídas para o telemóvel da equipa no terreno (ex: &ldquo;Bloquear compras ao fornecedor X&rdquo;, &ldquo;Escoar produto em risco de caducidade&rdquo;, ou &ldquo;Avançar com auditoria de compliance na conta Y&rdquo;). A execução mantém regras estritas de autorização, validação humana e registo de toda a atividade.
            </li>
            <li>
              <strong className="text-[#131b2f]">Transparência e Rastreabilidade (Contexto da Decisão):</strong> As respostas geradas pela IA não são &ldquo;caixas negras&rdquo;. Cada análise apresenta as fontes originais e os limites dos dados cruzados. A IA apoia a análise; não substitui a responsabilidade dos decisores, os controlos internos nem os sistemas oficiais de registo.
            </li>
            <li>
              <strong className="text-[#131b2f]">Automatização Documental e Administrativa:</strong> A IA extrai, compreende e cruza automaticamente dados não estruturados de faturas, notas de crédito, guias de remessa e contratos. Este processo elimina milhares de horas de trabalho manual de reconciliação e reduz drasticamente os atrasos e erros na contabilidade.
            </li>
          </ul>
        </section>

        {/* 3. Plano de Entrada no Mercado (Roadmap Estratégico) */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131b2f] mt-8 mb-3">
            3. Plano de Entrada no Mercado (Roadmap Estratégico)
          </h2>
          <p className="text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify mb-4">
            Para garantir uma adoção pautada pela segurança, transparência e confiança institucional, a Nuelltech propõe um plano em três fases:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#14b8a6] mb-1">
                Fase 1: Missão de Diagnóstico e Auscultação (Curto Prazo)
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-[10.5pt] leading-relaxed text-[#334155]">
                <li><strong className="text-[#131b2f]">Ação:</strong> Condução de sessões executivas exploratórias com decisores de topo.</li>
                <li><strong className="text-[#131b2f]">Objetivo:</strong> Mapear os estrangulamentos logísticos e financeiros no terreno e desenhar arquiteturas de solução adaptadas à realidade de infraestrutura angolana (sem qualquer compromisso comercial inicial).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#14b8a6] mb-1">
                Fase 2: Prova de Conceito (PoC) Isolada (Médio Prazo)
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-[10.5pt] leading-relaxed text-[#334155]">
                <li><strong className="text-[#131b2f]">Ação:</strong> Seleção de 1 a 2 empresas pioneiras para o desenvolvimento de um projeto-piloto cirúrgico (ex: otimização de uma linha de armazém, reconciliação automática de documentação e faturas, centro de distribuição ou departamento de risco).</li>
                <li><strong className="text-[#131b2f]">Objetivo:</strong> Demonstrar o Retorno sobre o Investimento (ROI) de forma auditável num prazo de 60 a 90 dias, mitigando por completo o risco para o empresário.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#14b8a6] mb-1">
                Fase 3: Escala e Transferência de Know-How
              </h3>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1 text-sm sm:text-[10.5pt] leading-relaxed text-[#334155]">
                <li><strong className="text-[#131b2f]">Ação:</strong> Roll-out da arquitetura institucional em larga escala corporativa.</li>
                <li><strong className="text-[#131b2f]">Objetivo:</strong> Para além da instalação tecnológica, a Nuelltech compromete-se a formar e capacitar as equipas operacionais e os quadros de gestão angolanos para integrarem e governarem ferramentas de IA.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Perfil do Parceiro Procurado (Fase 1) */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#131b2f] mt-8 mb-3">
            4. Perfil do Parceiro Procurado (Fase 1)
          </h2>
          <p className="text-sm sm:text-[10.5pt] leading-relaxed text-[#334155] text-justify mb-3">
            Para alavancar a Fase 1, procuramos dialogar com 5 a 8 empresas locais de referência que encaixem no seguinte enquadramento:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-[10.5pt] leading-relaxed text-[#334155]">
            <li><strong className="text-[#131b2f]">Setores-Alvo:</strong> Banca &amp; Seguros, Logística &amp; Portos, Distribuição &amp; Retalho, Indústria &amp; Manufatura.</li>
            <li><strong className="text-[#131b2f]">Maturidade Tecnológica:</strong> Empresas com elevado volume de transações e utilizadoras de ERPs consolidados (ex: Primavera, SAP, Oracle, Microsoft).</li>
            <li><strong className="text-[#131b2f]">Perfil do Interlocutor:</strong> Administração, CEO (Diretor Geral), COO (Diretor de Operações) ou CFO (Diretor Financeiro) — executivos com o foco na otimização de capital empatado e tempo de resposta.</li>
          </ul>
        </section>

        {/* Rodapé do Documento */}
        <footer className="mt-12 sm:mt-16 pt-5 border-t border-[#e2e8f0] text-center text-xs text-[#94a3b8] leading-relaxed">
          <p className="m-0 font-bold text-[#64748b]">
            Nuelltech • Estratégia e Governação AI
          </p>
          <p className="m-0 mt-1">
            <a href="mailto:nuno.miguel@nuelltech.com" className="hover:text-teal-600 transition">nuno.miguel@nuelltech.com</a>
            {' '}|{' '}
            <a href="tel:+351966665571" className="hover:text-teal-600 transition">+351 966 665 571</a>
          </p>
        </footer>
      </main>

      {/* Regras CSS exclusivas de impressão */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-sheet {
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            padding: 12mm 15mm !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
