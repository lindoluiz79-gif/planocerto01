import type { Plan } from "@/data/plans";
import { Check, ShieldCheck, TrendingUp } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { CompareButton } from "./CompareButton";
import { ShareButton } from "./ShareButton";
import { StarRating } from "./StarRating";
import { useEffect } from "react";
import { addToHistory } from "@/lib/favorites";
import { trackPlanView, trackPlanClick } from "@/lib/analytics";
import { commissions } from "@/lib/payments";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

export function PlanCard({ plan, motivo, destaque }: { plan: Plan; motivo?: string; destaque?: boolean }) {
  useEffect(() => {
    addToHistory(plan.id);
    trackPlanView(plan.id, plan.nome);
  }, [plan.id, plan.nome]);

  const isPopular = plan.popularidade > 400;

  const handleContractClick = async () => {
    trackPlanClick(plan.id, plan.nome);
    
    // Rastrear comissão
    const user = getCurrentUser();
    if (user) {
      try {
        await commissions.trackConversion(plan.id, user.id);
        console.log('Comissão rastreada com sucesso');
      } catch (error) {
        console.error('Erro ao rastrear comissão:', error);
      }
    }
  };

  return (
    <Link
      to="/plano/$planId"
      params={{ planId: plan.id }}
      className={`block rounded-2xl bg-card border p-5 transition-all hover:-translate-y-0.5 ${
        destaque ? "border-primary shadow-[var(--shadow-elegant)]" : "border-border shadow-[var(--shadow-card)]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: plan.cor }}
          >
            {plan.operadora.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{plan.operadora}</h3>
            <p className="text-sm text-muted-foreground truncate">{plan.nome}</p>
          </div>
        </div>
        <div className="flex gap-1 ml-2" onClick={(e) => e.preventDefault()}>
          <FavoriteButton planId={plan.id} />
          <CompareButton planId={plan.id} />
          <ShareButton plan={plan} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {plan.recomendadoMei && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" /> MEI
          </span>
        )}
        {isPopular && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> Mais escolhido
          </span>
        )}
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold text-primary">
          R$ {plan.precoMensal.toFixed(0)}
        </span>
        <span className="text-sm text-muted-foreground">/mês</span>
      </div>

      <div className="mb-3">
        <StarRating rating={plan.rating} reviewCount={plan.reviewCount} />
      </div>

      <ul className="space-y-1.5 mb-4">
        {plan.coberturas.slice(0, 3).map((c) => (
          <li key={c} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
            <span>{c}</span>
          </li>
        ))}
      </ul>

      {motivo && (
        <p className="text-sm bg-secondary text-secondary-foreground rounded-lg p-3 mb-4">
          <strong>Por que: </strong>{motivo}
        </p>
      )}

      {isPopular && (
        <p className="text-xs text-muted-foreground mb-3 text-center">
          {plan.popularidade} pessoas escolheram este mês
        </p>
      )}

      <a
        href={plan.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
          handleContractClick();
        }}
        className="block w-full text-center bg-success text-success-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        Quero contratar
      </a>
    </Link>
  );
}
