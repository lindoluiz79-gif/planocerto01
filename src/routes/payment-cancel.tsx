import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/payment-cancel")({
  head: () => ({
    meta: [
      { title: "Pagamento Cancelado — PlanoCerto" },
    ],
  }),
  component: PaymentCancel,
});

function PaymentCancel() {
  return (
    <AppShell>
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6">
          <XCircle className="w-12 h-12 text-orange-600 dark:text-orange-400" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Pagamento Cancelado
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Não se preocupe! Nenhuma cobrança foi realizada.
        </p>

        <div className="bg-secondary rounded-xl p-6 mb-8 max-w-md mx-auto text-left">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            O que aconteceu?
          </h2>
          
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Você cancelou o processo de pagamento</li>
            <li>• Nenhum valor foi cobrado</li>
            <li>• Você pode tentar novamente quando quiser</li>
            <li>• Seus dados estão seguros</li>
          </ul>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <Link
            to="/premium"
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Tentar Novamente
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Voltar ao Início
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl max-w-md mx-auto">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
            💬 Precisa de ajuda?
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-500">
            Entre em contato pelo WhatsApp ou chat ao vivo
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto">
          <Link
            to="/faq"
            className="text-sm text-primary hover:underline"
          >
            Ver FAQ
          </Link>
          <a
            href="https://wa.me/5511939537040"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </AppShell>
  );
}
