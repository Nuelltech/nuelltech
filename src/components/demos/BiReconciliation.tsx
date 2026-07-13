'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  RefreshCw, 
  BarChart2, 
  X, 
  Check, 
  Smartphone, 
  Laptop, 
  BarChart3, 
  Calendar, 
  Zap, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface RawSales {
  m1: string;
  m2: string;
  m3: string;
  pvp: string;
}

interface ProductItem {
  name: string;
  badge: { pt: string; en: string };
  badgeClass: 'danger' | 'success';
  stock: string;
  expiry: string;
  avgSales: { pt: string; en: string };
  action: { pt: string; en: string };
  digitalAction: { pt: string; en: string };
  rawSales: RawSales;
}

const productsData: ProductItem[] = [
  {
    name: "Firstpharma Care Penso Rápido T20",
    badge: { pt: "🔥 Alto Risco", en: "🔥 High Risk" },
    badgeClass: "danger",
    stock: "11 un.",
    expiry: "01-2027",
    avgSales: { pt: "3 un./trim", en: "3 units/quarter" },
    action: {
      pt: "<b>Campanha Verão:</b> Expositor Acrílico de caixa física com preço promocional.",
      en: "<b>Summer Campaign:</b> Acrylic display at physical checkout with promotional price."
    },
    digitalAction: {
      pt: "<b>Push Mobile:</b> 'Kit SOS Férias com 20% de desconto na App hoje.'",
      en: "<b>Push Mobile:</b> 'SOS Vacation Kit with 20% off on the App today.'"
    },
    rawSales: { m1: "2 un", m2: "1 un", m3: "0 un", pvp: "2,60 € (PC: 0,92 €)" }
  },
  {
    name: "Ilvico Comp revest 20",
    badge: { pt: "🔥 Alto Risco", en: "🔥 High Risk" },
    badgeClass: "danger",
    stock: "11 un.",
    expiry: "01-2027",
    avgSales: { pt: "5 un./trim", en: "5 units/quarter" },
    action: {
      pt: "<b>Campanha Verão:</b> Cesto de impulso ao lado do teclado de atendimento físico.",
      en: "<b>Summer Campaign:</b> Impulse basket next to the physical checkout counter."
    },
    digitalAction: {
      pt: "<b>Ecrã Dinâmico:</b> Publicidade em vídeo rotativo no painel LED da montra.",
      en: "<b>Dynamic Screen:</b> Rotating video ad displayed on the shopfront window LED panel."
    },
    rawSales: { m1: "0 un", m2: "5 un", m3: "0 un", pvp: "9,95 € (PC: 5,44 €)" }
  },
  {
    name: "Irigaston Saquetas Promo 2U",
    badge: { pt: "💎 Lucro Oculto", en: "💎 Hidden Profit" },
    badgeClass: "success",
    stock: "4 un.",
    expiry: "01-2027",
    avgSales: { pt: "2 un./trim", en: "2 units/quarter" },
    action: {
      pt: "<b>Campanha Verão:</b> Sugestão oral ativa pelos farmacêuticos na linha de caixa.",
      en: "<b>Summer Campaign:</b> Active oral suggestion by pharmacists at the checkout line."
    },
    digitalAction: {
      pt: "<b>Recomendação App:</b> Banner 'Higiene Nasal Pós-Praia' ao pesquisar soros.",
      en: "<b>App Recommendation:</b> 'Post-Beach Nasal Hygiene' banner when searching saline solutions."
    },
    rawSales: { m1: "1 un", m2: "0 un", m3: "1 un", pvp: "17,95 € (PC: 6,69 €)" }
  },
  {
    name: "ZZZQUIL SONO FORTE GOMA 30",
    badge: { pt: "💎 Lucro Oculto", en: "💎 Hidden Profit" },
    badgeClass: "success",
    stock: "1 un.",
    expiry: "09-2027",
    avgSales: { pt: "0 un./trim", en: "0 units/quarter" },
    action: {
      pt: "<b>Campanha Outono:</b> Destaque na sinalética física de regresso às rotinas.",
      en: "<b>Autumn Campaign:</b> Prominent physical signage for returning to school/work routines."
    },
    digitalAction: {
      pt: "<b>SMS Marketing:</b> Disparo direcionado: 'Sem sono pós-férias? Conheça ZzzQuil.'",
      en: "<b>SMS Marketing:</b> Targeted blast: 'No sleep post-vacation? Discover ZzzQuil.'"
    },
    rawSales: { m1: "0 un", m2: "0 un", m3: "0 un", pvp: "23,45 € (PC: 13,35 €)" }
  },
  {
    name: "Absorvit Infantil Xarope 150ml",
    badge: { pt: "🔥 Alto Risco", en: "🔥 High Risk" },
    badgeClass: "danger",
    stock: "2 un.",
    expiry: "01-2027",
    avgSales: { pt: "0 un./trim", en: "0 units/quarter" },
    action: {
      pt: "<b>Campanha Outono:</b> Ilha infantil física sob o mote 'Regresso às Aulas'.",
      en: "<b>Autumn Campaign:</b> Physical kids island display themed 'Back to School'."
    },
    digitalAction: {
      pt: "<b>Newsletter:</b> Email especial regresso às rotinas focado no reforço imunitário.",
      en: "<b>Newsletter:</b> Special back-to-school email campaign focused on immune support."
    },
    rawSales: { m1: "0 un", m2: "0 un", m3: "0 un", pvp: "19,45 € (PC: 10,27 €)" }
  },
  {
    name: "Fluprox Comp eferv 600mg 20",
    badge: { pt: "🔥 Alto Risco", en: "🔥 High Risk" },
    badgeClass: "danger",
    stock: "33 un.",
    expiry: "06-2027",
    avgSales: { pt: "3 un./trim", en: "3 units/quarter" },
    action: {
      pt: "<b>Campanha Inverno:</b> Pilha central física volumétrica 'Inverno Sem Gripe'.",
      en: "<b>Winter Campaign:</b> Volumetric central physical stack 'Flu-Free Winter'."
    },
    digitalAction: {
      pt: "<b>Desconto App:</b> Alerta push animado para gripes e resfriados nas semanas frias.",
      en: "<b>App Discount:</b> Animated push alert for flu and cold relief on freezing weeks."
    },
    rawSales: { m1: "1 un", m2: "0 un", m3: "2 un", pvp: "6,95 € (PC: 2,13 €)" }
  }
];

