'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ShieldAlert, Check, FileText, Settings, History, Info, Play, FolderOpen, TrendingUp, Brain } from 'lucide-react';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  pt: boolean;
}

type DocType = 'fruit' | 'frozen' | 'grocery';
type ActionType = 'margins' | 'guide' | 'contract';

interface SimulationResult {
  logs: string[];
  matrixFields: { label: string; value: string; conf: string; status?: 'review' | 'ok' }[];
  reconciliation: { label: string; extracted: string; sysRecord: string; variance: string; status: 'matched' | 'review' | 'blocked' }[];
  ptImpact: string;
  enImpact: string;
  impactColor: string;
  ptActionLabel?: string;
  enActionLabel?: string;
}

interface PriceTrend {
  product: string;
  minPrice: string;
  maxPrice: string;
  variance: string;
  svgPath: string;
  ptLabel: string;
  enLabel: string;
}

interface ContractPrices {
  fruitPear: number;
  frozenChicken: number;
  frozenOctopus: number;
}

// Generate simulation data based on dynamic contract price configurations
const getSimulationData = (pt: boolean, prices: ContractPrices): Record<DocType, Record<ActionType, SimulationResult>> => {
  // Fruit Pear Audit Check
  const fruitPearExtracted = 1.30;
  const fruitPearContract = prices.fruitPear;
  const fruitPearDiff = ((fruitPearExtracted - fruitPearContract) / fruitPearContract) * 100;
  const fruitPearIsMatched = fruitPearExtracted <= fruitPearContract;

  // Frozen Chicken Audit Check
  const chickenExtracted = 7.35;
  const chickenContract = prices.frozenChicken;
  const chickenDiff = ((chickenExtracted - chickenContract) / chickenContract) * 100;
  const chickenIsMatched = chickenExtracted <= chickenContract;

  // Frozen Octopus Audit Check
  const octopusExtracted = 9.50;
  const octopusContract = prices.frozenOctopus;
  const octopusDiff = ((octopusExtracted - octopusContract) / octopusContract) * 100;
  const octopusIsMatched = octopusExtracted <= octopusContract;

  return {
    fruit: {
      margins: {
        ptImpact: `📈 IMPACTO NAS MARGENS: O custo da Pêra Rocha subiu para 1.30€/KG, comprimindo a margem do "Doce de Pêra Caseiro" de 75% para 70%. O sistema sugere aumentar o PVP de venda da compota de 3.50€ para 3.80€ para reestabelecer o rácio histórico.`,
        enImpact: `📈 MARGIN IMPACT: Pear cost rose to 1.30€/KG, compressing the margin of "Homemade Pear Jam" from 75% to 70%. The system recommends raising the retail price from 3.50€ to 3.80€ to restore historic ratios.`,
        impactColor: 'border-brand-accent',
        ptActionLabel: 'Atualizar Ficha Técnica',
        enActionLabel: 'Update Recipe Costs',
        logs: [
          pt ? '[INFRA] Ingestão: fatura_bastos_frutas.pdf carregada.' : '[INFRA] Ingest: fatura_bastos_frutas.pdf loaded.',
          pt ? '[PARSING] Extraído: Pêra Conferência -> 1.30 €/KG' : '[PARSING] Extracted: Pêra Conferência -> 1.30 €/KG',
          pt ? '[SQL] Atualizando custo de produção do ingrediente...' : '[SQL] Updating production cost for ingredient...',
          pt ? '[MARGIN] Alerta: Margem da ficha "Doce de Pêra" reduziu 5.00%.' : '[MARGIN] Alert: "Pear Jam" recipe margin reduced by 5.00%.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'POMAR DO CARVALHO Lda', conf: '99.5% CONF' },
          { label: 'Doc Number', value: 'FR CMB/4963', conf: '99.1% CONF' },
          { label: 'Maçã Golden', value: '0.60 €/KG', conf: '99.0% CONF' },
          { label: 'Pêra Conferência', value: '1.30 €/KG', conf: 'REVIEW', status: 'review' }
        ],
        reconciliation: [
          { label: 'Maçã Cost', extracted: '0.60 €/KG', sysRecord: 'PO #1102 - 0.60 €/KG', variance: '0.00%', status: 'matched' },
          { label: 'Pêra Cost', extracted: '1.30 €/KG', sysRecord: 'Prev: 1.10 €/KG', variance: '+18.18%', status: 'review' }
        ]
      },
      guide: {
        ptImpact: '📋 AUDITORIA DE GUIA: A fatura cobra 24 KG de Maçã Golden, mas a guia de entrega anotada pelo motorista registou apenas 20 KG entregues (4 KG devolvidos por danos de transporte). Poupança imediata detetada: 2.40 € pendentes de nota de crédito.',
        enImpact: '📋 GUIDE AUDIT: Invoice bills 24 KG of Golden Apples, but the delivery note signed by the driver registered only 20 KG delivered (4 KG returned due to damage). Immediate saving detected: 2.40 € pending credit note.',
        impactColor: 'border-brand-risk',
        ptActionLabel: 'Reclamar Nota de Crédito',
        enActionLabel: 'Claim Credit Note',
        logs: [
          pt ? '[INFRA] Cruzando fatura_bastos_frutas.pdf com guia_entrega_192.pdf...' : '[INFRA] Cross-checking invoice with delivery_note_192.pdf...',
          pt ? '[AUDIT] Analisando anotações manuais digitalizadas da guia...' : '[AUDIT] Analyzing scanned manual notes on delivery guide...',
          pt ? '[DISCREPANCY] Detetada quebra física na entrega de Maçã Golden.' : '[DISCREPANCY] Physical shortage detected for Golden Apples.',
          pt ? '[ALERT] Faturado: 24.00 KG | Entregue: 20.00 KG. Diferença: -4.00 KG.' : '[ALERT] Billed: 24.00 KG | Delivered: 20.00 KG. Variance: -4.00 KG.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'POMAR DO CARVALHO Lda', conf: '99.5% CONF' },
          { label: 'Doc Number', value: 'FR CMB/4963', conf: '99.1% CONF' },
          { label: 'Billed Apple Qty', value: '24.00 KG', conf: '98.5% CONF' },
          { label: 'Delivered Apple Qty', value: '20.00 KG', conf: 'REVIEW', status: 'review' }
        ],
        reconciliation: [
          { label: 'Pêra Qty Match', extracted: '33.00 KG', sysRecord: 'Guia: 33.00 KG', variance: '0.00%', status: 'matched' },
          { label: 'Maçã Qty Match', extracted: '24.00 KG', sysRecord: 'Guia: 20.00 KG', variance: '-4.00 KG', status: 'review' }
        ]
      },
      contract: {
        ptImpact: fruitPearIsMatched 
          ? `📜 PREÇOS DE CONTRATO: Fatura em conformidade. O preço cobrado (1.30 €/KG) está de acordo ou abaixo da regra de preço limite configurada em contrato (${fruitPearContract.toFixed(2)} €/KG).`
          : `📜 PREÇOS DE CONTRATO: O fornecedor faturou a Pêra Conferência a 1.30€/KG, mas a tabela de preços de contrato limita o item a ${fruitPearContract.toFixed(2)}€/KG (Desvio de +${fruitPearDiff.toFixed(1)}%). IA gerou notificação de desvio comercial.`,
        enImpact: fruitPearIsMatched
          ? `📜 CONTRACT AUDIT: Invoice in compliance. Billed price (1.30 €/KG) respects the contract threshold limit of ${fruitPearContract.toFixed(2)} €/KG.`
          : `📜 CONTRACT AUDIT: Supplier billed Pears at 1.30€/KG, exceeding the pre-negotiated threshold of ${fruitPearContract.toFixed(2)}€/KG (Deviation of +${fruitPearDiff.toFixed(1)}%). IA generated dispute.`,
        impactColor: fruitPearIsMatched ? 'border-brand-ok' : 'border-brand-warn',
        ptActionLabel: fruitPearIsMatched ? undefined : 'Enviar Notificação de Desvio',
        enActionLabel: fruitPearIsMatched ? undefined : 'Send Dispute Notification',
        logs: [
          pt ? '[SQL] Carregando catálogo de preços acordados para 2026...' : '[SQL] Loading agreed price catalog for 2026...',
          pt ? '[AUDIT] Validando preços faturados contra acordos contratuais...' : '[AUDIT] Validating billed prices against contract rules...',
          fruitPearIsMatched 
            ? (pt ? '[OK] Margem de preço dentro dos limites acordados.' : '[OK] Billed price within contract boundaries.')
            : (pt ? '[OVERCHARGE] Desvio de preço encontrado na Pêra Rocha.' : '[OVERCHARGE] Price deviation found on Pear.'),
          pt ? `[REGRA] Limite Contratado: ${fruitPearContract.toFixed(2)} €/KG` : `[RULE] Contract Limit: ${fruitPearContract.toFixed(2)} €/KG`
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'POMAR DO CARVALHO Lda', conf: '99.5% CONF' },
          { label: 'Billed Pear Price', value: '1.30 €/KG', conf: fruitPearIsMatched ? '99.0% CONF' : 'REVIEW', status: fruitPearIsMatched ? 'ok' : 'review' },
          { label: 'Contract Pear Price', value: `${fruitPearContract.toFixed(2)} €/KG`, conf: '99.9% CONF' }
        ],
        reconciliation: [
          { label: 'Maçã Price Check', extracted: '0.60 €/KG', sysRecord: 'Contract: 0.60 €/KG', variance: '0.00%', status: 'matched' },
          { 
            label: 'Pêra Price Check', 
            extracted: '1.30 €/KG', 
            sysRecord: `Contract: ${fruitPearContract.toFixed(2)} €/KG`, 
            variance: fruitPearIsMatched ? '0.00%' : `+${fruitPearDiff.toFixed(2)}%`, 
            status: fruitPearIsMatched ? 'matched' : 'review' 
          }
        ]
      }
    },
    frozen: {
      margins: {
        ptImpact: '📈 IMPACTO NAS MARGENS: O custo da linha "POLVO ROTO" (9.50€/KG) e do "BIFE FRANGO" (7.35€/KG) comprimiu a margem do prato do dia de 68% para 59%. O sistema aconselha redefinir as doses ou reajustar o PVP de venda.',
        enImpact: '📈 MARGIN IMPACT: Billed frozen octopus (9.50€/KG) and chicken paned breast (7.35€/KG) compressed margin on daily menus from 68% to 59%. System advises resizing portions or retail pricing adjustment.',
        impactColor: 'border-brand-accent',
        ptActionLabel: 'Simular Margens Menu',
        enActionLabel: 'Simulate Menu Margins',
        logs: [
          pt ? '[PARSING] Extraído artigo: Bife Frango Panado -> 7.35 €/KG' : '[PARSING] Extracted article: Paned Chicken Breast -> 7.35 €/KG',
          pt ? '[PARSING] Extraído artigo: Polvo Roto -> 9.50 €/KG' : '[PARSING] Extracted article: Octopus Roto -> 9.50 €/KG',
          pt ? '[SQL] Atualizando matriz de custos de receitas de menu...' : '[SQL] Updating recipe costs matrix for menus...',
          pt ? '[MARGIN] Alerta: Prato de Polvo reduziu margem líquida para 60%.' : '[MARGIN] Alert: Octopus dish reduced net margin to 60%.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'FRIO-VIL CONGELADOS, S.A.', conf: '99.8% CONF' },
          { label: 'Doc Number', value: 'FT FTV 25001/070673', conf: '99.5% CONF' },
          { label: 'Frango Panado Price', value: '7.35 €/KG', conf: 'REVIEW', status: 'review' },
          { label: 'Polvo Roto Price', value: '9.50 €/KG', conf: '99.0% CONF' }
        ],
        reconciliation: [
          { label: 'Polvo Cost Sync', extracted: '9.50 €/KG', sysRecord: 'PO Cost: 9.50 €/KG', variance: '0.00%', status: 'matched' },
          { label: 'Frango Cost Sync', extracted: '7.35 €/KG', sysRecord: 'Prev: 6.50 €/KG', variance: '+13.07%', status: 'review' }
        ]
      },
      guide: {
        ptImpact: '📋 AUDITORIA DE GUIA: O bife de frango panado foi recusado na entrega (ruptura de frio registada pelo termógrafo do cais). A fatura de 29.40 € foi retida e a IA lançou uma requisição automática de nota de crédito de reembolso.',
        enImpact: '📋 GUIDE AUDIT: Billed chicken was rejected upon delivery due to cold chain temperature failure. The 29.40 € invoice line was flagged and the AI generated an automatic credit note refund request.',
        impactColor: 'border-brand-risk',
        ptActionLabel: 'Aprovar Nota de Crédito',
        enActionLabel: 'Approve Credit Note',
        logs: [
          pt ? '[INFRA] Cruzando Fatura com Guia de Receção do Cais...' : '[INFRA] Merging invoice with warehouse receipt log...',
          pt ? '[READ] Detetada assinatura de motorista com avaria térmica.' : '[READ] Detected driver signature detailing thermal failure.',
          pt ? '[DISCREPANCY] Produto "Bife Frango Panado" devolvido por completo.' : '[DISCREPANCY] Paned chicken returned due to quality issue.',
          pt ? '[ALERT] Retido valor de 29.40 € para pagamento ao fornecedor.' : '[ALERT] Hold placed on 29.40 € for supplier payout.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'FRIO-VIL CONGELADOS, S.A.', conf: '99.8% CONF' },
          { label: 'Billed Chicken Qty', value: '4.000 KG', conf: '99.0% CONF' },
          { label: 'Received Chicken Qty', value: '0.000 KG', conf: 'REVIEW', status: 'review' }
        ],
        reconciliation: [
          { label: 'Polvo Qty Match', extracted: '15.000 KG', sysRecord: 'Cais: 15.000 KG', variance: '0.00%', status: 'matched' },
          { label: 'Frango Qty Match', extracted: '4.000 KG', sysRecord: 'Cais: 0.000 KG', variance: '-100.00%', status: 'review' }
        ]
      },
      contract: {
        ptImpact: (chickenIsMatched && octopusIsMatched)
          ? `📜 PREÇOS DE CONTRATO: Fatura em conformidade. Ambos os produtos faturados respeitam os preços acordados em contrato (${chickenContract.toFixed(2)} € e ${octopusContract.toFixed(2)} €).`
          : `📜 PREÇOS DE CONTRATO: Sobretaxas detetadas nos congelados faturados. Desvio nos artigos que excedem as regras contratuais (${chickenContract.toFixed(2)} € e ${octopusContract.toFixed(2)} €). IA bloqueou agendamento bancário.`,
        enImpact: (chickenIsMatched && octopusIsMatched)
          ? `📜 CONTRACT AUDIT: Supermarket frozen invoice in compliance. Billed prices match contracted rates.`
          : `📜 CONTRACT AUDIT: Overcharges detected on frozen goods exceeding rules of ${chickenContract.toFixed(2)} € and ${octopusContract.toFixed(2)} €. AI blocked payout batch.`,
        impactColor: (chickenIsMatched && octopusIsMatched) ? 'border-brand-ok' : 'border-brand-warn',
        ptActionLabel: (chickenIsMatched && octopusIsMatched) ? undefined : 'Bloquear Pagamento',
        enActionLabel: (chickenIsMatched && octopusIsMatched) ? undefined : 'Block Payment Batch',
        logs: [
          pt ? '[AUDIT] Correndo verificação de conformidade de tabelas comerciais...' : '[AUDIT] Running compliance verification on trade agreements...',
          pt ? `[REGRA] Limite Frango: ${chickenContract.toFixed(2)} €/KG` : `[RULE] Chicken Limit: ${chickenContract.toFixed(2)} €/KG`,
          pt ? `[REGRA] Limite Polvo: ${octopusContract.toFixed(2)} €/KG` : `[RULE] Octopus Limit: ${octopusContract.toFixed(2)} €/KG`,
          (chickenIsMatched && octopusIsMatched) 
            ? (pt ? '[SUCESSO] Preços estão em conformidade.' : '[SUCCESS] Prices are in compliance.')
            : (pt ? '[DISCREPANCY] Encontradas discrepâncias de custos faturados.' : '[DISCREPANCY] Cost discrepancies found on invoice lines.')
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'FRIO-VIL CONGELADOS, S.A.', conf: '99.8% CONF' },
          { label: 'Billed Chicken', value: '7.35 €/KG', conf: chickenIsMatched ? '99.0% CONF' : 'REVIEW', status: chickenIsMatched ? 'ok' : 'review' },
          { label: 'Contract Chicken', value: `${chickenContract.toFixed(2)} €/KG`, conf: '99.9% CONF' },
          { label: 'Billed Octopus', value: '9.50 €/KG', conf: octopusIsMatched ? '99.0% CONF' : 'REVIEW', status: octopusIsMatched ? 'ok' : 'review' },
          { label: 'Contract Octopus', value: `${octopusContract.toFixed(2)} €/KG`, conf: '99.9% CONF' }
        ],
        reconciliation: [
          { 
            label: 'Frango Price Check', 
            extracted: '7.35 €/KG', 
            sysRecord: `Contract: ${chickenContract.toFixed(2)} €/KG`, 
            variance: chickenIsMatched ? '0.00%' : `+${chickenDiff.toFixed(2)}%`, 
            status: chickenIsMatched ? 'matched' : 'review' 
          },
          { 
            label: 'Polvo Price Check', 
            extracted: '9.50 €/KG', 
            sysRecord: `Contract: ${octopusContract.toFixed(2)} €/KG`, 
            variance: octopusIsMatched ? '0.00%' : `+${octopusDiff.toFixed(2)}%`, 
            status: octopusIsMatched ? 'matched' : 'review' 
          }
        ]
      }
    },
    grocery: {
      margins: {
        ptImpact: '📈 IMPACTO NAS MARGENS: Mercearia seca (Arroz Agulha, Massa Esparguete) estável (+1.2% desvio médio). O custo de acompanhamentos mantém-se inalterado. Não há necessidade de reajustes de PVP nos menus.',
        enImpact: '📈 MARGIN IMPACT: Dry grocery goods (Rice, Spaghetti) stable (+1.2% mean deviation). Cost of side dishes remains unchanged. No need for menu retail pricing adjustments.',
        impactColor: 'border-brand-accent',
        ptActionLabel: 'Aprovar Custos',
        enActionLabel: 'Approve Recipe Costs',
        logs: [
          pt ? '[PARSING] Extraído: Arroz Agulha -> 1.49 €/UNI' : '[PARSING] Extracted: Arroz Agulha -> 1.49 €/UNI',
          pt ? '[PARSING] Extraído: Massa Esparguete -> 0.63 €/UNI' : '[PARSING] Extracted: Massa Esparguete -> 0.63 €/UNI',
          pt ? '[SQL] Cruzando custos de acompanhamentos...' : '[SQL] Cross-referencing side dish ingredient costs...',
          pt ? '[OK] Sem desvios marginais relevantes.' : '[OK] No relevant margin deviations found.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'NOR-GROSS GROSSISTAS Lda', conf: '99.4% CONF' },
          { label: 'Doc Number', value: 'FR 2023A/98', conf: '99.2% CONF' },
          { label: 'Arroz Agulha Price', value: '1.49 €/UNI', conf: '99.0% CONF' },
          { label: 'Massa Esparguete', value: '0.63 €/UNI', conf: '99.0% CONF' }
        ],
        reconciliation: [
          { label: 'Arroz Cost Sync', extracted: '1.49 €/UNI', sysRecord: 'Prev: 1.49 €/UNI', variance: '0.00%', status: 'matched' },
          { label: 'Esparguete Sync', extracted: '0.63 €/UNI', sysRecord: 'Prev: 0.62 €/UNI', variance: '+1.61%', status: 'matched' }
        ]
      },
      guide: {
        ptImpact: '📋 AUDITORIA DE GUIA: Entrega 100% em conformidade física. O motor confirmou que todos os itens faturados (Arroz, Madalenas, Massas) coincidem com as quantidades descarregadas no inventário.',
        enImpact: '📋 GUIDE AUDIT: Delivery 100% in compliance. The engine verified that all billed supermarket items match the physical warehouse unloading records perfectly.',
        impactColor: 'border-brand-accent',
        ptActionLabel: 'Sincronizar Stock',
        enActionLabel: 'Sync Inventory stock',
        logs: [
          pt ? '[INFRA] Comparando faturas de mercearia com receção fisica...' : '[INFRA] Comparing grocery invoice with warehouse intake log...',
          pt ? '[AUDIT] Cruzamento completo executado sem discrepâncias.' : '[AUDIT] Complete cross-match executed without discrepancies.',
          pt ? '[OK] Quantidades faturadas coincidem com quantidades de stock.' : '[OK] Billed quantities match physical stock quantities.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'NOR-GROSS GROSSISTAS Lda', conf: '99.4% CONF' },
          { label: 'Madalenas Chocolate', value: '2.00 UNI', conf: '98.5% CONF' },
          { label: 'Arroz Agulha Qty', value: '2.00 UNI', conf: '99.0% CONF' }
        ],
        reconciliation: [
          { label: 'Madalenas Qty', extracted: '2.00 UNI', sysRecord: 'Warehouse: 2.00 UNI', variance: '0.00%', status: 'matched' },
          { label: 'Arroz Qty Match', extracted: '2.00 UNI', sysRecord: 'Warehouse: 2.00 UNI', variance: '0.00%', status: 'matched' }
        ]
      },
      contract: {
        ptImpact: '📜 PREÇOS DE CONTRATO: Compra de supermercado avulso de carácter Ad-hoc. Não existem acordos de contratos de fornecimento tabelados. A IA sugere prosseguir para lançamento e escrituração automática.',
        enImpact: '📜 CONTRACT AUDIT: Ad-hoc local store purchase. No pre-negotiated supply contract agreements found. The AI recommends proceeding directly to automated bookkeeping.',
        impactColor: 'border-brand-accent',
        ptActionLabel: 'Prosseguir Lançamento',
        enActionLabel: 'Proceed to Bookkeeping',
        logs: [
          pt ? '[SQL] Consultando catálogo de acordos de preço de grossistas...' : '[SQL] Searching agreed wholesale price catalog registry...',
          pt ? '[INFO] Categoria: Ad-hoc (Consumíveis de mercearia local).' : '[INFO] Category: Ad-hoc (Local grocery consumables).',
          pt ? '[OK] Sem regras de contrato de preço aplicáveis.' : '[OK] No contract pricing rules applicable.'
        ],
        matrixFields: [
          { label: 'Vendor Name', value: 'NOR-GROSS GROSSISTAS Lda', conf: '99.4% CONF' },
          { label: 'Agreement Type', value: 'AD-HOC (NO CONTRACT)', conf: '100% CONF' }
        ],
        reconciliation: [
          { label: 'Supermarket Buy', extracted: '85.45 €', sysRecord: 'Ad-hoc expenses', variance: 'N/A', status: 'matched' }
        ]
      }
    }
  };
};

