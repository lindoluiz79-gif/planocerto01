import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS, payments } from "@/lib/payments";
import { getCurrentUser } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium — PlanoCerto" },
      { name: "description", content: "Assine o plano Premium e tenha acesso a recursos exclusivos" },
    ],
  }),
  component: Premium,
});

function Premium() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState<string | null>(null);
  const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  // Obter plano atual do usuário
  const getCurrentPlan = () => {
    if (!user) return 'free';
    const stored = localStorage.getItem(`subscription-${user.id}`);
    if (!stored) return 'free';
    const subscription = JSON.parse(stored);
    return subscription.planId || 'free';
  };
  
  const currentPlanId = getCurrentPlan();
  const isPremiumUser = user ? payments.isPremium(user.id) : false;

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      window.location.href = "/login?redirect=/premium";
      return;
    }

    setLoading(planId);
    
    try {
      // MODO DESENVOLVIMENTO: Simulação (remover em produção)
      const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      
      if (isDevelopment) {
        // Mostrar aviso que é simulação
        toast.info("⚠️ MODO DESENVOLVIMENTO: Simulando pagamento...", { duration: 2000 });
        
        // Simular pagamento
        await payments.simulatePayment(planId, user.id);
        
        toast.success("✅ Assinatura ativada (simulação)!");
        
        // Redirecionar para página de sucesso
        setTimeout(() => {
          window.location.href = "/payment-success?plan=" + planId;
        }, 1500);
      } else {
        // MODO PRODUÇÃO: Pagamento real com Stripe
        toast.info("Redirecionando para pagamento...");
        
        // Criar checkout session no Stripe
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/stripe/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            planId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar checkout');
        }

        const { url } = await response.json();
        
        // Redirecionar para Stripe Checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AppShell>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg mb-4">
          <Crown className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Seja Premium
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Desbloqueie recursos exclusivos e encontre o plano de saúde perfeito ainda mais rápido
        </p>
      </div>

      {isPremiumUser && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Você já é Premium!</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
            Aproveite todos os recursos exclusivos
          </p>
        </div>
      )}

      {/* Aviso de Modo Desenvolvimento */}
      {isDevelopment && !isPremiumUser && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <div className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                Modo Desenvolvimento
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                Os pagamentos estão sendo <strong>simulados</strong>. Ao clicar em "Assinar Agora", 
                você será marcado como Premium instantaneamente <strong>sem cobrança real</strong>.
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-600 mt-2">
                💡 Para ativar pagamentos reais, configure as chaves do Stripe no arquivo .env
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isFree = plan.id === 'free';
          const isPopular = plan.popular;
          const isYearly = plan.interval === 'yearly';
          const isCurrentPlan = plan.id === currentPlanId;
          const canUpgrade = currentPlanId === 'premium' && plan.id === 'premium-yearly';

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 transition-all ${
                isCurrentPlan
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : isPopular
                  ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {isCurrentPlan && (
                <div className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" />
                  Plano Atual
                </div>
              )}
              
              {!isCurrentPlan && isPopular && (
                <div className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Zap className="w-3 h-3" />
                  Mais Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      R$ {plan.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{plan.interval === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      💰 Economize R$ 38,90 por ano
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {isFree && currentPlanId === 'free' ? (
                <div className="w-full text-center bg-green-600 text-white font-semibold py-3 rounded-xl">
                  ✓ Plano Atual
                </div>
              ) : isCurrentPlan ? (
                <div className="w-full text-center bg-green-600 text-white font-semibold py-3 rounded-xl">
                  ✓ Plano Atual
                </div>
              ) : isFree ? (
                <Link
                  to="/"
                  className="block w-full text-center bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Voltar ao Gratuito
                </Link>
              ) : canUpgrade ? (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === plan.id ? "Processando..." : "⬆️ Fazer Upgrade"}
                </button>
              ) : isPremiumUser && !isCurrentPlan ? (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === plan.id ? "Processando..." : "🔄 Trocar de Plano"}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full font-semibold py-3 rounded-xl transition-opacity ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-secondary-foreground hover:opacity-90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? "Processando..." : "Assinar Agora"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-secondary rounded-xl p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">
          🔒 Pagamento 100% Seguro
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aceitamos Pix, cartão de crédito e boleto bancário
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🔐 SSL Criptografado</span>
          <span>•</span>
          <span>💳 PCI Compliant</span>
          <span>•</span>
          <span>✅ Cancele quando quiser</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/faq"
          className="text-sm text-primary hover:underline"
        >
          Dúvidas sobre o Premium? Veja o FAQ
        </Link>
      </div>
    </AppShell>
  );
}
