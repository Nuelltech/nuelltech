'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FooterProps {
  lang: 'pt' | 'en';
  dict: {
    meta: { description: string };
    nav: { home: string; rcm: string; auditor: string; sales: string; custom: string; about: string; lab: string };
    footer: { contacts: string; location: string; rights: string };
  };
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="w-full bg-[#04060C] border-t border-brand-border/60 py-12 text-xs text-brand-ink-dim">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <Link href={`/${lang}`} className="flex items-center gap-2 group w-max select-none">
            <Image
              src="/logo.png"
              alt="Nuelltech Logo"
              width={150}
              height={38}
              className="h-8 w-auto object-contain group-hover:scale-[1.02] transition duration-200"
            />
          </Link>
          <p className="leading-relaxed text-[11px] max-w-[200px]">
            {dict.meta.description}
          </p>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-display font-bold text-brand-ink uppercase text-[10px] tracking-wider mb-4">
            Navegação
          </h4>
          <nav className="flex flex-col gap-2.5 font-medium">
            <Link href={`/${lang}`} className="hover:text-brand-ink transition">
              {dict.nav.home}
            </Link>
            <Link href={`/${lang}/rcm`} className="hover:text-brand-ink transition">
              {dict.nav.rcm}
            </Link>
            <Link href={`/${lang}/auditor-pro`} className="hover:text-brand-ink transition">
              {dict.nav.auditor}
            </Link>
            <Link href={`/${lang}/simulador-vendas`} className="hover:text-brand-ink transition">
              {dict.nav.sales}
            </Link>
          </nav>
        </div>

        {/* Support/Other Column */}
        <div>
          <h4 className="font-display font-bold text-brand-ink uppercase text-[10px] tracking-wider mb-4">
            Soluções
          </h4>
          <nav className="flex flex-col gap-2.5 font-medium">
            <Link href={`/${lang}/engenharia-a-medida`} className="hover:text-brand-ink transition">
              {dict.nav.custom}
            </Link>
            <Link href={`/${lang}/sobre`} className="hover:text-brand-ink transition">
              {dict.nav.about}
            </Link>
            <Link href={`/${lang}/laboratorio`} className="hover:text-brand-ink transition">
              {dict.nav.lab}
            </Link>
          </nav>
        </div>

        {/* Contacts Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="font-display font-bold text-brand-ink uppercase text-[10px] tracking-wider mb-2">
            {dict.footer.contacts}
          </h4>
          
          <a
            href="mailto:geral@nuelltech.com"
            className="flex items-center gap-2 hover:text-brand-ink transition w-max"
          >
            <Mail className="w-4 h-4 text-brand-accent-soft" />
            <span>geral@nuelltech.com</span>
          </a>

          <div className="flex items-center gap-2 w-max">
            <MapPin className="w-4 h-4 text-brand-accent-soft" />
            <span>{dict.footer.location}</span>
          </div>

          <a
            href="https://linkedin.com/company/nuelltech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-brand-ink transition w-max"
          >
            <LinkedinIcon className="w-4 h-4 text-brand-accent-soft" />
            <span>LinkedIn /nuelltech</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-brand-border/40 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px]">
        <span>{dict.footer.rights}</span>
        <div className="flex gap-4">
          <Link href={`/${lang}/sobre`} className="hover:underline">
            Termos de Uso
          </Link>
          <Link href={`/${lang}/sobre`} className="hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
