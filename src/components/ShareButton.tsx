import { Share2 } from "lucide-react";
import type { Plan } from "@/data/plans";

export function ShareButton({ plan }: { plan: Plan }) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const text = `Confira o plano ${plan.nome} da ${plan.operadora} por R$ ${plan.precoMensal}/mês no PlanoCerto!`;
    const url = window.location.origin;

    // Tenta usar a API nativa de compartilhamento
    if (navigator.share) {
      try {
        await navigator.share({ title: "PlanoCerto", text, url });
      } catch (err) {
        // Usuário cancelou
      }
    } else {
      // Fallback: WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      aria-label="Compartilhar plano"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
