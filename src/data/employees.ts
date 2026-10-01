export interface EmployeeData {
  slug: string;          // ex: "nuno-miguel"
  firstName: string;     // ex: "Nuno"
  lastName: string;      // ex: "Miguel"
  fullName?: string;     // ex: "Nuno Rogério Miguel"
  role: string;          // ex: "CEO"
  company: string;       // ex: "Nuelltech"
  phone: string;         // ex: "+351966665571"
  whatsapp: string;      // ex: "351966665571" (apenas dígitos com indicativo)
  email: string;         // ex: "nuno.miguel@nuelltech.com"
  website: string;       // ex: "https://nuelltech.com"
  linkedin: string;      // ex: "https://www.linkedin.com/in/nuno-rogerio-miguel/"
  location: string;      // ex: "Portugal"
  avatarUrl: string;     // URL da foto de perfil ou caminho relativo como "/team/nuno-miguel.png"
  cardUrl: string;       // URL público do cartão
  bio?: string;
}

export const employees: EmployeeData[] = [
  {
    slug: 'nuno-miguel',
    firstName: 'Nuno',
    lastName: 'Miguel',
    fullName: 'Nuno Rogério Miguel',
    role: 'CEO',
    company: 'Nuelltech',
    phone: '+351966665571',
    whatsapp: '351966665571',
    email: 'nuno.miguel@nuelltech.com',
    website: 'https://nuelltech.com',
    linkedin: 'https://www.linkedin.com/in/nuno-rogerio-miguel/',
    location: 'Portugal',
    avatarUrl: '/team/nuno-miguel.jpg',
    cardUrl: 'https://nuelltech.com/c/nuno-miguel',
    bio: 'Chief Executive Officer @ Nuelltech',
  },
  {
    slug: 'nuno',
    firstName: 'Nuno',
    lastName: 'Miguel',
    fullName: 'Nuno Rogério Miguel',
    role: 'CEO',
    company: 'Nuelltech',
    phone: '+351966665571',
    whatsapp: '351966665571',
    email: 'nuno.miguel@nuelltech.com',
    website: 'https://nuelltech.com',
    linkedin: 'https://www.linkedin.com/in/nuno-rogerio-miguel/',
    location: 'Portugal',
    avatarUrl: '/team/nuno-miguel.jpg',
    cardUrl: 'https://nuelltech.com/c/nuno',
    bio: 'Chief Executive Officer @ Nuelltech',
  },
];

export function getEmployeeBySlug(slug: string): EmployeeData | undefined {
  const normalizedSlug = slug.toLowerCase().trim();
  return employees.find((emp) => emp.slug.toLowerCase() === normalizedSlug);
}

export function generateVCardString(emp: EmployeeData): string {
  const displayName = emp.fullName || `${emp.firstName} ${emp.lastName}`;
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${emp.lastName};${emp.firstName};;;`,
    `FN:${displayName}`,
    `ORG:${emp.company}`,
    `TITLE:${emp.role}`,
    `TEL;TYPE=CELL,VOICE:${emp.phone}`,
    `EMAIL;TYPE=WORK,INTERNET:${emp.email}`,
    `URL:${emp.website}`,
    `ADR;TYPE=WORK:;;${emp.location};;;;`,
    emp.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${emp.linkedin}` : '',
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');
}
