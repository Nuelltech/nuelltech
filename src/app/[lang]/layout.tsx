import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import { locales } from '@/i18n/settings';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
    title: isPt ? 'Nuelltech — Automação e Inteligência Artificial' : 'Nuelltech — Automation & Artificial Intelligence',
    description: isPt
      ? 'A Nuelltech transforma dados dispersos e processos manuais em decisões de gestão automatizadas com Inteligência Artificial.'
      : 'Nuelltech transforms scattered data and manual processes into automated management decisions with Artificial Intelligence.',
  };
}

import StoreTracker from '../../components/analytics/StoreTracker';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager / GA4 Template slot */}
        {/* Replace GTM-XXXXXX with actual container ID when DNS goes live */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KWTW9LGP');
            `,
          }}
        />
      </head>
      <body className="bg-brand-bg text-brand-ink min-h-screen flex flex-col font-sans antialiased" suppressHydrationWarning>
        <StoreTracker />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWTW9LGP"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  );
}
