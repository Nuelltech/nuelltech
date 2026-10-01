import { NextRequest, NextResponse } from 'next/server';
import { getEmployeeBySlug, generateVCardString } from '@/data/employees';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const employee = getEmployeeBySlug(slug);

  if (!employee) {
    return new NextResponse('Colaborador não encontrado', { status: 404 });
  }

  const vcardData = generateVCardString(employee);
  const fileName = `${employee.firstName}_${employee.lastName}.vcf`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');

  return new NextResponse(vcardData, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
