import { ProposalData } from './types';

export const proposals: ProposalData[] = [
  {
    id: 'pwa-terapeutico',
    code: 'PWA-TERAPEUTICO',
    title: 'Plataforma de Acompanhamento Terapêutico (PWA)',
    subtitle: 'Solução digital premium para prescrição clínica, engajamento familiar e rentabilização de consultas',
    clientName: '',
    clientRole: 'Psicologia Clínica & Acompanhamento Terapêutico',
    organization: 'Clínica & Prática Terapêutica',
    date: 'Novembro de 2026',
    validUntil: '16 de Dezembro de 2026',
    summary:
      'Uma plataforma digital (Progressive Web App - instalável no telemóvel e PC) para prescrever tarefas, recolher feedback e acompanhar a evolução terapêutica. Desenhada para ser não apenas uma excelente ferramenta clínica, mas um serviço premium que pode rentabilizar junto das famílias.',
    executivePitch:
      'A solução foi estruturada para garantir total autonomia ao terapeuta e máxima simplicidade para as famílias, assegurando o rigor exigido por dados clínicos sensíveis e cumprimento estrito do RGPD.',
    modules: {
      psychologist: {
        title: 'Módulo do Psicólogo',
        subtitle: 'Painel de Gestão Clínico (Web & Tablet)',
        description:
          'Painel de controlo profissional e intuitivo desenhado para gerir planos terapêuticos sem fricção operacional.',
        items: [
          {
            title: 'Gestão de Pacientes',
            description:
              'Criação e organização de perfis clínicos de forma rápida e segura, com histórico centralizado.',
          },
          {
            title: 'Prescrição Personalizada',
            description:
              'Criação de planos de tarefas à medida de cada criança, com definição de instruções detalhadas e periodicidade personalizada.',
          },
          {
            title: 'Dashboard de Acompanhamento',
            description:
              'Visão centralizada com indicadores de execução e evolução, permitindo analisar o feedback diário e semanal submetido pelos pais.',
          },
        ],
      },
      family: {
        title: 'Módulo da Família',
        subtitle: 'App dos Pais / Educadores (PWA Móvel)',
        description:
          'Aplicação sem barreiras de download em stores, instalável num clique diretamente no ecrã principal.',
        items: [
          {
            title: 'Interface Focada na Ação',
            description:
              'Design simples e direto ao ponto, otimizado para utilização rápida no telemóvel na rotina diária.',
          },
          {
            title: 'Gestão de Múltiplos Filhos',
            description:
              'Pais com mais de uma criança a cargo podem alternar facilmente entre perfis na mesma conta, mantendo as tarefas e dados rigorosamente separados.',
          },
          {
            title: 'Feedback Obrigatório Estruturado',
            description:
              'Validação de tarefas executadas com submissão de feedback simples e objetivo, essencial para a avaliação contínua do psicólogo.',
          },
        ],
      },
      securityRgpd: {
        title: 'Segurança, Privacidade e RGPD',
        subtitle: 'Tolerância Zero a Fugas de Dados de Saúde',
        description:
          'Arquitetura em conformidade total com as normas europeias de proteção de dados sensíveis de menores.',
        items: [
          {
            title: 'Isolamento de Dados em Servidores UE',
            description:
              'Base de dados dedicada, encriptada em repouso e em trânsito (AES-256 / TLS 1.3), alojada exclusivamente na União Europeia.',
          },
          {
            title: 'Cumprimento Legal & Artigo 28.º RGPD',
            description:
              'Implementação do "Direito ao Apagamento". Inclui contrato formal de subcontratação (Art. 28.º do RGPD): o psicólogo/terapeuta é o responsável pelo tratamento; a Nuelltech trata os dados estritamente sob sua instrução.',
          },
          {
            title: 'Acessos Seguros e Auditoria',
            description:
              'Sistema robusto de autenticação, recuperação segura de credenciais e isolamento estrito entre clínicas e famílias.',
          },
        ],
      },
      futureEvolutions: {
        title: 'Evoluções Futuras (Roadmap Pós-Fase 1)',
        description:
          'Funcionalidades pensadas para escalar a plataforma numa fase seguinte do negócio:',
        items: [
          'Pagamentos integrados diretamente na app (MBWay, Cartão de Crédito e Débito Direto)',
          'Relatórios avançados com IA para síntese clínica de evolução do paciente',
          'Partilha multi-utilizador e contas para clínicas com equipas multidisciplinares',
          'Empacotamento como aplicações nativas para distribuição na App Store e Google Play Store',
        ],
      },
    },
    phases: [
      {
        number: 1,
        title: 'Mockup Funcional',
        duration: '4 a 5 dias úteis',
        deliverables:
          'Protótipo visual e navegável dos ecrãs do psicólogo e dos pais. Inclui reunião para validação do design e fluxos de utilização.',
      },
      {
        number: 2,
        title: 'Desenvolvimento e Piloto',
        duration: '2 semanas',
        deliverables:
          'Programação core completa e entrega da plataforma num ambiente de testes privado, populada com dados fictícios para validação prática.',
      },
      {
        number: 3,
        title: 'Testes e Lançamento',
        duration: '3 a 4 semanas',
        deliverables:
          'Período de testes realizados por si. Aplicação de correções finais, configuração do servidor seguro (RGPD) e passagem oficial a produção.',
      },
    ],
    phasesNotes:
      'O planeamento inclui 2 rondas de correções nas fases de testes. Os prazos suspendem-se caso o feedback de aprovação demore mais de 5 dias úteis.',
    options: [
      {
        id: 'opcao-a',
        name: 'Opção A: Arranque',
        tagline: 'Mínimo risco financeiro inicial',
        isRecommended: false,
        idealProfile: 'Para testar a ideia no mercado com o menor investimento de setup.',
        setupPrice: 900,
        setupFormatted: '900 €',
        monthlyFee: '5 € / paciente ativo',
        hostingAndRgpd: 'Incluído (Servidores UE)',
        codeOwnership: 'Licença de utilização Nuelltech',
        dataOwnership: 'Seus (100% Exportáveis a qualquer momento)',
        supportLevel: 'Base: Correção de erros e resposta até 2 dias úteis.',
        highlights: [
          'Setup inicial mais acessível',
          'Ideal para carteira inicial pequena',
          'Infraestrutura gerida pela Nuelltech',
        ],
      },
      {
        id: 'opcao-b',
        name: 'Opção B: Parceria',
        tagline: 'A escolha recomendada para rentabilidade máxima',
        isRecommended: true,
        idealProfile: 'A escolha estratégica recomendada. Maximiza a sua margem de lucro por família a longo prazo.',
        setupPrice: 1500,
        setupFormatted: '1.500 €',
        monthlyFee: '2 € / paciente ativo',
        hostingAndRgpd: 'Incluído (Servidores UE)',
        codeOwnership: 'Licença de utilização Nuelltech',
        dataOwnership: 'Seus (100% Exportáveis a qualquer momento)',
        supportLevel: 'Plus: Resposta prioritária em 1 dia útil + 15% de desconto em novas evoluções.',
        highlights: [
          'Margem de lucro muito superior por paciente',
          'Amortização rápida em ~6 meses com apenas 20 famílias',
          'Suporte prioritário e melhor TCO a médio/longo prazo',
        ],
      },
      {
        id: 'opcao-c',
        name: 'Opção C: Propriedade',
        tagline: 'Controlo total e independência tecnológica',
        isRecommended: false,
        idealProfile: 'Controlo total do ativo. Ideal se pretende revender o software a colegas ou ter propriedade intelectual total.',
        setupPrice: 3200,
        setupFormatted: '3.200 €',
        monthlyFee: '120 € / mês (Custo Fixo sem limite de pacientes)',
        hostingAndRgpd: 'Incluído (Servidores Dedicados UE)',
        codeOwnership: 'Seu (Código-fonte 100% Proprietário)',
        dataOwnership: 'Seus (100% Exportáveis)',
        supportLevel: 'Premium: Canal direto via WhatsApp, 2h/mês de evolução gratuitas e revisão trimestral.',
        highlights: [
          'Propriedade integral do código-fonte',
          'Custo fixo previsível sem pagar por paciente adicional',
          'Canal VIP via WhatsApp com horas de desenvolvimento incluídas',
        ],
      },
    ],
    roiSimulation: {
      defaultFamilyFee: 15,
      defaultFamiliesCount: 20,
      note: 'Simulação baseada numa cobrança sugerida de 15 €/mês aos pais pelo serviço de acompanhamento digital. Valores antes de impostos.',
    },
    paymentTerms: [
      {
        percentage: '25%',
        stage: 'Na Adjudicação',
        description: 'Arranque oficial do projeto e início do desenho dos ecrãs.',
      },
      {
        percentage: '25%',
        stage: 'Na Aprovação do Mockup',
        description: 'Após validação do protótipo navegável interativo por si.',
      },
      {
        percentage: '25%',
        stage: 'Na Aprovação do Piloto',
        description: 'Com a plataforma funcional validada no ambiente de testes privado.',
      },
      {
        percentage: '25%',
        stage: 'No Go-Live',
        description: 'Na entrada em produção (servidores RGPD) e pronta a usar com pacientes reais.',
      },
    ],
    guarantee: {
      title: 'Garantia de Arranque & Risco Mitigado',
      description:
        'O primeiro mês após o lançamento em produção inclui suporte gratuito total para garantir uma transição suave. A faturação da sua mensalidade (dependente da Opção escolhida) apenas se inicia no segundo mês de utilização efetiva.',
    },
    nextSteps: {
      title: 'Próximos Passos & Agendamento',
      description:
        'Para avançarmos ou esclarecer qualquer pormenor técnico e clínico, basta agendarmos uma breve chamada de 15 minutos.',
      calendlyUrl: 'https://calendly.com/nuelltech/30min',
      whatsappNumber: '351966665571',
      whatsappMessage:
        'Olá Nuno! Estive a analisar a proposta da Plataforma PWA Terapêutica da Nuelltech e gostaria de agendar uma breve reunião.',
      email: 'nuno.miguel@nuelltech.com',
    },
  },
];

export function getProposalById(id: string): ProposalData | undefined {
  const normalized = id.toLowerCase().trim();
  // Match exact ID or common aliases
  return proposals.find(
    (p) =>
      p.id === normalized ||
      p.code?.toLowerCase() === normalized ||
      normalized === 'pwa-terapeutico' ||
      normalized === 'pwa-terapeutica' ||
      normalized === 'prp-2026-bruno' ||
      normalized === 'bruno' ||
      (normalized.includes('terapeut') && p.id === 'pwa-terapeutico') ||
      (normalized.includes('psico') && p.id === 'pwa-terapeutico') ||
      (normalized.includes('pwa') && p.id === 'pwa-terapeutico') ||
      normalized === 'demo'
  );
}
