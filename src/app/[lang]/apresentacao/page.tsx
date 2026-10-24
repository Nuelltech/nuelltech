import type { Metadata } from 'next';
import { locales } from '@/i18n/settings';
import PresentationView from '@/components/presentation/PresentationView';

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
      ? 'Apresentação Corporativa — Nuelltech'
      : 'Corporate Presentation — Nuelltech',
    description: isPt
      ? 'A ponte entre o que o seu negócio precisa e o que a IA pode fazer. Automação, inteligência artificial e casos práticos para PMEs.'
      : 'The bridge between what your business needs and what AI can achieve. Automation, AI, and case studies for SMEs.',
  };
}

export default async function ApresentacaoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <PresentationView lang={lang === 'en' ? 'en' : 'pt'} />;
}
