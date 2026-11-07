import type { Metadata } from 'next';
import PitchEnterprise from '@/components/docs/PitchEnterprise';

export const metadata: Metadata = {
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

export default function PitchEnterprisePage() {
  return <PitchEnterprise />;
}
