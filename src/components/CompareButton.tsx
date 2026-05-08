import { GitCompare } from "lucide-react";
import { useState, useEffect } from "react";
import { isInComparison, toggleComparison } from "@/lib/favorites";

export function CompareButton({ planId }: { planId: string }) {
  const [inComparison, setInComparison] = useState(false);

  useEffect(() => {
    setInComparison(isInComparison(planId));
  }, [planId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = toggleComparison(planId);
    if (success || inComparison) {
      setInComparison(!inComparison);
    } else {
      alert("Você pode comparar no máximo 3 planos por vez");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-colors ${
        inComparison
          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
      }`}
      aria-label={inComparison ? "Remover da comparação" : "Adicionar à comparação"}
    >
      <GitCompare className="w-5 h-5" />
    </button>
  );
}
