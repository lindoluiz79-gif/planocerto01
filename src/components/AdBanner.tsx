import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/auth";
import { payments } from "@/lib/payments";

export function AdBanner() {
  const [closed, setClosed] = useState(false);
  const user = getCurrentUser();
  
  // Não mostrar anúncio para usuários premium
  if (user && payments.isPremium(user.id)) {
    return null;
  }

  // Não mostrar se foi fechado
  if (closed) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
      <button
        onClick={() => setClosed(true)}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
        aria-label="Fechar anúncio"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="text-3xl">👑</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            Remova os anúncios
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Assine o Premium e tenha uma experiência sem interrupções, além de recursos exclusivos
          </p>
          <Link
            to="/premium"
            className="inline-block bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Ver Planos Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
