import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar se já foi dispensado nesta sessão
    const wasDismissed = sessionStorage.getItem('installPromptDismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowButton(false);
    }

    // Verificar se é iOS (Safari não suporta beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone;
    
    if (isIOS && !isStandalone) {
      // Mostrar instruções para iOS após 3 segundos
      setTimeout(() => {
        setShowButton(true);
      }, 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Se não há prompt (iOS), mostrar instruções
      alert(
        'Para instalar no iOS:\n\n' +
        '1. Toque no botão de compartilhar (□↑)\n' +
        '2. Role para baixo e toque em "Adicionar à Tela de Início"\n' +
        '3. Toque em "Adicionar"'
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso!');
    } else {
      console.log('Instalação do PWA cancelada');
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  const handleDismiss = () => {
    setShowButton(false);
    setDismissed(true);
    sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showButton || dismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 max-w-xs">
      <div className="bg-gradient-to-r from-primary to-primary-glow text-white p-4 rounded-2xl shadow-2xl animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dispensar"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="pr-6">
          <h3 className="font-bold text-lg mb-1">Instalar PlanoCerto</h3>
          <p className="text-sm opacity-90 mb-3">
            Acesse mais rápido e receba notificações de ofertas!
          </p>
          
          <button
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Instalar App</span>
          </button>
          
          <p className="text-xs opacity-75 mt-2 text-center">
            Funciona offline • Sem ocupar espaço
          </p>
        </div>
      </div>
    </div>
  );
}
