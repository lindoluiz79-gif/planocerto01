import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { themeService, THEMES, type Theme } from "@/lib/themes";
import { pushNotifications } from "@/lib/push-notifications";
import { Palette, Bell, Download, Upload, Smartphone, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — PlanoCerto" },
      { name: "description", content: "Configure seu PlanoCerto" },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const user = getCurrentUser();
  const [currentTheme, setCurrentTheme] = useState<Theme>(themeService.getCurrentTheme());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    checkNotificationStatus();
    checkPWAStatus();

    // Listeners para status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkNotificationStatus = async () => {
    const hasPermission = pushNotifications.hasPermission();
    setNotificationsEnabled(hasPermission);
    
    const subscribed = await pushNotifications.isSubscribed();
    setIsSubscribed(subscribed);
  };

  const checkPWAStatus = () => {
    const installed = pushNotifications.isPWAInstalled();
    setIsPWAInstalled(installed);
  };

  const handleThemeChange = (themeId: string) => {
    const success = themeService.applyTheme(themeId);
    if (success) {
      setCurrentTheme(themeService.getCurrentTheme());
      toast.success("Tema aplicado!");
    }
  };

  const handleEnableNotifications = async () => {
    const granted = await pushNotifications.requestPermission();
    if (granted) {
      await pushNotifications.subscribe();
      setNotificationsEnabled(true);
      setIsSubscribed(true);
      toast.success("Notificações ativadas!");
      
      // Mostrar notificação de boas-vindas
      if (user) {
        await pushNotifications.notifyWelcome(user.name);
      }
    } else {
      toast.error("Permissão negada");
    }
  };

  const handleDisableNotifications = async () => {
    await pushNotifications.unsubscribe();
    setIsSubscribed(false);
    toast.success("Notificações desativadas");
  };

  const handleTestNotification = async () => {
    await pushNotifications.showLocalNotification(
      "🧪 Notificação de Teste",
      {
        body: "Se você viu isso, as notificações estão funcionando!",
        tag: "test",
      }
    );
  };

  const handleExportTheme = () => {
    const themeJson = themeService.exportTheme();
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planocerto-theme-${currentTheme.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tema exportado!");
  };

  const handleImportTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const text = await file.text();
      const success = themeService.importTheme(text);
      
      if (success) {
        setCurrentTheme(themeService.getCurrentTheme());
        toast.success("Tema importado!");
      } else {
        toast.error("Erro ao importar tema");
      }
    };
    input.click();
  };

  const handleClearCache = async () => {
    if (confirm("Limpar cache? Isso pode deixar o app mais lento temporariamente.")) {
      await pushNotifications.clearCache();
      toast.success("Cache limpo!");
    }
  };

  const handleUpdateSW = async () => {
    await pushNotifications.updateServiceWorker();
    toast.success("Service Worker atualizado! Recarregue a página.");
  };

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize sua experiência no PlanoCerto
        </p>
      </header>

      {/* Status do Sistema */}
      <div className="mb-6 rounded-xl bg-card border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Status do Sistema
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Conexão</span>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Offline</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">PWA Instalado</span>
            <span className={`text-sm font-medium ${isPWAInstalled ? 'text-green-600' : 'text-muted-foreground'}`}>
              {isPWAInstalled ? '✓ Sim' : '✗ Não'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Service Worker</span>
            <button
              onClick={handleUpdateSW}
              className="text-sm text-primary hover:underline"
            >
              Atualizar
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Cache</span>
            <button
              onClick={handleClearCache}
              className="text-sm text-red-600 hover:underline"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Temas */}
      <div className="mb-6 rounded-xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Tema
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportTheme}
              className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors"
              title="Exportar tema"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleImportTheme}
              className="p-2 bg-secondary rounded-lg hover:bg-accent transition-colors"
              title="Importar tema"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                currentTheme.id === theme.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{theme.preview}</div>
              <div className="text-sm font-semibold text-foreground">{theme.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{theme.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Dica:</strong> Você pode exportar seu tema favorito e compartilhar com amigos!
          </p>
        </div>
      </div>

      {/* Notificações */}
      <div className="mb-6 rounded-xl bg-card border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificações Push
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Notificações do Navegador</div>
              <div className="text-sm text-muted-foreground">
                Receba alertas de preços e novidades
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled && isSubscribed}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleEnableNotifications();
                  } else {
                    handleDisableNotifications();
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {notificationsEnabled && isSubscribed && (
            <button
              onClick={handleTestNotification}
              className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-accent transition-colors"
            >
              🧪 Testar Notificação
            </button>
          )}

          {!notificationsEnabled && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ Notificações desativadas. Ative para receber alertas de preços!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="rounded-xl bg-secondary p-5">
        <h3 className="font-semibold text-foreground mb-2">Sobre o PlanoCerto</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Versão: 2.0.0</p>
          <p>Última atualização: 07/05/2026</p>
          <p>Desenvolvido com ❤️ para MEI e autônomos</p>
        </div>
      </div>
    </AppShell>
  );
}
