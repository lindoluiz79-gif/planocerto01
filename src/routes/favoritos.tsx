import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { PlanCard } from "@/components/PlanCard";
import { PLANS } from "@/data/plans";
import { getFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus Favoritos — PlanoCerto" },
      { name: "description", content: "Planos de saúde salvos como favoritos." },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
    
    // Atualiza quando localStorage muda
    const handleStorage = () => setFavoriteIds(getFavorites());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const favoritePlans = PLANS.filter(p => favoriteIds.includes(p.id));

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-foreground">Meus Favoritos</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {favoritePlans.length} plano{favoritePlans.length !== 1 ? 's' : ''} salvo{favoritePlans.length !== 1 ? 's' : ''}
        </p>
      </header>

      {favoritePlans.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-muted-foreground mb-6">
            Clique no ícone de coração nos planos para salvá-los aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favoritePlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
