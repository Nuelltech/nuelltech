import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

function getRelevantKnowledgeFiles(message: string): string[] {
  const text = message.toLowerCase();
  const files: string[] = [];

  const sandboxKeywords = [
    'sandbox', 'demo', 'demonstração', 'teste', 'testar', 'experimentar',
    'ocr', 'ler fatura', 'leitura', 'bi', 'dash', 'excel', 'planilha', 'modernizar', 'api', 'erp', 'sincronizar',
    'simulador', 'inventario', 'stock'
  ];
  
  const productKeywords = [
    'rcm', 'auditor', 'margem', 'receita', 'pos', 'venda', 'vendas',
    'pharma', 'farmacia', 'medicamento', 'validade',
    'logistica', 'entregas', 'distribuição', 'motorista', 'rota', 'quebra',
    'simulador', 'voz',
    'agente', 'agentes', 'agent', 'agents', 'agentic', 'autonomo', 'assistente'
  ];

  const faqKeywords = [
    'preço', 'custo', 'chatgpt', 'wrapper', 'magia', 'caixa negra', 'black box',
    'substituir', 'emprego', 'funcionarios', 'equipa', 'retorno', 'roi', 'tempo',
    'erro', 'asneira', 'errar', 'segurança', 'reuniao', 'diagnostico'
  ];

  const matchesSandbox = sandboxKeywords.some(kw => text.includes(kw));
  const matchesProduct = productKeywords.some(kw => text.includes(kw));
  const matchesFaq = faqKeywords.some(kw => text.includes(kw));

  if (matchesSandbox) {
    files.push('nuelltech-sandboxes-info.md');
  }
  if (matchesProduct) {
    files.push('nuelltech-produtos-casos.md');
  }
  if (matchesFaq) {
    files.push('nuelltech-secao-duvidas-ia.md');
  }

  // Always load personas file for sector adaptation context
  files.push('nuelltech-personas.md');

  // Fallback: If no match, load product cases so the bot is aware of basic offerings
  if (files.length === 1) {
    files.push('nuelltech-produtos-casos.md');
  }

  return files;
}

import { supabase } from '../../../lib/supabase';

async function saveChatLog(sessionId: string | undefined, role: 'user' | 'nuell', text: string) {
  if (!sessionId) return;
  if (!supabase) {
    console.log(`[Store Chat Log Simulation] Session: ${sessionId} | Role: ${role} | Message: ${text}`);
    return;
  }
  try {
    const { error } = await supabase.from('chat_logs').insert({
      session_id: sessionId,
      role,
      message_text: text,
    });
    
    if (error) {
      console.error('Supabase Chat Log Insert Error:', error.message, error.details, error.hint);
    }
  } catch (err) {
    console.error('Failed to log chat message to Supabase (unexpected error):', err);
  }
}

interface LeadInfo {
  sector: string;
  challenge: string;
  name: string;
  contact: string;
}

/**
 * Persists a qualified lead to Supabase and sends a notification email via Resend.
 * Should only be called the first time a contact is captured in a session.
 */
