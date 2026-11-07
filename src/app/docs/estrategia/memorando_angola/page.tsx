import type { Metadata } from 'next';
import MemorandoAngola from '@/components/docs/MemorandoAngola';

export const metadata: Metadata = {
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

export default function MemorandoAngolaPage() {
  return <MemorandoAngola />;
}
