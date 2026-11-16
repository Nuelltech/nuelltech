import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Proposta Comercial | Nuelltech',
  description: 'Documento confidencial de proposta de desenvolvimento de software e serviços Nuelltech.',
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

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className={inter.variable}>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />
      </head>
      <body className="bg-[#f8fafc] text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