const mockupsData = {
  pt: {
    tradicional: {
      verao1: "<b>Expositor Acrílico de Caixa:</b><br><small>Firstpharma Penso Rápido</small><br><i style='color:#64748b'>\"Leve de forma preventiva para a mala de viagem.\"</i>",
      verao2: "<b>Sinalética Alta Margem (62%):</b><br><small>Irigaston Saquetas Kit</small><br><i style='color:#64748b'>\"Colocar fisicamente junto à prateleira de higiene nasal e praia.\"</i>",
      verao3: "<b>Cesto Impulso de Balcão:</b><br><small>Ilvico Comp Revestidos</small><br><i style='color:#64748b'>\"Posicionar linearmente ao lado do terminal de pagamento.\"</i>",
      outono1: "<b>Ilha Central Regresso às Aulas:</b><br><small>Absorvit Infantil Xarope</small><br><i style='color:#64748b'>\"Reforço de defesas no arranque do ano letivo.\"</i>",
      outono2: "<b>Cartaz Físico de Balcão:</b><br><small>ZzzQuil Forte Gomas</small><br><i style='color:#64748b'>\"Regularizar o sono no regresso às rotinas das aulas/trabalho.\"</i>",
      outono3: "<b>Gôndola de Foco de Stress:</b><br><small>Valdispert Comp 45mg</small><br><i style='color:#64748b'>\"Destaque físico focado no equilíbrio e stress pós-férias.\"</i>",
      inverno1: "<b>Pilha Central de Alto Volume:</b><br><small>Fluprox 20m + Cêgripe 20</small><br><i style='color:#64748b'>\"Leve o Kit SOS Proteção de Inverno com preço especial.\"</i>",
      inverno2: "<b>Protocolo Técnico de Saída:</b><br><small>Strepsils Pastilhas</small><br><i style='color:#64748b'>\"Sugerir pastilhas na saída de qualquer medicação gripal.\"</i>",
      inverno3: "<b>Display de Balcão Rápido:</b><br><small>Aspirina C / Ben-u-ron direct</small><br><i style='color:#64748b'>\"Soluções rápidas efervescentes para sintomas imediatos.\"</i>"
    },
    digital: {
      verao1: "<b>Notificação Push (App):</b><br><i>\"🔔 <b>BI-PHARMA:</b> Vai de férias? Garanta o seu Kit SOS Viagem com 20% de desconto só hoje!\"</i>",
      verao2: "<b>Banner no Website (Foco Margem):</b><br><i>\"Higiene Nasal Pós-Praia: Conheça a gama Irigaston e respire em pleno neste verão.\"</i>",
      verao3: "<b>Ecrã Digital de Montra:</b><br><i>Anúncio digital rotativo com Ilvico: \"Alívio rápido de sintomas. Disponível para recolha rápida.\"</i>",
      outono1: "<b>Destaque Slider App:</b><br><i>\"Preparados para a Escola?\" Campanha integrada de Absorvit Infantil com oferta de brindes escolares.</i>",
      outono2: "<b>SMS Push Utentes Cadastrados:</b><br><i>\"Olá! Dificuldade em retomar o sono? Experimente ZzzQuil Gomas na App com pontos a duplicar.\"</i>",
      outono3: "<b>Newsletter Semanal Segmentada:</b><br><i>Disparo automático para utilizadores recorrentes promovendo o Valdispert para o stress de regresso.</i>",
      inverno1: "<b>Painel LED Indoor:</b><br><i>Vídeo promocional focado em Fluprox e Cêgripe com preço promocional exclusivo App.</i>",
      inverno2: "<b>SMS Push Georreferenciado:</b><br><i>\"Frio intenso esta semana? Proteja a sua garganta. Adicione Strepsils ao seu carrinho e ganhe 15% de desconto.\"</i>",
      inverno3: "<b>Anúncios Redes Sociais:</b><br><i>Carrossel Instagram/Facebook: Aspirina C e Ben-u-ron direct entregues em casa em 2 horas.</i>"
    }
  },
  en: {
    tradicional: {
      verao1: "<b>Acrylic Checkout Display:</b><br><small>Firstpharma Penso Rápido</small><br><i style='color:#64748b'>\"Take preventatively in your travel bag.\"</i>",
      verao2: "<b>High Margin Signage (62%):</b><br><small>Irigaston Saquetas Kit</small><br><i style='color:#64748b'>\"Place physically near the nasal hygiene and beach shelf.\"</i>",
      verao3: "<b>Countertop Impulse Basket:</b><br><small>Ilvico Comp Revestidos</small><br><i style='color:#64748b'>\"Position linearly next to the payment terminal.\"</i>",
      outono1: "<b>Back to School Center Island:</b><br><small>Absorvit Infantil Xarope</small><br><i style='color:#64748b'>\"Defense booster at the start of the school year.\"</i>",
      outono2: "<b>Physical Counter Sign:</b><br><small>ZzzQuil Forte Gomas</small><br><i style='color:#64748b'>\"Regulate sleep when returning to school/work routines.\"</i>",
      outono3: "<b>Stress Focus Gondola Shelf:</b><br><small>Valdispert Comp 45mg</small><br><i style='color:#64748b'>\"Physical spotlight focused on balance and post-vacation stress.\"</i>",
      inverno1: "<b>High-Volume Central Stack:</b><br><small>Fluprox 20m + Cêgripe 20</small><br><i style='color:#64748b'>\"Get the Winter SOS Protection Kit with a special price.\"</i>",
      inverno2: "<b>Outbound Technical Protocol:</b><br><small>Strepsils Pastilhas</small><br><i style='color:#64748b'>\"Suggest lozenges upon checking out any flu medication.\"</i>",
      inverno3: "<b>Fast Checkout Counter Display:</b><br><small>Aspirina C / Ben-u-ron direct</small><br><i style='color:#64748b'>\"Fast effervescent solutions for immediate cold relief.\"</i>"
    },
    digital: {
      verao1: "<b>Push Notification (App):</b><br><i>\"🔔 <b>BI-PHARMA:</b> Going on vacation? Secure your SOS Travel Kit with 20% off today only!\"</i>",
      verao2: "<b>Website Banner (Margin Focus):</b><br><i>\"Post-Beach Nasal Hygiene: Discover the Irigaston range and breathe easy this summer.\"</i>",
      verao3: "<b>Digital Window Screen:</b><br><i>Rotating digital ad with Ilvico: \"Fast symptom relief. Available for quick pickup.\"</i>",
      outono1: "<b>App Slider Spotlight:</b><br><i>\"Ready for School?\" Integrated Absorvit Infantil campaign with free school giveaways.</i>",
      outono2: "<b>SMS Push (Registered Users):</b><br><i>\"Hello! Trouble getting back to sleep? Try ZzzQuil Gummies on the App with double points.\"</i>",
      outono3: "<b>Segmented Weekly Newsletter:</b><br><i>Automated blast to recurring users promoting Valdispert for back-to-work stress.</i>",
      inverno1: "<b>Indoor LED Panel:</b><br><i>Promotional video highlighting Fluprox and Cêgripe with an App-exclusive promo price.</i>",
      inverno2: "<b>Geotargeted SMS Push:</b><br><i>\"Severe cold this week? Protect your throat. Add Strepsils to your cart for 15% off.\"</i>",
      inverno3: "<b>Social Media Ads:</b><br><i>Instagram/Facebook Carousel: Aspirina C and Ben-u-ron direct delivered to your door in 2 hours.</i>"
    }
  }
};

