import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { Resend } from 'resend';

interface SessionRow {
  session_id: string;
  sector_selected: string | null;
  referrer: string;
  user_agent: string;
}

interface SectionViewRow {
  session_id: string;
  section_id: string;
  duration_seconds: number;
}

interface ClickRow {
  session_id: string;
  element_id: string;
}

interface ChatLogRow {
  session_id: string;
  role: string;
  message_text: string;
}

interface BookingRow {
  session_id: string;
  name: string;
  email: string;
  event_time: string;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize CRON request in production (supports header or ?secret= query parameter)
    if (process.env.NODE_ENV === 'production') {
      const authHeader = req.headers.get('authorization');
      const { searchParams } = new URL(req.url);
      const querySecret = searchParams.get('secret');

      const isHeaderValid = authHeader === `Bearer ${process.env.CRON_SECRET}`;
      const isQueryValid = querySecret && querySecret === process.env.CRON_SECRET;

      if (!isHeaderValid && !isQueryValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let reportData = '';
    let emailStatus = 'Not sent';

    // 2. Fetch today's records or run local mock simulation
    if (!supabase) {
      // Mock data for simulation when local keys are not configured
      reportData = `
        [SIMULAÇÃO LOCAL - DADOS FICTÍCIOS DE EXEMPLO]
        - Sessões Iniciadas: 5
        - Visitantes do Setor: 2 Restauração, 1 Imobiliária, 2 Outros
        - Dwell Time Médio:
          * Montra Hero: 12s
          * Montra OCR Sandbox: 84s
          * Montra Excel Slider: 40s
        - Cliques na Sandbox OCR: 3 cliques
        - Conversas de Chat Widget:
          * Sessão 1 (Restauração): "Olá, o vosso OCR lê faturas da Macro e insere no software Primavera?"
          * Sessão 2 (Imobiliária): "Fazem integrações com o Idealista?"
        - Agendamentos Calendly: 1 agendamento concluído (Pedro Santos - Imobiliária).
      `;
    } else {
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const todayIso = todayStart.toISOString();

      // Query database
      const [
        { data: sessionsRaw },
        { data: sectionViewsRaw },
        { data: clicksRaw },
        { data: chatLogsRaw },
        { data: bookingsRaw },
      ] = await Promise.all([
        supabase.from('sessions').select('*').gte('created_at', todayIso),
        supabase.from('section_views').select('*').gte('created_at', todayIso),
        supabase.from('clicks').select('*').gte('created_at', todayIso),
        supabase.from('chat_logs').select('*').gte('created_at', todayIso).order('created_at', { ascending: true }),
        supabase.from('bookings').select('*').gte('created_at', todayIso),
      ]);

      const sessions = (sessionsRaw || []) as SessionRow[];
      const sectionViews = (sectionViewsRaw || []) as SectionViewRow[];
      const clicks = (clicksRaw || []) as ClickRow[];
      const chatLogs = (chatLogsRaw || []) as ChatLogRow[];
      const bookings = (bookingsRaw || []) as BookingRow[];

      // Compile raw data into text format for the AI prompt
      reportData += `RELATÓRIO DE ATIVIDADE EM BRUTO (${new Date().toLocaleDateString('pt-PT')})\n`;
      reportData += `==========================================\n\n`;
      reportData += `1. TOTAL SESSÕES: ${sessions.length}\n`;
      sessions.forEach((s) => {
        reportData += `   - Sessão ${s.session_id.substring(0, 8)} | Setor: ${s.sector_selected || 'Não indicado'} | Ref: ${s.referrer} | Dispositivo: ${s.user_agent.substring(0, 50)}...\n`;
      });

      reportData += `\n2. VISUALIZAÇÕES DE MONTRAS (SECÇÕES):\n`;
      const sectionDwell: Record<string, { total: number; count: number }> = {};
      sectionViews.forEach((sv) => {
        if (!sectionDwell[sv.section_id]) sectionDwell[sv.section_id] = { total: 0, count: 0 };
        sectionDwell[sv.section_id].total += sv.duration_seconds;
        sectionDwell[sv.section_id].count += 1;
      });
      Object.keys(sectionDwell).forEach((sec) => {
        const avg = Math.round(sectionDwell[sec].total / sectionDwell[sec].count);
        reportData += `   - Secção: "${sec}" | Tempo Total: ${sectionDwell[sec].total}s | Tempo Médio: ${avg}s\n`;
      });

      reportData += `\n3. CLIQUES NAS SANDBOXES:\n`;
      const clickCount: Record<string, number> = {};
      clicks.forEach((c) => {
        clickCount[c.element_id] = (clickCount[c.element_id] || 0) + 1;
      });
      Object.keys(clickCount).forEach((el) => {
        reportData += `   - Botão: "${el}" | Cliques: ${clickCount[el]}\n`;
      });

      reportData += `\n4. CONVERSAS COM O ASSISTENTE (CHAT):\n`;
      const chatGrouped: Record<string, string[]> = {};
      chatLogs.forEach((cl) => {
        if (!chatGrouped[cl.session_id]) chatGrouped[cl.session_id] = [];
        const roleName = cl.role === 'user' ? 'Visitante' : 'Nuell (Bot)';
        chatGrouped[cl.session_id].push(`[${roleName}]: ${cl.message_text}`);
      });
      Object.keys(chatGrouped).forEach((sid) => {
        const sector = sessions.find((s) => s.session_id === sid)?.sector_selected || 'Indeterminado';
        reportData += `   - Sessão ${sid.substring(0, 8)} (Setor: ${sector}):\n`;
        chatGrouped[sid].forEach((msg) => {
          reportData += `     ${msg}\n`;
        });
      });

      reportData += `\n5. REUNIÕES AGENDADAS (CALENDLY):\n`;
      reportData += `   - Total de Conversões: ${bookings.length}\n`;
      bookings.forEach((b) => {
        reportData += `   - Lead: ${b.name} (${b.email}) | Reunião marcada para: ${b.event_time}\n`;
      });
    }

    // 3. Request AI Summary using Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    let finalNarrative = '';

    if (!geminiApiKey) {
      finalNarrative = `
Relatório Diário Nuelltech (Simulação sem Chave Gemini)
------------------------------------------------------
Aqui estaria a análise narrada pelo Gerente IA.
Dados recolhidos:
${reportData}
      `;
    } else {
      const geminiPrompt = `
Tu és o "Gerente de Loja" da Nuelltech, uma empresa de automação de processos e engenharia de Inteligência Artificial.
Abaixo encontras os dados brutos de atividade da nossa "loja" (página web) no dia de hoje.
Analisa os dados de visitas, tempo nas secções, cliques nas sandboxes e conversas com o assistente Nuell.
Cria um relatório diário narrativo, informal mas profissional, com foco em vendas e qualificação de negócios, estruturado da seguinte forma:

1. **Movimento Geral**: Resumo das visitas e origem do tráfego.
2. **Áreas de Maior Interesse**: Quais montras (sandboxes) e secções retiveram mais as pessoas e se clicaram em testar.
3. **Conversas em Destaque**: Quais foram as conversas mais interessantes no chat, quais as dores dos clientes e se deixaram contactos.
4. **Fecho de Negócios**: Resumo das reuniões marcadas (Calendly).
5. **Recomendação do Gerente**: O teu conselho comercial para amanhã (ex: se há alguma lead quente a ligar já).

Escreve em Português de Portugal e sê assertivo e direto ao ponto.

Dados do dia:
${reportData}
      `;

      let response: Response | null = null;
      let attempts = 0;
      const maxAttempts = 3;
      let delayMs = 1500;
      
      // Fallback model list: only Flash models (Pro has a quota limit of 0 on the Google free tier)
      const modelsToTry = ['gemini-flash-latest', 'gemini-3.5-flash'];
      let modelIndex = 0;

      while (modelIndex < modelsToTry.length && attempts < maxAttempts) {
        attempts++;
        const currentModel = modelsToTry[modelIndex];
        
        try {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: geminiPrompt }]
              }]
            })
          });

          if (response.ok) {
            break; // Success, exit loop
          }

          // If current model is overloaded (503) or rate-limited (429)
          if (response.status === 503 || response.status === 429) {
            if (modelIndex < modelsToTry.length - 1) {
              console.warn(`Gemini model ${currentModel} returned ${response.status}. Swapping to fallback model ${modelsToTry[modelIndex + 1]}...`);
              modelIndex++; // Move to gemini-1.5-pro
              attempts = 0; // Reset attempts for the new model
              continue;
            } else if (attempts < maxAttempts) {
              console.warn(`All Gemini models busy. Retrying in ${delayMs}ms (Attempt ${attempts} of ${maxAttempts})...`);
              await new Promise((resolve) => setTimeout(resolve, delayMs));
              delayMs *= 2;
              continue;
            }
          }
          break; // Stop on client errors (400, 404, etc.)
        } catch (err) {
          if (attempts < maxAttempts) {
            console.warn(`Gemini fetch error. Retrying in ${delayMs}ms...`, err);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            delayMs *= 2;
            continue;
          }
          throw err;
        }
      }

      if (response && response.ok) {
        const resJson = await response.json();
        finalNarrative = resJson.candidates?.[0]?.content?.parts?.[0]?.text || 'Falha ao compilar narrativa do Gemini.';
      } else {
        const errorText = response ? await response.text() : 'No response from Gemini API';
        console.error('Gemini API failed:', errorText);
        finalNarrative = `Falha ao conectar com o Gemini: ${errorText}\n\nDados brutos:\n${reportData}`;
      }
    }

    // 4. Send Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.REPORT_RECEIVER_EMAIL;

    if (resendApiKey && receiverEmail) {
      const resend = new Resend(resendApiKey);
      const emailResult = await resend.emails.send({
        from: 'Nuelltech Store <onboarding@resend.dev>',
        to: receiverEmail,
        subject: `Relatório Diário Nuelltech — Loja Física (${new Date().toLocaleDateString('pt-PT')})`,
        text: finalNarrative,
      });

      if (emailResult.error) {
        console.error('Resend Email Error:', emailResult.error);
        emailStatus = `Failed: ${JSON.stringify(emailResult.error)}`;
      } else {
        emailStatus = 'Sent successfully';
      }
    }

    return NextResponse.json({
      success: true,
      emailStatus,
      report: finalNarrative,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Daily Report Cron Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
