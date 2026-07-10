'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Code, Terminal, Send, Link, Database, Sparkles } from 'lucide-react';

type ApiType = 'erp' | 'graphql' | 'stripe' | 'mcp' | 'ai';

interface ApiScenario {
  url: string;
  method: string;
  ptDesc: string;
  enDesc: string;
  ptTimeline: string[];
  enTimeline: string[];
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
}

const apiScenarios: Record<ApiType, ApiScenario> = {
  erp: {
    url: 'https://api.nuelltech.com/v1/erp/sync-inventory',
    method: 'POST',
    ptDesc: 'Sincronização de stock em tempo real entre o software de faturação/POS e o inventário digital central.',
    enDesc: 'Real-time inventory synchronization between local POS/billing software and the central data hub.',
    requestPayload: {
      event: "inventory_updated",
      provider: "POS Billing System v10",
      sync_token: "nt_live_772a819b22e",
      item_id: "102",
      qty_in_stock: 150,
      unit_cost: 1.79,
      updated_at: "2026-07-06T17:45:00Z"
    },
    responsePayload: {
      status: "success",
      sync_id: "erp_sync_9941a8b",
      db_rows_affected: 1,
      cache_cleared: true,
      execution_time_ms: 84,
      message: "Physical inventory sync completed successfully."
    },
    ptTimeline: [
      '[17:45:00] Pedido POST recebido da API do software de faturação.',
      '[17:45:00] Token de autenticação verificado com sucesso.',
      '[17:45:00] Atualizado stock do ID 102 para 150 unidades no Postgres.',
      '[17:45:01] Custo médio ponderado recalculado para 1.79 €.',
      '[17:45:01] Cache do Dashboard do cliente purgada.'
    ],
    enTimeline: [
      '[17:45:00] POST request received from billing software API.',
      '[17:45:00] API Auth token successfully verified.',
      '[17:45:00] Updated item ID 102 stock to 150 units in Postgres database.',
      '[17:45:01] Weighted average cost recalculated to 1.79 €.',
      '[17:45:01] Client dashboard cache purged successfully.'
    ]
  },
  graphql: {
    url: 'https://api.nuelltech.com/v1/graphql',
    method: 'POST',
    ptDesc: 'Consulta GraphQL otimizada para obter dados estruturados e aninhados de produtos e stock com um único pedido (Query Batching).',
    enDesc: 'Optimized GraphQL query to retrieve nested, structured catalog details and stock levels in a single round-trip (Query Batching).',
    requestPayload: {
      query: "query GetProductStock($id: ID!) { product(id: $id) { name sku price stock { physical reserved available } } }",
      variables: {
        id: "102"
      }
    },
    responsePayload: {
      data: {
        product: {
          name: "Barra Proteica Coco x12",
          sku: "NT-BAR-COCO-102",
          price: 2.50,
          stock: {
            physical: 150,
            reserved: 12,
            available: 138
          }
        }
      }
    },
    ptTimeline: [
      '[17:45:00] Pedido GraphQL POST recebido no endpoint v1/graphql.',
      '[17:45:00] Estrutura da Query validada contra o GraphQL Schema.',
      '[17:45:00] Resolvers mapeados e executados no Postgres (1 única ligação).',
      '[17:45:01] Payload estruturado sob a propriedade "data" retornado em 22ms.'
    ],
    enTimeline: [
      '[17:45:00] GraphQL POST request received at v1/graphql endpoint.',
      '[17:45:00] Query structure validated against the GraphQL Schema definition.',
      '[17:45:00] Executed mapped query resolvers in Postgres (single database query).',
      '[17:45:01] Structured JSON response payload resolved in 22ms.'
    ]
  },
  stripe: {
    url: 'https://api.nuelltech.com/v1/webhooks/stripe-payments',
    method: 'POST',
    ptDesc: 'Webhooks orientados a eventos para processamento de pagamentos automáticos do Stripe, reconciliando faturas e atualizando contas.',
    enDesc: 'Event-driven webhooks for Stripe payment processing, automatically matching billing invoices and updating customer status.',
    requestPayload: {
      id: "evt_1Pq981HlB22e0a7",
      type: "invoice.payment_succeeded",
      created: 1783358700,
      data: {
        object: {
          customer_email: "financeiro@restauranteserra.pt",
          amount_paid: 45225,
          currency: "eur",
          invoice_pdf: "https://stripe.com/pdf/inv_123"
        }
      }
    },
    responsePayload: {
      webhook_status: "processed",
      action_taken: "invoice_marked_paid",
      erp_order_ref: "FT_FTV_25001",
      matching_nif: "502233445",
      notification_sent: "slack_billing_alerts"
    },
    ptTimeline: [
      '[17:45:00] Webhook recebido de Stripe IP 3.18.12.1.',
      '[17:45:00] Assinatura do webhook (Stripe-Signature) validada.',
      '[17:45:00] Evento "payment_succeeded" identificado.',
      '[17:45:01] Associada fatura FT_FTV_25001 de 452.25 € ao NIF 502233445.',
      '[17:45:01] Estado da fatura atualizado para PAGA no ERP local.',
      '[17:45:01] Disparada notificação Slack para canal #billing-alertas.'
    ],
    enTimeline: [
      '[17:45:00] Webhook request received from Stripe IP 3.18.12.1.',
      '[17:45:00] Webhook signature (Stripe-Signature) validated.',
      '[17:45:00] Event "payment_succeeded" identified successfully.',
      '[17:45:01] Matched invoice FT_FTV_25001 (452.25 €) to client NIF 502233445.',
      '[17:45:01] ERP local invoice marked as PAID.',
      '[17:45:01] Dispatched Slack notification to #billing-alerts channel.'
    ]
  },
  mcp: {
    url: 'https://api.nuelltech.com/v1/mcp/tools/call',
    method: 'POST',
    ptDesc: 'Servidor Model Context Protocol (MCP) para conectar Agentes de IA autónomos a bases de dados locais e ferramentas de forma segura.',
    enDesc: 'Model Context Protocol (MCP) server endpoints connecting autonomous AI agents to local databases and enterprise systems securely.',
    requestPayload: {
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        name: "query_stock_alerts",
        arguments: {
          min_expiry_days: 30,
          status: "critical"
        }
      },
      id: 42
    },
    responsePayload: {
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: "ALERTA: 150 caixas de Barra Proteica (ID: 102) expiram em 15 dias. Ações sugeridas: Lançar cupão de 40%."
          }
        ],
        isError: false
      },
      id: 42
    },
    ptTimeline: [
      '[17:45:00] Conexão SSE estabelecida com o Servidor MCP local.',
      '[17:45:00] Agente de IA invocou método "tools/call" para a ferramenta "query_stock_alerts".',
      '[17:45:01] Parâmetros de entrada validados com sucesso.',
      '[17:45:01] Executada query local SQL e gerada resposta XML/Text estruturada JSON-RPC 2.0.'
    ],
    enTimeline: [
      '[17:45:00] SSE Connection established with the local MCP Server.',
      '[17:45:00] AI Agent invoked "tools/call" method for tool query "query_stock_alerts".',
      '[17:45:01] Input query arguments successfully validated.',
      '[17:45:01] Executed local SQL database check and generated JSON-RPC 2.0 response wrapper.'
    ]
  },
  ai: {
    url: 'https://api.nuelltech.com/v1/ai/extract-ocr-schema',
    method: 'POST',
    ptDesc: 'API de Ingestão de Documentos usando modelos de Visão e Linguagem (Gemini 2.5) para extrair tabelas estruturadas de fotos ou PDFs.',
    enDesc: 'Document Ingestion API leveraging Vision and Language models (Gemini 2.5) to parse structured tables from raw photos or PDFs.',
    requestPayload: {
      model: "gemini-2.5-flash",
      document_type: "pdf_invoice",
      schema_format: "JSON_strict",
      raw_ocr_stream: "POMAR DO CARVALHO Lda... NIF: 509876543... Pêra Rocha 33.00 KG a 1.30..."
    },
    responsePayload: {
      model_version: "gemini-2.5-flash-001",
      tokens_processed: 1284,
      confidence_score: 0.992,
      structured_data: {
        vendor_name: "POMAR DO CARVALHO Lda",
        vendor_nif: "509876543",
        items: [
          { item_name: "Pêra Rocha", quantity: 33.0, unit_price: 1.30, vat_rate: 0.06 }
        ]
      }
    },
    ptTimeline: [
      '[17:45:00] Pedido POST de extração iniciado com stream de texto.',
      '[17:45:00] Encaminhado payload de prompts estruturados para a API Gemini.',
      '[17:45:01] Resposta JSON estruturada recebida da IA (1.284 tokens).',
      '[17:45:01] Validação matemática concluída com 99.2% de confiança.',
      '[17:45:01] Estrutura exportada em conformidade com schema JSON.'
    ],
    enTimeline: [
      '[17:45:00] POST extraction request initiated with text raw stream.',
      '[17:45:00] Forwarded structured prompts to Gemini AI engine API.',
      '[17:45:01] Received structured JSON response payload (1,284 tokens processed).',
      '[17:45:01] Mathematical checks validation passed with 99.2% confidence.',
      '[17:45:01] Output structured schema matched JSON format rules.'
    ]
  }
};