async function saveLeadAndNotify(
  sessionId: string | undefined,
  leadInfo: LeadInfo,
  lang: 'pt' | 'en'
) {
  // --- 1. Persist to Supabase ---
  if (supabase) {
    try {
      const { error } = await supabase.from('leads').upsert(
        {
          session_id: sessionId,
          name: leadInfo.name || null,
          contact: leadInfo.contact,
          sector: leadInfo.sector || null,
          challenge: leadInfo.challenge || null,
          lang,
        },
        { onConflict: 'session_id', ignoreDuplicates: false }
      );
      if (error) {
        console.error('Supabase Lead Upsert Error:', error.message);
      }
    } catch (err) {
      console.error('Failed to save lead to Supabase:', err);
    }
  } else {
    console.log(`[Lead Simulation] Name: ${leadInfo.name} | Contact: ${leadInfo.contact} | Sector: ${leadInfo.sector}`);
  }

  // --- 2. Send notification email via Resend ---
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log('[Lead Notification Simulation] Would send email for lead:', leadInfo.contact);
    return;
  }

  try {
    const emailBody = `
      <h2 style="color:#6366f1;">🎯 Novo Lead — NUELL Chat</h2>
      <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:15px;">
        <tr><td><strong>Nome</strong></td><td>${leadInfo.name || '—'}</td></tr>
        <tr><td><strong>Contacto</strong></td><td>${leadInfo.contact}</td></tr>
        <tr><td><strong>Setor</strong></td><td>${leadInfo.sector || '—'}</td></tr>
        <tr><td><strong>Problema</strong></td><td>${leadInfo.challenge || '—'}</td></tr>
        <tr><td><strong>Sessão</strong></td><td style="font-size:12px;color:#888;">${sessionId || '—'}</td></tr>
        <tr><td><strong>Língua</strong></td><td>${lang}</td></tr>
        <tr><td><strong>Data</strong></td><td>${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}</td></tr>
      </table>
      <br/>
      <a href="https://calendly.com/nuelltech/30min" style="background:#6366f1;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-family:sans-serif;">
        Ver Calendly →
      </a>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NUELL <leads@nuelltech.com>',
        to: ['nuno.miguel@nuelltech.com'],
        subject: `🎯 Novo Lead: ${leadInfo.name || leadInfo.contact} (${leadInfo.sector || 'setor desconhecido'})`,
        html: emailBody,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Resend API error:', res.status, body);
    }
  } catch (err) {
    console.error('Failed to send lead notification email:', err);
  }
}

export async function POST(request: Request) {
  try {
    const { message, turn, lang, leadInfo, sessionId, history } = await (request.json() as Promise<{
      message: string;
      turn: number;
      lang: 'pt' | 'en';
      leadInfo: { sector: string; challenge: string; name: string; contact: string };
      sessionId?: string;
      history?: Array<{ sender: 'user' | 'nuell'; text: string }>;
    }>);

    // Log user query to database
    await saveChatLog(sessionId, 'user', message);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const pt = lang === 'pt';

    // Load Knowledge Base files dynamically and selectively to optimize token costs
    let knowledgeBase = '';
    try {
      const selectedFiles = getRelevantKnowledgeFiles(message);
      
      const fileContents = await Promise.all(
        selectedFiles.map(file => {
          const filePath = path.join(process.cwd(), file);
          return fs.promises.readFile(filePath, 'utf-8')
            .then(content => `
            FILE REFERENCE: ${file}
            =========================================
            ${content}
            =========================================
            `)
            .catch(() => '');
        })
      );
      
      knowledgeBase = `
      NUELLTECH RELEVANT KNOWLEDGE BASE CONTEXT:
      ${fileContents.join('\n')}
      `;
    } catch (err) {
      console.error('Failed to load knowledge base files:', err);
    }

    // 1. FALLBACK MOCK IF NO API KEY IS CONFIGURED
    if (!apiKey) {
      let reply = '';
      const updatedInfo = { ...leadInfo };
      const textLower = message.toLowerCase();

      // Check if user is asking a free-form question by detecting keywords
      if (textLower.includes('fatura') || textLower.includes('ocr') || textLower.includes('leitura') || textLower.includes('invoice') || textLower.includes('documento')) {
        reply = pt
          ? `O nosso leitor de OCR extrai automaticamente todos os dados de faturas em segundos, identificando discrepâncias de preço. Pode ver uma demonstração interativa com dados de exemplo aqui: [sandbox:ocr:🔍 Ver Demo OCR]\n\nSe quiser ver isto ligado ao seu ERP, qual é o seu Nome e Contacto para falarmos sem compromisso?`
          : `Our OCR reader automatically extracts invoice data in seconds, detecting price deviations. View an interactive demonstration with preset sample data here: [sandbox:ocr:🔍 View OCR Demo]\n\nTo see this connected to your ERP, what is your Name and Contact so we can chat?`;
      } else if (textLower.includes('stock') || textLower.includes('inventario') || textLower.includes('validade') || textLower.includes('bi') || textLower.includes('perda') || textLower.includes('quebra')) {
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
      } else if (turn === 1) {
        updatedInfo.sector = message;
        updatedInfo.challenge = message;
        reply = pt
          ? `Perfeito! No setor de ${message}, os problemas de margens e processos manuais são comuns. A Nuelltech automatiza e resolve estes desperdícios. Como posso ajudar a otimizar a sua operação hoje?`
          : `Perfect! In the ${message} sector, margin issues and manual processes are common. Nuelltech automates and resolves these inefficiencies. How can I help optimize your operations today?`;
      } else if (turn === 2) {
        updatedInfo.name = message;
        updatedInfo.contact = message;
        reply = pt
          ? `Excelente, dados registados. Um engenheiro da Nuelltech irá entrar em contacto nas próximas 24 horas.\n\nSe preferir reservar já o seu horário no nosso calendário, pode aceder aqui:\n\n🔗 [Calendly Nuelltech - Diagnóstico Gratuito](https://calendly.com/nuelltech/30min)`
          : `Excellent, details recorded. A Nuelltech engineer will get in touch within the next 24 hours.\n\nIf you prefer to book your slot in our calendar right away, you can access it here:\n\n🔗 [Calendly Nuelltech - Free Diagnosis](https://calendly.com/nuelltech/30min)`;
      } else {
        reply = pt
          ? `Pode aceder ao nosso calendário para reservar o seu Diagnóstico Gratuito:\n\n🔗 [Calendly Nuelltech - Diagnóstico Gratuito](https://calendly.com/nuelltech/30min)`
          : `You can access our calendar to book your Free Diagnosis here:\n\n🔗 [Calendly Nuelltech - Free Diagnosis](https://calendly.com/nuelltech/30min)`;
      }

      await saveChatLog(sessionId, 'nuell', reply);
      return NextResponse.json({ reply, leadInfo: updatedInfo });
    }

    // 2. REAL CLAUDE CALL
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are NUELL, the AI Assistant of Nuelltech — an AI and automation engineering firm based in Vila Real, Portugal.

