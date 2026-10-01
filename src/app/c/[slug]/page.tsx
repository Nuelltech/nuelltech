import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEmployeeBySlug, employees } from '@/data/employees';
import VirtualBusinessCard from '@/components/VirtualBusinessCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return employees.map((emp) => ({
    slug: emp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const employee = getEmployeeBySlug(slug);

  if (!employee) {
    return {
      title: 'Cartão de Visita Não Encontrado | Nuelltech',
    };
  }

  const name = employee.fullName || `${employee.firstName} ${employee.lastName}`;
  const title = `${name} — ${employee.role} | ${employee.company}`;
  const description = `Cartão de Visita Digital 3D de ${name}, ${employee.role} na ${employee.company}. Guarde o contacto ou conecte-se diretamente.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: employee.cardUrl,
      siteName: employee.company,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BusinessCardPage({ params }: PageProps) {
  const { slug } = await params;
  const employee = getEmployeeBySlug(slug);

  if (!employee) {
    notFound();
  }

  return <VirtualBusinessCard employee={employee} />;
}
