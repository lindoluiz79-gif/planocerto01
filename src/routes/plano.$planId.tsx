import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PLANS } from "@/data/plans";
import { getReviewsByPlan, addReview, markHelpful } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/auth";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { ShareButton } from "@/components/ShareButton";
import { StarRating } from "@/components/StarRating";
import { ArrowLeft, Star, ThumbsUp, Check, MapPin, Building2, Bell, TrendingDown } from "lucide-react";
import { notifications } from "@/lib/notifications";
import { toast } from "sonner";
import { generatePlanSchema, generateBreadcrumbSchema } from "@/components/SEO";

export const Route = createFileRoute("/plano/$planId")({
  component: PlanDetailPage,
});

function PlanDetailPage() {
  const { planId } = Route.useParams();
  const plan = PLANS.find(p => p.id === planId);
  const [reviews, setReviews] = useState(getReviewsByPlan(planId));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const user = getCurrentUser();

  // Planos similares (mesma operadora ou preço similar)
  const similarPlans = PLANS.filter(p => 
    p.id !== planId && 
    (p.operadora === plan?.operadora || 
     Math.abs(p.precoMensal - (plan?.precoMensal || 0)) < 50)
  ).slice(0, 3);

  useEffect(() => {
    setReviews(getReviewsByPlan(planId));
  }, [planId]);

  if (!plan) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Plano não encontrado</h1>
          <Link to="/buscar" className="text-primary hover:underline">
            Voltar para busca
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para avaliar");
      return;
    }

    addReview({
      planId: plan.id,
      userId: user.id,
      userName: user.name,
      rating,
      comment
    });

    setReviews(getReviewsByPlan(planId));
    setShowReviewForm(false);
    setComment("");
    setRating(5);
    toast.success("Avaliação publicada!");
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    const target = Number(targetPrice);
    if (target >= plan.precoMensal) {
      toast.error("O preço alvo deve ser menor que o preço atual");
      return;
    }

    notifications.createPriceAlert(user.id, plan.id, target, plan.precoMensal);
    toast.success(`Alerta criado! Você será notificado quando o preço baixar para R$ ${target.toFixed(2)}`);
    setShowAlertForm(false);
    setTargetPrice("");
  };

  return (
    <AppShell>
      {/* Schema.org para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePlanSchema(plan)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateBreadcrumbSchema([
            { name: 'Início', url: '/' },
            { name: 'Buscar', url: '/buscar' },
            { name: plan.nome, url: `/plano/${plan.id}` },
          ])) 
        }}
      />

      <Link
        to="/buscar"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: plan.cor }}
            >
              {plan.operadora.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{plan.operadora}</h1>
              <p className="text-muted-foreground">{plan.nome}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <FavoriteButton planId={plan.id} />
            <CompareButton planId={plan.id} />
            <ShareButton plan={plan} />
          </div>
        </div>

        <div className="mb-4">
          <span className="text-4xl font-bold text-primary">
            R$ {plan.precoMensal.toFixed(0)}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>

        <StarRating rating={plan.rating} reviewCount={plan.reviewCount} />

        <div className="mt-6">
          <h3 className="font-semibold text-foreground mb-3">Coberturas incluídas:</h3>
          <ul className="space-y-2">
            {plan.coberturas.map((c) => (
              <li key={c} className="flex items-start gap-2 text-foreground">
                <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground mb-1">Dependentes</div>
            <div className="font-semibold text-foreground">
              {plan.cobreDependentes ? "✓ Aceita" : "✗ Não aceita"}
            </div>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground mb-1">Odontológico</div>
            <div className="font-semibold text-foreground">
              {plan.cobreOdonto ? "✓ Incluso" : "✗ Não incluso"}
            </div>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground mb-1">Hospitais Premium</div>
            <div className="font-semibold text-foreground">
              {plan.hospitaisGrandePorte ? "✓ Sim" : "✗ Não"}
            </div>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs text-muted-foreground mb-1">Recomendado MEI</div>
            <div className="font-semibold text-foreground">
              {plan.recomendadoMei ? "✓ Sim" : "✗ Não"}
            </div>
          </div>
        </div>

        <a
          href={plan.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-success text-success-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mt-6"
        >
          Quero contratar
        </a>

        {user && (
          <button
            onClick={() => setShowAlertForm(!showAlertForm)}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-foreground font-medium py-3 rounded-xl hover:bg-accent transition-colors mt-3"
          >
            <Bell className="w-4 h-4" />
            Criar alerta de preço
          </button>
        )}

        {showAlertForm && (
          <form onSubmit={handleCreateAlert} className="mt-4 p-4 bg-secondary rounded-xl">
            <h4 className="font-semibold text-foreground mb-3">Alerta de Preço</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Você será notificado quando o preço baixar para o valor desejado
            </p>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  required
                  min="0"
                  max={plan.precoMensal - 1}
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={`Menor que R$ ${plan.precoMensal.toFixed(2)}`}
                  className="input"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90"
              >
                Criar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Rede Credenciada</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {plan.hospitaisGrandePorte 
              ? "Acesso a hospitais de grande porte e rede premium"
              : "Rede credenciada padrão com hospitais e clínicas"}
          </p>
          <div className="text-xs text-muted-foreground">
            💡 Consulte a lista completa no site da operadora
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Cobertura</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Cobertura nacional com atendimento em todo o Brasil
          </p>
          <div className="text-xs text-muted-foreground">
            🗺️ Verifique disponibilidade na sua região
          </div>
        </div>
      </div>

      {/* Planos Similares */}
      {similarPlans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Planos Similares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarPlans.map(similarPlan => (
              <Link
                key={similarPlan.id}
                to={`/plano/${similarPlan.id}`}
                className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: similarPlan.cor }}
                  >
                    {similarPlan.operadora.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground text-sm truncate">
                      {similarPlan.operadora}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {similarPlan.nome}
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-primary">
                    R$ {similarPlan.precoMensal.toFixed(0)}
                  </span>
                  <span className="text-xs text-muted-foreground">/mês</span>
                </div>
                <StarRating rating={similarPlan.rating} reviewCount={similarPlan.reviewCount} size="sm" />
                {similarPlan.precoMensal < plan.precoMensal && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <TrendingDown className="w-3 h-3" />
                    R$ {(plan.precoMensal - similarPlan.precoMensal).toFixed(2)} mais barato
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ do Plano */}
      <div className="mb-6 rounded-xl bg-card border border-border p-5">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Como funciona a carência?
            </h4>
            <p className="text-sm text-muted-foreground">
              A carência varia de acordo com o tipo de procedimento. Consultas geralmente têm carência de 24h, 
              enquanto procedimentos mais complexos podem ter até 180 dias.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Posso incluir dependentes?
            </h4>
            <p className="text-sm text-muted-foreground">
              {plan.cobreDependentes 
                ? "Sim! Este plano aceita dependentes. O valor adicional varia conforme idade e grau de parentesco."
                : "Este plano não aceita dependentes. Consulte outros planos da operadora."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Como faço para contratar?
            </h4>
            <p className="text-sm text-muted-foreground">
              Clique no botão "Quero contratar" acima para ser direcionado ao site da operadora. 
              Você precisará preencher um formulário e enviar documentos para análise.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Avaliações ({reviews.length})
          </h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-sm text-primary hover:underline font-medium"
            >
              Escrever avaliação
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="rounded-xl bg-card border border-border p-5 mb-4">
            <h3 className="font-semibold text-foreground mb-3">Sua avaliação</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Nota
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Comentário
              </label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Compartilhe sua experiência com este plano..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Publicar
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-secondary text-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-card border border-border p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-foreground">{review.userName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              
              <p className="text-foreground mb-3">{review.comment}</p>
              
              <button
                onClick={() => {
                  markHelpful(review.id);
                  setReviews(getReviewsByPlan(planId));
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Útil ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}
