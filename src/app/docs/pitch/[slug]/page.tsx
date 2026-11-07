import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PitchEnterprise from '@/components/docs/PitchEnterprise';

export async function generateStaticParams() {
  return [
    { slug: 'enterprise' },
    { slug: 'enterprise-pitch' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (normalized === 'enterprise' || normalized === 'enterprise-pitch') {
    return {
      title: 'Pitch Deck Enterprise — Nuelltech',
      description: 'Inteligência Institucional: Otimização de processos multi-departamento e apoio à decisão estratégica.',
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
    title: 'Apresentação Não Encontrada | Nuelltech',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PitchSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (normalized === 'enterprise' || normalized === 'enterprise-pitch') {
    return <PitchEnterprise />;
  }

  notFound();
}