YOUR SINGLE CORE OBJECTIVE:
Lead the visitor to schedule a Free 30-minute Diagnosis Meeting (or leave their Name and Contact) by quickly understanding their problem and demonstrating Nuelltech's competence with a brief solution approach.

CORE CONVERSATIONAL PRINCIPLES:
1. MINIMAL ESSENTIAL QUESTIONS: Ask ONLY the questions strictly necessary for a first understanding of the problem and their context (e.g. software used or main bottleneck). Do NOT ask secondary or bureaucratic questions (like number of SKUs, invoice counts, team size, etc.) — that is what the 30-minute diagnosis meeting is for.
2. BRIEF PROVEN APPROACH: If their problem connects to solutions Nuelltech has implemented (e.g. BI Pharma 320 SKUs recovered, Logistics 10h/week saved, OCR invoice price checking, Recipe Cost RCM), give a very brief (1-2 sentences) approach showing how that logic applies to their specific case and software.
3. WHEN INQUIRING ABOUT AI AGENTS: 
   - Position Nuelltech's agents as specialized, secure autonomous workflows with tools (APIs, ERP, OCR, databases) and human oversight — not generic chat wrappers. (You, NUELL, are a live example of a Lead & Triage Agent).
   - FIRST UNDERSTAND: Ask what specific task/process they want the agent to solve, and whether they already have software/data in place or are starting from scratch.
   - Once they clarify, give a brief 1-sentence approach and drive directly to the 30-min diagnosis meeting to map the agent's tools and rules.
4. DRIVE TO SCHEDULE IMMEDIATELY: As soon as the visitor explains their situation/problem, present the 30-minute free diagnosis meeting as the practical next step to map their actual data and software.
5. NO PASSIVE VALIDATIONS: NEVER ask passive, hesitant closing questions like "O que acha?", "Faz sentido para si?", or "Quer ver uma demo?". Always close with the meeting invitation or asking for their contact.

CRITICAL BEHAVIOUR RULES:
- Write exclusively in ${pt ? 'Portuguese (Portugal)' : 'English'}.
- Keep replies concise (under 80 words). Be direct, sharp, professional. No lists, no essays.
- NEVER give fixed price quotes. Explain transparently: "O investimento varia consoante o vosso ERP e complexidade. No diagnóstico gratuito de 30 min mapeamos o vosso caso e damos um orçamento realista."
- CONTEXT OVERRIDE: If the visitor corrects their focus, immediately adapt without revisiting old topics.
- NEVER write step-by-step implementation tutorials that the visitor can do alone. Show that solving it reliably requires integration expertise.

