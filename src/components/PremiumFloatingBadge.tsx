import { Crown, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { payments } from "@/lib/payments";

export function PremiumFloatingBadge() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const user = getCurrentUser();
  const isPremium = user ? payments.isPremium(user.id) : false;

  useEffect(() => {
    // Verificar se já foi fechado nesta sessão
    const wasClosed = sessionStorage.getItem('premium-badge-closed');
    if (wasClosed) {
      setClosed(true);
      return;
    }

    // Mostrar após 3 segundos
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosed(true);
    setVisible(false);
    sessionStorage.setItem('premium-badge-closed', 'true');
  };

  // Não mostrar para usuários premium ou se foi fechado
  if (isPremium || closed) {
    return null;
  }

  return (
    <>
      {/* Badge flutuante no canto inferior direito */}
      <div
        className={`fixed bottom-24 right-4 z-40 transition-all duration-500 ${
          visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="relative">
          {/* Botão fechar */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge principal */}
          <Link
            to="/premium"
            className="block bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl p-4 shadow-2xl hover:scale-105 transition-transform max-w-[280px]"
          >
            {/* Animação de brilho */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">Seja Premium</div>
                  <div className="text-white/90 text-xs">Recursos exclusivos</div>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-white text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span>Alertas ilimitados</span>
                </div>
                <div className="flex items-center gap-2 text-white text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span>Sem anúncios</span>
                </div>
                <div className="flex items-center gap-2 text-white text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  <span>Consultoria exclusiva</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-white">
                  <div className="text-xs opacity-75">A partir de</div>
                  <div className="text-lg font-bold">R$ 19,90/mês</div>
                </div>
                <div className="bg-white text-orange-600 font-bold text-xs px-3 py-1.5 rounded-lg">
                  Ver Planos
                </div>
              </div>
            </div>
          </Link>

          {/* Pulso animado */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 animate-ping opacity-20"></div>
        </div>
      </div>

      {/* Estilos para animação */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
}
