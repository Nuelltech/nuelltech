import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProposalView from '@/components/proposal/ProposalView';
import { getProposalById, proposals } from '@/data/proposals';

interface ProposalPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const ids = [
    'pwa-terapeutico',
    'pwa-terapeutica',
    'prp-2026-bruno',
    'bruno',
  ];
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ProposalPageProps): Promise<Metadata> {
  const { id } = await params;
  const sParams = await searchParams;
  const proposal = getProposalById(id);

  if (!proposal) {
    return {
      title: 'Proposta Não Encontrada | Nuelltech',
      robots: { index: false, follow: false },
    };
  }

  const customClient =
    typeof sParams.cliente === 'string'
      ? sParams.cliente
      : typeof sParams.nome === 'string'
      ? sParams.nome
      : proposal.clientName;

  const title = `Proposta Comercial — ${proposal.title} | Nuelltech`;
  const description = `Proposta técnica e comercial preparada para ${customClient} pela Nuelltech.`;

  return {
    title,
    description,
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

export default async function ProposalSlugPage({
  params,
  searchParams,
}: ProposalPageProps) {
  const { id } = await params;
  const sParams = await searchParams;
  const proposal = getProposalById(id);

  if (!proposal) {
    notFound();
  }

  const customClientName =
    typeof sParams.cliente === 'string'
      ? sParams.cliente
      : typeof sParams.nome === 'string'
      ? sParams.nome
      : undefined;

  return (
    <ProposalView proposal={proposal} customClientName={customClientName} />
  );
}
