import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start') || '';
    const end = searchParams.get('end') || '';

    const makeWebhookUrl = process.env.MAKE_SLOTS_WEBHOOK_URL;

    // Fallback: If Make.com webhook is not configured, simulate all slots are available
    if (!makeWebhookUrl) {
      console.log(`[Slots Proxy Simulation] No MAKE_SLOTS_WEBHOOK_URL set. Returning empty busy list.`);
      return NextResponse.json({ busy: [] });
    }

    // Call Make.com Webhook with start/end parameters
    const targetUrl = new URL(makeWebhookUrl);
    targetUrl.searchParams.set('start', start);
    targetUrl.searchParams.set('end', end);

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Optional security token to secure Make webhook
        'Authorization': `Bearer ${process.env.MAKE_API_TOKEN || ''}`
      }
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in slots proxy API:', err);
    return NextResponse.json({ busy: [], error: err.message }, { status: 500 });
  }
}
