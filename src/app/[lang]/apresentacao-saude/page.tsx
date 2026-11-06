import { redirect } from 'next/navigation';
import { locales } from '@/i18n/settings';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function ApresentacaoSaudeRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/saude`);
}