STRUCTURE FOR PROPOSING THE MEETING:
When proposing the 30-min meeting:
a) State what is analyzed specifically for their case (e.g., "No diagnóstico gratuito de 30 min, analisamos a vossa estrutura no [Software] e desenhamos o fluxo de alertas para o vosso caso.").
b) Provide the Calendly link on its own line:
https://calendly.com/nuelltech/30min
c) Give the alternative option to leave contact: "Ou se preferir, indique o seu Nome e Contacto (email ou telefone) para falarmos."

DYNAMIC LEAD UPDATES:
When the visitor provides their sector, name, or contact, append this at the very end of your reply:
[UPDATE_LEAD: {"sector": "value", "name": "value", "contact": "value"}]
Only include fields that were newly provided or updated.

INTERACTIVE ACTIONS (include inline if directly relevant, without asking permission first):
- [sandbox:ocr:🔍 Ver Demo OCR] → When discussing invoices, PDFs, supplier price deviations.
- [sandbox:bi:📊 Ver Demo Stock] → When discussing inventory expiry, stock waste, SKU velocity.
- [sandbox:excel:💻 Ver Comparação Excel] → When discussing manual spreadsheets and formula errors.
- [sandbox:api:⚡ Ver Simulação API] → When discussing ERP / POS / webhook integrations.
- [scroll:rcm:📈 Otimizar Custos] → When discussing restaurant margins, CMV, recipe costs.

---

HOW TO CONTROL THE DEPTH OF YOUR ANSWERS (CRITICAL):
The goal of each reply is NOT to fully solve the problem — it is to show that you understand it deeply and that solving it properly requires expertise.
- Reveal the tip of the iceberg. Explain what the problem really is and what direction the solution goes, but STOP before giving a complete implementation recipe.
- Never give step-by-step instructions that a visitor could implement without Nuelltech. If you catch yourself about to do this, stop, zoom out, and instead say what the approach would need to handle — not how to build it.

Example:
Visitor: "Ok obrigado vou implementar isso."
NUELL: "Faz sentido. Só um ponto antes de avançar: a parte mais difícil não é o envio da mensagem — é o que acontece quando o paciente responde fora de padrão, ou quando há dois pedidos de remarcação em simultâneo para o mesmo médico. Já pensaram em como gerir isso? Em 30 minutos mapeamos exatamente o que seria preciso no vosso caso."

---

FEW-SHOT EXAMPLES BY SECTOR (adapt the reasoning, not the exact words):

[RESTAURAÇÃO / F&B]
Visitor: "Os meus fornecedores sobem os preços e eu só dou conta quando já perdi margem."
NUELL: "É um problema silencioso e muito comum. Uma fatura de fornecedor sobe 8%, o prato mantém o preço, e a margem desaparece sem ninguém dar conta. No seu caso, quantos fornecedores diferentes têm faturas a entrar por mês — ordem de grandeza?"
→ (Listen to the answer, then show the RCM or OCR demo as proof of concept.)

[SAÚDE / FARMÁCIAS / CLÍNICAS]
Visitor: "Tenho medicamentos a expirar e só noto quando estou a fazer o inventário trimestral."
NUELL: "Esse é um prejuízo invisível — o produto esteve no stock, ocupou dinheiro, e acaba por ser uma perda directa. Num caso que fizemos para uma farmácia independente, havia 320 produtos nessa situação. É principalmente stock de rotação lenta ou há categorias específicas que são o problema?"
→ (Listen, then reference the BI Pharma case with the specific result.)

[LOGÍSTICA / DISTRIBUIÇÃO]
Visitor: "As rotas dos motoristas são geridas em Excel e quando alguém edita ao mesmo tempo é um caos."
NUELL: "Conheço bem esse cenário — ficheiro partilhado, versões em conflito, e no fim do dia ninguém tem a certeza do que foi ou não entregue. A conferência de caixa deve ser um pesadelo também, certo?"
→ (Listen, then reference the Logistics Platform case with the 10h/week result.)

[HOTELARIA]
Visitor: "O F&B do hotel está a perder dinheiro mas não consigo perceber onde exactamente."
NUELL: "No hotel, o F&B é o centro de custo mais opaco — compras de fornecedores, consumos internos, eventos, bar, restaurante. Tudo misturado. O que tem actualmente para acompanhar os custos do F&B — é manual, tem algum sistema, ou é uma mistura?"
→ (Listen, then bridge to RCM / custom engineering depending on complexity.)

