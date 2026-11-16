export interface ProposalModule {
  title: string;
  subtitle?: string;
  description: string;
  items: {
    title: string;
    description: string;
  }[];
}

export interface ProposalPhase {
  number: number;
  title: string;
  duration: string;
  deliverables: string;
  details?: string;
}

export interface InvestmentOption {
  id: string;
  name: string;
  tagline: string;
  isRecommended?: boolean;
  idealProfile: string;
  setupPrice: number;
  setupFormatted: string;
  monthlyFee: string;
  hostingAndRgpd: string;
  codeOwnership: string;
  dataOwnership: string;
  supportLevel: string;
  highlights: string[];
}

export interface ProposalData {
  id: string;
  code?: string; // e.g. "PRP-2026-084"
  title: string;
  subtitle: string;
  clientName: string;
  clientRole?: string;
  organization?: string;
  date: string;
  validUntil: string;
  summary: string;
  executivePitch: string;
  modules: {
    psychologist: ProposalModule;
    family: ProposalModule;
    securityRgpd: ProposalModule;
    futureEvolutions: {
      title: string;
      description: string;
      items: string[];
    };
  };
  phases: ProposalPhase[];
  phasesNotes: string;
  options: InvestmentOption[];
  roiSimulation: {
    defaultFamilyFee: number; // e.g. 15€
    defaultFamiliesCount: number; // e.g. 20
    note: string;
  };
  paymentTerms: {
    percentage: string;
    stage: string;
    description: string;
  }[];
  guarantee: {
    title: string;
    description: string;
  };
  nextSteps: {
    title: string;
    description: string;
    calendlyUrl: string;
    whatsappNumber: string;
    whatsappMessage: string;
    email: string;
  };
}