const mockCampaignsMobile = {
  pt: {
    tradicional: {
      verao: "<b>Firstpharma/Fenistil:</b> Expositor Acrílico de Caixa para mala SOS férias.",
      outono: "<b>Absorvit/ZzzQuil:</b> Expositor na ilha de 'Regresso às Aulas e Sono'.",
      inverno: "<b>Fluprox/Cêgripe:</b> Pilha de volume no balcão de pagamento rápido."
    },
    digital: {
      verao: "<b>Notificação App:</b> '🔔 BI-PHARMA: Compre o Kit SOS Viagem na App c/ 20% desc.'",
      outono: "<b>Notificação App:</b> '🔔 BI-PHARMA: Dificuldade em dormir? ZzzQuil Gomas.'",
      inverno: "<b>SMS Marketing:</b> 'Olá! Desconto exclusivo em Fluprox efervescente na App.'"
    }
  },
  en: {
    tradicional: {
      verao: "<b>Firstpharma/Fenistil:</b> Acrylic Checkout Display for SOS vacation bag.",
      outono: "<b>Absorvit/ZzzQuil:</b> Counter island display for 'Back to School & Sleep'.",
      inverno: "<b>Fluprox/Cêgripe:</b> High-volume central stack at payment counter."
    },
    digital: {
      verao: "<b>App Notification:</b> '🔔 BI-PHARMA: Buy the SOS Travel Kit on the App with 20% off.'",
      outono: "<b>App Notification:</b> '🔔 BI-PHARMA: Trouble sleeping? ZzzQuil Gummies.'",
      inverno: "<b>SMS Marketing:</b> 'Hello! Exclusive discount on effervescent Fluprox on the App.'"
    }
  }
};

const tableASalesData = [
  { name: "Absorvit Infantil Xarope 150ml", m1: 0, m2: 0, m3: 0, pvp: "19,45 €", pc: "10,27 €" },
  { name: "Firstpharma Care Penso Rápido T20", m1: 2, m2: 1, m3: 0, pvp: "2,60 €", pc: "0,92 €" },
  { name: "Aelardis Comp orodisp 20mg 20", m1: 4, m2: 1, m3: 0, pvp: "6,39 €", pc: "3,27 €" },
  { name: "Irigaston Saquetas Promo 2U", m1: 1, m2: 0, m3: 1, pvp: "17,95 €", pc: "6,69 €" },
  { name: "Fenistil Gel 1mg/g 50g", m1: 2, m2: 7, m3: 5, pvp: "12,50 €", pc: "7,20 €" },
  { name: "Aero-OM Duo Comp 50mg 20", m1: 2, m2: 0, m3: 0, pvp: "18,10 €", pc: "11,71 €" },
  { name: "Aspirina C Comp eferv 10", m1: 1, m2: 3, m3: 0, pvp: "6,50 €", pc: "4,11 €" },
  { name: "Ben-u-ron direct Gran saq 500mg", m1: 0, m2: 0, m3: 0, pvp: "5,20 €", pc: "3,38 €" },
  { name: "Betadine Pda 100mg/g 100g", m1: 0, m2: 0, m3: 0, pvp: "12,95 €", pc: "9,18 €" },
  { name: "Cêgripe Comp 20", m1: 5, m2: 1, m3: 3, pvp: "11,50 €", pc: "7,40 €" },
  { name: "Fluprox Comp eferv 600mg 20", m1: 1, m2: 0, m3: 2, pvp: "6,95 €", pc: "2,13 €" }
];

const tableBExpiryData = [
  { name: "Absorvit Infantil Xarope 150ml", stock: 2, expiry: "01-2027", critical: true },
  { name: "Firstpharma Care Penso Rápido T20", stock: 11, expiry: "01-2027", critical: true },
  { name: "Aelardis Comp orodisp 20mg 20", stock: 5, expiry: "01-2027", critical: true },
  { name: "Irigaston Saquetas Promo 2U", stock: 4, expiry: "01-2027", critical: true },
  { name: "Fenistil Gel 1mg/g 50g", stock: 6, expiry: "01-2027", critical: true },
  { name: "Aero-OM Duo Comp 50mg 20", stock: 2, expiry: "11-2027", critical: false },
  { name: "Aspirina C Comp eferv 10", stock: 4, expiry: "11-2027", critical: false },
  { name: "Ben-u-ron direct Gran saq 500mg", stock: 6, expiry: "08-2027", critical: false },
  { name: "Betadine Pda 100mg/g 100g", stock: 3, expiry: "03-2027", critical: false },
  { name: "Cêgripe Comp 20", stock: 17, expiry: "07-2027", critical: false },
  { name: "Fluprox (MG) Comp eferv 600mg 20", stock: 33, expiry: "06-2027", critical: false }
];