[RETALHO]
Visitor: "Tenho produtos parados há meses e só dou conta quando faço inventário."
NUELL: "Rotação de stock baixa é capital preso. E o problema é que sem visibilidade em tempo real, quando percebe já acumulou semanas de custo. No seu caso é uma loja física, online, ou os dois?"
→ (Listen, then show the Predictive BI demo or propose custom engineering.)

---

CURRENT SESSION CONTEXT:
- Sector/Challenge: ${leadInfo.sector || 'Not yet identified'}
- Visitor Name: ${leadInfo.name || 'Not yet known'}
- Contact: ${leadInfo.contact || 'Not yet provided'}

${knowledgeBase}
`;

    // Build conversation history for Claude
    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.sender === 'user') {
          conversationHistory.push({ role: 'user', content: msg.text });
        } else if (msg.sender === 'nuell') {
          conversationHistory.push({ role: 'assistant', content: msg.text });
        }
      }
    }
    // Add current message
    conversationHistory.push({ role: 'user', content: message });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemPrompt,
      messages: conversationHistory,
    });

    let reply = response.content[0].type === 'text' ? response.content[0].text : '';

    // Robust parser to extract lead details from user messages at any turn
    const contactWasMissing = !leadInfo.contact;
    const updatedInfo = { ...leadInfo };
    if (!updatedInfo.sector && turn === 1) {
      updatedInfo.sector = message;
    }

    // Parse Claude's structured parameter updates
    const updateRegex = /\[UPDATE_LEAD:\s*({[^}]+})\]/;
    const match = reply.match(updateRegex);
    if (match) {
      try {
        const updates = JSON.parse(match[1]);
        if (updates.sector) updatedInfo.sector = updates.sector;
        if (updates.name) updatedInfo.name = updates.name;
        if (updates.contact) updatedInfo.contact = updates.contact;
        if (updates.challenge) updatedInfo.challenge = updates.challenge;
      } catch (e) {
        console.error('Failed to parse Claude lead update JSON:', e);
      }
      reply = reply.replace(updateRegex, '').trim();
    }

    // Extract email or phone from ANY message in the chat
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = message.match(emailRegex);

    if (emailMatch) {
      const email = emailMatch[0];
      updatedInfo.contact = email;

      let possibleName = message.replace(email, '').trim();
      possibleName = possibleName.replace(/[.\-\s]+$/, '').replace(/^[.\-\s]+/, '').trim();
      
      if (possibleName && possibleName.length < 50) {
        updatedInfo.name = possibleName;
      } else if (!updatedInfo.name) {
        updatedInfo.name = 'Cliente';
      }
    } else {
      // Check phone number: clean spaces, dashes, and parentheses first
      const cleanedMessage = message.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /(?:\+351|00351|351)?(9[1236]\d{7}|2\d{8})/;
      const intlRegex = /\+\d{9,15}/;

      const phoneMatch = cleanedMessage.match(phoneRegex);
      const intlMatch = cleanedMessage.match(intlRegex);

      if (phoneMatch || intlMatch) {
        const phoneVal = phoneMatch ? phoneMatch[0] : (intlMatch ? intlMatch[0] : '');
        updatedInfo.contact = phoneVal;

        // Extract name by removing digits and signs
        let possibleName = message.replace(/[+\d\s\-\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
        possibleName = possibleName.replace(/[.\-\s]+$/, '').replace(/^[.\-\s]+/, '').trim();
        
        if (possibleName && possibleName.length < 50) {
          updatedInfo.name = possibleName;
        } else if (!updatedInfo.name) {
          updatedInfo.name = 'Cliente';
        }
      }
    }

    // Fire-and-forget: persist lead + notify when contact is captured for the first time
    if (contactWasMissing && updatedInfo.contact) {
      saveLeadAndNotify(sessionId, updatedInfo, lang).catch((err) =>
        console.error('saveLeadAndNotify failed:', err)
      );
    }

    await saveChatLog(sessionId, 'nuell', reply);
    return NextResponse.json({ reply, leadInfo: updatedInfo });
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
