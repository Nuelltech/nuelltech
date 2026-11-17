import { ProposalData } from './types';

export const proposals: ProposalData[] = [
  // 1. Proposta PWA Terapêutico
  {
    id: 'pwa-terapeutico',
    code: 'PWA-TERAPEUTICO',
    type: 'pwa',
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

  // 2. Proposta Alojamento Local Trancoso (2 Apartamentos)
  {
    id: 'alojamento-trancoso',
    code: 'PRP-2026-TRANCOSO',
    type: 'alojamento',
    title: 'Website Bilingue para Alojamento Local (2 Apartamentos em Trancoso)',
    subtitle: 'Presença digital premium, motor de reservas diretas sem comissões de terceiros e sincronização iCal',
    clientName: '',
    clientRole: 'Proprietário / Gestão de Alojamento Local',
    organization: 'Alojamento Local Trancoso',
    location: 'Trancoso, Guarda • Portugal',
    date: 'Novembro de 2026',
    validUntil: '17 de Dezembro de 2026',
    summary:
      'Proposta fechada e estruturada para o desenvolvimento de um website bilingue (Português e Inglês) para 2 apartamentos de alojamento local em Trancoso. Inclui duas opções distintas: desde um site de apresentação elegante com ligação ao Airbnb até uma plataforma autónoma com motor de reservas próprio, pagamentos online (Stripe/MBWay) e sincronização de calendários.',
    executivePitch:
      'O projeto foi concebido para valorizar a identidade única dos 2 apartamentos em Trancoso, garantindo máxima visibilidade local e internacional (SEO + IA) e permitindo, caso opte pela Opção B, recuperar a margem que atualmente é retida pelas comissões das plataformas de reservas.',
    options: [
      {
        id: 'opcao-a',
        name: 'Opção A: Site de Apresentação',
        tagline: 'Imagem profissional & tráfego para plataformas existentes',
        isRecommended: false,
        idealProfile: 'Para quem pretende uma presença digital elegante e credível, mantendo o processo de reservas no Airbnb.',
        setupPrice: 650,
        setupFormatted: '650,00 €',
        setupWithVatFormatted: '799,50 €',
        monthlyFee: 'Manutenção opcional: 35,00 € + IVA / mês',
        hostingAndRgpd: 'Servidor dedicado na Europa com SSL e backups',
        codeOwnership: '100% Seu (Acesso de Administrador total)',
        dataOwnership: '100% Seus (Domínio registado em seu nome)',
        supportLevel: 'Apoio técnico no arranque + 2 rondas globais de alterações',
        highlights: [
          'Site bilingue completo (Português e Inglês)',
          '1 página dedicada por apartamento com galeria fotográfica',
          'Secção de acessibilidade e mapa interativo de localização',
          'Botões de reserva ligados diretamente aos anúncios do Airbnb',
          'Botão de contacto direto via WhatsApp e formulário',
          'SEO Local avançado + Otimização para Assistentes de IA',
          'Registo de domínio (.pt ou .com) incluído no 1º ano',
        ],
        deliverables: [
          'Home institucional com 4 a 5 secções bem estruturadas',
          'Páginas individuais dos 2 apartamentos com galerias profissionais fornecidas por si',
          'Design moderno, responsivo (telemóvel, tablet e desktop) e rápido',
          'Botões de reencaminhamento direto para o Airbnb',
          'Otimização semântica e SEO Local (Google Maps, Bing, ChatGPT e Perplexity)',
        ],
        importantNote:
          'Nesta Opção A, todo o processo de reserva e pagamento decorre diretamente no Airbnb/Booking. As comissões e taxas aplicadas por essas plataformas estão fora do âmbito deste desenvolvimento e são geridas diretamente por si com as mesmas.',
      },
      {
        id: 'opcao-b',
        name: 'Opção B: Site com Reservas Diretas (Motor Próprio)',
        tagline: 'Independência de comissões, pagamentos online & calendário iCal',
        isRecommended: true,
        idealProfile: 'A escolha recomendada para maximizar rentabilidade, eliminar comissões de intermediários e gerir reservas de forma centralizada.',
        setupPrice: 1250,
        setupFormatted: '1.250,00 €',
        setupWithVatFormatted: '1.537,50 €',
        monthlyFee: 'Manutenção opcional: 35,00 € + IVA / mês',
        hostingAndRgpd: 'Servidor dedicado na Europa com SSL e backups diários',
        codeOwnership: '100% Seu (Acesso de Administrador total)',
        dataOwnership: '100% Seus (Base de dados de hóspedes e reservas é sua)',
        supportLevel: 'Apoio técnico no arranque + 2 rondas globais de alterações',
        highlights: [
          'Tudo o que consta na Opção A',
          'Motor de Reservas próprio com calendário de disponibilidade em tempo real',
          'Preços configuráveis, épocas e políticas de cancelamento flexíveis',
          'Sincronização bidirecional automática (iCal) com Airbnb e Booking (Zero Overbookings)',
          'Pagamentos online seguros via Stripe (Cartões de Crédito/Débito e MBWay)',
          'Preparação técnica para integração com software de faturação certificado (Moloni/Vendus)',
          'Envio automático de emails de confirmação ao hóspede',
          'Painel de gestão intuitivo para controlo total de reservas',
        ],
        deliverables: [
          'Motor de reservas completo integrado no website',
          'Sincronização iCal em tempo real com canais externos',
          'Integração técnica do checkout Stripe',
          'Aquisição e configuração das licenças premium de reservas para o 1º ano incluída no valor',
        ],
        importantNote:
          'Com o motor de reservas próprio, poupa as taxas de intermediação (geralmente entre 15% e 20% por reserva). As únicas comissões aplicáveis são as tarifas de processamento bancário da Stripe, cobradas diretamente pela gateway sem qualquer custo adicional da Nuelltech.',
      },
    ],
    technicalAnswers: [
      {
        number: 1,
        question: 'Plataforma a utilizar (WordPress, Wix, código à medida ou outra)?',
        shortAnswer: 'WordPress (com WooCommerce / Motor de Reservas Dedicado)',
        details:
          'Para este tipo de projeto (especialmente a Opção B com gestão hoteleira), utilizamos WordPress. É a plataforma mais robusta a nível global para hotelaria independente, garantindo que o painel de gestão é extremamente intuitivo para o cliente atualizar preços, datas e fotografias.',
        bullets: [
          'Sendo a Nuelltech uma empresa de engenharia de software, também desenvolvemos soluções de raiz em código custom (Next.js/React); contudo, para a escala e orçamento deste projeto, o WordPress é a escolha mais inteligente, económica e sustentável a longo prazo.',
          'Interface em Português e fácil de usar sem conhecimentos de programação.',
        ],
      },
      {
        number: 2,
        question: 'O motor de reservas tem custos de licença (Opção B)?',
        shortAnswer: '1.º Ano 100% Incluído no Orçamento • Renovações transparentes',
        details:
          'O desenvolvimento de um motor de reservas profissional em WordPress exige a utilização de plugins premium certificados para gestão de calendários e sincronização iCal.',
        bullets: [
          'O valor do nosso orçamento fechado já inclui a aquisição e configuração inicial destas licenças para o 1.º ano.',
          'As renovações anuais destas licenças de software de terceiros (geralmente entre 80 € a 150 €/ano no total) ficarão a vosso cargo a partir do segundo ano, garantindo que o sistema continua a receber atualizações de segurança e melhorias contínuas.',
        ],
      },
      {
        number: 3,
        question: 'Como funciona a integração com Stripe e Gateways de Pagamento (Opção B)?',
        shortAnswer: 'Integração técnica total pela Nuelltech • Criação de conta pelo proprietário',
        details:
          'A Nuelltech assegura toda a integração técnica do checkout com a Stripe (Cartões e MBWay). Contudo, há dois aspetos fundamentais:',
        bullets: [
          'Criação de Conta (KYC): Por exigência legal bancária da União Europeia, a criação e validação da conta Stripe (envio de identificação do titular e IBAN para recebimento dos fundos) tem de ser realizada por si. A Nuelltech orienta todo o processo passo a passo.',
          'Comissões Bancárias: A Stripe cobra a sua comissão normal de intermediação bancária por transação processada. Este valor é retido automaticamente por eles no momento do pagamento, não havendo qualquer custo adicional ou comissão cobrada pela Nuelltech.',
        ],
      },
      {
        number: 4,
        question: 'Quem fica com a propriedade e os acessos do site?',
        shortAnswer: '100% de Propriedade do Cliente • Sem dependências',
        details:
          'O site é integralmente seu. O domínio é registado formalmente em seu nome/empresa. Após o pagamento integral do projeto, fornecemos todas as credenciais de Administrador com acesso pleno ao código, painel de gestão e base de dados.',
      },
      {
        number: 5,
        question: 'Qual é o prazo de entrega?',
        shortAnswer: 'Opção A: 2 a 3 semanas • Opção B: 3 a 4 semanas',
        details:
          'Prazos contados a partir da receção dos conteúdos e fotografias de boa qualidade fornecidas pelo cliente e validação do layout inicial.',
      },
      {
        number: 6,
        question: 'Qual é a forma de pagamento e quantas rondas de alterações estão incluídas?',
        shortAnswer: '4 tranches de 25% por entregas reais • 2 rondas de revisão completas',
        details:
          'Para garantir máxima segurança mútua, o pagamento do valor fechado é diluído à medida que o projeto avança e é aprovado por si:',
        bullets: [
          '25% na Adjudicação (Início oficial dos trabalhos e estrutura)',
          '25% na Aprovação do Design Visual dos ecrãs',
          '25% na Apresentação do Site Funcional em ambiente privado de testes',
          '25% no Lançamento Oficial (Site online, testado e pronto a receber hóspedes)',
          'Estão incluídas 2 rondas completas de alterações/revisões globais durante o processo de desenvolvimento.',
        ],
      },
      {
        number: 7,
        question: 'Qual o valor da manutenção mensal, domínio e o que cobre?',
        shortAnswer: '35,00 € + IVA / mês (Sem fidelização obrigatória • 1.º mês de oferta)',
        details:
          'Um serviço proativo para garantir que o seu alojamento local está sempre online, seguro e rápido.',
        bullets: [
          'Alojamento de alta performance em servidor dedicado na Europa (rápido e fiável)',
          'Certificado de Segurança SSL (HTTPS)',
          'Backups diários automáticos de segurança e base de dados',
          'Atualizações técnicas do núcleo do WordPress, plugins e segurança',
          'Monitorização de disponibilidade 24/7 (uptime)',
          'Renovação anual do domínio (.pt ou .com) incluída',
          'Primeiro mês de manutenção é oferta da Nuelltech',
        ],
      },
    ],
    maintenancePlan: {
      priceFormatted: '35,00 €',
      priceWithVatFormatted: '43,05 €',
      commitment: 'Sem fidelização obrigatória (cancele quando desejar)',
      freeMonthNote: 'O 1.º mês de manutenção e alojamento é oferta de arranque da Nuelltech.',
      coverage: [
        'Alojamento num servidor rápido e dedicado (Europa)',
        'Certificado de segurança SSL (HTTPS)',
        'Backups diários de segurança de todo o website e base de dados',
        'Atualizações técnicas regulares do núcleo do WordPress e plugins',
        'Monitorização de disponibilidade e segurança contra ataques',
        'Renovação anual do domínio (.pt ou .com) incluída',
      ],
    },
    paymentTerms: [
      {
        percentage: '25%',
        stage: 'Na Adjudicação',
        description: 'Início oficial dos trabalhos e arquitetura do website.',
      },
      {
        percentage: '25%',
        stage: 'Na Aprovação do Design',
        description: 'Após validação do visual, páginas dos apartamentos e identidade.',
      },
      {
        percentage: '25%',
        stage: 'No Site Funcional (Testes)',
        description: 'Com o site completamente funcional e motor de reservas testado em privado.',
      },
      {
        percentage: '25%',
        stage: 'No Lançamento Oficial',
        description: 'Com o site publicado em produção, domínio configurado e pronto a faturar.',
      },
    ],
    guarantee: {
      title: 'Transparência, Risco Zero & Suporte Inicial',
      description:
        'O primeiro mês após o lançamento inclui manutenção e alojamento gratuitos para garantir que tudo funciona em perfeitas condições. Estão incluídas 2 rondas de revisões completas e o site é 100% sua propriedade desde o primeiro dia.',
    },
    nextSteps: {
      title: 'Próximos Passos & Agendamento',
      description:
        'Se os valores e condições estiverem alinhados com o que pretende, terei todo o gosto em agendar uma breve chamada de 15 minutos para nos conhecermos e esclarecer qualquer questão.',
      calendlyUrl: 'https://calendly.com/nuelltech/30min',
      whatsappNumber: '351966665571',
      whatsappMessage:
        'Olá Nuno! Estive a analisar a proposta para o site dos apartamentos em Trancoso e gostaria de agendar uma breve reunião.',
      email: 'nuno.miguel@nuelltech.com',
    },
  },
];

export function getProposalById(id: string): ProposalData | undefined {
  const normalized = id.toLowerCase().trim();
  
  // 1. Verificar Alojamento Local Trancoso
  if (
    normalized === 'alojamento-trancoso' ||
    normalized === 'al-trancoso' ||
    normalized === 'trancoso' ||
    normalized === 'trancoso-al' ||
    normalized === 'prp-2026-trancoso' ||
    normalized.includes('trancoso')
  ) {
    return proposals.find((p) => p.id === 'alojamento-trancoso');
  }

  // 2. Verificar PWA Terapêutico
  if (
    normalized === 'pwa-terapeutico' ||
    normalized === 'pwa-terapeutica' ||
    normalized === 'prp-2026-bruno' ||
    normalized === 'bruno' ||
    normalized === 'psicologo-bruno' ||
    normalized === 'dr-bruno' ||
    normalized.includes('terapeut') ||
    normalized.includes('psico')
  ) {
    return proposals.find((p) => p.id === 'pwa-terapeutico');
  }

  return proposals.find((p) => p.id === normalized || p.code?.toLowerCase() === normalized);
}
