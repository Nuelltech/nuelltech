import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventTime, sector, challenge } = body;

    const makeWebhookUrl = process.env.MAKE_CONFIRM_WEBHOOK_URL;

    // Fallback: If Make.com webhook is not configured, simulate success locally
    if (!makeWebhookUrl) {
      console.log(`[Confirm Proxy Simulation] No MAKE_CONFIRM_WEBHOOK_URL set. Simulating success for:`, body);
      return NextResponse.json({
        success: true,
        meetLink: 'https://meet.google.com/mock-meet-link'
      });
    }

    // Call Make.com Webhook with booking details
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAKE_API_TOKEN || ''}`
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        eventTime,
        sector,
        challenge
      })
    });

    if (!response.ok) {
      throw new Error(`Make.com confirm webhook returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in confirm proxy API:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
