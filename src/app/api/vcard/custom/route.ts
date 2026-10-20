import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const fullName = searchParams.get('fullName') || 'Contacto';
  const firstName = searchParams.get('firstName') || fullName.split(' ')[0] || '';
  const lastName = searchParams.get('lastName') || fullName.split(' ').slice(1).join(' ') || '';
  const company = searchParams.get('company') || '';
  const role = searchParams.get('role') || '';
  const phone = searchParams.get('phone') || '';
  const email = searchParams.get('email') || '';
  const website = searchParams.get('website') || '';
  const address = searchParams.get('address') || '';
  const notes = searchParams.get('notes') || '';

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
    `FN;CHARSET=UTF-8:${fullName}`,
    company ? `ORG;CHARSET=UTF-8:${company}` : '',
    role ? `TITLE;CHARSET=UTF-8:${role}` : '',
    phone ? `TEL;TYPE=CELL,VOICE:${phone}` : '',
    email ? `EMAIL;TYPE=WORK,INTERNET:${email}` : '',
    website ? `URL:${website}` : '',
    address ? `ADR;TYPE=WORK;CHARSET=UTF-8:;;${address};;;;` : '',
    notes ? `NOTE;CHARSET=UTF-8:${notes}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');

  const safeName = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  return new NextResponse(vcardLines, {
    status: 200,
    headers: {
      'Content-Type': 'text/x-vcard; charset=utf-8',
      'Content-Disposition': `inline; filename="${safeName || 'contacto'}.vcf"`,
      'Cache-Control': 'no-store',
    },
  });
}
