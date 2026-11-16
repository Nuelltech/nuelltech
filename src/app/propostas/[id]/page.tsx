import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropostasRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(`/proposta/${id}`);
}