const getPriceTrends = (pt: boolean): Record<DocType, PriceTrend> => ({
  fruit: {
    product: 'Pêra Rocha (KG)',
    minPrice: '1.10 €',
    maxPrice: '1.30 €',
    variance: '+18.2%',
    svgPath: 'M 10,75 L 50,75 L 90,70 L 130,60 L 170,45 L 210,15',
    ptLabel: 'Tendência Pêra Rocha (6 meses)',
    enLabel: 'Pear Price Trend (6 months)'
  },
  frozen: {
    product: pt ? 'Frango Panado (KG)' : 'Paned Chicken (KG)',
    minPrice: '6.50 €',
    maxPrice: '7.35 €',
    variance: '+13.1%',
    svgPath: 'M 10,75 L 50,75 L 90,72 L 130,68 L 170,60 L 210,22',
    ptLabel: 'Tendência Frango Panado (6 meses)',
    enLabel: 'Chicken Price Trend (6 months)'
  },
  grocery: {
    product: pt ? 'Arroz Agulha (UNI)' : 'Agulha Rice (UNI)',
    minPrice: '1.45 €',
    maxPrice: '1.49 €',
    variance: '+2.7%',
    svgPath: 'M 10,70 L 50,70 L 90,65 L 130,60 L 170,60 L 210,60',
    ptLabel: 'Tendência Arroz Agulha (6 meses)',
    enLabel: 'Rice Price Trend (6 months)'
  }
});

