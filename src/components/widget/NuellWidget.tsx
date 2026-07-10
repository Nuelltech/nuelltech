'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, Calendar } from 'lucide-react';

interface NuellWidgetProps {
  lang: 'pt' | 'en';
}

interface Message {
  sender: 'nuell' | 'user';
  text: string;
}

// Default section messages moved outside component to avoid dependency changes
const defaultMessages: Record<string, Record<string, string>> = {
  pt: {
    hero: 'Como é que a Inteligência Artificial pode impulsionar o seu negócio?',
    problem: 'Identifica-se com estas perdas de margem e stock? Posso ajudar a quantificar o seu caso.',
    ocr: 'Viu como lemos uma fatura? Pergunte-me sobre o seu processo de faturação.',
    bi: 'Reconciliamos stock físico com vendas para prever perdas. Quer ver aplicado ao seu caso?',
    excel: 'Ainda usa planilhas Excel manuais? Posso estimar as horas de trabalho que pouparia.',
    api: 'Ligamos o seu software de faturação, Stripe e modelos de IA. Qual é o seu ecossistema atual?',
    rcm: 'O RCM e o Auditor Pro protegem as margens da restauração. Quer ver as fichas técnicas?',
    custom: 'Quando o problema é específico, construímos à medida. Tem um desafio único de dados?',
    sobre: 'Trazemos a disciplina dos sistemas Oracle Retail para o seu negócio. Quer saber mais?',
    faq: 'Ainda com dúvidas sobre custos, prazos ou o ChatGPT? Pergunte-me diretamente!',
  },
  en: {
    hero: 'How can Artificial Intelligence boost your business?',
    problem: 'Do you recognize these margin and stock leaks? I can help quantify your case.',
    ocr: 'Saw how we read an invoice? Ask me about your billing process.',
    bi: 'We reconcile stock with sales to predict loss. Want to see it applied to your case?',
    excel: 'Still using manual Excel sheets? I can estimate the hours of labor you would save.',
    api: 'We integrate billing systems, Stripe and AI models. What is your current tech stack?',
    rcm: 'RCM and Auditor Pro protect restaurant margins. Want to see the recipe cost structures?',
    custom: 'When the problem is specific, we build custom solutions. Have a unique data challenge?',
    sobre: 'We bring the discipline of Oracle Retail enterprise systems to your business. Learn more?',
    faq: 'Still have questions about pricing, timelines, or ChatGPT? Ask me directly!',
  },
};

const getUTMs = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || ''
  };
};

const getDeviceDetails = () => {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isMobile ? 'Mobile' : 'Desktop';
};

const getReferrer = () => {
  if (typeof window === 'undefined') return '';
  return document.referrer || 'Direct';
};

