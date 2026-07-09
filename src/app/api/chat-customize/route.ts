import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { sector, lang } = await (request.json() as Promise<{
      sector: string;
      lang: 'pt' | 'en';
    }>);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const pt = lang === 'pt';

    // 1. FALLBACK MOCK IF NO API KEY
    if (!apiKey) {
      const mockCustom: Record<string, string> = pt ? {
        hero: `Tem dúvidas sobre a gestão do seu negócio de ${sector}? Fale comigo.`,
        problem: `Perdas de margem e stock em ${sector} são evitáveis com automação de processos.`,
        ocr: `OCR em ${sector}: Extração de faturas de fornecedores e aviso imediato de desvios.`,
        bi: `Com base em ${sector}: Cruzamos stock e histórico para evitar desperdício de inventário.`,
        excel: `Migre o seu Excel de ${sector} para base de dados. Poupe horas de digitação manual.`,
        api: `Ligamos o seu ERP e software de faturação de ${sector} a Stripe ou modelos de IA via APIs.`,
        rcm: `Otimize custos de receitas e proteja margens no seu negócio de ${sector} hoje.`,
        custom: `Precisa de uma ferramenta personalizada de dados para o setor de ${sector}?`,
        sobre: `Oracle Retail e sistemas complexos adaptados ao seu contexto de ${sector}.`,
        faq: `Quer saber prazos ou como funciona a automação em ${sector}?`,
      } : {
        hero: `Have questions about managing your ${sector} business? Talk to me.`,
        problem: `Margin and inventory leaks in ${sector} are preventable with workflow automation.`,
        ocr: `OCR in ${sector}: Supplier invoice extraction and instant discrepancy alerts.`,
        bi: `For ${sector}: We cross stock and history to prevent inventory waste.`,
        excel: `Migrate your manual ${sector} Excel sheets to secure databases. Save hours of typing.`,
        api: `We connect your ${sector} ERP and POS software to Stripe or AI APIs.`,
        rcm: `Optimize recipe costs and protect margins in your ${sector} business today.`,
        custom: `Need a custom data or AI tool tailored for ${sector}?`,
        sobre: `Oracle Retail systems and complex data tools customized for ${sector}.`,
        faq: `Want to know timelines or how automation works in ${sector}?`,
      };
      return NextResponse.json({ messages: mockCustom });
    }

    // 2. REAL CLAUDE CALL
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a copywriting AI for Nuelltech.
    Your task is to take a business sector/niche and generate exactly 10 short, context-specific messages (max 20 words each) to be displayed in a chat bubble as the visitor scrolls through the home page.
    The messages must translate how Nuelltech's technology applies specifically to the sector ${sector} (write it naturally and do NOT wrap the sector name in quotation marks).
    
    You must output a raw JSON object with exactly these keys: "hero", "problem", "ocr", "bi", "excel", "api", "rcm", "custom", "sobre", "faq". Do not include any markdown markup, explanation, or additional characters. Just output valid JSON.
    
    Keys definition:
    - "hero": A short welcome translating to this sector (e.g. "Managing a gym? Let's check how we can automate your management.")
    - "problem": Addressing margin/inventory leaks for this sector (e.g. "Recognize these inventory leaks in your restaurant? We stop them.")
    - "ocr": How OCR/Invoice reading helps this sector (e.g. "We read gym supplier invoices to check if equipment costs went up.")
    - "bi": How database reconciliation/BI helps this sector (e.g. "Reconciling supplements inventory with sales to predict expired items.")
    - "excel": How replacing Excel helps this sector (e.g. "Manual sheets wasting hours? We build centralized dashboards for gyms.")
    - "api": How APIs/webhooks connect their systems (e.g. "Connect billing software with your gym booking software using APIs.")
    - "rcm": How RCM / margin management helps this sector (e.g. "Track margins and staff costs vs monthly memberships in your gym.")
    - "custom": Pitching bespoke tools for this sector (e.g. "Need custom logistics or stock prediction tools for your store?")
    - "sobre": Reassuring them of our pedigree applied to this sector (e.g. "Enterprise Oracle Retail discipline scaled down for your store.")
    - "faq": Prompting them to ask questions about this sector (e.g. "Want to know timelines or pricing for gyms?")
    
    Language: Write in ${pt ? 'Portuguese (Portugal)' : 'English'}.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Sector: ${sector}` }
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';
    
    // Attempt to parse JSON. If it fails, fallback to template
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      const parsed = JSON.parse(jsonString);
      return NextResponse.json({ messages: parsed });
    } catch {
      console.error('Failed to parse Claude customization JSON:', text);
      throw new Error('Invalid JSON from Claude');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
