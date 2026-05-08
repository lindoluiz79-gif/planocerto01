import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export function FavoriteButton({ planId }: { planId: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(planId));
  }, [planId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(planId);
    setFavorite(newState);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-colors ${
        favorite
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
      }`}
      aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={`w-5 h-5 ${favorite ? "fill-current" : ""}`} />
    </button>
  );
}
