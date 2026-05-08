import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PLANS } from "@/data/plans";
import { getComparison, clearComparison } from "@/lib/favorites";
import { GitCompare, Check, X, TrendingUp, Award, DollarSign, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparar Planos — PlanoCerto" },
      { name: "description", content: "Compare planos de saúde lado a lado." },
    ],
  }),
  component: CompararPage,
});

function CompararPage() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  useEffect(() => {
    setComparisonIds(getComparison());
  }, []);

  const comparisonPlans = PLANS.filter(p => comparisonIds.includes(p.id));

  const handleClear = () => {
    clearComparison();
    setComparisonIds([]);
  };

  if (comparisonPlans.length === 0) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhum plano para comparar
          </h2>
          <p className="text-muted-foreground mb-6">
            Adicione até 3 planos para comparar lado a lado
          </p>
          <Link
            to="/buscar"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Buscar planos
          </Link>
        </div>
      </AppShell>
    );
  }

  const features = [
    { key: 'precoMensal', label: 'Preço mensal', format: (v: number) => `R$ ${v}`, type: 'number', lower: true },
    { key: 'rating', label: 'Avaliação', format: (v: number) => `${v.toFixed(1)} ⭐`, type: 'number', lower: false },
    { key: 'reviewCount', label: 'Avaliações', format: (v: number) => v.toString(), type: 'number', lower: false },
    { key: 'cobreDependentes', label: 'Cobre dependentes', format: (v: boolean) => v, type: 'boolean' },
    { key: 'cobreOdonto', label: 'Cobertura odonto', format: (v: boolean) => v, type: 'boolean' },
    { key: 'cobreMedicamentoContinuo', label: 'Medicamento contínuo', format: (v: boolean) => v, type: 'boolean' },
    { key: 'cobreDoencaCronica', label: 'Doença crônica', format: (v: boolean) => v, type: 'boolean' },
    { key: 'hospitaisGrandePorte', label: 'Hospitais premium', format: (v: boolean) => v, type: 'boolean' },
    { key: 'recomendadoMei', label: 'Recomendado MEI', format: (v: boolean) => v, type: 'boolean' },
  ];

  // Calcular melhor em cada categoria
  const getBestInCategory = (key: string, lower = false) => {
    const values = comparisonPlans.map(p => p[key as keyof typeof p]);
    if (typeof values[0] === 'number') {
      return lower ? Math.min(...(values as number[])) : Math.max(...(values as number[]));
    }
    return null;
  };

  // Calcular pontuação geral
  const getScore = (plan: typeof comparisonPlans[0]) => {
    let score = 0;
    score += (5 - plan.precoMensal / 100) * 2; // Preço (peso 2)
    score += plan.rating * 3; // Avaliação (peso 3)
    score += plan.cobreDependentes ? 1 : 0;
    score += plan.cobreOdonto ? 1 : 0;
    score += plan.cobreMedicamentoContinuo ? 1 : 0;
    score += plan.cobreDoencaCronica ? 1 : 0;
    score += plan.hospitaisGrandePorte ? 2 : 0;
    score += plan.recomendadoMei ? 1 : 0;
    return score;
  };

  const scores = comparisonPlans.map(p => ({ id: p.id, score: getScore(p) }));
  const bestScore = Math.max(...scores.map(s => s.score));
  const bestPlan = comparisonPlans.find(p => getScore(p) === bestScore);

  const handleShare = () => {
    const text = `Comparando planos: ${comparisonPlans.map(p => p.nome).join(' vs ')}`;
    if (navigator.share) {
      navigator.share({ title: 'Comparação PlanoCerto', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  const handleExport = () => {
    toast.info('Exportação em PDF em breve!');
  };

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comparar Planos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {comparisonPlans.length} plano{comparisonPlans.length !== 1 ? 's' : ''} selecionado{comparisonPlans.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Resumo e Recomendação */}
        {bestPlan && (
          <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-4 mb-6">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Melhor Custo-Benefício
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>{bestPlan.operadora} - {bestPlan.nome}</strong> tem a melhor pontuação geral 
                  considerando preço, avaliações e coberturas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gráfico de Preços */}
        <div className="rounded-xl bg-card border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Comparação de Preços
          </h3>
          <div className="space-y-3">
            {comparisonPlans.map(plan => {
              const maxPrice = Math.max(...comparisonPlans.map(p => p.precoMensal));
              const percentage = (plan.precoMensal / maxPrice) * 100;
              const isCheapest = plan.precoMensal === Math.min(...comparisonPlans.map(p => p.precoMensal));
              
              return (
                <div key={plan.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{plan.operadora}</span>
                    <span className="text-sm font-bold text-foreground">
                      R$ {plan.precoMensal.toFixed(2)}
                      {isCheapest && <span className="ml-2 text-xs text-green-600">Mais barato</span>}
                    </span>
                  </div>
                  <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-end px-3 text-xs font-semibold text-white transition-all ${
                        isCheapest ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 30 && `${percentage.toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico de Avaliações */}
        <div className="rounded-xl bg-card border border-border p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Avaliações dos Usuários
          </h3>
          <div className="space-y-3">
            {comparisonPlans.map(plan => {
              const percentage = (plan.rating / 5) * 100;
              const isBest = plan.rating === Math.max(...comparisonPlans.map(p => p.rating));
              
              return (
                <div key={plan.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{plan.operadora}</span>
                    <span className="text-sm font-bold text-foreground">
                      {plan.rating.toFixed(1)} ⭐
                      {isBest && <span className="ml-2 text-xs text-yellow-600">Melhor avaliado</span>}
                    </span>
                  </div>
                  <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-end px-3 text-xs font-semibold text-white transition-all ${
                        isBest ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 30 && `${plan.reviewCount} avaliações`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-secondary font-semibold text-foreground border border-border">
                Característica
              </th>
              {comparisonPlans.map(plan => (
                <th key={plan.id} className="p-3 text-center bg-secondary border border-border min-w-[200px]">
                  <div
                    className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: plan.cor }}
                  >
                    {plan.operadora.charAt(0)}
                  </div>
                  <div className="font-semibold text-foreground text-sm">{plan.operadora}</div>
                  <div className="text-xs text-muted-foreground">{plan.nome}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => {
              const bestValue = getBestInCategory(feature.key, feature.lower);
              
              return (
                <tr key={feature.key} className={idx % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}>
                  <td className="p-3 font-medium text-foreground border border-border">
                    {feature.label}
                  </td>
                  {comparisonPlans.map(plan => {
                    const value = plan[feature.key as keyof typeof plan];
                    const formatted = feature.format(value as any);
                    const isBest = feature.type === 'number' && value === bestValue;
                    
                    return (
                      <td key={plan.id} className={`p-3 text-center border border-border ${isBest ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                        {typeof formatted === 'boolean' ? (
                          formatted ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className={`text-foreground ${isBest ? 'font-bold text-green-600' : ''}`}>
                            {formatted}
                            {isBest && <span className="ml-1">🏆</span>}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td className="p-3 font-medium text-foreground border border-border">
                Ação
              </td>
              {comparisonPlans.map(plan => (
                <td key={plan.id} className="p-3 text-center border border-border">
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-success text-success-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Contratar
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
