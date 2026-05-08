import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { getFavorites } from "@/lib/favorites";
import { notifications } from "@/lib/notifications";
import { PLANS } from "@/data/plans";
import { 
  Heart, 
  Bell, 
  TrendingUp, 
  Clock, 
  Star,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu Dashboard — PlanoCerto" },
      { name: "description", content: "Gerencie seus planos favoritos, alertas e notificações" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<"favorites" | "alerts" | "notifications">("favorites");
  
  if (!user) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Você precisa estar logado
          </h2>
          <p className="text-muted-foreground mb-6">
            Faça login para acessar seu dashboard
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Fazer Login
          </Link>
        </div>
      </AppShell>
    );
  }

  const favorites = getFavorites();
  const favoritePlans = PLANS.filter(p => favorites.includes(p.id));
  const alerts = notifications.getPriceAlerts(user.id);
  const userNotifications = notifications.getNotifications(user.id);
  const unreadCount = notifications.getUnreadCount(user.id);

  const handleDeleteAlert = (alertId: string) => {
    notifications.deletePriceAlert(alertId);
    toast.success("Alerta removido");
    window.location.reload();
  };

  const handleToggleAlert = (alertId: string) => {
    notifications.togglePriceAlert(alertId);
    toast.success("Alerta atualizado");
    window.location.reload();
  };

  const handleMarkAsRead = (notificationId: string) => {
    notifications.markAsRead(notificationId);
    window.location.reload();
  };

  const handleMarkAllAsRead = () => {
    notifications.markAllAsRead(user.id);
    toast.success("Todas as notificações marcadas como lidas");
    window.location.reload();
  };

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Meu Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Olá, {user.name}! Gerencie seus planos e alertas
        </p>
      </header>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm text-muted-foreground">Favoritos</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{favoritePlans.length}</div>
        </div>

        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">Alertas</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{alerts.length}</div>
        </div>

        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Não lidas</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{unreadCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "favorites"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Favoritos ({favoritePlans.length})
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "alerts"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Alertas ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === "notifications"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Notificações ({userNotifications.length})
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === "favorites" && (
        <div className="space-y-4">
          {favoritePlans.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">Nenhum favorito ainda</p>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione planos aos favoritos para acompanhá-los aqui
              </p>
              <Link
                to="/buscar"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Buscar Planos
              </Link>
            </div>
          ) : (
            favoritePlans.map(plan => (
              <Link
                key={plan.id}
                to={`/plano/${plan.id}`}
                className="block rounded-xl bg-card border border-border p-5 hover:border-primary transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0"
                    style={{ backgroundColor: plan.cor }}
                  >
                    {plan.operadora.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{plan.operadora}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{plan.nome}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-primary">
                        R$ {plan.precoMensal.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{plan.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === "alerts" && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">Nenhum alerta configurado</p>
              <p className="text-sm text-muted-foreground mb-4">
                Crie alertas de preço para ser notificado quando um plano baixar
              </p>
              <Link
                to="/buscar"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Buscar Planos
              </Link>
            </div>
          ) : (
            alerts.map(alert => {
              const plan = PLANS.find(p => p.id === alert.planId);
              if (!plan) return null;

              return (
                <div
                  key={alert.id}
                  className={`rounded-xl bg-card border p-5 ${
                    alert.active ? "border-border" : "border-gray-300 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {plan.operadora} - {plan.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Preço atual: <span className="font-medium">R$ {alert.currentPrice.toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Alerta quando baixar para: <span className="font-medium text-green-600">R$ {alert.targetPrice.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAlert(alert.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          alert.active
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={alert.active ? "Desativar" : "Ativar"}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Remover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Criado em {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
                    {alert.notifiedAt && ` • Notificado em ${new Date(alert.notifiedAt).toLocaleDateString('pt-BR')}`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-4">
          {userNotifications.length > 0 && unreadCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:underline font-medium"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}

          {userNotifications.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-xl">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-foreground font-semibold mb-2">Nenhuma notificação</p>
              <p className="text-sm text-muted-foreground">
                Você será notificado sobre alertas de preço e novidades
              </p>
            </div>
          ) : (
            userNotifications.map(notification => (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 ${
                  notification.read
                    ? "bg-card border-border"
                    : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(notification.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Ver detalhes →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AppShell>
  );
}
