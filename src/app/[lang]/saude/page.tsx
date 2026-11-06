import type { Metadata } from 'next';
import { locales } from '@/i18n/settings';
import SaudePresentation from '@/components/presentation/SaudePresentation';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isPt = lang === 'pt';
  return {
    title: isPt
      ? 'Inteligência Ativa na Saúde — Apresentação Executiva | Nuelltech'
      : 'Active Intelligence in Healthcare — Executive Pitch Deck | Nuelltech',
    description: isPt
      ? 'A IA como parte integrante da gestão na saúde: potenciar a decisão e dar visibilidade a informação desintegrada.'
      : 'AI as an integral part of healthcare management: empowering decisions and unifying fragmented data.',
    openGraph: {
      title: isPt
        ? 'Inteligência Ativa na Saúde — Nuelltech'
        : 'Active Intelligence in Healthcare — Nuelltech',
      description: isPt
        ? 'Apresentação executiva: IA e Governação aplicadas ao ecossistema de saúde.'
        : 'Executive presentation: Governed AI applied across the healthcare ecosystem.',
    },
  };
}

export default async function SaudePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SaudePresentation lang={lang === 'en' ? 'en' : 'pt'} />;
}
