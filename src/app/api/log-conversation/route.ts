import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { sessionId, leadInfo, messages, metadata } = await request.json();

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const logData = {
      sessionId,
      leadInfo,
      messages,
      metadata,
      timestamp: new Date().toISOString(),
    };

    // 1. SAVE LOCALLY (JSONL Backup database)
    try {
      const logsDir = path.join(process.cwd(), 'src', 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const logFilePath = path.join(logsDir, 'conversations.jsonl');
      const logLine = JSON.stringify(logData) + '\n';
      await fs.promises.appendFile(logFilePath, logLine, 'utf-8');
    } catch (localErr) {
      console.error('Failed to log conversation locally:', localErr);
    }

    // 2. SEND TO GOOGLE SHEETS WEBHOOK (If configured)
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        });
      } catch (sheetsErr) {
        console.error('Failed to send conversation to Google Sheets webhook:', sheetsErr);
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
