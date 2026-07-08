'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';

interface HeaderProps {
  lang: 'pt' | 'en';
  dict: {
    nav: { home: string; rcm: string; auditor: string; sales: string; custom: string; about: string; lab: string };
    hero: { ctaPrimary: string };
  };
}

export default function Header({ lang, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Generate path for the other language
  const getLanguageSwitchPath = (targetLang: 'pt' | 'en') => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split('/');
    if (segments.length > 1 && (segments[1] === 'pt' || segments[1] === 'en')) {
      segments[1] = targetLang;
      return segments.join('/');
    }
    return `/${targetLang}${pathname}`;
  };

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/rcm`, label: dict.nav.rcm },
    { href: `/${lang}/auditor-pro`, label: dict.nav.auditor },
    { href: `/${lang}/simulador-vendas`, label: dict.nav.sales },
    { href: `/${lang}/engenharia-a-medida`, label: dict.nav.custom },
    { href: `/${lang}/sobre`, label: dict.nav.about },
    { href: `/${lang}/laboratorio`, label: dict.nav.lab },
  ];

  return (
    <header className="sticky top-0 w-full z-40 border-b border-brand-border/60 bg-brand-bg/85 backdrop-blur-md transition duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group select-none">
          <Image
            src="/logo.png"
            alt="Nuelltech Logo"
            width={160}
            height={44}
            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-[1.02] transition duration-200"
            priority
          />
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium tracking-wide transition duration-150 ${
                pathname === link.href
                  ? 'text-brand-accent-soft'
                  : 'text-brand-ink-dim hover:text-brand-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language & CTA buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 border border-brand-border px-2.5 py-1.5 rounded-lg bg-brand-card text-[11px] font-medium font-mono text-brand-ink-dim">
            <Globe className="w-3.5 h-3.5" />
            <Link
              href={getLanguageSwitchPath('pt')}
              className={lang === 'pt' ? 'text-brand-accent-soft font-bold' : 'hover:text-brand-ink'}
            >
              PT
            </Link>
            <span>|</span>
            <Link
              href={getLanguageSwitchPath('en')}
              className={lang === 'en' ? 'text-brand-accent-soft font-bold' : 'hover:text-brand-ink'}
            >
              EN
            </Link>
          </div>

          <a
            href="https://calendly.com/nuelltech/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg text-xs transition duration-150 shadow-md shadow-brand-accent/10"
          >
            {dict.hero.ctaPrimary}
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Lang Selector Mini */}
          <div className="flex items-center gap-1.5 border border-brand-border px-2 py-1 rounded-lg bg-brand-card text-[10px] font-mono font-medium text-brand-ink-dim">
            <Link
              href={getLanguageSwitchPath('pt')}
              className={lang === 'pt' ? 'text-brand-accent-soft font-bold' : 'hover:text-brand-ink'}
            >
              PT
            </Link>
            <span>|</span>
            <Link
              href={getLanguageSwitchPath('en')}
              className={lang === 'en' ? 'text-brand-accent-soft font-bold' : 'hover:text-brand-ink'}
            >
              EN
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-ink p-1 hover:bg-brand-border/40 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-brand-bg border-b border-brand-border px-6 py-5 flex flex-col gap-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-1.5 border-b border-brand-border/30 ${
                  pathname === link.href ? 'text-brand-accent-soft' : 'text-brand-ink-dim'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://calendly.com/nuelltech/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2.5 px-4 rounded-lg text-xs transition"
          >
            {dict.hero.ctaPrimary}
          </a>
        </div>
      )}
    </header>
  );
}