const extractContact = (text: string) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  
  if (emailMatch) {
    const email = emailMatch[0];
    let name = text.replace(email, '').trim();
    name = name.replace(/[.\-\s]+$/, '').replace(/^[.\-\s]+/, '').trim();
    return {
      name: name && name.length < 50 ? name : 'Cliente',
      contact: email
    };
  }

  // Check phone number: clean spaces, dashes, and parentheses first
  const cleaned = text.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /(?:\+351|00351|351)?(9[1236]\d{7}|2\d{8})/;
  const intlRegex = /\+\d{9,15}/;

  const phoneMatch = cleaned.match(phoneRegex);
  const intlMatch = cleaned.match(intlRegex);

  if (phoneMatch || intlMatch) {
    const phone = phoneMatch ? phoneMatch[0] : (intlMatch ? intlMatch[0] : '');
    let name = text.replace(/[+\d\s\-\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
    name = name.replace(/[.\-\s]+$/, '').replace(/^[.\-\s]+/, '').trim();
    return {
      name: name && name.length < 50 ? name : 'Cliente',
      contact: phone
    };
  }

  return null;
};

export default function NuellWidget({ lang }: NuellWidgetProps) {
  const pt = lang === 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Conversational state
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [turnCount, setTurnCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  // Lead info captured
  const [leadInfo, setLeadInfo] = useState({
    sector: '',
    challenge: '',
    name: '',
    contact: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const bubbleTextRef = useRef(bubbleText);

  // Sector customization dictionary (if Claude provides it or fallback)
  const [customMessages, setCustomMessages] = useState<Record<string, string> | null>(null);
  const [visitedSections, setVisitedSections] = useState<string[]>(['hero']);
  const [geoInfo, setGeoInfo] = useState({ city: '', country: '' });

  // Load geo location details
  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city && data.country_name) {
          setGeoInfo({ city: data.city, country: data.country_name });
        }
      } catch {
        // Fallback or ignore
      }
    };
    fetchGeo();
  }, []);

  // Scroll customization trigger (call single Claude call API or mock fallback)
  const triggerScrollCustomization = useCallback(async (sector: string) => {
    try {
      const response = await fetch('/api/chat-customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, lang }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setCustomMessages(data.messages);
        }
      }
    } catch {
      // Mock customization values locally
      const mockCustom: Record<string, string> = pt ? {
        hero: `Tem dúvidas sobre a gestão de ${sector}? Fale comigo.`,
        ocr: `OCR em ${sector}: Extração de faturas de fornecedores e aviso imediato de desvios.`,
        bi: `Com base em ${sector}: Cruzamos stock e histórico para evitar desperdício.`,
        rcm: `Otimize custos e margens no seu negócio de ${sector} hoje.`,
        custom: `Precisa de uma ferramenta personalizada de dados para ${sector}?`,
        faq: `Quer saber prazos ou valores para o setor de ${sector}?`,
      } : {
        hero: `Have questions about managing your ${sector}? Talk to me.`,
        ocr: `OCR in ${sector}: Supplier invoice extraction and instant discrepancy alerts.`,
        bi: `For ${sector}: We cross stock and history to prevent waste.`,
        rcm: `Optimize costs and margins in your ${sector} business today.`,
        custom: `Need a custom data tool for your ${sector} business?`,
        faq: `Want to know timelines or pricing for ${sector}?`,
      };
      setCustomMessages(mockCustom);
    }
  }, [lang, pt]);

  // Helper to open chat and trigger typing state safely
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (messages.length === 0) {
      setIsTyping(true);
    }
  }, [messages.length]);

  // Listen for sector selection from the homepage banner
  useEffect(() => {
    const handleSectorCustomized = (e: Event) => {
      const customEvent = e as CustomEvent<{ sector: string; messages: Record<string, string> | null }>;
      const { sector, messages } = customEvent.detail;
      setLeadInfo(prev => ({ ...prev, sector, challenge: '', name: '', contact: '' }));
      setCustomMessages(messages);
      
      // Clear messages history and reset session for the new sector
      setMessages([]);
      setTurnCount(2);
      sessionStorage.removeItem('nuell_chat_session_id');
    };
    const handleOpenChat = () => {
      openChat();
    };
    const handleReset = () => {
      setLeadInfo({ sector: '', challenge: '', name: '', contact: '' });
      setCustomMessages(null);
      setMessages([]);
      setIsOpen(false);
      sessionStorage.removeItem('nuell_chat_session_id');
    };
    window.addEventListener('nuell-sector-customized', handleSectorCustomized);
    window.addEventListener('nuell-open-chat', handleOpenChat);
    window.addEventListener('nuell-sector-reset', handleReset);
    return () => {
      window.removeEventListener('nuell-sector-customized', handleSectorCustomized);
      window.removeEventListener('nuell-open-chat', handleOpenChat);
      window.removeEventListener('nuell-sector-reset', handleReset);
    };
  }, [openChat]);

  // Helper to change message with smooth fade
  const updateBubbleMessage = (newText: string) => {
    if (newText === bubbleTextRef.current) return;
    setIsFading(true);
    setTimeout(() => {
      setBubbleText(newText);
      bubbleTextRef.current = newText;
      setIsFading(false);
    }, 350);
  };

  // 1. SCROLL TRACKING
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], div[id="ocr"], div[id="bi"], div[id="excel"], div[id="api"]');
      const viewportCenter = window.innerHeight / 2;
      let closestSectionId = 'hero';
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSectionId = section.id;
        }
      });

      if (closestSectionId !== activeSection) {
        setActiveSection(closestSectionId);
        // Track visited sections so we only trigger once per session (Rule 131)
        setVisitedSections(prev => {
          if (!prev.includes(closestSectionId)) {
            return [...prev, closestSectionId];
          }
          return prev;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // 2. UPDATE BUBBLE MESSAGE BASE ON ACTIVE SECTION & CUSTOMIZATION
  useEffect(() => {
    if (isOpen) return; // Suppress updates during active chat panel (Rule 133)

    // Only update if it is the first time visiting this section (latest entry in visitedSections)
    if (visitedSections[visitedSections.length - 1] === activeSection) {
      let text = '';
      if (customMessages && customMessages[activeSection]) {
        text = customMessages[activeSection];
      } else {
        text = defaultMessages[lang][activeSection] || defaultMessages[lang]['hero'];
      }
      updateBubbleMessage(text);
    }
  }, [activeSection, customMessages, lang, isOpen, visitedSections]);

  // 3. INITIAL CHAT MESSAGE WHEN OPENED
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        const sector = leadInfo.sector;
        if (sector) {
          setMessages([
            {
              sender: 'nuell',
              text: pt
                ? `Olá! Vejo que o seu negócio é no setor de ${sector} *(não é o seu? [reset:sector:Mudar Setor])*. Sou o NUELL, o seu assistente inteligente.

Em que processos de ${sector} gostaria de introduzir IA? Que tarefas rotineiras ou informações gostava de ver aceleradas hoje? Com base na sua resposta, posso mostrar-lhe exemplos práticos ou explicar como desenhar a solução ideal para o que precisa.`
                : `Hello! I see your business is in the ${sector} sector *(not yours? [reset:sector:Change Sector])*. I am NUELL, your smart assistant.

In which processes of ${sector} would you like to introduce AI? Which routine tasks or information would you like to see accelerated today? Based on your answer, I can show you practical examples or explain how to design the ideal solution for what you need.`,
            },
          ]);
          setIsTyping(false);
          setTurnCount(2); // Skip sector turn, next is user challenge details/contact
        } else {
          setMessages([
            {
              sender: 'nuell',
              text: pt
                ? 'Olá! Sou o NUELL, o assistente inteligente da Nuelltech. Para o poder ajudar melhor, qual é o setor do seu negócio (ex: restaurante, farmácia, ginásio) e qual o seu maior desafio de gestão hoje?'
                : 'Hello! I am NUELL, Nuelltech\'s smart assistant. To help you best, what is your business sector (e.g., restaurant, pharmacy, gym) and what is your biggest management challenge today?',
            },
          ]);
          setIsTyping(false);
          setTurnCount(1);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, leadInfo.sector, pt]);

  // 3.5. LOG CONVERSATION IN REAL-TIME TO BACKEND / GOOGLE SHEETS
  useEffect(() => {
    if (messages.length > 0) {
      const sessionId = sessionStorage.getItem('nuell_chat_session_id') || (() => {
        const newId = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        sessionStorage.setItem('nuell_chat_session_id', newId);
        return newId;
      })();

      const utms = getUTMs();
      const device = getDeviceDetails();
      const referrer = getReferrer();
      const visited = visitedSections.join(', ');

      const timer = setTimeout(() => {
        fetch('/api/log-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            leadInfo,
            messages,
            metadata: {
              device,
              referrer,
              visitedSections: visited,
              language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
              city: geoInfo.city || 'Desconhecida',
              country: geoInfo.country || 'Desconhecido',
              ...utms
            }
          })
        }).catch(err => console.error('Error logging conversation:', err));
      }, 500); // 500ms debounce to prevent logging spam

      return () => clearTimeout(timer);
    }
  }, [messages, leadInfo, visitedSections, geoInfo]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 4. CALL BACKEND CHAT OR FALLBACK TO LOCAL MOCK
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setUserInput('');
    setIsTyping(true);

    const currentTurn = turnCount;
    setTurnCount((prev) => prev + 1);

    // Extract contact details locally to avoid lag or state mismatch
    const contactInfo = extractContact(userText);
    const currentLeadInfo = { ...leadInfo };
    if (contactInfo) {
      currentLeadInfo.name = contactInfo.name;
      currentLeadInfo.contact = contactInfo.contact;
      setLeadInfo(currentLeadInfo);
    }

    // Call API or Mock locally
    try {
      // Build conversation payload for the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          turn: currentTurn,
          lang,
          leadInfo: currentLeadInfo,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local leadInfo if API returns updated fields
        if (data.leadInfo) {
          setLeadInfo(data.leadInfo);
        } else if (contactInfo) {
          setLeadInfo(currentLeadInfo);
        }

        // Handle scroll customization after Turn 1 (sector identified)
        if (currentTurn === 1 && data.leadInfo?.sector) {
          triggerScrollCustomization(data.leadInfo.sector);
        }

        setTimeout(() => {
          setMessages((prev) => [...prev, { sender: 'nuell', text: data.reply }]);
          setIsTyping(false);
        }, 600);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Fallback Mock Controller
      handleLocalMockResponse(userText, currentTurn, currentLeadInfo);
    }
  };

  // Local Chat Mock Flow
  const handleLocalMockResponse = (userText: string, currentTurn: number, updatedInfoArg?: typeof leadInfo) => {
    setTimeout(() => {
      let reply = '';
      const updatedInfo = updatedInfoArg || { ...leadInfo };
      const textLower = userText.toLowerCase();

      // Check if user is asking a free-form question by detecting keywords
      if (textLower.includes('fatura') || textLower.includes('ocr') || textLower.includes('leitura') || textLower.includes('invoice') || textLower.includes('documento')) {
        reply = pt
          ? `O nosso leitor de OCR extrai automaticamente todos os dados de faturas em segundos, identificando discrepâncias de preço. Pode ver uma demonstração interativa com dados de exemplo aqui: [sandbox:ocr:🔍 Ver Demo OCR]\n\nSe quiser ver isto ligado ao seu ERP, qual é o seu Nome e Contacto para falarmos sem compromisso?`
          : `Our OCR reader automatically extracts invoice data in seconds, detecting price deviations. View an interactive demonstration with preset sample data here: [sandbox:ocr:🔍 View OCR Demo]\n\nTo see this connected to your ERP, what is your Name and Contact so we can chat?`;
      } else if (textLower.includes('stock') || textLower.includes('inventario') || textLower.includes('validade') || textLower.includes('bi') || textLower.includes('perda')) {
        reply = pt
          ? `O nosso reconciliador preditivo cruza o stock com a velocidade de venda para alertar sobre perdas e sugerir campanhas de escoamento. Veja uma simulação interativa com dados predefinidos aqui: [sandbox:bi:📊 Ver Demo Stock]\n\nQual o seu melhor Contacto para agendarmos uma demonstração detalhada?`
          : `Our predictive reconciler crosses stock with sales speed to alert you about waste and suggest discount campaigns. View an interactive simulation with preset data here: [sandbox:bi:📊 View Stock Demo]\n\nWhat is your best Contact so we can schedule a custom demo?`;
      } else if (textLower.includes('excel') || textLower.includes('planilha') || textLower.includes('manual') || textLower.includes('folha')) {
        reply = pt
          ? `Migramos folhas manuais de Excel para bases de dados seguras e dinâmicas, eliminando erros de fórmulas. Veja uma comparação visual com dados predefinidos: [sandbox:excel:💻 Ver Comparação Excel]\n\nPodemos fazer o mesmo pelas suas planilhas. Deixe o seu Nome e Contacto para falarmos.`
          : `We migrate manual Excel sheets to secure databases, eliminating formula errors. See an interactive before/after comparison with preset data here: [sandbox:excel:💻 View Excel Demo]\n\nWe can do the same for your files. Leave your Name and Contact to discuss.`;
      } else if (textLower.includes('api') || textLower.includes('erp') || textLower.includes('sistema') || textLower.includes('integr')) {
        reply = pt
          ? `Ligamos o seu ERP, POS ou software de faturação a portais web ou modelos de IA via APIs seguras. Veja uma simulação técnica com dados de exemplo aqui: [sandbox:api:⚡ Ver Simulação API]\n\nQual o seu Nome e Contacto para vermos a compatibilidade com os seus sistemas?`
          : `We connect your ERP, POS, or billing software to web portals or AI models using secure APIs. Check out our technical simulation with sample webhook data: [sandbox:api:⚡ View API Demo]\n\nWhat is your Name and Contact to check compatibility with your software?`;
      } else if (textLower.includes('custo') || textLower.includes('receita') || textLower.includes('margem') || textLower.includes('rcm') || textLower.includes('preço') || textLower.includes('recebimento') || textLower.includes('cliente')) {
        reply = pt
          ? `Gerimos e protegemos as margens de receitas comparando faturas com o PVP praticado em tempo real. Veja a secção dedicada a isto: [scroll:rcm:📈 Otimizar Custos]\n\nPara analisarmos a sua estrutura de custos de forma confidencial, indique o seu Nome e Contacto.`
          : `We manage and protect recipe margins by crossing supplier pricing with actual menu prices. See the dedicated section: [scroll:rcm:📈 Optimize Costs]\n\nTo analyze your cost structure confidentially, leave your Name and Contact.`;
      } else if (currentTurn === 1) {
        // Sector and challenge turn
        updatedInfo.sector = userText.substring(0, 40);
        updatedInfo.challenge = userText;
        setLeadInfo(updatedInfo);
        triggerScrollCustomization(userText);

        reply = pt
          ? `Perfeito! No setor de ${userText}, os problemas de margens e processos manuais são muito comuns. A Nuelltech automatiza estes fluxos.

Como prefere avançar?
👉 **Pergunte-me diretamente o que procura** (ex: *"Como posso ler faturas de fornecedores?"* ou *"Como ligam ao meu software de faturação?"*). Eu respondo e posso guiar-lhe na página ou abrir a demonstração certa.
👉 **Ou navegue pela página à sua vontade.** O meu balão de fala adapta-se automaticamente explicando como cada secção se aplica ao setor de ${userText}!`
          : `Perfect! In the ${userText} sector, margin issues and manual processes are common. Nuelltech automates these leaks.

How would you like to proceed?
👉 **Ask me directly what you need** (e.g., *"How can I read supplier invoices?"* or *"How do you connect to my billing systems?"*). I will explain and guide you directly to the right demo or section.
👉 **Or simply scroll through the page.** My speech bubble will dynamically adapt to explain each section for the ${userText} industry!`;
      } else if (currentTurn === 2) {
        // Lead details turn
        updatedInfo.name = userText;
        updatedInfo.contact = userText;
        setLeadInfo(updatedInfo);

        reply = pt
          ? `Obrigado pelos seus dados, ${userText.split(' ')[0]}. Para reservar o seu diagnóstico gratuito e avançar sem compromisso, por favor selecione o melhor horário no nosso calendário.\n\nA nossa equipa analisará o seu caso real e apresentará soluções concretas.`
          : `Thank you for your details, ${userText.split(' ')[0]}. To reserve your free diagnosis and move forward without commitment, please select the best slot in our calendar.\n\nOur team will analyze your real case and present concrete solutions.`;
      } else {
        // Closing turn / Calendly link
        reply = pt
          ? `Pode agendar diretamente a sua sessão aqui: \n\n🔗 [Calendly Nuelltech - Diagnóstico Gratuito](https://calendly.com/nuelltech/30min)`
          : `You can schedule your session directly here: \n\n🔗 [Calendly Nuelltech - Free Diagnosis](https://calendly.com/nuelltech/30min)`;
      }

      setMessages((prev) => [...prev, { sender: 'nuell', text: reply }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-3 select-none">
      
      {/* 1. TEXT BUBBLE (Scroll updates) */}
      {!isOpen && bubbleText && (
        <div
          onClick={openChat}
          className={`bg-white/80 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md cursor-pointer max-w-[240px] text-xs leading-relaxed transition-all duration-350 transform hover:scale-[1.02] ${
            isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <span className="block text-[8px] font-mono text-blue-600 uppercase tracking-wider mb-1 font-bold">
            NUELL · assistant
          </span>
          <p className="text-gray-700 font-medium">{bubbleText}</p>
        </div>
      )}

      {/* 2. CHAT PANEL (Expandable UI) */}
      {isOpen ? (
        <div className="w-full sm:w-[380px] h-[500px] max-h-[calc(100vh-6rem)] bg-white/80 border border-white/20 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col justify-between backdrop-blur-md animate-fade-in text-gray-800">
          {/* Header */}
          <div className="bg-gray-50/80 border-b border-gray-200/60 p-4 flex justify-between items-center rounded-t-3xl">
            <div className="flex items-center gap-3">
              {/* Thumbnail Orbe */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2054C7] to-[#3B82F6] flex items-center justify-center font-bold text-white shadow-lg shadow-brand-accent/20 relative">
                N
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-ok border-2 border-white" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-gray-900 font-display">NUELL</h4>
                <span className="text-[9px] font-mono text-emerald-600 font-bold">
                  {pt ? 'Automação Ativa' : 'Automation Active'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 p-1.5 rounded-xl hover:bg-gray-200/55 transition duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <span className="text-[8px] font-mono text-gray-500 uppercase mb-0.5 px-1">
                  {msg.sender === 'user' ? (pt ? 'Você' : 'You') : 'NUELL'}
                </span>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#3B82F6] to-[#2054C7] text-white rounded-tr-none shadow-md shadow-brand-accent/10 font-medium'
                      : 'bg-gray-100 border border-gray-200/80 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {(() => {
                    const formatTextChunk = (chunk: string) => {
                      const boldRegex = /\*\*([^*]+)\*\*/g;
                      const boldParts = [];
                      let lastIdx = 0;
                      let boldMatch;
                      
                      while ((boldMatch = boldRegex.exec(chunk)) !== null) {
                        const matchIdx = boldMatch.index;
                        if (matchIdx > lastIdx) {
                          boldParts.push(chunk.substring(lastIdx, matchIdx));
                        }
                        boldParts.push(<strong key={`bold-${matchIdx}`} className="font-extrabold text-gray-900">{boldMatch[1]}</strong>);
                        lastIdx = boldRegex.lastIndex;
                      }
                      
                      if (lastIdx < chunk.length) {
                        boldParts.push(chunk.substring(lastIdx));
                      }
                      
                      return boldParts.length > 0 ? <>{boldParts}</> : chunk;
                    };

                    const renderMessageText = (text: string) => {
                      const isCalendly = text.includes('https://calendly.com');
                      const actionRegex = /\[(scroll|sandbox|reset):([^:]+):([^\]]+)\]/g;

                      const parts: React.ReactNode[] = [];
                      let lastIndex = 0;
                      let match;

                      actionRegex.lastIndex = 0;

                      while ((match = actionRegex.exec(text)) !== null) {
                        const matchIndex = match.index;

                        if (matchIndex > lastIndex) {
                          parts.push(
                            <span key={`text-${lastIndex}`} className="whitespace-pre-line">
                              {formatTextChunk(text.substring(lastIndex, matchIndex))}
                            </span>
                          );
                        }

                        const [, type, target, label] = match;

                        if (type === 'scroll') {
                          parts.push(
                            <button
                              key={`action-${matchIndex}`}
                              onClick={() => {
                                const el = document.getElementById(target);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="mt-2 inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold py-1 px-2.5 rounded-lg text-[9px] transition duration-150 uppercase border border-blue-200/60 cursor-pointer mr-2 select-none active:scale-95"
                            >
                              {label}
                            </button>
                          );
                        } else if (type === 'sandbox') {
                          parts.push(
                            <button
                              key={`action-${matchIndex}`}
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('nuell-switch-sandbox-tab', {
                                  detail: { tab: target }
                                }));
                                const el = document.getElementById('demos-container');
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="mt-2 inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold py-1 px-2.5 rounded-lg text-[9px] transition duration-150 uppercase border border-emerald-200/60 cursor-pointer mr-2 select-none active:scale-95"
                            >
                              {label}
                            </button>
                          );
                        } else if (type === 'reset') {
                          parts.push(
                            <button
                              key={`action-${matchIndex}`}
                              onClick={() => {
                                sessionStorage.removeItem('nuell_selected_sector');
                                sessionStorage.removeItem('nuell_custom_messages');
                                window.dispatchEvent(new CustomEvent('nuell-sector-reset'));
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer ml-1 select-none inline active:scale-95"
                            >
                              {label}
                            </button>
                          );
                        }

                        lastIndex = actionRegex.lastIndex;
                      }

                      if (lastIndex < text.length) {
                        parts.push(
                          <span key={`text-${lastIndex}`} className="whitespace-pre-line">
                            {formatTextChunk(text.substring(lastIndex))}
                          </span>
                        );
                      }

                      if (isCalendly) {
                        const textWithoutFooter = text.split('\n\n')[0];
                        const parsedClean = textWithoutFooter.match(actionRegex) 
                           ? parts 
                           : <span className="whitespace-pre-line">{formatTextChunk(textWithoutFooter)}</span>;

                        return (
                          <div className="flex flex-col items-start gap-1">
                            <div>{parsedClean}</div>
                            <a
                              href="https://calendly.com/nuelltech/30min"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-1.5 px-3 rounded-lg text-[9px] transition duration-150 uppercase shadow-md shadow-emerald-500/10 cursor-pointer hover:scale-[1.03] active:scale-95 select-none"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              {pt ? 'Agendar Diagnóstico' : 'Schedule Diagnosis'}
                            </a>
                          </div>
                        );
                      }

                      return <div className="flex flex-wrap items-center text-left">{parts}</div>;
                    };

                    return renderMessageText(msg.text);
                  })()}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="self-start flex flex-col items-start max-w-[85%] animate-pulse">
                <span className="text-[8px] font-mono text-gray-500 uppercase mb-0.5 px-1">NUELL</span>
                <div className="bg-gray-100 border border-gray-200/80 rounded-2xl rounded-tl-none px-4 py-2.5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form / Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200/60 bg-gray-50/80 flex gap-2 items-center rounded-b-3xl"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                turnCount === 1
                  ? pt
                    ? 'Ex: Restaurante, perco muito tempo com faturas...'
                    : 'E.g., Restaurant, spend too much time on invoices...'
                  : turnCount === 2
                  ? pt
                    ? 'Ex: João Silva, joao@email.com...'
                    : 'E.g., John Smith, john@email.com...'
                  : pt
                  ? 'Escreva a sua mensagem...'
                  : 'Type your message...'
              }
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isTyping}
              className="bg-brand-accent hover:bg-brand-accent-dark text-white p-2.5 rounded-xl transition duration-150 disabled:opacity-40 shadow-md shadow-brand-accent/10 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>
        </div>
      ) : (
        /* 3. ORBE REATIVO (Floating Button) */
        <div
          onClick={openChat}
          title={pt ? 'Falar com o NUELL' : 'Speak to NUELL'}
          className="w-[58px] h-[58px] rounded-full relative flex-shrink-0 cursor-pointer shadow-[0_0_25px_4px_rgba(59,130,246,0.25),_0_8px_20px_-4px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_12px_rgba(59,130,246,0.45)] transition-all duration-300 transform hover:scale-105 active:scale-95 animate-pulse bg-gradient-radial"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #5B9CF7, #2054C7 70%)',
            animationDuration: '2.6s',
          }}
        >
          {/* Swirl Gloss effect */}
          <div
            className="absolute inset-[8px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.35), transparent 60%)',
            }}
          />
          {/* Letter N */}
          <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-white text-base drop-shadow-md select-none">
            N
          </span>
        </div>
      )}
    </div>
  );
}
