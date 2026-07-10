import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, type, ...params } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Capture geolocation header injected by Vercel
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';

    // Fallback if Supabase is not configured yet (local testing convenience)
    if (!supabase) {
      console.log(`[Store Analytics Local Simulation] Session: ${sessionId} | Type: ${type} | Country: ${country} | Data:`, params);
      return NextResponse.json({ success: true, simulated: true });
    }

    if (type === 'session_init') {
      let referrerStr = params.referrer || 'direct';
      if (params.utmSource) {
        referrerStr += ` (utm_source=${params.utmSource}&utm_medium=${params.utmMedium || ''}&utm_campaign=${params.utmCampaign || ''})`;
      }

      const { error } = await supabase.from('sessions').upsert({
        session_id: sessionId,
        user_agent: params.userAgent || 'Unknown',
        country,
        referrer: referrerStr,
      });

      if (error) throw error;
    } else if (type === 'dwell') {
      const { error } = await supabase.from('section_views').insert({
        session_id: sessionId,
        section_id: params.sectionId,
        duration_seconds: params.duration || 0,
      });

      if (error) throw error;
    } else if (type === 'click') {
      const { error } = await supabase.from('clicks').insert({
        session_id: sessionId,
        element_id: params.elementId,
      });

      if (error) throw error;
    } else if (type === 'sector') {
      const { error } = await supabase.from('sessions').update({
        sector_selected: params.sector,
      }).eq('session_id', sessionId);

      if (error) throw error;
    } else if (type === 'booking') {
      const { error } = await supabase.from('bookings').insert({
        session_id: sessionId,
        name: params.name || 'Unknown',
        email: params.email || 'Unknown',
        event_time: params.eventTime || 'Unknown',
      });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Analytics Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
