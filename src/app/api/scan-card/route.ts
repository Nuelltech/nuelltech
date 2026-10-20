import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

export interface ScannedCardData {
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  notes: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, notes, scannedBy } = body as {
      imageBase64: string;
      mimeType?: string;
      notes?: string;
      scannedBy?: string;
    };

    if (!imageBase64) {
      return NextResponse.json({ error: 'Imagem não fornecida.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave API de IA não configurada no servidor.' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Clean base64 data URI prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const validMediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
    type ValidMediaType = (typeof validMediaTypes)[number];

    const detectedType: ValidMediaType = validMediaTypes.includes(mimeType as ValidMediaType)
      ? (mimeType as ValidMediaType)
      : 'image/jpeg';

    const systemPrompt = `You are a high-precision OCR & Business Card parser for Nuelltech.
Extract the contact information from the business card image and return ONLY a valid JSON object with the exact following keys:
{
  "firstName": "string",
  "lastName": "string",
  "fullName": "string",
  "role": "string",
  "company": "string",
  "email": "string",
  "phone": "string",
  "website": "string",
  "address": "string",
  "notes": "string"
}

Rules:
- Format phone numbers cleanly with country code if visible (e.g. +351912345678). If it's a 9-digit Portuguese number without country code, prefix with +351.
- If multiple phone numbers exist, pick the mobile number first, or primary phone. If there is a second number, mention it in "notes".
- Ensure website starts with https:// if a domain is present.
- Leave any missing field as an empty string "".
- Do NOT wrap the JSON in markdown code blocks. Output raw JSON only.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: detectedType,
                data: cleanBase64,
              },
            },
            {
              type: 'text',
              text: 'Extract all contact details from this business card into the requested JSON format.',
            },
          ],
        },
      ],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}';

    let extracted: ScannedCardData = {
      firstName: '',
      lastName: '',
      fullName: '',
      role: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      notes: '',
    };

    try {
      const jsonStart = rawText.indexOf('{');
      const jsonEnd = rawText.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd));
        extracted = {
          firstName: parsed.firstName || '',
          lastName: parsed.lastName || '',
          fullName: parsed.fullName || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim(),
          role: parsed.role || '',
          company: parsed.company || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          website: parsed.website || '',
          address: parsed.address || '',
          notes: [parsed.notes, notes].filter(Boolean).join(' | '),
        };
      }
    } catch (parseErr) {
      console.error('Failed to parse Claude Vision JSON:', rawText, parseErr);
      return NextResponse.json(
        { error: 'Não foi possível ler os dados do cartão. Tente tirar uma foto mais nítida.' },
        { status: 422 }
      );
    }

    // Optional: Persist scanned card to Supabase if table exists
    if (supabase) {
      try {
        await supabase.from('scanned_cards').insert({
          full_name: extracted.fullName || null,
          company: extracted.company || null,
          role: extracted.role || null,
          email: extracted.email || null,
          phone: extracted.phone || null,
          website: extracted.website || null,
          address: extracted.address || null,
          notes: extracted.notes || null,
          scanned_by: scannedBy || 'nuno-miguel',
        });
      } catch (dbErr) {
        console.warn('Could not save scanned card to Supabase (table may not exist yet):', dbErr);
      }
    }

    return NextResponse.json({ contact: extracted });
  } catch (error: unknown) {
    console.error('Error in /api/scan-card:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
