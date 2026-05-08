import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/payments";

export const Route = createFileRoute("/payment-success")({
  head: () => ({
    meta: [
      { title: "Pagamento Confirmado — PlanoCerto" },
    ],
  }),
  component: PaymentSuccess,
});

function PaymentSuccess() {
  const search = useSearch({ from: "/payment-success" });
  const planId = (search as any).plan || 'premium';
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

  return (
    <AppShell>
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          🎉 Pagamento Confirmado!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Sua assinatura <strong className="text-foreground">{plan?.name}</strong> foi ativada com sucesso!
        </p>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Você agora é Premium!
            </h2>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Alertas ilimitados</p>
                <p className="text-sm text-muted-foreground">Receba notificações de mudanças de preço</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Comparação ilimitada</p>
                <p className="text-sm text-muted-foreground">Compare quantos planos quiser</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Sem anúncios</p>
                <p className="text-sm text-muted-foreground">Experiência limpa e focada</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Consultoria por chat</p>
                <p className="text-sm text-muted-foreground">Tire dúvidas com especialistas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Ver Meu Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/buscar"
            className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Buscar Planos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl max-w-md mx-auto">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            📧 Enviamos um email de confirmação com os detalhes da sua assinatura
          </p>
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
