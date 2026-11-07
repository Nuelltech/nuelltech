import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MemorandoAngola from '@/components/docs/MemorandoAngola';

export async function generateStaticParams() {
  return [
    { slug: 'memorando_angola' },
    { slug: 'memorando-angola' },
    { slug: 'angola' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (normalized === 'memorando_angola' || normalized === 'memorando-angola' || normalized === 'angola') {
    return {
      title: 'Memorando Estratégico — Nuelltech Angola',
      description: 'Documento Executivo: Plano de Abordagem e Otimização Institucional através de Inteligência Artificial para Angola.',
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
    };
  }

  return {
    title: 'Documento Não Encontrado | Nuelltech',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EstrategiaDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (normalized === 'memorando_angola' || normalized === 'memorando-angola' || normalized === 'angola') {
    return <MemorandoAngola />;
  }

  notFound();
}
