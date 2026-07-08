'use client';

import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AuditorCalculator({ pt = true }: { pt?: boolean }) {
  // Inputs
  const [sales, setSales] = useState(35000);
  const [fixedCosts, setFixedCosts] = useState(15000);
  const [foodCostPct, setFoodCostPct] = useState(32);

  // Sliders for Simulation
  const [rawMaterialInflation, setRawMaterialInflation] = useState(0);
  const [fixedInflation, setFixedInflation] = useState(0);
  const [marketingBoost, setMarketingBoost] = useState(0);

  // Initial calculations
  const initialFoodCost = sales * (foodCostPct / 100);
  const initialProfit = sales - fixedCosts - initialFoodCost;
  const initialMargin = (initialProfit / sales) * 100;

  // Simulated calculations
  const simSales = sales * (1 + marketingBoost / 100);
  const simFixedCosts = fixedCosts * (1 + fixedInflation / 100);
  
  // Food cost is affected by both raw material inflation and sales boost
  const simFoodCostPct = foodCostPct * (1 + rawMaterialInflation / 100);
  const simFoodCost = simSales * (simFoodCostPct / 100);

  const simProfit = simSales - simFixedCosts - simFoodCost;
  const simMargin = simSales > 0 ? (simProfit / simSales) * 100 : 0;

  // Required actions to maintain initial profit
  const neededSalesIncrease = Math.max(0, (initialProfit + simFixedCosts) / (1 - simFoodCostPct / 100) - sales);
  const neededSalesPct = sales > 0 ? (neededSalesIncrease / sales) * 100 : 0;

  const resetSliders = () => {
    setRawMaterialInflation(0);
    setFixedInflation(0);
    setMarketingBoost(0);
  };

  return (
    <div className="w-full bg-[#05070D] border border-brand-border rounded-xl p-6 flex flex-col gap-6">
      {/* 2-Column Base Setup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-[10px] font-mono text-brand-ink-dim uppercase mb-1.5">
            {pt ? 'Faturação Mensal (€)' : 'Monthly Sales (€)'}
          </label>
          <input
            type="number"
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-brand-ink focus:outline-none focus:border-brand-accent-soft"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-brand-ink-dim uppercase mb-1.5">
            {pt ? 'Custos Fixos (Staff, Renda, Luz)' : 'Fixed Costs (Staff, Rent, Energy)'}
          </label>
          <input
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(Number(e.target.value))}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-brand-ink focus:outline-none focus:border-brand-accent-soft"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-brand-ink-dim uppercase mb-1.5">
            {pt ? 'Foodcost / Custo Matéria (%)' : 'Food Cost / Raw Materials (%)'}
          </label>
          <input
            type="number"
            value={foodCostPct}
            onChange={(e) => setFoodCostPct(Number(e.target.value))}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-brand-ink focus:outline-none focus:border-brand-accent-soft"
          />
        </div>
      </div>

      {/* Grid: Sliders vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 border-t border-brand-border/40 pt-6">
        
        {/* Sliders Area */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
            <h4 className="text-xs font-bold font-display text-brand-ink uppercase tracking-wide">
              {pt ? 'Simular Cenários Futuristas' : 'Simulate Future Scenarios'}
            </h4>
            <button
              onClick={resetSliders}
              className="text-[9px] font-mono text-brand-ink-dim hover:text-brand-ink flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              {pt ? 'Reiniciar' : 'Reset'}
            </button>
          </div>

          {/* Slider 1: Inflation raw materials */}
          <div>
            <div className="flex justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-brand-warn flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pt ? 'Inflação de Matérias-Primas' : 'Raw Materials Inflation'}
              </span>
              <span className="font-mono">+{rawMaterialInflation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={rawMaterialInflation}
              onChange={(e) => setRawMaterialInflation(Number(e.target.value))}
              className="w-full accent-brand-warn cursor-pointer bg-brand-card"
            />
          </div>

          {/* Slider 2: Fixed cost increase */}
          <div>
            <div className="flex justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-brand-risk flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pt ? 'Subida de Custos de Estrutura' : 'Fixed/Structure Cost Increase'}
              </span>
              <span className="font-mono">+{fixedInflation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={fixedInflation}
              onChange={(e) => setFixedInflation(Number(e.target.value))}
              className="w-full accent-brand-risk cursor-pointer bg-brand-card"
            />
          </div>

          {/* Slider 3: Marketing / New customers */}
          <div>
            <div className="flex justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-brand-ok flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {pt ? 'Impacto de Marketing (Clientes Extra)' : 'Marketing Impact (Extra Customers)'}
              </span>
              <span className="font-mono">+{marketingBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={marketingBoost}
              onChange={(e) => setMarketingBoost(Number(e.target.value))}
              className="w-full accent-brand-ok cursor-pointer bg-brand-card"
            />
          </div>
        </div>

        {/* Results / Audit Output */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-brand-border/30 pb-2">
            <span className="text-[10px] font-mono text-brand-ink-dim uppercase">
              {pt ? 'Simulador de Margem Final' : 'Final Margin Simulator'}
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          </div>

          {/* KPI numbers */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#05070D] p-3 rounded-lg border border-brand-border/40">
              <div className="text-[9px] text-brand-ink-dim uppercase font-mono">{pt ? 'Lucro Inicial' : 'Initial Profit'}</div>
              <div className="text-sm font-bold text-brand-ink font-mono mt-1">
                {initialProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
              <div className="text-[8px] text-brand-ink-dim mt-0.5">
                {initialMargin.toFixed(1)}% {pt ? 'Margem' : 'Margin'}
              </div>
            </div>

            <div className={`bg-[#05070D] p-3 rounded-lg border ${
              simProfit < 0 
                ? 'border-brand-risk/30 bg-brand-risk/5' 
                : simProfit < initialProfit 
                ? 'border-brand-warn/30 bg-brand-warn/5' 
                : 'border-brand-ok/30 bg-brand-ok/5'
            }`}>
              <div className="text-[9px] text-brand-ink-dim uppercase font-mono">{pt ? 'Novo Lucro Simulado' : 'Simulated Profit'}</div>
              <div className={`text-sm font-bold font-mono mt-1 ${
                simProfit < 0 ? 'text-brand-risk text-glow' : simProfit < initialProfit ? 'text-brand-warn' : 'text-brand-ok text-glow'
              }`}>
                {simProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
              <div className="text-[8px] text-brand-ink-dim mt-0.5">
                {simMargin.toFixed(1)}% {pt ? 'Margem' : 'Margin'}
              </div>
            </div>
          </div>

          {/* Explainer / Diagnostics */}
          <div className="text-[10px] text-brand-ink-dim leading-relaxed border-t border-brand-border/40 pt-3">
            {simProfit < initialProfit ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-1.5 text-brand-warn font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>
                    {pt 
                      ? 'Redução de lucro detetada face ao ponto inicial.' 
                      : 'Profit reduction detected compared to baseline.'}
                  </span>
                </div>
                <p>
                  {pt 
                    ? `Para recuperar o seu lucro inicial sem aumentar os preços, precisa de faturar mais ${neededSalesIncrease.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} € (+${neededSalesPct.toFixed(1)}% clientes).` 
                    : `To recover baseline profit without raising prices, you need to generate an additional ${neededSalesIncrease.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} € (+${neededSalesPct.toFixed(1)}% customers).`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-1.5 text-brand-ok font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
                  <span>
                    {pt ? 'Cenário equilibrado / lucrativo.' : 'Balanced / profitable scenario.'}
                  </span>
                </div>
                <p>
                  {pt 
                    ? 'O aumento de clientes através de marketing compensa o impacto inflacionário.' 
                    : 'The customer increase from marketing offsets the inflation impact.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal component check to avoid compiler warning
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
