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
  setupWithVatFormatted?: string;
  monthlyFee: string;
  hostingAndRgpd: string;
  codeOwnership: string;
  dataOwnership: string;
  supportLevel: string;
  highlights: string[];
  deliverables?: string[];
  importantNote?: string;
}

export interface TechnicalAnswer {
  number: number;
  question: string;
  shortAnswer: string;
  details: string;
  bullets?: string[];
}

export interface MaintenancePlan {
  priceFormatted: string;
  priceWithVatFormatted: string;
  coverage: string[];
  commitment: string;
  freeMonthNote: string;
}

export interface BaseProposal {
  id: string;
  code?: string;
  title: string;
  subtitle: string;
  clientName: string;
  clientRole?: string;
  organization?: string;
  location?: string;
  date: string;
  validUntil: string;
  summary: string;
  executivePitch: string;
  options: InvestmentOption[];
  paymentTerms: {
    percentage: string;
    stage: string;
    description: string;
  }[];
  guarantee?: {
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

export interface PwaProposalData extends BaseProposal {
  type: 'pwa';
  guarantee: {
    title: string;
    description: string;
  };
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
  roiSimulation: {
    defaultFamilyFee: number;
    defaultFamiliesCount: number;
    note: string;
  };
}

export interface AlojamentoProposalData extends BaseProposal {
  type: 'alojamento';
  technicalAnswers: TechnicalAnswer[];
  maintenancePlan: MaintenancePlan;
}

export type ProposalData = PwaProposalData | AlojamentoProposalData;
