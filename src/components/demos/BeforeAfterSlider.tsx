'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, LayoutDashboard, Grid, RefreshCw, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

interface BeforeAfterSliderProps {
  pt?: boolean;
}

interface ProductState {
  stock: number;
  cost: number;
  pvp: number;
}

export default function BeforeAfterSlider({ pt = true }: BeforeAfterSliderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'excel' | 'dashboard'>('excel');
  
  // Simulation states
  const [stockState, setStockState] = useState<Record<string, ProductState>>({
    whey: { stock: 85, cost: 20.00, pvp: 35.00 },
    bar: { stock: 20, cost: 1.50, pvp: 2.50 },
    carnitine: { stock: 240, cost: 4.00, pvp: 6.50 }
  });

  // Excel specific error states
  const [excelFormulaBroken, setExcelFormulaBroken] = useState(false);
  
  // Dashboard suggestions
  const [suggestedPvp, setSuggestedPvp] = useState<number | null>(null);
  const [isPvpAdjusted, setIsPvpAdjusted] = useState(false);
  const [isReorderTriggered, setIsReorderTriggered] = useState(false);

  // Trigger: Add Stock (Entrada) with inflation
  const handleAddStock = () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setIsPvpAdjusted(false);

    setTimeout(() => {
      setIsProcessing(false);
      
      // Excel simulation error: lock / shared file crash
      const roll = Math.random();
      if (roll < 0.5) {
        setErrorMsg(pt 
          ? '⚠️ ERRO DE GRAVAÇÃO: Ficheiro Excel bloqueado por utilizador "carlos.financeiro" (Acesso Partilhado desativado).' 
          : '⚠️ WRITE LOCK ERROR: Excel file locked by user "carlos.financeiro" (Shared Access disabled).');
      } else {
        setExcelFormulaBroken(true);
      }

      // Both systems get stock updates, but Dashboard recalculates average cost
      setStockState(prev => {
        const currentTotalCost = prev.bar.stock * prev.bar.cost;
        const newAddedCost = 50 * 1.90; // supplier price rose to 1.90€
        const newTotalStock = prev.bar.stock + 50;
        const newAvgCost = parseFloat(( (currentTotalCost + newAddedCost) / newTotalStock ).toFixed(2));
        
        return {
          ...prev,
          bar: { ...prev.bar, stock: newTotalStock, cost: newAvgCost }
        };
      });
      setSuggestedPvp(2.99); // suggested retail price to protect 40% margin
    }, 700);
  };

  // Trigger: Sell Stock (Saída) to provoke critical levels
  const handleSellStock = () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setIsReorderTriggered(false);

    setTimeout(() => {
      setIsProcessing(false);
      setStockState(prev => ({
        ...prev,
        bar: { ...prev.bar, stock: Math.max(0, prev.bar.stock - 15) }
      }));
    }, 700);
  };

  // Auto PVPs adjuster
  const adjustPvp = () => {
    if (suggestedPvp) {
      setStockState(prev => ({
        ...prev,
        bar: { ...prev.bar, pvp: suggestedPvp }
      }));
      setIsPvpAdjusted(true);
      setSuggestedPvp(null);
    }
  };

  // Auto Reorder trigger
  const confirmReorder = () => {
    setStockState(prev => ({
      ...prev,
      bar: { ...prev.bar, stock: prev.bar.stock + 100 }
    }));
    setIsReorderTriggered(true);
  };

  // Reset simulation state
  const resetSimulation = () => {
    setStockState({
      whey: { stock: 85, cost: 20.00, pvp: 35.00 },
      bar: { stock: 20, cost: 1.50, pvp: 2.50 },
      carnitine: { stock: 240, cost: 4.00, pvp: 6.50 }
    });
    setExcelFormulaBroken(false);
    setErrorMsg(null);
    setSuggestedPvp(null);
    setIsPvpAdjusted(false);
    setIsReorderTriggered(false);
  };

  // Detect low stock alerts for the Dashboard view dynamically
  const isBarStockLow = stockState.bar.stock <= 5;
  const barMargin = parseFloat((( (stockState.bar.pvp - stockState.bar.cost) / stockState.bar.pvp ) * 100).toFixed(1));

  return (
    <div className="w-full max-w-4xl mx-auto my-4 flex flex-col gap-6 font-sans">
      
      {/* Simulation Control Deck */}
      <div className="bg-[#090D1A] border border-brand-border/60 rounded-xl p-5 flex flex-col gap-4 shadow-inner relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-mono text-brand-accent-soft uppercase font-bold tracking-wider block mb-1">
              {pt ? 'Painel de Simulação de Stock (Interativo)' : 'Stock Simulation Deck (Interactive)'}
            </span>
            <h4 className="text-xs font-semibold text-brand-ink">
              {pt ? 'Produto de Teste: Barra Proteica Coco (ID 102)' : 'Test Item: Protein Bar Coco (ID 102)'}
            </h4>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Action: Add Stock with pricing changes */}
            <button
              data-analytics-id="sandbox_excel_simulate_in"
              onClick={handleAddStock}
              disabled={isProcessing}
              className="bg-gradient-to-r from-brand-card to-[#1C2333] hover:from-[#1C2333] hover:to-[#2A344A] border border-brand-border/80 text-brand-ink px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-350 shadow-md shadow-black/30 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              📥 {pt ? 'Simular Entrada: +50 Barra Coco (Custo Subiu para 1.90€)' : 'Simulate In: +50 Coco Bar (Cost Rose to 1.90€)'}
            </button>

            {/* Action: Sell Stock */}
            <button
              data-analytics-id="sandbox_excel_simulate_out"
              onClick={handleSellStock}
              disabled={isProcessing}
              className="bg-gradient-to-r from-brand-card to-[#1C2333] hover:from-[#1C2333] hover:to-[#2A344A] border border-brand-border/80 text-brand-ink px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-350 shadow-md shadow-black/30 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              📤 {pt ? 'Simular Saída: Vender 15 Barra Coco' : 'Simulate Out: Sell 15 Coco Bar'}
            </button>

            {/* Reset button */}
            <button
              data-analytics-id="sandbox_excel_reset"
              onClick={resetSimulation}
              disabled={isProcessing}
              className="border border-brand-border/80 text-brand-ink-dim hover:text-brand-ink p-2.5 rounded-xl text-[10px] transition-all duration-350 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              title="Reset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Legend / Explanations of what happens when button clicked */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-[9.5px] text-brand-ink-dim border-t border-brand-border/30 pt-4 text-left">
          <div className="flex gap-2">
            <span className="text-brand-accent-soft font-bold flex-shrink-0">📥 {pt ? 'Botão Entrada:' : 'In Button:'}</span>
            <span>
              {pt
                ? 'Simula o aumento de custo do fornecedor. No Excel, a margem corrompe-se ou o ficheiro bloqueia por edição partilhada. No Dashboard, o custo é atualizado e o sistema sugere ajustar o PVP para salvar a margem.'
                : 'Simulates price inflation. In Excel, file locks occur or margins break. In the Dashboard, cost updates automatically and a PVP adjustment is suggested.'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-brand-risk font-bold flex-shrink-0">📤 {pt ? 'Botão Saída:' : 'Out Button:'}</span>
            <span>
              {pt
                ? 'Simula vendas. No Excel, o stock cai a níveis críticos sem qualquer aviso. No Dashboard, é disparado um alerta visual vermelho e surge o botão "Comprar" para encomenda imediata.'
                : 'Simulates sales. In Excel, stock depletions pass undetected. In the Dashboard, a red critical alert fires alongside an instant Reorder action.'}
            </span>
          </div>
        </div>
      </div>

      {/* Processing Loader Indicator */}
      {isProcessing && (
        <div className="text-center py-1 animate-pulse text-[10px] font-mono text-brand-accent-soft uppercase font-bold">
          {pt ? 'A atualizar inventário nos sistemas...' : 'Updating inventory records...'}
        </div>
      )}

      {/* Workstations Segmented Control (Mobile only) */}
      <div className="md:hidden flex bg-[#05070C]/85 border border-[#172033] rounded-xl p-1.5 gap-1.5 w-full mt-2">
        <button
          data-analytics-id="sandbox_excel_tab_excel"
          onClick={() => setViewTab('excel')}
          className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
            viewTab === 'excel'
              ? 'bg-brand-risk/15 border border-brand-risk/30 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
          }`}
        >
          ❌ {pt ? 'Excel Antigo' : 'Legacy Excel'}
        </button>
        <button
          data-analytics-id="sandbox_excel_tab_dashboard"
          onClick={() => setViewTab('dashboard')}
          className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
            viewTab === 'dashboard'
              ? 'bg-brand-ok/15 border border-brand-ok/30 text-brand-ok shadow-[0_0_8px_rgba(34,197,94,0.15)]'
              : 'bg-transparent border-transparent text-brand-ink-dim hover:text-brand-ink hover:bg-brand-border/20'
          }`}
        >
          ❇️ {pt ? 'Dashboard Nuell' : 'Nuell Dashboard'}
        </button>
      </div>

      {/* Stacked Workstations: Excel (Top) then Dashboard (Bottom) for sequential comparison */}
      <div className="flex flex-col gap-8 w-full text-left">
        
        {/* 1. Legacy Excel Section (Before) */}
        <div className={`flex flex-col gap-3 ${viewTab === 'excel' ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-brand-risk uppercase font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {pt ? 'Antes: Versão Excel (Erros & Fricção)' : 'Before: Excel Version (Errors & Friction)'}
          </div>

          {errorMsg && (
            <div className="bg-brand-risk/10 border border-brand-risk/30 text-brand-risk p-3.5 rounded-xl text-[10.5px] font-mono text-left animate-shake">
              {errorMsg}
            </div>
          )}

          {/* LEGACY EXCEL VIEW */}
          <div className="bg-[#181B22] border border-brand-border rounded-xl p-4 flex flex-col justify-between text-xs font-sans text-gray-400 select-none shadow-2xl min-h-[300px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-700/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300 font-mono text-[10px] font-semibold">inventario_stocks_2026_V3_final.xlsx</span>
                </div>
                {excelFormulaBroken && (
                  <span className="bg-brand-risk/10 border border-brand-risk/30 px-2 py-0.5 rounded text-[8px] font-mono text-brand-risk font-bold animate-pulse">
                    {pt ? 'ERRO DE FÓRMULA (#VALOR!)' : 'FORMULA ERROR (#VALUE!)'}
                  </span>
                )}
              </div>

              {/* Excel Grid Header */}
              <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] bg-gray-800 text-gray-400 font-mono text-[9px] border-b border-gray-700">
                <div className="p-1 border-r border-gray-700 text-center"></div>
                <div className="p-1 border-r border-gray-700 pl-1">A (Artigo)</div>
                <div className="p-1 border-r border-gray-700 pl-1 hidden sm:block">B (Custo)</div>
                <div className="p-1 border-r border-gray-700 pl-1">C (Stock)</div>
                <div className="p-1 border-r border-gray-700 pl-1 hidden sm:block">D (PVP)</div>
                <div className="p-1 pl-1">E (Margem)</div>
              </div>

              {/* Excel Rows */}
              <div className="flex flex-col font-mono text-[9px] sm:text-[9.5px]">
                {/* Row 1 */}
                <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 bg-[#1D212A] text-gray-300">
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">1</div>
                  <div className="p-1 border-r border-gray-800 pl-1 truncate">Whey Protein 1KG</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">20,00 €</div>
                  <div className="p-1 border-r border-gray-800 pl-1">85 UNI</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">35,00 €</div>
                  <div className="p-1 pl-1">42.8%</div>
                </div>

                {/* Row 2 (Interactive row) */}
                <div className={`grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 text-gray-300 transition-colors ${excelFormulaBroken ? 'bg-red-950/20 text-red-300' : 'bg-[#1D212A]'}`}>
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">2</div>
                  <div className="p-1 border-r border-gray-800 pl-1 font-bold truncate">Barra Coco x12</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">1,50 €</div> {/* Cost stays static/outdated in manual Excel */}
                  <div className="p-1 border-r border-gray-800 pl-1 font-bold">{stockState.bar.stock} UNI</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">2,50 €</div>
                  <div className="p-1 pl-1 font-semibold text-brand-risk">
                    {excelFormulaBroken ? '#VALOR!' : '40.0%'}
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 bg-[#1D212A] text-gray-300">
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">3</div>
                  <div className="p-1 border-r border-gray-800 pl-1 truncate">L-Carnitina Shot</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">4,00 €</div>
                  <div className="p-1 border-r border-gray-800 pl-1">240 UNI</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">6,50 €</div>
                  <div className="p-1 pl-1">38.4%</div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 bg-[#1D212A] text-gray-300">
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">4</div>
                  <div className="p-1 border-r border-gray-800 pl-1 truncate">Shaker Misturador</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">2,10 €</div>
                  <div className="p-1 border-r border-gray-800 pl-1">15 UNI</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">4,50 €</div>
                  <div className="p-1 pl-1">53.3%</div>
                </div>

                {/* Row 5 (Out of stock with no warnings) */}
                <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 bg-[#1D212A] text-gray-300">
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">5</div>
                  <div className="p-1 border-r border-gray-800 pl-1 truncate">Creatina Mono 300g</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">14,20 €</div>
                  <div className="p-1 border-r border-gray-800 pl-1 text-red-400 font-bold">0 UNI</div> {/* Out of stock but no alerts */}
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">24,99 €</div>
                  <div className="p-1 pl-1">43.1%</div>
                </div>

                {/* Row 6 (Broken Reference Cell) */}
                <div className="grid grid-cols-[20px_1fr_65px_65px] sm:grid-cols-[20px_160px_70px_70px_80px_1fr] border-b border-gray-800 bg-[#1D212A] text-gray-300">
                  <div className="p-1 border-r border-gray-800 text-center bg-gray-800/40">6</div>
                  <div className="p-1 border-r border-gray-800 pl-1 truncate">Glutamina 250g</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">9,80 €</div>
                  <div className="p-1 border-r border-gray-800 pl-1">40 UNI</div>
                  <div className="p-1 border-r border-gray-800 pl-1 hidden sm:block">16,50 €</div>
                  <div className="p-1 pl-1 text-red-400 font-bold">#REF!</div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[9px] text-gray-500 italic flex items-center gap-1.5 border-t border-gray-700/50 pt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
              {pt 
                ? 'Ficheiro xlsx local. Sem sincronização com vendas (POS) ou compras de faturas (OCR).' 
                : 'xlsx file saved on local drive. No integration with live POS sales or supplier invoices.'}
            </div>
          </div>
        </div>

        {/* 2. Modern Dashboard Section (After) */}
        <div className={`flex flex-col gap-3 ${viewTab === 'dashboard' ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-brand-ok uppercase font-bold">
            <LayoutDashboard className="w-3.5 h-3.5" />
            {pt ? 'Depois: Versão Dashboard (Gestão Inteligente Nuell)' : 'After: Dashboard Version (Nuell Intelligent Hub)'}
          </div>

          {/* MODERN DASHBOARD VIEW */}
          <div className="bg-[#090D1A] border border-brand-border rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative min-h-[360px] gap-5">
            
            <div className="flex flex-col gap-4">
              {/* Dashboard Header */}
              <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
                <div>
                  <div className="text-[8px] font-mono text-brand-accent-soft uppercase tracking-wider font-bold">
                    NUELL DATA HUB · INVENTORY MONITOR
                  </div>
                  <h4 className="text-xs font-semibold font-display text-brand-ink mt-0.5">
                    {pt ? 'Painel Consolidado de Margens & Stocks' : 'Consolidated Margins & Stocks Panel'}
                  </h4>
                </div>
                <div className="bg-brand-ok/10 border border-brand-ok/20 px-2 py-0.5 rounded text-[8px] font-mono text-brand-ok flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-ok animate-pulse" />
                  {pt ? 'LIGAÇÃO ERP ATIVA' : 'ERP CONNECTION LIVE'}
                </div>
              </div>

              {/* Global KPI Banner */}
              <div className="grid grid-cols-3 gap-2 bg-[#05070C] p-2.5 rounded-xl border border-brand-border/60 text-[9px] font-mono select-none">
                <div className="text-left">
                  <span className="text-brand-ink-dim text-[8px] block">{pt ? 'Stock Total' : 'Total Stock'}</span>
                  <span className="text-brand-ink font-bold text-[10px]">380 UNI</span>
                </div>
                <div className="text-left">
                  <span className="text-brand-ink-dim text-[8px] block">{pt ? 'Margem Média' : 'Avg Profit Margin'}</span>
                  <span className="text-brand-ok font-bold text-[10px]">43.6%</span>
                </div>
                <div className="text-left">
                  <span className="text-brand-ink-dim text-[8px] block">{pt ? 'Alertas Ativos' : 'Active Alerts'}</span>
                  <span className={`font-bold text-[10px] ${isBarStockLow || stockState.bar.cost > 1.50 ? 'text-brand-risk animate-pulse' : 'text-brand-warn'}`}>
                    {isBarStockLow || stockState.bar.cost > 1.50 ? '2 ALERTA(S)' : '1 ALERTA(S)'}
                  </span>
                </div>
              </div>

              {/* Metric cards grid */}
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Card 1: Protein Bar Stock */}
                <div className={`bg-brand-card/75 border p-3 rounded-xl flex flex-col justify-between relative transition duration-300 ${isBarStockLow ? 'border-brand-risk/50 bg-brand-risk/5' : 'border-brand-border'}`}>
                  <div>
                    <span className="text-[8px] font-mono text-brand-ink-dim uppercase font-bold">
                      {pt ? 'Stock (Barra Coco)' : 'Stock (Coco Bar)'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-sm font-black font-mono ${isBarStockLow ? 'text-brand-risk' : 'text-brand-ink'}`}>
                        {stockState.bar.stock}
                      </span>
                      <span className="text-[7.5px] text-brand-ink-dim">UNI</span>
                    </div>
                  </div>
                  {isBarStockLow && (
                    <button 
                      data-analytics-id="sandbox_excel_confirm_reorder"
                      onClick={confirmReorder}
                      className="bg-brand-risk hover:bg-brand-risk/80 text-white font-bold px-1.5 py-0.5 rounded text-[7px] uppercase transition mt-2 w-full cursor-pointer shadow"
                    >
                      {pt ? '🛒 Comprar +100' : '🛒 Order +100'}
                    </button>
                  )}
                  {!isBarStockLow && isReorderTriggered && (
                    <span className="text-[7px] font-mono font-bold text-brand-ok uppercase mt-2 block border-t border-brand-ok/20 pt-1 text-center">
                      ✔️ {pt ? 'Enviado!' : 'Ordered!'}
                    </span>
                  )}
                </div>

                {/* Card 2: Avg profit margin */}
                <div className={`bg-brand-card/75 border p-3 rounded-xl flex flex-col justify-between transition duration-300 ${barMargin < 30 ? 'border-brand-risk/50 bg-brand-risk/5' : 'border-brand-border'}`}>
                  <div>
                    <span className="text-[8px] font-mono text-brand-ink-dim uppercase font-bold">
                      {pt ? 'Margem (Barra Coco)' : 'Margin (Coco Bar)'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-sm font-black font-mono ${barMargin < 30 ? 'text-brand-risk animate-pulse font-bold' : 'text-brand-ok'}`}>
                        {barMargin}%
                      </span>
                    </div>
                  </div>
                  
                  {suggestedPvp && (
                    <button 
                      data-analytics-id="sandbox_excel_adjust_pvp"
                      onClick={adjustPvp}
                      className="bg-brand-accent hover:bg-brand-accent-dark text-[#04060C] font-bold px-1.5 py-0.5 rounded text-[7px] uppercase transition mt-2 w-full shadow cursor-pointer"
                    >
                      {pt ? '⚡ Ajustar PVP' : '⚡ Adjust PVP'}
                    </button>
                  )}

                  {!suggestedPvp && isPvpAdjusted && (
                    <span className="text-[7px] font-mono font-bold text-brand-ok uppercase mt-2 block border-t border-brand-ok/20 pt-1 text-center">
                      ✔️ {pt ? 'Ajustado!' : 'Adjusted!'}
                    </span>
                  )}

                  {!suggestedPvp && !isPvpAdjusted && (
                    <span className="text-[7px] font-mono text-brand-ink-dim mt-2 block border-t border-brand-border/20 pt-1 text-center">
                      {pt ? 'Meta >40%' : 'Target >40%'}
                    </span>
                  )}
                </div>

                {/* Card 3: Billed inventory cost */}
                <div className="bg-brand-card/75 border border-brand-border p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-brand-ink-dim uppercase font-bold">
                      {pt ? 'Custo (Barra Coco)' : 'Cost (Coco Bar)'}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-black font-mono text-brand-ink">
                        {stockState.bar.cost.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <span className="text-[7px] font-mono text-brand-ink-dim mt-2 block border-t border-brand-border/20 pt-1 text-center truncate">
                    {pt ? 'Lido via OCR' : 'From OCR scan'}
                  </span>
                </div>

              </div>

              {/* Live stock table visual (expanded to match Excel) */}
              <div className="overflow-x-auto text-[9.5px] bg-brand-card/50 rounded-xl border border-brand-border p-3">
                <table className="w-full text-left font-mono">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-ink-dim font-bold">
                      <th>Artigo</th>
                      <th className="text-right">Stock</th>
                      <th className="text-right">Custo</th>
                      <th className="text-right">PVP</th>
                      <th className="text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-brand-border/10 text-brand-ink">
                      <td className="py-1.5 font-sans truncate max-w-[90px]">Whey Protein 1KG</td>
                      <td className="text-right">85 UNI</td>
                      <td className="text-right">20.00 €</td>
                      <td className="text-right">35.00 €</td>
                      <td className="text-right">
                        <span className="bg-brand-ok/10 text-brand-ok px-1 py-0.5 rounded text-[7px] font-bold">OK</span>
                      </td>
                    </tr>
                    <tr className="border-b border-brand-border/10 text-brand-ink">
                      <td className="py-1.5 font-sans font-bold truncate max-w-[90px]">Barra Coco x12</td>
                      <td className={`text-right font-bold ${isBarStockLow ? 'text-brand-risk' : ''}`}>{stockState.bar.stock} UNI</td>
                      <td className={`text-right ${stockState.bar.cost > 1.50 ? 'text-brand-risk font-bold' : ''}`}>{stockState.bar.cost.toFixed(2)} €</td>
                      <td className="text-right">{stockState.bar.pvp.toFixed(2)} €</td>
                      <td className="text-right">
                        <span className={`px-1 py-0.5 rounded text-[7px] font-bold ${isBarStockLow ? 'bg-brand-risk/10 text-brand-risk animate-pulse' : 'bg-brand-ok/10 text-brand-ok'}`}>
                          {isBarStockLow ? (pt ? 'CRÍTICO' : 'CRITICAL') : 'OK'}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-brand-border/10 text-brand-ink">
                      <td className="py-1.5 font-sans truncate max-w-[90px]">L-Carnitina Shot</td>
                      <td className="text-right">240 UNI</td>
                      <td className="text-right">4.00 €</td>
                      <td className="text-right">6.50 €</td>
                      <td className="text-right">
                        <span className="bg-brand-ok/10 text-brand-ok px-1 py-0.5 rounded text-[7px] font-bold">OK</span>
                      </td>
                    </tr>
                    <tr className="border-b border-brand-border/10 text-brand-ink">
                      <td className="py-1.5 font-sans truncate max-w-[90px]">Shaker Misturador</td>
                      <td className="text-right">15 UNI</td>
                      <td className="text-right">2.10 €</td>
                      <td className="text-right">4.50 €</td>
                      <td className="text-right">
                        <span className="bg-brand-ok/10 text-brand-ok px-1 py-0.5 rounded text-[7px] font-bold">OK</span>
                      </td>
                    </tr>
                    {/* Out of stock Creatina with clear warning in Dashboard */}
                    <tr className="border-b border-brand-border/10 text-brand-ink">
                      <td className="py-1.5 font-sans truncate max-w-[90px] font-semibold text-brand-risk">Creatina Mono 300g</td>
                      <td className="text-right text-brand-risk font-bold">0 UNI</td>
                      <td className="text-right">14.20 €</td>
                      <td className="text-right">24.99 €</td>
                      <td className="text-right">
                        <span className="bg-brand-risk/10 text-brand-risk px-1 py-0.5 rounded text-[7px] font-bold animate-pulse">{pt ? 'RUTURA' : 'OUT'}</span>
                      </td>
                    </tr>
                    {/* Glutamina is correctly calculated in Dashboard (no formula errors) */}
                    <tr className="text-brand-ink">
                      <td className="py-1.5 font-sans truncate max-w-[90px]">Glutamina 250g</td>
                      <td className="text-right">40 UNI</td>
                      <td className="text-right">9.80 €</td>
                      <td className="text-right">16.50 €</td>
                      <td className="text-right">
                        <span className="bg-brand-ok/10 text-brand-ok px-1 py-0.5 rounded text-[7px] font-bold">OK</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[8px] text-brand-ink-dim italic border-t border-brand-border/20 pt-2 flex flex-col sm:flex-row justify-between sm:items-center gap-2 select-none">
              <div className="flex items-center gap-1.5 text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-ok animate-pulse" />
                <span>
                  {pt 
                    ? 'Painel integrado. Stocks e custos atualizados via OCR de faturas e POS de vendas em tempo real.' 
                    : 'Connected data hub. Stock levels and weighted average cost updated via OCR and POS in real-time.'}
                </span>
              </div>
              <span className="text-[7.5px] font-mono text-brand-accent-soft uppercase font-bold flex-shrink-0 ml-4">[powered_by: nuelltech]</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
