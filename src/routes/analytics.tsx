import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getPopularPlans, getConversionRate, getAnalytics } from "@/lib/analytics";
import { PLANS } from "@/data/plans";
import { BarChart3, TrendingUp, Eye, MousePointer } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Estatísticas — PlanoCerto" },
      { name: "description", content: "Veja as estatísticas de uso do PlanoCerto." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [popularPlans, setPopularPlans] = useState<Array<[string, number]>>([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    setPopularPlans(getPopularPlans());
    setConversionRate(getConversionRate());
    setTotalEvents(getAnalytics().length);
  }, []);

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Dados de uso e popularidade dos planos
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl bg-card border border-border p-4 text-center">
          <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalEvents}</div>
          <div className="text-xs text-muted-foreground">Total de eventos</div>
        </div>

        <div className="rounded-xl bg-card border border-border p-4 text-center">
          <MousePointer className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Taxa de conversão</div>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Planos Mais Visualizados
        </h2>

        {popularPlans.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum dado disponível ainda
          </p>
        ) : (
          <div className="space-y-3">
            {popularPlans.map(([planId, views], index) => {
              const plan = PLANS.find(p => p.id === planId);
              if (!plan) return null;

              return (
                <div key={planId} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <div className="text-2xl font-bold text-primary w-8">
                    #{index + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: plan.cor }}
                  >
                    {plan.operadora.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">
                      {plan.operadora}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {plan.nome}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{views}</div>
                    <div className="text-xs text-muted-foreground">visualizações</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