// Initial history database
interface HistoryItem {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  status: 'matched' | 'review' | 'audit_passed';
}

export default function OcrModal({ isOpen, onClose, pt }: OcrModalProps) {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'overview' | 'rules' | 'history'>('upload');
  
  // OCR dynamic configurations state
  const [contractPrices, setContractPrices] = useState<ContractPrices>({
    fruitPear: 1.20,
    frozenChicken: 6.50,
    frozenOctopus: 9.00
  });

  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType>('margins');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Track resolved items globally for session metrics
  const [resolvedDocuments, setResolvedDocuments] = useState<Record<string, boolean>>({});
  const [scannedDocumentsCount, setScannedDocumentsCount] = useState<number>(0);
  const [exportingHistoryId, setExportingHistoryId] = useState<string | null>(null);

  // History list state
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    { id: 'FR CMB/4963', vendor: 'POMAR DO CARVALHO Lda', date: '2026-03-16', amount: 60.74, status: 'review' },
    { id: 'FT FTV 25001/070673', vendor: 'FRIO-VIL CONGELADOS, S.A.', date: '2025-11-11', amount: 452.25, status: 'review' },
    { id: 'FR 2023A/98', vendor: 'NOR-GROSS GROSSISTAS Lda', date: '2025-12-12', amount: 85.45, status: 'matched' }
  ]);

  // Terminal logs
  const [logs, setLogs] = useState<string[]>([]);
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scenarios = getSimulationData(pt, contractPrices);
  const priceTrends = getPriceTrends(pt);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const selectDocument = (docKey: DocType) => {
    setSelectedDoc(docKey);
    setActiveAction('margins'); // default action
    setIsScanning(false);
    setIsComplete(false);
    setLogs([]);
    setScanProgress(0);
  };

  const changeAction = (actionKey: ActionType) => {
    setActiveAction(actionKey);
    setIsScanning(false);
    setIsComplete(false);
    setLogs([]);
    setScanProgress(0);
  };

  const startScan = useCallback(() => {
    if (!selectedDoc) return;
    setIsScanning(true);
    setScanProgress(0);
    setIsComplete(false);
    
    // Increment scanned counter
    setScannedDocumentsCount(prev => prev + 1);

    // Initial logs based on chosen scenario
    const initialLogs = scenarios[selectedDoc][activeAction].logs;
    setLogs(initialLogs.slice(0, 3));

    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 20;
        
        // Add log messages based on progress percentage
        if (next === 40 && initialLogs[3]) {
          addLog(initialLogs[3]);
        }

        if (next >= 100) {
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          setIsScanning(false);
          setIsComplete(true);
          addLog(pt ? '[CONCLUÍDO] Análise operacional finalizada com sucesso.' : '[COMPLETE] Operational analysis finished successfully.');
          return 100;
        }
        return next;
      });
    }, 150);
  }, [selectedDoc, activeAction, scenarios, pt, addLog]);

  const resolveMismatch = () => {
    if (!selectedDoc) return;
    
    // Set as resolved in local session state
    const resolvedKey = `${selectedDoc}_${activeAction}`;
    setResolvedDocuments(prev => ({
      ...prev,
      [resolvedKey]: true
    }));

    // Update state inside history log items
    let docId = 'FR CMB/4963'; // default fruit doc id
    if (selectedDoc === 'frozen') docId = 'FT FTV 25001/070673';
    if (selectedDoc === 'grocery') docId = 'FR 2023A/98';

    setHistoryItems(prev => prev.map(item => {
      if (item.id === docId) {
        return { ...item, status: 'audit_passed' };
      }
      return item;
    }));

    addLog(pt ? '[LOG] Ação de correção resolvida e arquivada.' : '[LOG] Correction action resolved and archived.');
    addLog(pt ? '[SUCESSO] Operação finalizada com sucesso.' : '[SUCCESS] Operation finished successfully.');
  };

  const handleExportSafT = (docId: string) => {
    setExportingHistoryId(docId);
    setTimeout(() => {
      setExportingHistoryId(null);
      alert(pt ? `Fatura ${docId} exportada para XML SAF-T com sucesso!` : `Invoice ${docId} successfully exported to XML SAF-T format!`);
    }, 600);
  };

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSelectedDoc(null);
        setIsScanning(false);
        setIsComplete(false);
      }, 50);
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Derived metrics for overview tab
  const resolvedCount = Object.keys(resolvedDocuments).length;
  const totalAuditedAmount = 598.44 + (scannedDocumentsCount * 45.00);
  const totalSavingsAmount = 15.00 + (resolvedDocuments['fruit_guide'] ? 2.40 : 0) + (resolvedDocuments['fruit_contract'] ? 3.30 : 0) + (resolvedDocuments['frozen_guide'] ? 29.40 : 0) + (resolvedDocuments['frozen_contract'] ? 10.90 : 0);

  // Check if current action is resolved
  const isCurrentActionResolved = selectedDoc ? resolvedDocuments[`${selectedDoc}_${activeAction}`] : false;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
      {/* Modal Box */}
      <div className="bg-[#04060C] border border-brand-border/60 rounded-2xl w-full max-w-6xl h-[85vh] max-h-[800px] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-brand-border/60 bg-[#090D1A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent-soft animate-pulse" />
            <h2 className="text-sm font-mono font-bold text-brand-ink uppercase tracking-wider">
              {pt ? 'Nuelltech Workstation · Sandbox OCR' : 'Nuelltech Workstation · OCR Sandbox'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-ink-dim hover:text-brand-ink transition p-1 hover:bg-brand-border/30 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-[200px] bg-[#070A14] border-r border-brand-border/60 p-4 flex flex-col justify-between flex-shrink-0">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-brand-ink-dim uppercase tracking-wider mb-4 px-2 block font-semibold">
                Menu
              </span>
              
              <button 
                onClick={() => setSelectedTab('overview')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${selectedTab === 'overview' ? 'bg-brand-accent/15 text-brand-accent-soft' : 'text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'}`}
              >
                <Info className="w-4 h-4" />
                {pt ? 'Visão Geral' : 'Overview'}
              </button>

              <button 
                onClick={() => setSelectedTab('upload')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${selectedTab === 'upload' ? 'bg-brand-accent/15 text-brand-accent-soft' : 'text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'}`}
              >
                <FolderOpen className="w-4 h-4" />
                {pt ? 'Upload & Pasta' : 'Folder Explorer'}
              </button>

              <button 
                onClick={() => setSelectedTab('rules')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${selectedTab === 'rules' ? 'bg-brand-accent/15 text-brand-accent-soft' : 'text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'}`}
              >
                <Settings className="w-4 h-4" />
                {pt ? 'Regras' : 'Extraction Rules'}
              </button>

              <button 
                onClick={() => setSelectedTab('history')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${selectedTab === 'history' ? 'bg-brand-accent/15 text-brand-accent-soft' : 'text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'}`}
              >
                <History className="w-4 h-4" />
                {pt ? 'Histórico' : 'History'}
              </button>
            </div>

            {/* Bottom Pages Limit */}
            <div className="border-t border-brand-border/40 pt-4">
              <div className="flex justify-between text-[9px] font-mono text-brand-ink-dim mb-1.5 font-bold">
                <span>{pt ? 'LIMITE MENSAL' : 'USAGE LIMIT'}</span>
                <span>750 / 1000 p.</span>
              </div>
              <div className="h-1.5 w-full bg-brand-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent-soft rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#04060C] p-6 overflow-y-auto flex flex-col gap-6">
            
            {/* OVERVIEW TAB */}
            {selectedTab === 'overview' && (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                <div className="border-b border-brand-border/40 pb-4">
                  <h3 className="text-base font-bold font-display text-brand-ink mb-1">
                    {pt ? 'Dashboard de Auditoria OCR' : 'OCR Audit Dashboard'}
                  </h3>
                  <p className="text-xs text-brand-ink-dim">
                    {pt ? 'Métricas de eficiência e perdas evitadas nas faturas processadas:' : 'Efficiency metrics and avoided losses in processed invoices:'}
                  </p>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#090D1A] border border-brand-border p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1 font-bold">{pt ? 'Lidas (Sessão)' : 'Scanned (Session)'}</span>
                    <span className="text-2xl font-black text-brand-ink font-mono">{3 + scannedDocumentsCount}</span>
                  </div>
                  <div className="bg-[#090D1A] border border-brand-border p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1 font-bold">{pt ? 'Reconciliadas' : 'Reconciled'}</span>
                    <span className="text-2xl font-black text-brand-ok font-mono">{1 + resolvedCount}</span>
                  </div>
                  <div className="bg-[#090D1A] border border-brand-border p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1 font-bold">{pt ? 'Auditoria (Volume)' : 'Audited Volume'}</span>
                    <span className="text-xl font-bold text-brand-ink font-mono">{totalAuditedAmount.toFixed(2)} €</span>
                  </div>
                  <div className="bg-[#090D1A] border border-brand-border p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1 font-bold text-brand-accent-soft">{pt ? 'Poupança Direta' : 'Avoided Losses'}</span>
                    <span className="text-xl font-bold text-brand-accent-soft font-mono text-glow">{totalSavingsAmount.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Recent activity log table */}
                <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-brand-ink font-mono uppercase mb-3 tracking-wider">
                    {pt ? 'Histórico de Atividade Recente' : 'Recent Invoices Activity Log'}
                  </h4>
                  <table className="w-full text-left font-mono text-[10px] text-brand-ink-dim">
                    <thead>
                      <tr className="border-b border-brand-border/20 text-brand-ink font-bold pb-2">
                        <th className="pb-2">FORNECEDOR</th>
                        <th className="pb-2">NIF</th>
                        <th className="pb-2">DATA</th>
                        <th className="pb-2 text-right">TOTAL</th>
                        <th className="pb-2 text-right">STATUS DE AUDITORIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-brand-border/10">
                        <td className="py-2 text-brand-ink font-medium">POMAR DO CARVALHO Lda</td>
                        <td>509876543</td>
                        <td>2026-03-16</td>
                        <td className="text-right">60.74 €</td>
                        <td className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${resolvedDocuments['fruit_guide'] || resolvedDocuments['fruit_contract'] ? 'bg-brand-ok/10 text-brand-ok' : 'bg-brand-risk/10 text-brand-risk'}`}>
                            {resolvedDocuments['fruit_guide'] || resolvedDocuments['fruit_contract'] ? (pt ? 'Matched / Resolvido' : 'Matched / Resolved') : (pt ? 'Divergência Pendente' : 'Variance Pending')}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-brand-border/10">
                        <td className="py-2 text-brand-ink font-medium">FRIO-VIL CONGELADOS, S.A.</td>
                        <td>502233445</td>
                        <td>2025-11-11</td>
                        <td className="text-right">452.25 €</td>
                        <td className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${resolvedDocuments['frozen_guide'] || resolvedDocuments['frozen_contract'] ? 'bg-brand-ok/10 text-brand-ok' : 'bg-brand-risk/10 text-brand-risk'}`}>
                            {resolvedDocuments['frozen_guide'] || resolvedDocuments['frozen_contract'] ? (pt ? 'Matched / Resolvido' : 'Matched / Resolved') : (pt ? 'Divergência Pendente' : 'Variance Pending')}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-brand-ink font-medium">NOR-GROSS GROSSISTAS Lda</td>
                        <td>504455667</td>
                        <td>2025-12-12</td>
                        <td className="text-right">85.45 €</td>
                        <td className="text-right">
                          <span className="bg-brand-ok/10 text-brand-ok px-2 py-0.5 rounded text-[8.5px] font-bold">
                            {pt ? 'Sem Desvios' : 'No Variances'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* RULES TAB */}
            {selectedTab === 'rules' && (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                <div className="border-b border-brand-border/40 pb-4">
                  <h3 className="text-base font-bold font-display text-brand-ink mb-1">
                    {pt ? 'Regras de Compliance & Contratos' : 'Compliance & Contract Extraction Rules'}
                  </h3>
                  <p className="text-xs text-brand-ink-dim">
                    {pt ? 'Altere os limiares de auditoria para ver como afetam instantaneamente o processador de faturas na mesa de trabalho:' : 'Modify the price audit thresholds to see how they instantly feed back into the invoice workspace:'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Rule card 1: Pomar do Carvalho */}
                  <div className="bg-[#090D1A] border border-brand-border p-5 rounded-xl flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
                      POMAR DO CARVALHO Lda (Regras)
                    </span>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10.5px] font-mono text-brand-ink-dim">
                        {pt ? 'Preço Limite Contrato - Pêra Rocha (€/KG):' : 'Contract Price Threshold - Pear (€/KG):'}
                      </label>
                      <input 
                        type="number"
                        step="0.05"
                        min="1.00"
                        max="2.00"
                        value={contractPrices.fruitPear}
                        onChange={(e) => setContractPrices(prev => ({ ...prev, fruitPear: parseFloat(e.target.value) || 1.20 }))}
                        className="bg-[#05070D] border border-brand-border rounded px-3 py-2 text-xs text-brand-ink font-mono font-bold focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    <div className="text-[9.5px] text-brand-ink-dim border-t border-brand-border/30 pt-3 leading-relaxed">
                      {pt 
                        ? '💡 Dica: Se definir o preço limite para 1.30 €/KG ou superior, a fatura de fruta deixará de sinalizar sobretaxa indevida na aba "Contratos".' 
                        : '💡 Tip: Setting this limit to 1.30 €/KG or above will clear Pear overcharge alerts in the "Contracts" tab.'}
                    </div>
                  </div>

                  {/* Rule card 2: Frio-Vil */}
                  <div className="bg-[#090D1A] border border-brand-border p-5 rounded-xl flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider">
                      FRIO-VIL CONGELADOS, S.A. (Regras)
                    </span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9.5px] font-mono text-brand-ink-dim">
                          {pt ? 'Teto Frango (€/KG):' : 'Chicken Cap (€/KG):'}
                        </label>
                        <input 
                          type="number"
                          step="0.10"
                          value={contractPrices.frozenChicken}
                          onChange={(e) => setContractPrices(prev => ({ ...prev, frozenChicken: parseFloat(e.target.value) || 6.50 }))}
                          className="bg-[#05070D] border border-brand-border rounded px-2.5 py-1.5 text-xs text-brand-ink font-mono font-bold focus:outline-none focus:border-brand-accent"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9.5px] font-mono text-brand-ink-dim">
                          {pt ? 'Teto Polvo (€/KG):' : 'Octopus Cap (€/KG):'}
                        </label>
                        <input 
                          type="number"
                          step="0.10"
                          value={contractPrices.frozenOctopus}
                          onChange={(e) => setContractPrices(prev => ({ ...prev, frozenOctopus: parseFloat(e.target.value) || 9.00 }))}
                          className="bg-[#05070D] border border-brand-border rounded px-2.5 py-1.5 text-xs text-brand-ink font-mono font-bold focus:outline-none focus:border-brand-accent"
                        />
                      </div>
                    </div>

                    <div className="text-[9.5px] text-brand-ink-dim border-t border-brand-border/30 pt-3 leading-relaxed">
                      {pt 
                        ? '💡 Dica: Suba o teto do Frango para 7.35 €/KG e Polvo para 9.50 €/KG para que a auditoria da fatura de congelados aprove os preços de tabela automaticamente.' 
                        : '💡 Tip: Raise Chicken cap to 7.35 €/KG and Octopus to 9.50 €/KG to auto-approve frozen catalog prices.'}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {selectedTab === 'history' && (
              <div className="flex flex-col gap-6 animate-fade-in text-left">
                <div className="border-b border-brand-border/40 pb-4">
                  <h3 className="text-base font-bold font-display text-brand-ink mb-1">
                    {pt ? 'Histórico Digital e Auditoria Fiscal' : 'Archived Invoices & Tax Audits'}
                  </h3>
                  <p className="text-xs text-brand-ink-dim">
                    {pt ? 'Arquivo digitalizado com rastreamento completo de auditoria física e fiscal:' : 'Digitized archive with full audit trailing details:'}
                  </p>
                </div>

                <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4">
                  <table className="w-full text-left font-mono text-[10px] text-brand-ink-dim">
                    <thead>
                      <tr className="border-b border-brand-border/20 text-brand-ink font-bold pb-2">
                        <th className="pb-2">DOC ID</th>
                        <th className="pb-2">FORNECEDOR</th>
                        <th className="pb-2">DATA</th>
                        <th className="pb-2 text-right">VALOR TOTAL</th>
                        <th className="pb-2 text-right">ESTADO FISCAL</th>
                        <th className="pb-2 text-right">EXPORTE SAF-T</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-brand-border/10">
                          <td className="py-2.5 text-brand-ink font-bold">{item.id}</td>
                          <td>{item.vendor}</td>
                          <td>{item.date}</td>
                          <td className="text-right text-brand-ink">{item.amount.toFixed(2)} €</td>
                          <td className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${item.status === 'review' ? 'bg-brand-risk/10 text-brand-risk' : 'bg-brand-ok/10 text-brand-ok'}`}>
                              {item.status === 'review' ? (pt ? 'Pendente' : 'Pending Review') : (pt ? 'Auditado / Conforme' : 'Audited / Matched')}
                            </span>
                          </td>
                          <td className="text-right py-2.5">
                            <button
                              onClick={() => handleExportSafT(item.id)}
                              disabled={exportingHistoryId === item.id}
                              className="bg-brand-card hover:bg-brand-border/50 border border-brand-border text-brand-ink px-2.5 py-1 rounded text-[8.5px] font-bold transition disabled:opacity-50"
                            >
                              {exportingHistoryId === item.id ? (pt ? 'A exportar...' : 'Exporting...') : 'Export XML'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* UPLOAD & PASTA TAB (EXISTING WORKSPACE) */}
            {selectedTab === 'upload' && (
              selectedDoc === null ? (
                // FOLDER SELECTION INTERFACE (FILE EXPLORER)
                <div className="flex flex-col flex-1 h-full">
                  <div className="border-b border-brand-border/40 pb-4 mb-6 text-left">
                    <h3 className="text-base font-bold font-display text-brand-ink mb-1">
                      {pt ? 'Explorador de Documentos Virtuais' : 'Virtual Document Explorer'}
                    </h3>
                    <p className="text-xs text-brand-ink-dim">
                      {pt 
                        ? 'Selecione um dos exemplos abaixo (baseados em faturas reais digitalizadas) para abrir na mesa de auditoria da IA:'
                        : 'Select one of the examples below (based on actual scanned invoices) to open on the AI audit deck:'}
                    </p>
                  </div>

                  {/* Grid of files */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
                    {/* File 1: Fruit receipt */}
                    <div 
                      onClick={() => selectDocument('fruit')}
                      className="border border-brand-border/60 bg-[#090D1A] rounded-xl p-5 hover:border-brand-accent/40 transition cursor-pointer flex flex-col justify-between group shadow-inner"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent-soft group-hover:bg-brand-accent-soft group-hover:text-black transition">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[8px] font-mono bg-brand-warn/15 text-brand-warn border border-brand-warn/25 px-2 py-0.5 rounded font-bold">
                            {pt ? 'FRUTA & RECIBO' : 'FRUIT RECEIPT'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-ink mb-1 font-mono">fatura_bastos_frutas.pdf</h4>
                        <p className="text-[10px] text-brand-ink-dim leading-relaxed">
                          {pt ? 'Talão térmico de fornecedor de hortofrutícolas local. Ideal para testar receitas e contabilidade de quebra.' : 'Thermal receipt from local fruit supplier. Ideal for testing recipe costing and shortage audits.'}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-semibold text-brand-accent-soft mt-4 block group-hover:underline">
                        {pt ? 'Selecionar Ficheiro' : 'Select Document'} &rarr;
                      </span>
                    </div>

                    {/* File 2: Frozen distributor */}
                    <div 
                      onClick={() => selectDocument('frozen')}
                      className="border border-brand-border/60 bg-[#090D1A] rounded-xl p-5 hover:border-brand-accent/40 transition cursor-pointer flex flex-col justify-between group shadow-inner"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent-soft group-hover:bg-brand-accent-soft group-hover:text-black transition">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[8px] font-mono bg-brand-risk/10 text-brand-risk border border-brand-risk/20 px-2 py-0.5 rounded font-bold">
                            {pt ? 'GROSSISTA' : 'WHOLESALER'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-ink mb-1 font-mono">fatura_congelados_coelho_dias.pdf</h4>
                        <p className="text-[10px] text-brand-ink-dim leading-relaxed">
                          {pt ? 'Fatura A4 de distribuidor de congelados alimentares com tabelas complexas, taxas cruzadas e dados de lote.' : 'A4 invoice from frozen food distributor with complex tables, cross-taxes, and batch record data.'}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-semibold text-brand-accent-soft mt-4 block group-hover:underline">
                        {pt ? 'Selecionar Ficheiro' : 'Select Document'} &rarr;
                      </span>
                    </div>

                    {/* File 3: Supermarket A4 */}
                    <div 
                      onClick={() => selectDocument('grocery')}
                      className="border border-brand-border/60 bg-[#090D1A] rounded-xl p-5 hover:border-brand-accent/40 transition cursor-pointer flex flex-col justify-between group shadow-inner"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent-soft group-hover:bg-brand-accent-soft group-hover:text-black transition">
                            <FileText className="w-4.5 h-4.5" />
                          </div>
                          <span className="text-[8px] font-mono bg-brand-accent/10 text-brand-accent-soft border border-brand-accent/20 px-2 py-0.5 rounded font-bold">
                            {pt ? 'MERCEARIA' : 'GROCERY'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-brand-ink mb-1 font-mono">fatura_marinho_mercearia.pdf</h4>
                        <p className="text-[10px] text-brand-ink-dim leading-relaxed">
                          {pt ? 'Fatura A4 densa de retalhista de Vila Real com mistura de consumíveis secos, refrigerantes e embalagens.' : 'Dense A4 invoice from Vila Real retail supplier with mixed dry goods, sodas, and packaging lines.'}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-semibold text-brand-accent-soft mt-4 block group-hover:underline">
                        {pt ? 'Selecionar Ficheiro' : 'Select Document'} &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // WORKSTATION WORKSPACE (WHEN FILE SELECTED)
                <>
                  {/* Upper row: Doc Viewer & Extraction Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* Left Column: Mock Document representation */}
                    <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden h-[390px] shadow-inner">
                      <div className="flex justify-between items-center text-[10px] font-mono text-brand-ink-dim border-b border-brand-border/30 pb-2 mb-3">
                        <span className="flex items-center gap-1.5 font-bold">
                          <FileText className="w-3.5 h-3.5 text-brand-accent-soft" />
                          {selectedDoc === 'fruit' ? 'fatura_bastos_frutas.pdf' : selectedDoc === 'frozen' ? 'fatura_congelados_coelho_dias.pdf' : 'fatura_marinho_mercearia.pdf'}
                        </span>
                        <button 
                          onClick={() => setSelectedDoc(null)}
                          className="text-brand-accent-soft hover:underline font-bold text-[9px] font-mono"
                        >
                          {pt ? '← Mudar Documento' : '← Change Document'}
                        </button>
                      </div>

                      {/* PDF Mock Visual Canvas */}
                      <div className="flex-1 border border-brand-border/40 bg-[#060810] rounded-lg p-5 font-mono text-[9px] text-[#A0AEC0] relative overflow-hidden select-none">
                        
                        {/* Laser scanning line */}
                        {isScanning && (
                          <div 
                            className="absolute left-0 w-full h-0.5 bg-brand-accent-soft shadow-[0_0_8px_#00F2FE] z-20 pointer-events-none transition-all duration-75"
                            style={{ top: `${scanProgress}%` }}
                          />
                        )}

                        {/* Mock A4 document structure based on images (ANONYMIZED) */}
                        {selectedDoc === 'fruit' && (
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="border-b border-brand-border/30 pb-2 mb-2 text-center">
                                <strong className="font-extrabold text-brand-ink block text-[9px]">POMAR DO CARVALHO - LEGUMES E FRUTAS Lda</strong>
                                <span className="text-[7px]">NIF: 509876543 &nbsp;|&nbsp; BRITIANDE, PORTUGAL</span>
                              </div>
                              <div className="flex justify-between text-[7px] mb-3">
                                <span>FATURA/RECIBO: FR CMB/4963</span>
                                <span>DATA: 2026-03-16</span>
                              </div>
                              <div className="mb-3 text-[7px]">
                                <span className="text-brand-ink-dim block">CLIENTE:</span>
                                <span className="text-brand-ink font-bold">Associação Desportiva e Cultural de Vila Real</span>
                              </div>
                              
                              <table className="w-full text-left text-[7px] border-collapse">
                                <thead>
                                  <tr className="border-b border-brand-border/20 text-brand-ink-dim font-bold">
                                    <th>DESCRIÇÃO</th>
                                    <th>QUANT</th>
                                    <th>P.UNIT</th>
                                    <th className="text-right">TOTAL</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-1">Maçã Golden c/75 PORT</td>
                                    <td>24.00</td>
                                    <td>0.60€</td>
                                    <td className="text-right">14.40€</td>
                                  </tr>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-1">Pêra Conferência c/65 ESP</td>
                                    <td>33.00</td>
                                    <td>1.30€</td>
                                    <td className="text-right">42.90€</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="border-t border-brand-border/30 pt-1.5 text-right text-[7px] flex justify-end gap-4">
                              <div>IVA: <span className="font-bold">3.44€</span></div>
                              <div>TOTAL: <span className="text-brand-accent-soft font-bold text-[9px]">60.74€</span></div>
                            </div>
                          </div>
                        )}

                        {selectedDoc === 'frozen' && (
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="border-b border-brand-border/30 pb-2 mb-2 flex justify-between items-center">
                                <strong className="font-extrabold text-brand-ink text-[10px]">FRIO-VIL DISTRIBUIÇÃO CONGELADOS, S.A.</strong>
                                <span className="text-[7px]">NIF: 502233445</span>
                              </div>
                              <div className="flex justify-between text-[7px] mb-3">
                                <span>FATURA: FTV 25001/070673</span>
                                <span>DATA: 2025-11-11</span>
                              </div>
                              <div className="mb-3 text-[7px]">
                                <span className="text-brand-ink-dim block">CLIENTE:</span>
                                <span className="text-brand-ink font-bold">RESTAURANTE SABORES DA SERRA (Tondela)</span>
                              </div>
                              
                              <table className="w-full text-left text-[7px] border-collapse">
                                <thead>
                                  <tr className="border-b border-brand-border/20 text-brand-ink-dim font-bold">
                                    <th>PRODUTO</th>
                                    <th>LOTE</th>
                                    <th>QNT</th>
                                    <th>PREÇO</th>
                                    <th className="text-right">VALOR</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-1">BIFE FRANGO PANADO</td>
                                    <td>01138622</td>
                                    <td>4.000 KG</td>
                                    <td>7.35€</td>
                                    <td className="text-right">29.40€</td>
                                  </tr>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-1">POLVO ROTO cx 2x7.5kg</td>
                                    <td>250408</td>
                                    <td>15.000 KG</td>
                                    <td>9.50€</td>
                                    <td className="text-right">142.50€</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="border-t border-brand-border/30 pt-1.5 text-right text-[7px] flex justify-end gap-4">
                              <div>IVA: <span className="font-bold">56.65€</span></div>
                              <div>TOTAL: <span className="text-brand-accent-soft font-bold text-[9px]">452.25€</span></div>
                            </div>
                          </div>
                        )}

                        {selectedDoc === 'grocery' && (
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="border-b border-brand-border/30 pb-1.5 mb-1.5 text-center">
                                <strong className="font-extrabold text-brand-ink block text-[9px]">NOR-GROSS GROSSISTAS ALIMENTAÇÃO Lda</strong>
                                <span className="text-[7px]">RUA ANTONIO AZEVEDO, VILA REAL | NIF: PT504455667</span>
                              </div>
                              <div className="flex justify-between text-[7px] mb-2">
                                <span>FATURA: FR 2023A/98</span>
                                <span>DATA: 2025-12-12</span>
                              </div>
                              <div className="mb-2 text-[7px]">
                                <span className="text-brand-ink-dim block">CLIENTE:</span>
                                <span className="text-brand-ink font-bold">MINIMERCADO RIO CORGO</span>
                              </div>
                              
                              <table className="w-full text-left text-[6.5px] border-collapse">
                                <thead>
                                  <tr className="border-b border-brand-border/20 text-brand-ink-dim font-bold">
                                    <th>DESCRIÇÃO</th>
                                    <th>QUANT</th>
                                    <th>P.UNIT</th>
                                    <th className="text-right">VALOR</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-0.5">MADALENAS CHOCOLATE 500G</td>
                                    <td>2.00 UNI</td>
                                    <td>2.59€</td>
                                    <td className="text-right">5.18€</td>
                                  </tr>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-0.5">ARROZ CACAROLA AGULHA</td>
                                    <td>2.00 UNI</td>
                                    <td>1.49€</td>
                                    <td className="text-right">2.98€</td>
                                  </tr>
                                  <tr className="border-b border-brand-border/10">
                                    <td className="py-0.5">MASSA MILANEZA ESPARGUETE</td>
                                    <td>3.00 UNI</td>
                                    <td>0.63€</td>
                                    <td className="text-right">1.89€</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="border-t border-brand-border/30 pt-1 text-right text-[7px] flex justify-end gap-4">
                              <div>TOTAL DOC: <span className="text-brand-accent-soft font-bold text-[8.5px]">85.45€</span></div>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Progress details */}
                      <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-brand-ink-dim">
                        <span>
                          {isScanning 
                            ? (pt ? 'Sensor de imagem OCR ativo...' : 'OCR Image sensor active...')
                            : isComplete 
                              ? (pt ? 'Varredura Concluída' : 'Scan Completed') 
                              : (pt ? 'Pronto para processar' : 'Ready to process')}
                        </span>
                        <span>
                          {isScanning ? `${(1.2 - (1.2 * scanProgress) / 100).toFixed(1)}s` : '0.0s'}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Control Deck & Extraction Matrix */}
                    <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between h-[390px] shadow-lg">
                      
                      {/* Action Tabs Selector */}
                      <div>
                        <div className="text-[9px] font-mono text-brand-ink-dim mb-3 font-bold uppercase tracking-wider block">
                          {pt ? 'Selecionar Funcionalidade de Auditoria' : 'Select Audit Feature'}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <button
                            onClick={() => changeAction('margins')}
                            className={`py-2 px-1 rounded-lg font-mono text-[10px] font-bold border transition ${activeAction === 'margins' ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_8px_rgba(0,242,254,0.1)]' : 'bg-brand-card border-brand-border text-brand-ink-dim hover:text-brand-ink'}`}
                          >
                            📈 {pt ? 'Margens' : 'Margins'}
                          </button>
                          <button
                            onClick={() => changeAction('guide')}
                            className={`py-2 px-1 rounded-lg font-mono text-[10px] font-bold border transition ${activeAction === 'guide' ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_8px_rgba(0,242,254,0.1)]' : 'bg-brand-card border-brand-border text-brand-ink-dim hover:text-brand-ink'}`}
                          >
                            📋 {pt ? 'Guia' : 'Guide'}
                          </button>
                          <button
                            onClick={() => changeAction('contract')}
                            className={`py-2 px-1 rounded-lg font-mono text-[10px] font-bold border transition ${activeAction === 'contract' ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft shadow-[0_0_8px_rgba(0,242,254,0.1)]' : 'bg-brand-card border-brand-border text-brand-ink-dim hover:text-brand-ink'}`}
                          >
                            📜 {pt ? 'Contrato' : 'Contract'}
                          </button>
                        </div>

                        {/* Small scenario context explainer */}
                        <p className="text-[10px] text-brand-ink-dim leading-relaxed mb-4 border-b border-brand-border/30 pb-3 font-sans">
                          {activeAction === 'margins' && (pt 
                            ? 'Mapeia artigos extraídos com a base de dados de receitas culinárias para recalcular o custo de produção e impacto na margem.' 
                            : 'Maps extracted items to menu recipe templates to recalculate real production cost and margin impacts.')}
                          {activeAction === 'guide' && (pt 
                            ? 'Compara as linhas da fatura extraída com a guia de transporte anotada na entrega para detetar perdas ou devoluções.' 
                            : 'Compares invoice lines against delivery notes signed at the dock to flag supply shortages or returns.')}
                          {activeAction === 'contract' && (pt 
                            ? 'Cruza os preços faturados com a tabela de fornecimento pré-acordada em contrato para identificar sobretaxas indevidas.' 
                            : 'Cross-checks billed item prices against pre-negotiated catalog agreements to detect unauthorized supplier overcharges.')}
                        </p>

                        {/* Matrix Fields Display Area */}
                        {isComplete && (
                          <div>
                            <div className="text-[9px] font-mono text-brand-ink-dim mb-2 font-bold uppercase">
                              {pt ? 'DADOS EXTRAÍDOS (OCR)' : 'EXTRACTED DATA (OCR)'}
                            </div>
                            <div className="flex flex-col gap-2 font-mono text-[10px]">
                              {scenarios[selectedDoc][activeAction].matrixFields.map((field, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-brand-border/10 pb-1.5">
                                  <span className="text-[#A0AEC0]">{field.label}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`font-bold ${field.status === 'review' && !isCurrentActionResolved ? 'text-brand-risk' : 'text-brand-ink'}`}>
                                      {field.value}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${field.status === 'review' && !isCurrentActionResolved ? 'bg-brand-risk/10 border border-brand-risk/30 text-brand-risk' : 'bg-brand-accent/10 border border-brand-accent/30 text-brand-accent-soft'}`}>
                                      {field.status === 'review' && !isCurrentActionResolved ? 'REVIEW' : field.conf}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isComplete && !isScanning && (
                          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-brand-ink-dim select-none font-sans">
                            <TrendingUp className="w-8 h-8 text-brand-border/40 mb-2" />
                            <p>{pt ? 'Clique abaixo para rodar o motor na funcionalidade selecionada.' : 'Click below to run the engine on the selected feature.'}</p>
                          </div>
                        )}

                        {isScanning && (
                          <div className="flex flex-col items-center justify-center py-8 text-center text-xs select-none font-sans">
                            <div className="relative w-12 h-12 flex items-center justify-center mb-3">
                              <div className="absolute inset-0 rounded-full bg-brand-accent/20 animate-ping" />
                              <div className="absolute inset-1.5 rounded-full bg-brand-accent/30 animate-pulse" />
                              <Brain className="w-5 h-5 text-brand-accent-soft relative z-10 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-mono text-brand-accent-soft uppercase tracking-wider animate-pulse mb-1">
                              {pt ? 'Processador OCR Nuelltech...' : 'Nuelltech OCR Engine...'}
                            </p>
                            <p className="text-[9px] text-brand-ink-dim font-mono">{pt ? 'Correndo varredura neuronal de campos...' : 'Running neural fields sweep...'}</p>
                          </div>
                        )}

                      </div>

                      {/* Simulation trigger buttons */}
                      <div className="flex flex-col gap-2">
                        {!isComplete && !isScanning ? (
                          <button
                            onClick={startScan}
                            className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs transition duration-150 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                          >
                            <Play className="w-4 h-4" />
                            {pt ? 'Iniciar Leitura OCR' : 'Start OCR Scan'}
                          </button>
                        ) : isScanning ? (
                          <div className="w-full bg-brand-border/40 text-brand-ink-dim font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 uppercase tracking-wide select-none">
                            <span className="w-2 h-2 rounded-full bg-brand-accent-soft animate-ping" />
                            {pt ? 'Auditando...' : 'Auditing...'}
                          </div>
                        ) : (
                          // Complete state actions
                          <div className="flex flex-col gap-2 w-full">
                            {scenarios[selectedDoc][activeAction].reconciliation.some(r => r.status === 'review' || r.status === 'blocked') && !isCurrentActionResolved ? (
                              <button
                                onClick={resolveMismatch}
                                className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs transition duration-150 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                              >
                                <Check className="w-4.5 h-4.5" />
                                {pt ? scenarios[selectedDoc][activeAction].ptActionLabel : scenarios[selectedDoc][activeAction].enActionLabel}
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedDoc(null)}
                                className="w-full border border-brand-border bg-brand-card hover:bg-brand-border/40 text-brand-ink font-bold py-3.5 px-6 rounded-xl text-xs transition uppercase tracking-wide flex justify-center gap-2"
                              >
                                {pt ? 'Escolher Outro Documento' : 'Choose Another File'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lower row: Price Trend Analysis & Database Reconciliation */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-6 items-stretch">
                    
                    {/* Price Trend Analysis */}
                    <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                      <div className="text-[10px] font-mono text-brand-ink-dim border-b border-brand-border/30 pb-2 mb-3.5 font-bold uppercase">
                        📊 {pt ? priceTrends[selectedDoc].ptLabel : priceTrends[selectedDoc].enLabel}
                      </div>
                      
                      {/* SVG Sparkline chart */}
                      <div className="flex-1 flex items-center justify-center min-h-[90px] relative px-2">
                        <svg className="w-full h-[80px] overflow-visible" viewBox="0 0 220 80">
                          <defs>
                            <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Area glow */}
                          <path 
                            d={`${priceTrends[selectedDoc].svgPath} L 210,80 L 10,80 Z`} 
                            fill="url(#trendGlow)" 
                            className="transition-all duration-500"
                          />
                          {/* Stroke line */}
                          <path 
                            d={priceTrends[selectedDoc].svgPath} 
                            fill="none" 
                            stroke="#00F2FE" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                            className="transition-all duration-500 drop-shadow-[0_0_4px_#00F2FE]"
                          />
                          {/* Data points dots */}
                          <circle cx="10" cy="75" r="3" fill="#A0AEC0" />
                          <circle cx="210" cy={priceTrends[selectedDoc].svgPath.endsWith('15') ? '15' : priceTrends[selectedDoc].svgPath.endsWith('22') ? '22' : '60'} r="4.5" fill="#00F2FE" className="animate-pulse" />
                        </svg>
                      </div>

                      {/* Sparkline stats footer */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-brand-ink-dim border-t border-brand-border/20 pt-2 mt-2">
                        <span>{pt ? 'Mín (Jan):' : 'Min (Jan):'} <strong className="text-brand-ink">{priceTrends[selectedDoc].minPrice}</strong></span>
                        <span>{pt ? 'Variação:' : 'Variance:'} <strong className="text-brand-risk font-bold">{priceTrends[selectedDoc].variance}</strong></span>
                        <span>{pt ? 'Atual (Jun):' : 'Current (Jun):'} <strong className="text-brand-accent-soft font-bold">{priceTrends[selectedDoc].maxPrice}</strong></span>
                      </div>
                    </div>

                    {/* Database Reconciliation Card */}
                    <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                      <div>
                        <div className="flex justify-between items-center border-b border-brand-border/30 pb-2 mb-3">
                          <span className="text-[10px] font-mono text-brand-ink-dim font-bold uppercase">
                            {pt ? 'AUDITORIA DE RECONCILIAÇÃO' : 'DATABASE RECONCILIATION'}
                          </span>
                          {isComplete && (
                            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded transition ${isCurrentActionResolved || !scenarios[selectedDoc][activeAction].reconciliation.some(r => r.status === 'review' || r.status === 'blocked') ? 'bg-brand-ok/10 border border-brand-ok/30 text-brand-ok' : 'bg-brand-risk/10 border border-brand-risk/30 text-brand-risk'}`}>
                              {isCurrentActionResolved || !scenarios[selectedDoc][activeAction].reconciliation.some(r => r.status === 'review' || r.status === 'blocked') 
                                ? (pt ? '0 ALERTAS PENDENTES' : '0 PENDING ALERTS') 
                                : (pt ? 'DIVERGÊNCIA DETETADA' : 'DISCREPANCY DETECTED')}
                            </span>
                          )}
                        </div>

                        {/* Audit Table */}
                        <table className="w-full text-left font-mono text-[9px] text-[#A0AEC0] border-collapse">
                          <thead>
                            <tr className="border-b border-brand-border/20 text-brand-ink-dim font-bold">
                              <th className="py-1.5">{pt ? 'ITEM / CÓDIGO' : 'ITEM / KEY'}</th>
                              <th className="py-1.5">{pt ? 'DADO EXTRAÍDO' : 'EXTRACTED DATA'}</th>
                              <th className="py-1.5">{pt ? 'REGISTO SISTEMA' : 'SYSTEM RECORD'}</th>
                              <th className="py-1.5">{pt ? 'DESVIO' : 'VARIANCE'}</th>
                              <th className="py-1.5 text-right">{pt ? 'STATUS' : 'STATUS'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isComplete && scenarios[selectedDoc][activeAction].reconciliation.map((row, idx) => (
                              <tr key={idx} className="border-b border-brand-border/10">
                                <td className="py-2 text-brand-ink font-semibold">{row.label}</td>
                                <td className="py-2">{row.extracted}</td>
                                <td className="py-2">{row.sysRecord}</td>
                                <td className={`py-2 font-bold ${row.status === 'review' && !isCurrentActionResolved ? 'text-brand-risk' : row.status === 'blocked' ? 'text-brand-risk' : 'text-brand-ok'}`}>
                                  {row.status === 'review' && isCurrentActionResolved ? '0.00%' : row.variance}
                                </td>
                                <td className="py-2 text-right">
                                  {row.status === 'review' && !isCurrentActionResolved ? (
                                    <button 
                                      onClick={resolveMismatch}
                                      className="inline-flex items-center gap-1 bg-brand-risk/10 border border-brand-risk/30 hover:bg-brand-risk/20 text-brand-risk font-bold px-2 py-0.5 rounded text-[8px] transition animate-pulse"
                                    >
                                      <ShieldAlert className="w-3 h-3" />
                                      {pt ? 'Resolver' : 'Resolve'}
                                    </button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-brand-ok font-bold">
                                      <Check className="w-3 h-3" />
                                      {pt ? 'Conforme' : 'Matched'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Direct Business Impact / Outcome Summary */}
                  {isComplete && (
                    <div className={`border-l-4 p-4 bg-[#0B1120] rounded-r-xl text-xs font-sans text-left transition duration-300 ${scenarios[selectedDoc][activeAction].impactColor}`}>
                      <p className="text-brand-ink leading-relaxed">
                        {pt ? scenarios[selectedDoc][activeAction].ptImpact : scenarios[selectedDoc][activeAction].enImpact}
                      </p>
                    </div>
                  )}

                  {/* Console Logs Footer */}
                  <div className="bg-[#060810] border border-brand-border/40 rounded-xl p-3 h-[100px] flex flex-col justify-between font-mono text-[8px] text-[#A0AEC0]">
                    <span className="text-brand-ink-dim border-b border-brand-border/20 pb-1 mb-1.5 uppercase font-bold block">
                      {pt ? 'LOGS DE PROCESSAMENTO EM TEMPO REAL' : 'REAL-TIME SYSTEM LOGS'}
                    </span>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 text-glow-light select-none">
                      {logs.map((log, index) => (
                        <div key={index} className={log.includes('[ALERTA]') || log.includes('[WARNING]') || log.includes('[ALERT]') || log.includes('[CRITICAL]') || log.includes('[DISCREPANCY]') ? 'text-brand-risk' : log.includes('[SUCESSO]') || log.includes('[SUCCESS]') || log.includes('[OK]') ? 'text-brand-ok font-bold' : ''}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
