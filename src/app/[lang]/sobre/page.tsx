import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NuellWidget from '@/components/widget/NuellWidget';
import { Award, Compass, ArrowRight, Clock, Shield } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'pt' ? 'Quem Somos / Sobre Nós — Nuelltech' : 'About Us — Nuelltech',
    description: lang === 'pt'
      ? 'Conheça a nossa história, metodologia e pedigree de engenharia de software.'
      : 'Learn about our history, methodology, and software engineering pedigree.',
  };
}

export default async function AboutPage({
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
              {pt ? 'SOBRE A NUELLTECH' : 'ABOUT NUELLTECH'}
            </span>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold font-display text-brand-ink mt-2 mb-4">
              {pt ? 'A Nossa Trajetória' : 'Our Journey'}
            </h1>
            <p className="text-sm text-brand-ink-dim leading-relaxed">
              {pt
                ? 'Aplicamos disciplina de engenharia de software de grande escala à Inteligência Artificial e Automação de processos para PMEs, ajudando-as a proteger margens de lucro e a eliminar o trabalho manual repetitivo.'
                : 'We apply large-scale software engineering discipline to Artificial Intelligence and process automation for SMEs, helping them protect profit margins and eliminate repetitive manual work.'}
            </p>
          </div>

          {/* Pedigree section */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-display text-brand-ink mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-accent-soft" />
              {pt ? 'Origem e Experiência Profissional' : 'Pedigree & Professional Background'}
            </h2>
            <div className="text-xs text-brand-ink-dim leading-relaxed flex flex-col gap-4">
              <p>
                {dict.about.pedigree}
              </p>
              <div className="bg-[#090D1A] border border-brand-border rounded-xl p-5 border-l-4 border-l-brand-accent">
                <span className="block text-[8px] font-mono text-brand-ink-dim uppercase tracking-wider mb-2">
                  {pt ? 'Enquadramento da Experiência Oracle Retail' : 'Context on Oracle Retail Experience'}
                </span>
                <p className="text-[10px]">
                  {pt
                    ? 'Nota: A implementação de sistemas Oracle Retail nas cadeias Tesco, Morrisons, Sonae e Ahold reflete o percurso profissional do fundador em consultoras multinacionais antes da constituição da Nuelltech, servindo como credencial de competência de engenharia.'
                    : 'Note: The implementation of Oracle Retail systems at Tesco, Morrisons, Sonae, and Ahold represents the founder\'s professional career at multinational consulting firms prior to founding Nuelltech, serves as a testament to engineering competency.'}
                </p>
              </div>
            </div>
          </div>

          {/* Methodology / Progression */}
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs leading-relaxed text-brand-ink-dim">
            <div className="bg-brand-card border border-brand-border p-6 rounded-xl">
              <Compass className="w-5 h-5 text-brand-accent-soft mb-3" />
              <h3 className="font-bold text-brand-ink text-sm mb-2">{pt ? 'A Nossa Metodologia' : 'Our Methodology'}</h3>
              <p>
                {pt
                  ? 'Acreditamos que a tecnologia deve ser um gerador de retorno claro. Iniciamos sempre com um diagnóstico completo gratuito da sua empresa, identificando as ineficiências de processos e quantificando o retorno financeiro que a automação trará antes de qualquer código ser escrito.'
                  : 'We believe technology must generate a clear return on investment. We always begin with a free diagnostic audit of your business, identifying process inefficiencies and quantifying the financial yield that automation will bring before writing any code.'}
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border p-6 rounded-xl">
              <Clock className="w-5 h-5 text-brand-accent-soft mb-3" />
              <h3 className="font-bold text-brand-ink text-sm mb-2">{pt ? 'Progressão Concreta' : 'Concrete Progression'}</h3>
              <p>
                {dict.about.progression}
              </p>
            </div>
          </div>

          {/* CTA diagnostic */}
          <div className="bg-gradient-to-tr from-[#090D1A] to-[#0D162D] border border-brand-border p-8 rounded-2xl text-center flex flex-col items-center glass">
            <Shield className="w-8 h-8 text-brand-ok mb-4" />
            <h3 className="text-md font-bold font-display text-brand-ink mb-2">
              {pt ? 'Pretende otimizar a sua operação?' : 'Ready to optimize your operations?'}
            </h3>
            <p className="text-xs text-brand-ink-dim max-w-md leading-relaxed mb-6">
              {pt
                ? 'Agende a sua sessão de diagnóstico gratuito de 30 minutos com a nossa equipa de engenharia e identifique gargalos operacionais.'
                : 'Schedule a free 30-minute diagnosis session with our engineering team and map out your operational bottlenecks.'}
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