export default function ApiSandbox({ pt = true }: { pt?: boolean }) {
  const [activeApi, setActiveApi] = useState<ApiType>('erp');
  const [isCalling, setIsCalling] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [apiMobileTab, setApiMobileTab] = useState<'request' | 'response'>('request');
  const [editablePayload, setEditablePayload] = useState<string>(() =>
    JSON.stringify(apiScenarios.erp.requestPayload, null, 2)
  );

  const apiTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabChange = (apiType: ApiType) => {
    if (apiTimerRef.current) clearInterval(apiTimerRef.current);
    setIsCalling(false);
    setActiveApi(apiType);
    setEditablePayload(JSON.stringify(apiScenarios[apiType].requestPayload, null, 2));
    setShowResponse(false);
    setLogs([]);
  };

  const handleTriggerApi = () => {
    if (apiTimerRef.current) clearInterval(apiTimerRef.current);
    setIsCalling(true);
    setShowResponse(false);
    setLogs([]);
    setApiMobileTab('response');

    const timeline = pt ? apiScenarios[activeApi].ptTimeline : apiScenarios[activeApi].enTimeline;
    let logIndex = 0;

    apiTimerRef.current = setInterval(() => {
      if (logIndex < timeline.length) {
        setLogs(prev => [...prev, timeline[logIndex]]);
        logIndex++;
      } else {
        if (apiTimerRef.current) clearInterval(apiTimerRef.current);
        setIsCalling(false);
        setShowResponse(true);
      }
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (apiTimerRef.current) clearInterval(apiTimerRef.current);
    };
  }, []);

  const currentScenario = apiScenarios[activeApi];

  return (
    <div className="w-full max-w-5xl mx-auto bg-brand-card rounded-2xl border border-brand-border overflow-hidden box-glow glass flex flex-col">
      {/* Tab switcher */}
      <div className="flex bg-[#090D1A] border-b border-brand-border px-4 py-2 gap-2 flex-shrink-0 overflow-x-auto scrollbar-none">
        <button
          data-analytics-id="sandbox_api_tab_erp"
          onClick={() => handleTabChange('erp')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
            activeApi === 'erp'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          REST ERP
        </button>

        <button
          data-analytics-id="sandbox_api_tab_graphql"
          onClick={() => handleTabChange('graphql')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
            activeApi === 'graphql'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          GraphQL
        </button>

        <button
          data-analytics-id="sandbox_api_tab_stripe"
          onClick={() => handleTabChange('stripe')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
            activeApi === 'stripe'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          Stripe Webhooks
        </button>

        <button
          data-analytics-id="sandbox_api_tab_mcp"
          onClick={() => handleTabChange('mcp')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
            activeApi === 'mcp'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          MCP Server
        </button>

        <button
          data-analytics-id="sandbox_api_tab_ai"
          onClick={() => handleTabChange('ai')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
            activeApi === 'ai'
              ? 'bg-brand-accent/15 border-brand-accent text-brand-accent-soft'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Gemini AI
        </button>
      </div>

      {/* Workspace Body */}
      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 bg-[#04060C] text-left">
        {/* Top Desc */}
        <div className="border-b border-brand-border/40 pb-4">
          <p className="text-xs text-brand-ink leading-relaxed">
            <strong>{pt ? 'Descrição da Integração:' : 'Integration Scope:'}</strong>{' '}
            {pt ? currentScenario.ptDesc : currentScenario.enDesc}
          </p>
        </div>

        {/* Mobile Segmented Control */}
        <div className="lg:hidden flex bg-[#05070C]/85 border border-[#172033] rounded-xl p-1 gap-1 w-full mb-2">
          <button
            onClick={() => setApiMobileTab('request')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              apiMobileTab === 'request'
                ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent-soft'
                : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
            }`}
          >
            📥 Request
          </button>
          <button
            onClick={() => setApiMobileTab('response')}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              apiMobileTab === 'response'
                ? 'bg-brand-accent/15 border border-brand-accent/40 text-brand-accent-soft'
                : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink'
            }`}
          >
            💻 Response
          </button>
        </div>

        {/* Interactive Split Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
          
          {/* Left Column: Request Builder */}
          <div className={`bg-[#05070D] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-inner ${apiMobileTab === 'request' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-brand-ink-dim uppercase">
                <span>{pt ? 'CONSTRUIR PEDIDO HTTP' : 'CONSTRUCT HTTP REQUEST'}</span>
                <span className="text-brand-accent-soft">{currentScenario.method}</span>
              </div>

              <div className="bg-[#0A0D1A] border border-brand-border rounded px-3 py-2 text-[10px] font-mono text-brand-ink flex items-center gap-2 overflow-hidden">
                <span className="text-[#00F2FE] font-bold">{currentScenario.method}</span>
                <span className="text-brand-ink-dim select-all overflow-x-auto whitespace-nowrap scrollbar-none">
                  {currentScenario.url}
                </span>
              </div>

              <div className="flex flex-col h-[180px]">
                <label className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1.5 font-bold">
                  {pt ? 'Request Body (Payload JSON):' : 'Request Body (JSON Payload):'}
                </label>
                <textarea
                  value={editablePayload}
                  onChange={e => setEditablePayload(e.target.value)}
                  className="flex-1 w-full bg-[#0A0D1A] border border-brand-border rounded-lg p-3 text-[10px] sm:text-[10.5px] font-mono text-brand-ink focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent resize-none overflow-y-auto"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-4 pt-3 border-t border-brand-border/30">
              <button
                data-analytics-id="sandbox_api_trigger"
                onClick={handleTriggerApi}
                disabled={isCalling}
                className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-6 rounded-xl text-xs transition duration-150 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 cursor-pointer"
              >
                {isCalling ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    {pt ? 'A ENVIAR PEDIDO...' : 'SENDING REQUEST...'}
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {pt ? 'Disparar Chamada de API' : 'Send API Request'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Console & Response Inspector */}
          <div className={`bg-[#05070D] border border-brand-border/60 rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-inner ${apiMobileTab === 'response' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="flex flex-col gap-4 h-full">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-brand-ink-dim uppercase border-b border-brand-border/30 pb-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-brand-accent-soft" />
                  <span>{pt ? 'INSPETOR DE RESPOSTA HTTP' : 'HTTP RESPONSE INSPECTOR'}</span>
                </div>
                {showResponse && <span className="text-brand-ok font-bold">200 OK</span>}
              </div>

              {/* Log steps pane */}
              <div className="bg-[#070A14] border border-brand-border/40 rounded-lg p-3 h-[90px] flex flex-col gap-1 font-mono text-[9px] text-[#A0AEC0] overflow-y-auto flex-shrink-0">
                <span className="text-brand-ink-dim uppercase font-bold block mb-1">
                  {pt ? 'ATIVIDADE DE INFRAESTRUTURA' : 'INFRASTRUCTURE GATEWAY LOGS'}
                </span>
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log &&
                      (log.includes('[SUCESSO]') ||
                        log.includes('[SUCCESS]') ||
                        log.includes('[OK]'))
                        ? 'text-brand-ok font-bold'
                        : log &&
                          (log.includes('[ALERT]') ||
                            log.includes('[ALERTA]') ||
                            log.includes('[DISCREPANCY]') ||
                            log.includes('[OVERCHARGE]') ||
                            log.includes('[REGRA]'))
                        ? 'text-brand-risk'
                        : ''
                    }
                  >
                    {log}
                  </div>
                ))}
                {isCalling && logs.length === 0 && (
                  <span className="animate-pulse">{pt ? 'A aguardar gateway...' : 'Waiting for gateway...'}</span>
                )}
                {!isCalling && logs.length === 0 && (
                  <span className="text-gray-600 italic">
                    {pt ? 'Aguardando envio de pedido no painel esquerdo.' : 'Awaiting request trigger from the left panel.'}
                  </span>
                )}
              </div>

              {/* JSON Response Payloads output */}
              <div className="flex-1 flex flex-col h-[180px] overflow-hidden">
                <label className="text-[9px] font-mono text-brand-ink-dim uppercase block mb-1.5 font-bold">
                  {pt ? 'Response Body (JSON Recebido):' : 'Response Body (JSON Output):'}
                </label>
                <div className="flex-1 bg-[#0A0D1A] border border-brand-border rounded-lg p-3 overflow-auto text-[9.5px] sm:text-[10px] font-mono text-brand-ink select-all whitespace-pre scrollbar-thin">
                  {showResponse ? (
                    JSON.stringify(currentScenario.responsePayload, null, 2)
                  ) : (
                    <span className="text-gray-600 italic">
                      {pt
                        ? '// A resposta do servidor será exibida aqui...'
                        : '// Server response payload will appear here...'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
