import { BottomNav } from "./BottomNav";
import { WhatsAppButton } from "./WhatsAppButton";
import { ThemeToggle } from "./ThemeToggle";
import { AIChat } from "./AIChat";
import { PremiumFloatingBadge } from "./PremiumFloatingBadge";
import { InstallButton } from "./InstallButton";
import { Link } from "@tanstack/react-router";
import { Menu, X, User, LogOut, Crown, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { payments } from "@/lib/payments";
import { notifications } from "@/lib/notifications";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (user) {
      setUnreadCount(notifications.getUnreadCount(user.id));
      setUserNotifications(notifications.getNotifications(user.id));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = "/";
  };

  const handleMarkAsRead = (notificationId: string) => {
    notifications.markAsRead(notificationId);
    if (user) {
      setUnreadCount(notifications.getUnreadCount(user.id));
      setUserNotifications(notifications.getNotifications(user.id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            PlanoCerto
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {!payments.isPremium(user.id) && (
                  <Link
                    to="/premium"
                    className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Crown className="w-3 h-3" />
                    Premium
                  </Link>
                )}
                
                {/* Sino de Notificações */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Notificações"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de Notificações */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Notificações</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              notifications.markAllAsRead(user.id);
                              setUnreadCount(0);
                              setUserNotifications(notifications.getNotifications(user.id));
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Marcar todas como lidas
                          </button>
                        )}
                      </div>
                      
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma notificação</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {userNotifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 hover:bg-secondary transition-colors cursor-pointer ${
                                !notif.read ? 'bg-primary/5' : ''
                              }`}
                              onClick={() => {
                                handleMarkAsRead(notif.id);
                                if (notif.actionUrl) {
                                  window.location.href = notif.actionUrl;
                                }
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm text-foreground">
                                    {notif.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {userNotifications.length > 0 && (
                        <Link
                          to="/dashboard"
                          className="block p-3 text-center text-sm text-primary hover:underline border-t border-border"
                          onClick={() => setShowNotifications(false)}
                        >
                          Ver todas
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Entrar
              </Link>
            )}
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {menuOpen && (
          <div className="border-t border-border bg-card">
            <nav className="max-w-2xl mx-auto px-4 py-2">
              <Link
                to="/recomendar"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                🎯 Encontrar Plano Ideal
              </Link>
              <Link
                to="/cobertura"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📍 Cobertura por CEP
              </Link>
              <Link
                to="/calculadora"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                🧮 Calculadora de Economia
              </Link>
              <Link
                to="/simulador"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📊 Simulador de Uso
              </Link>
              <Link
                to="/faq"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                ❓ Perguntas Frequentes
              </Link>
              <Link
                to="/glossario"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📖 Glossário
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📝 Blog
              </Link>
              <Link
                to="/newsletter"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📧 Newsletter
              </Link>
              <Link
                to="/analytics"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                📈 Estatísticas
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                👤 Dashboard
              </Link>
              <Link
                to="/filtros-salvos"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                🔖 Filtros Salvos
              </Link>
              <Link
                to="/configuracoes"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                ⚙️ Configurações
              </Link>
              
              {/* Premium destacado */}
              <Link
                to="/premium"
                className="block mx-2 my-2 px-4 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl text-white font-bold text-center hover:opacity-90 transition-opacity shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span>Seja Premium</span>
                </div>
                <div className="text-xs font-normal opacity-90 mt-1">
                  A partir de R$ 19,90/mês
                </div>
              </Link>
              
              <Link
                to="/sobre"
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                ℹ️ Sobre
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-28">{children}</main>
      <InstallButton />
      <AIChat />
      <WhatsAppButton />
      <PremiumFloatingBadge />
      <BottomNav />
    </div>
  );
}