export default function BiReconciliation({ pt = true }: { pt?: boolean }) {
  const [tab, setTab] = useState<'analise' | 'campanhas'>('analise');
  const [mobileTab, setMobileTab] = useState<'home' | 'alerts' | 'campaigns'>('home');
  const [reconciling, setReconciling] = useState(false);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [tableTab, setTableTab] = useState<'stock' | 'sales'>('stock');
  const [channel, setChannel] = useState<'tradicional' | 'digital'>('tradicional');
  
  // Tinder Swipe and Bottom Drawer details
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const [swipedCards, setSwipedCards] = useState<Record<number, 'left' | 'right'>>({});
  
  // Toast Alert States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [mobileToast, setMobileToast] = useState<string | null>(null);
  const [showMobileToast, setShowMobileToast] = useState(false);

  // Sync state between viewport sizes
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  const startAnalysisSimulation = () => {
    setReconciling(true);
    setStep(1);
    setShowResults(false);
  };

  useEffect(() => {
    if (!reconciling) return;

    if (step === 1) {
      const t = setTimeout(() => setStep(2), 700);
      return () => clearTimeout(t);
    } else if (step === 2) {
      const t = setTimeout(() => setStep(3), 700);
      return () => clearTimeout(t);
    } else if (step === 3) {
      const t = setTimeout(() => {
        setReconciling(false);
        setShowResults(true);
        setIsAnalysisComplete(true);
        triggerToast(pt ? "Cruzamento concluído! Lotes prontos para escoamento." : "Cross-reference complete! Expirations detected.");
        setMobileTab('alerts');
      }, 700);
      return () => clearTimeout(t);
    }
  }, [step, reconciling, pt]);

  const triggerToast = (msg: string, isMobile = false) => {
    if (isMobile) {
      setMobileToast(msg);
      setShowMobileToast(true);
      setTimeout(() => setShowMobileToast(false), 3000);
    } else {
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4500);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (activeCardIndex >= productsData.length) return;

    const prodName = productsData[activeCardIndex].name;
    setSwipedCards(prev => ({ ...prev, [activeCardIndex]: direction }));
    
    const msg = direction === 'right'
      ? (pt ? `Campanha lançada para ${prodName}!` : `Campaign launched for ${prodName}!`)
      : (pt ? `Alerta de ${prodName} arquivado.` : `Alert for ${prodName} archived.`);
    
    triggerToast(msg, true);

    setTimeout(() => {
      setActiveCardIndex(prev => prev + 1);
    }, 300);
  };

  // Ring circular calculations
  const baseHealth = 78;
  const currentHealth = activeCardIndex >= productsData.length 
    ? 100 
    : isAnalysisComplete 
    ? 89 
    : baseHealth;
  const strokeOffset = 201 - (201 * currentHealth / 100);

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden relative font-sans text-xs">
      
      {/* =============================================================== */}
      {/* DESKTOP LAYOUT (visible on medium/large screens)               */}
      {/* =============================================================== */}
      <div className="hidden md:flex flex-col w-full">
        {/* Desktop Header */}
        <header className="bg-[#0f172a] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#0284c7] shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Nuelltech" className="h-7 w-auto object-contain" />
            <div className="w-[1px] bg-slate-700 h-5" />
            <span className="font-display font-semibold text-base text-sky-400">Bi-Pharma</span>
          </div>
          <div className="bg-sky-500/10 border border-sky-400/30 text-sky-300 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:bg-sky-400 before:rounded-full before:animate-ping">
            {pt ? 'Demonstração Interativa' : 'Interactive Demo'}
          </div>
        </header>

        {/* Navigation Tab Bar */}
        <nav className="bg-white flex justify-center border-b border-slate-200 sticky top-0 z-35 shadow-sm">
          <button
            onClick={() => setTab('analise')}
            className={`tab-btn flex items-center gap-2 py-4 px-8 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer ${
              tab === 'analise' 
                ? 'border-[#0284c7] text-[#0284c7]' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            {pt ? '1. Cruzamento de Dados' : '1. Data Cross-Reference'}
          </button>
          <button
            onClick={() => { if (isAnalysisComplete) setTab('campanhas'); }}
            disabled={!isAnalysisComplete}
            className={`tab-btn flex items-center gap-2 py-4 px-8 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 ${
              !isAnalysisComplete 
                ? 'opacity-40 cursor-not-allowed border-transparent text-slate-400' 
                : tab === 'campanhas'
                ? 'border-[#0284c7] text-[#0284c7] cursor-pointer'
                : 'border-transparent text-slate-400 hover:text-slate-600 cursor-pointer'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {pt ? '2. Aplicação em Campanhas' : '2. Campaign Application'}
          </button>
        </nav>

        {/* Content Container */}
        <div className="p-6 bg-slate-100 flex-1 min-h-[480px]">
          
          {/* TAB 1: DATA CROSS-REFERENCE */}
          {tab === 'analise' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Table A: Raw Sales Data */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2.5">
                    <BarChart3 className="w-4 h-4 text-[#0284c7]" />
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
                      {pt ? 'Histórico de Vendas Real (Dados Brutos 2025)' : 'Real Sales History (Raw Data 2025)'}
                    </h4>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg text-[11px] text-slate-600">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-800 font-bold uppercase text-[9px] border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                          <th className="p-2.5 text-left">{pt ? 'Produto' : 'Product'}</th>
                          <th className="p-2.5 text-center">{pt ? 'Julho' : 'July'}</th>
                          <th className="p-2.5 text-center">{pt ? 'Agosto' : 'August'}</th>
                          <th className="p-2.5 text-center">{pt ? 'Setembro' : 'September'}</th>
                          <th className="p-2.5 text-right">PVP</th>
                          <th className="p-2.5 text-right">PC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableASalesData.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2.5 font-medium">{item.name}</td>
                            <td className="p-2.5 text-center">{item.m1} {pt ? 'un' : 'units'}</td>
                            <td className="p-2.5 text-center">{item.m2} {pt ? 'un' : 'units'}</td>
                            <td className="p-2.5 text-center">{item.m3} {pt ? 'un' : 'units'}</td>
                            <td className="p-2.5 text-right">{item.pvp}</td>
                            <td className="p-2.5 text-right">{item.pc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table B: Target Expiry Inventory */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2.5">
                    <Database className="w-4 h-4 text-[#0284c7]" />
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
                      {pt ? 'Inventário de Validades Alvo (Extração Winphar)' : 'Target Expiry Inventory (Winphar)'}
                    </h4>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg text-[11px] text-slate-600">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-800 font-bold uppercase text-[9px] border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                          <th className="p-2.5 text-left">{pt ? 'Produto de Venda Livre' : 'Product'}</th>
                          <th className="p-2.5 text-center">{pt ? 'Stock Físico' : 'Physical Stock'}</th>
                          <th className="p-2.5 text-right">{pt ? 'Caducidade' : 'Expiry'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableBExpiryData.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-2.5 font-medium">{item.name}</td>
                            <td className="p-2.5 text-center"><strong>{item.stock} {pt ? 'un' : 'units'}</strong></td>
                            <td className={`p-2.5 text-right font-bold font-mono ${item.critical ? 'text-red-500' : 'text-slate-500'}`}>{item.expiry}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Action Simulation Box */}
              {!reconciling && !showResults && (
                <div className="bg-[#f0f9ff] border-2 border-dashed border-[#bae6fd] p-8 rounded-xl text-center shadow-inner flex flex-col items-center gap-3">
                  <p className="font-semibold text-sm text-[#0369a1] leading-relaxed">
                    {pt 
                      ? 'O algoritmo detetou um desalinhamento temporal crítico entre a rotação de vendas e os prazos de caducidade.' 
                      : 'The algorithm detected a critical timing misalignment between sales run-rate and stock shelf life.'}
                  </p>
                  <button 
                    onClick={startAnalysisSimulation}
                    className="flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 px-8 rounded-full text-xs transition duration-200 shadow-md shadow-sky-400/20 uppercase tracking-wide cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {pt ? 'Correr Cruzamento Bi-Pharma' : 'Run Bi-Pharma Reconciler'}
                  </button>
                </div>
              )}

              {/* Loading State animation */}
              {reconciling && (
                <div className="bg-white border border-slate-200 p-10 rounded-xl text-center shadow-sm flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0284c7] rounded-full animate-spin" />
                  <span className="font-semibold text-slate-800 text-xs animate-pulse">
                    {step === 1 
                      ? (pt ? 'A cruzar dados de vendas homólogos (Faturação 2025)...' : 'Cross-referencing homolog sales history (Billing 2025)...')
                      : step === 2
                      ? (pt ? 'A analisar datas de validade críticas (Winphar)...' : 'Analyzing critical expiration schedules (Winphar)...')
                      : (pt ? 'A calibrar margens e a estruturar campanhas...' : 'Calibrating margins and scheduling sales campaigns...')}
                  </span>
                </div>
              )}

              {/* Results metrics & table */}
              {showResults && (
                <div className="animate-fade-in flex flex-col gap-6">
                  
                  {/* KPI Row cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-red-500 shadow-sm relative overflow-hidden">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {pt ? 'Prejuízo Bruto Evitado por Antecipação' : 'Prevented Gross Loss'}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-2 font-display">518,45 €</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {pt ? 'Lotes com caducidade < 9 meses' : 'Batches with shelf life < 9 months'}
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-[#0284c7] shadow-sm relative overflow-hidden">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {pt ? 'Linhas com Alerta de Sobrestock' : 'SKUs with Overstock Alert'}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-2 font-display">{pt ? '11 Lotes Críticos' : '11 Critical Batches'}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {pt ? 'Artigos com velocidade inadequada' : 'Items with inadequate velocity'}
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-4 border-emerald-500 shadow-sm relative overflow-hidden">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {pt ? 'Margem Oculta Resgatada' : 'Recovered Hidden Margin'}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-2 font-display">63,60 €</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {pt ? 'Oportunidades de alta margem paradas' : 'Idle high-margin opportunities'}
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic analysis result table */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2.5 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider">
                        {pt ? 'Resultado da Análise Preditiva de Perdas' : 'Predictive Loss Analysis Results'}
                      </h4>
                    </div>
                    <div className="overflow-x-auto text-[11px] text-slate-600">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-800 font-bold uppercase text-[9px] border-b border-slate-200">
                            <th className="p-2.5 text-left">{pt ? 'Artigo Identificado' : 'Identified Product'}</th>
                            <th className="p-2.5 text-right">PVP</th>
                            <th className="p-2.5 text-right">{pt ? 'Margem Un.' : 'Unit Margin'}</th>
                            <th className="p-2.5 text-center">{pt ? 'Stock' : 'Stock'}</th>
                            <th className="p-2.5 text-center">{pt ? 'Vendas Trimestre' : 'Quarterly Sales'}</th>
                            <th className="p-2.5 text-center">{pt ? 'Estado' : 'Status'}</th>
                            <th className="p-2.5 text-left">{pt ? 'Enquadramento / Solução Nuelltech' : 'Strategy / Nuelltech Solution'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productsData.map((item, idx) => (
                            <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50/50 ${
                              item.badgeClass === 'danger' ? 'bg-red-500/[0.015]' : 'bg-emerald-500/[0.015]'
                            }`}>
                              <td className="p-2.5 font-bold text-slate-800">{item.name}</td>
                              <td className="p-2.5 text-right font-mono">{item.rawSales.pvp.split(' ')[0]} €</td>
                              <td className="p-2.5 text-right font-mono font-semibold">
                                {idx === 2 || idx === 3 ? <span className="text-emerald-600 font-bold">{idx === 2 ? '11,26 €' : '10,10 €'}</span> : '—'}
                              </td>
                              <td className="p-2.5 text-center font-medium font-mono">{pt ? item.stock : item.stock.replace('un.', 'units')}</td>
                              <td className="p-2.5 text-center font-mono">{item.rawSales.m1.split(' ')[0] === '0' && item.rawSales.m2.split(' ')[0] === '0' && item.rawSales.m3.split(' ')[0] === '0' ? (pt ? '0 un' : '0 units') : (pt ? '3 un' : '3 units')}</td>
                              <td className="p-2.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                  item.badgeClass === 'danger' 
                                    ? 'bg-red-50 text-red-600 border border-red-200' 
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                }`}>
                                  {pt ? item.badge.pt : item.badge.en}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-700 leading-relaxed">
                                {idx === 0 && (pt ? '<b>Verão (Jul-Set):</b> Pico de férias e pequenos traumas. Forçar volume comercial.' : '<b>Summer (Jul-Sep):</b> Peak travel & minor wounds. Push retail volume.')}
                                {idx === 1 && (pt ? '<b>Verão (Jul-Set):</b> Sazonalidade baixa. Caduca em Janeiro. Escoar por impulso em caixa.' : '<b>Summer (Jul-Sep):</b> Low seasonal demand. Expirations in Jan. Clear at counter.')}
                                {idx === 2 && (pt ? '<b>Alta Margem (62%):</b> Forçar venda complementar na caixa física. Excelente rentabilidade.' : '<b>High Margin (62%):</b> Cross-sell at physical checkout. High profitability.')}
                                {idx === 3 && (pt ? '<b>Venda Zero / Margem Elevada:</b> Puxar via marketing de \"Ajuste de Sono pós-férias\".' : '<b>Zero Sales / High Margin:</b> Recover via \"Post-vacation sleep reset\" marketing.')}
                                {idx === 4 && (pt ? '<b>Outono (Set-Nov):</b> Integração no Regresso às Aulas (Reforço Escolar e Defesas).' : '<b>Autumn (Sep-Nov):</b> Leverage Back-to-school campaigns (Immunity & school focus).')}
                                {idx === 5 && (pt ? '<b>Inverno (Nov-Fev):</b> Época Gripal Máxima. Escoamento massivo no balcão.' : '<b>Winter (Nov-Feb):</b> High cold & flu season. Massive checkout stack clearance.')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CAMPAIGN MOCKUPS */}
          {tab === 'campanhas' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-center items-center">
                <div className="bg-slate-200 p-1 rounded-xl inline-flex shadow-inner">
                  <button 
                    onClick={() => setChannel('tradicional')}
                    className={`flex items-center gap-1.5 py-2 px-6 rounded-lg text-xs font-bold transition uppercase tracking-wide cursor-pointer ${
                      channel === 'tradicional' 
                        ? 'bg-white text-[#0284c7] shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    🏢 {pt ? 'Farmácia Física' : 'Physical Pharmacy'}
                  </button>
                  <button 
                    onClick={() => setChannel('digital')}
                    className={`flex items-center gap-1.5 py-2 px-6 rounded-lg text-xs font-bold transition uppercase tracking-wide cursor-pointer ${
                      channel === 'digital' 
                        ? 'bg-white text-[#0284c7] shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    📱 {pt ? 'Canal Digital (App / SMS)' : 'Digital Channel (App/SMS)'}
                  </button>
                </div>
              </div>

              {/* Summer section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-800">
                    {pt ? 'Campanha Sazonal: Pico de Verão (Julho a Setembro)' : 'Seasonal Campaign: Summer Peak (July to September)'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  <strong>{pt ? 'Justificação Civil:' : 'Civil Rationale:'}</strong> {pt ? 'Período de férias e turismo escolar/familiar. Além de limpar o stock de risco estival estagnado, o sistema injeta produtos de alta rentabilidade que estavam parados no armazém físico.' : 'School vacations and family tourism. In addition to clearing stagnant seasonal risk stock, the system boosts high-profit items lying idle.'}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica de Balcão (Risco)' : 'Checkout Strategy (Risk)'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].verao1 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Escoar excedentário crítico de pensos rápidos.' : '💡 Focus: Clear critical overstock of adhesive bandages.'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica "Rentabilidade Extra"' : 'Strategy "Extra Profitability"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].verao2 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-emerald-600 font-bold mt-2">{pt ? '💰 Foco: Puxar o Irigaston. Margem de 11,26 €/unidade!' : '💰 Focus: Push Irigaston. Margin of 11.26 €/unit!'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica de Impulso de Caixa' : 'Impulse Strategy (Checkout)'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].verao3 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Forçar a saída de 11 unidades de Ilvico.' : '💡 Focus: Force clearance of 11 units of Ilvico.'}</p>
                  </div>
                </div>
              </div>

              {/* Autumn Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-800">
                    {pt ? 'Campanha Sazonal: Regresso às Rotinas (Setembro a Novembro)' : 'Seasonal Campaign: Back to Routines (September to November)'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  <strong>{pt ? 'Justificação Civil:' : 'Civil Rationale:'}</strong> {pt ? 'Fim das férias e reabertura de escolas/empresas. Foco em energia para o regresso ao trabalho/aulas e ativação de estimuladores de margem para regular o sono de transição.' : 'End of holidays and school reopenings. Focus on energy for work/classes and activation of margin boosters for sleep regulation.'}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica "Regresso às Aulas"' : 'Strategy "Back to School"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].outono1 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Garantir o escoamento dos xaropes infantis.' : '💡 Focus: Guarantee clearance of children syrups.'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica "Puxar Margem Oculta"' : 'Strategy "Uncover Margin"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].outono2 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-emerald-600 font-bold mt-2">{pt ? '💰 Foco: Ativar o ZzzQuil. Lucro líquido de 10,10 €/un!' : '💰 Focus: Activate ZzzQuil. Net profit of 10.10 €/unit!'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica "Fadiga Crónica"' : 'Strategy "Chronic Fatigue"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].outono3 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Estimular a rotação de calmantes de regresso.' : '💡 Focus: Stimulate sales of stress relief products.'}</p>
                  </div>
                </div>
              </div>

              {/* Winter Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-800">
                    {pt ? 'Campanha Sazonal: Época Gripal de Inverno (Novembro a Fevereiro)' : 'Seasonal Campaign: Winter Cold & Flu Season (November to February)'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  <strong>{pt ? 'Justificação Civil:' : 'Civil Rationale:'}</strong> {pt ? 'Pico de vírus respiratórios em território nacional. Altura estratégica de escoar grandes volumes acumulados aproveitando a elevadíssima procura natural de urgência.' : 'Respirational viruses peak. Strategic timing to clear large accumulated stocks taking advantage of the high natural demand.'}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica \"Inverno Sem Gripe\"' : 'Strategy \"Cold-Free Winter\"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].inverno1 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Limpar Fluprox e Cêgripe excedentários.' : '💡 Focus: Clear overstock Fluprox and Cêgripe.'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica \"Alívio de Balcão\"' : 'Strategy \"Checkout Relief\"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].inverno2 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Venda cruzada obrigatória com pastilhas.' : '💡 Focus: Mandatory cross-selling with pastilles.'}</p>
                  </div>
                  <div className="flex flex-col justify-between bg-slate-50 p-4 border border-slate-200 rounded-lg">
                    <span className="font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-1.5 mb-3 block">{pt ? 'Mecânica \"Prevenção Rápida\"' : 'Strategy \"Rapid Prevention\"'}</span>
                    <div dangerouslySetInnerHTML={{ __html: mockupsData[pt ? 'pt' : 'en'][channel].inverno3 }} className={channel === 'digital' ? 'mockup-preview digital-style' : 'mockup-preview traditional-style'} />
                    <p className="text-[10px] text-sky-600 font-semibold mt-2">{pt ? '💡 Foco: Escoar efervescentes com validade curta.' : '💡 Focus: Clear short-expiry effervescent lines.'}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Desktop Toast Notification */}
        <div className={`fixed bottom-6 right-6 bg-white shadow-2xl border-l-4 border-[#10b981] p-4 rounded-lg flex items-center gap-3 z-50 transition-all duration-300 max-w-sm ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`} id="analysis-toast">
          <div className="flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-full p-1.5 flex-shrink-0">
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs text-slate-800">
              {pt ? 'Análise Bi-Pharma Concluída' : 'Bi-Pharma Analysis Complete'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {toastMessage || (pt ? '11 lotes identificados e campanhas geradas.' : '11 batches identified and campaigns scheduled.')}
            </span>
          </div>
          <button className="text-slate-400 text-sm font-bold ml-auto hover:text-slate-600 cursor-pointer pl-2" onClick={() => setShowToast(false)}>×</button>
        </div>
      </div>

      {/* =============================================================== */}
      {/* MOBILE LAYOUT (visible on small viewports)                     */}
      {/* =============================================================== */}
      <div className="flex md:hidden flex-col w-full min-h-[500px] bg-slate-100 pb-16 relative">
        {/* Mobile Toast Alert */}
        <div className={`mob-toast flex items-center gap-2 bg-[#0f172a] text-white p-3 rounded-lg shadow-lg text-[10px] border-l-4 border-emerald-500 absolute left-3 right-3 z-50 transition-all duration-300 ${
          showMobileToast ? 'top-3' : '-top-16'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{mobileToast || 'Ação concluída!'}</span>
        </div>

        {/* Mobile Header */}
        <div className="mob-header bg-[#0f172a] text-white px-4 py-3 flex justify-between items-center border-b-2 border-sky-500 z-30">
          <div className="flex items-center gap-2">
            <Database className="w-4.5 h-4.5 text-sky-400" />
            <span className="mob-title font-display font-extrabold text-sm uppercase tracking-wider">Bi-Pharma</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-sky-400 font-bold text-[10px]">N</div>
        </div>

        {/* Mobile Content screens */}
        <div className="flex-1 p-4 overflow-y-auto">

          {/* SCREEN 1: DASHBOARD HOME */}
          {mobileTab === 'home' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg width="64" height="64" className="-rotate-90">
                    <circle className="stroke-slate-100 fill-none" strokeWidth="5" cx="32" cy="32" r="28" />
                    <circle 
                      className="fill-none transition-all duration-1000 ease-in-out" 
                      strokeWidth="5" 
                      cx="32" 
                      cy="32" 
                      r="28"
                      stroke={currentHealth >= 90 ? '#10b981' : currentHealth >= 80 ? '#0284c7' : '#f59e0b'}
                      strokeDasharray="176"
                      strokeDashoffset={176 - (176 * currentHealth / 100)}
                    />
                  </svg>
                  <span className="absolute font-display font-extrabold text-slate-800 text-sm">{currentHealth}%</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-display font-bold text-slate-800 text-xs mb-1">
                    {pt ? 'Saúde do Armazém' : 'Warehouse Health'}
                  </h3>
                  <p className="text-slate-500 text-[10px] leading-relaxed">
                    {activeCardIndex >= productsData.length 
                      ? (pt ? 'Stock Excelente! Todos os lotes foram escoados.' : 'Excellent Stock! All batches cleared.')
                      : isAnalysisComplete 
                      ? (pt ? 'Análise concluída. Lotes em processamento.' : 'Analysis done. Batches in progress.')
                      : (pt ? 'Detetámos 11 lotes em risco de expiração.' : 'We detected 11 batches in danger of expiry.')}
                  </p>
                </div>
              </div>

              {!reconciling && !isAnalysisComplete && (
                <button 
                  onClick={startAnalysisSimulation}
                  className="flex items-center justify-center gap-2 bg-[#0284c7] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wide w-full shadow-md shadow-sky-400/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {pt ? 'Correr Cruzamento Bi-Pharma' : 'Run Bi-Pharma Reconciler'}
                </button>
              )}

              {reconciling && (
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-[#0284c7] rounded-full animate-spin" />
                  <p className="text-slate-800 text-[11px] font-semibold font-mono animate-pulse">
                    {step === 1 ? (pt ? 'A cruzar faturas históricas...' : 'Crossing invoice history...') : step === 2 ? (pt ? 'A ler validades Winphar...' : 'Reading Winphar expiries...') : (pt ? 'A desenhar ações...' : 'Designing actions...')}
                  </p>
                </div>
              )}

              <div className="flex gap-3 overflow-x-auto pb-1 text-left">
                <div className="bg-white border border-slate-200 border-t-3 border-red-500 rounded-xl p-3 flex-1 min-w-[110px] shadow-sm">
                  <div className="text-[8px] uppercase font-bold text-slate-400">{pt ? 'Perda em Risco' : 'Loss at Risk'}</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1 font-display">{isAnalysisComplete ? '518,45 €' : '—'}</div>
                </div>
                <div className="bg-white border border-slate-200 border-t-3 border-[#0284c7] rounded-xl p-3 flex-1 min-w-[110px] shadow-sm">
                  <div className="text-[8px] uppercase font-bold text-slate-400">{pt ? 'Lotes Críticos' : 'Critical Batches'}</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1 font-display">{isAnalysisComplete ? '6 Lotes' : '—'}</div>
                </div>
                <div className="bg-white border border-slate-200 border-t-3 border-emerald-500 rounded-xl p-3 flex-1 min-w-[110px] shadow-sm">
                  <div className="text-[8px] uppercase font-bold text-slate-400">{pt ? 'Margem Oculta' : 'Hidden Margin'}</div>
                  <div className="text-sm font-extrabold text-slate-800 mt-1 font-display">{isAnalysisComplete ? '63,60 €' : '—'}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-left flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{pt ? 'Alertas Principais' : 'Main Alerts'}</span>
                
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[11px]">Firstpharma Care Penso T20</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Caduca em 01-2027 • 11 un.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">{pt ? 'Crítico' : 'Critical'}</span>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[11px]">Irigaston Saquetas Promo</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Margem Un. 11,26€ • 4 un.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">{pt ? 'Lucro' : 'Profit'}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[11px]">Fluprox Comp 600mg</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Caduca em 06-2027 • 33 un.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">{pt ? 'Crítico' : 'Critical'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: TINDER CARDS SWIPER */}
          {mobileTab === 'alerts' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[380px] animate-fade-in relative">
              {activeCardIndex < productsData.length ? (
                <>
                  <div className="relative w-[280px] h-[320px] flex justify-center items-center">
                    {productsData.map((prod, idx) => {
                      if (idx < activeCardIndex) return null;
                      
                      const isTop = idx === activeCardIndex;
                      const isNext = idx === activeCardIndex + 1;
                      const isThird = idx === activeCardIndex + 2;
                      const swipeDir = swipedCards[idx];

                      let transformStyle = '';
                      let opacityStyle = '1';
                      let zIndexStyle = 5;

                      if (isTop) {
                        zIndexStyle = 5;
                        if (swipeDir === 'left') {
                          transformStyle = 'translate(-380px, -20px) rotate(-15deg)';
                          opacityStyle = '0';
                        } else if (swipeDir === 'right') {
                          transformStyle = 'translate(380px, -20px) rotate(15deg)';
                          opacityStyle = '0';
                        } else {
                          transformStyle = 'scale(1) translateY(0)';
                        }
                      } else if (isNext) {
                        transformStyle = 'scale(0.95) translateY(12px)';
                        opacityStyle = '0.9';
                        zIndexStyle = 4;
                      } else if (isThird) {
                        transformStyle = 'scale(0.9) translateY(24px)';
                        opacityStyle = '0.7';
                        zIndexStyle = 3;
                      } else {
                        transformStyle = 'scale(0.85) translateY(36px)';
                        opacityStyle = '0';
                        zIndexStyle = 2;
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            transform: transformStyle,
                            opacity: opacityStyle,
                            zIndex: zIndexStyle,
                          }}
                          className="absolute w-[280px] h-[310px] bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all duration-300 transform-gpu text-left"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-display font-extrabold text-slate-800 text-[13px] leading-tight max-w-[70%]">{prod.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              prod.badgeClass === 'danger' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}>
                              {pt ? prod.badge.pt : prod.badge.en}
                            </span>
                          </div>
                          
                          <div className="bg-slate-100 rounded-xl p-3 flex justify-between text-center text-[10px]">
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">{pt ? 'Stock' : 'Stock'}</h5>
                              <p className="font-bold text-slate-700 mt-0.5">{prod.stock}</p>
                            </div>
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">{pt ? 'Validade' : 'Expiry'}</h5>
                              <p className="font-bold text-slate-700 mt-0.5">{prod.expiry}</p>
                            </div>
                            <div>
                              <h5 className="text-[8px] text-slate-400 uppercase font-bold">{pt ? 'Vendas' : 'Sales'}</h5>
                              <p className="font-bold text-slate-700 mt-0.5">{pt ? prod.avgSales.pt.split(' ')[0] : prod.avgSales.en.split(' ')[0]}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setDrawerIndex(idx)}
                            className="flex items-center justify-center gap-1 border border-sky-500/50 text-[#0284c7] py-2 rounded-lg text-[10px] font-bold hover:bg-sky-50 transition w-full bg-white cursor-pointer"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            {pt ? 'Ver Histórico Vendas (Dados)' : 'View Sales Database'}
                          </button>

                          <div className="border-t border-dashed border-slate-200 pt-3 mt-auto text-left">
                            <span className="text-[8px] font-bold text-slate-400 uppercase block mb-0.5">{pt ? 'Ação Sugerida' : 'Suggested Action'}</span>
                            <p dangerouslySetInnerHTML={{ __html: pt ? prod.action.pt : prod.action.en }} className="text-[11px] text-slate-700 leading-snug" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => handleSwipe('left')}
                      className="w-12 h-12 rounded-full border border-red-200 bg-red-50 text-red-500 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => handleSwipe('right')}
                      className="w-12 h-12 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-6 animate-fade-in max-w-xs">
                  <div className="bg-emerald-50 text-emerald-500 w-14 h-14 rounded-full flex items-center justify-center mb-4 border border-emerald-200 shadow-sm">
                    <Check className="w-8 h-8" strokeWidth={3} />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-base mb-1">{pt ? 'Stock Protegido!' : 'Stock Protected!'}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {pt ? 'Todos os lotes críticos foram analisados e encaminhados para campanhas de escoamento.' : 'All critical batches have been audited and queued for clearance.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: MOBILE CAMPAIGNS TIMELINE */}
          {mobileTab === 'campaigns' && (
            <div className="flex flex-col gap-4 animate-fade-in text-left">
              <div className="bg-slate-200 p-1 rounded-xl flex w-full shadow-inner">
                <button 
                  onClick={() => setChannel('tradicional')}
                  className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold transition uppercase tracking-wide cursor-pointer ${
                    channel === 'tradicional' ? 'bg-white text-[#0284c7] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🏢 {pt ? 'Loja Física' : 'Physical Shop'}
                </button>
                <button 
                  onClick={() => setChannel('digital')}
                  className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold transition uppercase tracking-wide cursor-pointer ${
                    channel === 'digital' ? 'bg-white text-[#0284c7] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  📱 {pt ? 'Digital' : 'Digital'}
                </button>
              </div>

              <div className="flex flex-col gap-5 pl-2 relative border-l border-slate-200 mt-2">
                <div className="relative pl-6">
                  <div className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-100" />
                  <div className="font-display font-extrabold text-[11px] text-slate-800 uppercase tracking-wide mb-1">{pt ? 'Verão (Jul-Set)' : 'Summer (Jul-Sep)'}</div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-[10.5px]">
                    <h4 className="font-bold text-[#0369a1] mb-1">{pt ? 'Kit Férias e Trauma' : 'Vacation & Wound Kit'}</h4>
                    <p dangerouslySetInnerHTML={{ __html: mockCampaignsMobile[pt ? 'pt' : 'en'][channel].verao }} className={channel === 'digital' ? 'mob-mock-box notif-style mt-2 p-2' : 'mob-mock-box mt-2 p-2'} />
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-100" />
                  <div className="font-display font-extrabold text-[11px] text-slate-800 uppercase tracking-wide mb-1">{pt ? 'Outono (Set-Nov)' : 'Autumn (Sep-Nov)'}</div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-[10.5px]">
                    <h4 className="font-bold text-[#0369a1] mb-1">{pt ? 'Defesas & Sono Rotina' : 'School & Sleep Routine'}</h4>
                    <p dangerouslySetInnerHTML={{ __html: mockCampaignsMobile[pt ? 'pt' : 'en'][channel].outono }} className={channel === 'digital' ? 'mob-mock-box notif-style mt-2 p-2' : 'mob-mock-box mt-2 p-2'} />
                  </div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-slate-100" />
                  <div className="font-display font-extrabold text-[11px] text-slate-800 uppercase tracking-wide mb-1">{pt ? 'Inverno (Nov-Fev)' : 'Winter (Nov-Feb)'}</div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm text-[10.5px]">
                    <h4 className="font-bold text-[#0369a1] mb-1">{pt ? 'Época Gripal Máxima' : 'Flu Season Peak'}</h4>
                    <p dangerouslySetInnerHTML={{ __html: mockCampaignsMobile[pt ? 'pt' : 'en'][channel].inverno }} className={channel === 'digital' ? 'mob-mock-box notif-style mt-2 p-2' : 'mob-mock-box mt-2 p-2'} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Detail Drawer Bottom-Sheet */}
        <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 transition-opacity duration-300 ${
          drawerIndex !== null ? 'opacity-100 block' : 'opacity-0 hidden'
        }`} onClick={() => setDrawerIndex(null)} />
        
        <div className={`fixed left-0 right-0 bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl p-5 z-50 flex flex-col justify-between transition-all duration-300 ${
          drawerIndex !== null ? 'bottom-0 h-[280px]' : '-bottom-[320px] h-[280px]'
        }`}>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setDrawerIndex(null)} />
          {drawerIndex !== null && (
            <>
              <div className="font-display font-bold text-slate-800 text-xs mb-3 text-left">
                {productsData[drawerIndex].name}
              </div>
              
              <table className="w-full border-collapse text-[10.5px] text-slate-600 mb-3 text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-2">{pt ? 'Mês Venda (2025)' : 'Sales Month (2025)'}</th>
                    <th className="p-2 text-center">{pt ? 'Jul' : 'Jul'}</th>
                    <th className="p-2 text-center">{pt ? 'Ago' : 'Aug'}</th>
                    <th className="p-2 text-center">{pt ? 'Set' : 'Sep'}</th>
                    <th className="p-2 text-right">PVP/Custo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2">{pt ? 'Histórico Vendas' : 'Sales History'}</td>
                    <td className="p-2 text-center font-mono">{pt ? productsData[drawerIndex].rawSales.m1 : productsData[drawerIndex].rawSales.m1.replace('un', 'units')}</td>
                    <td className="p-2 text-center font-mono">{pt ? productsData[drawerIndex].rawSales.m2 : productsData[drawerIndex].rawSales.m2.replace('un', 'units')}</td>
                    <td className="p-2 text-center font-mono">{pt ? productsData[drawerIndex].rawSales.m3 : productsData[drawerIndex].rawSales.m3.replace('un', 'units')}</td>
                    <td className="p-2 text-right font-mono text-[9.5px]">{productsData[drawerIndex].rawSales.pvp}</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[10px] text-slate-400 leading-normal mb-3 text-left">
                {pt 
                  ? '*Estes dados foram extraídos do histórico homólogo. A velocidade média de escoamento recomendou a ação corretiva imediata.' 
                  : '*This data is pulled from homolog sales. Current depletion rate triggered an immediate corrective strategy.'}
              </p>

              <button 
                onClick={() => setDrawerIndex(null)}
                className="w-full py-2.5 rounded-lg bg-[#0f172a] text-white text-[10.5px] font-bold uppercase tracking-wide hover:bg-slate-800 cursor-pointer"
              >
                {pt ? 'Fechar Dados' : 'Close Database'}
              </button>
            </>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="mob-nav fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center pb-2 z-45 shadow-inner">
          <button 
            onClick={() => setMobileTab('home')}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition cursor-pointer ${
              mobileTab === 'home' ? 'text-[#0284c7]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => { if (isAnalysisComplete) setMobileTab('alerts'); }}
            disabled={!isAnalysisComplete}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition ${
              !isAnalysisComplete
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : mobileTab === 'alerts'
                ? 'text-[#0284c7] cursor-pointer'
                : 'text-slate-400 hover:text-slate-600 cursor-pointer'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            {pt ? 'Alertas' : 'Alerts'}
          </button>
          <button 
            onClick={() => { if (isAnalysisComplete) setMobileTab('campaigns'); }}
            disabled={!isAnalysisComplete}
            className={`mob-tab-btn flex flex-col items-center gap-1 text-[9px] font-bold transition ${
              !isAnalysisComplete
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : mobileTab === 'campaigns'
                ? 'text-[#0284c7] cursor-pointer'
                : 'text-slate-400 hover:text-slate-600 cursor-pointer'
            }`}
          >
            <Calendar className="w-5 h-5" />
            {pt ? 'Campanhas' : 'Campaigns'}
          </button>
        </div>
      </div>

    </div>
  );
}
