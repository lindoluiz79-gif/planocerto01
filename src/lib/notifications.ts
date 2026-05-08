// Sistema de Notificações e Alertas de Preço

export type PriceAlert = {
  id: string;
  userId: string;
  planId: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: string;
  notifiedAt?: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'price_drop' | 'new_plan' | 'plan_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  planId?: string;
  actionUrl?: string;
};

class NotificationService {
  private readonly ALERTS_KEY = 'planocerto-price-alerts';
  private readonly NOTIFICATIONS_KEY = 'planocerto-notifications';

  // ========== ALERTAS DE PREÇO ==========

  createPriceAlert(userId: string, planId: string, targetPrice: number, currentPrice: number): PriceAlert {
    const alert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      planId,
      targetPrice,
      currentPrice,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const alerts = this.getPriceAlerts(userId);
    alerts.push(alert);
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));

    return alert;
  }

  getPriceAlerts(userId: string): PriceAlert[] {
    const stored = localStorage.getItem(this.ALERTS_KEY);
    if (!stored) return [];
    
    const all: PriceAlert[] = JSON.parse(stored);
    return all.filter(a => a.userId === userId);
  }

  getActivePriceAlerts(userId: string): PriceAlert[] {
    return this.getPriceAlerts(userId).filter(a => a.active);
  }

  deletePriceAlert(alertId: string): void {
    const stored = localStorage.getItem(this.ALERTS_KEY);
    if (!stored) return;
    
    const all: PriceAlert[] = JSON.parse(stored);
    const filtered = all.filter(a => a.id !== alertId);
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(filtered));
  }

  togglePriceAlert(alertId: string): void {
    const stored = localStorage.getItem(this.ALERTS_KEY);
    if (!stored) return;
    
    const all: PriceAlert[] = JSON.parse(stored);
    const alert = all.find(a => a.id === alertId);
    if (alert) {
      alert.active = !alert.active;
      localStorage.setItem(this.ALERTS_KEY, JSON.stringify(all));
    }
  }

  checkPriceAlerts(userId: string, planId: string, newPrice: number): void {
    const alerts = this.getActivePriceAlerts(userId).filter(a => a.planId === planId);
    
    alerts.forEach(alert => {
      if (newPrice <= alert.targetPrice && newPrice < alert.currentPrice) {
        // Preço atingiu o alvo!
        this.createNotification(
          userId,
          'price_drop',
          '🎉 Alerta de Preço!',
          `O plano que você acompanha baixou para R$ ${newPrice.toFixed(2)}!`,
          planId,
          `/plano/${planId}`
        );
        
        // Atualizar alerta
        const stored = localStorage.getItem(this.ALERTS_KEY);
        if (stored) {
          const all: PriceAlert[] = JSON.parse(stored);
          const alertToUpdate = all.find(a => a.id === alert.id);
          if (alertToUpdate) {
            alertToUpdate.notifiedAt = new Date().toISOString();
            alertToUpdate.currentPrice = newPrice;
            localStorage.setItem(this.ALERTS_KEY, JSON.stringify(all));
          }
        }
      }
    });
  }

  // ========== NOTIFICAÇÕES ==========

  createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    planId?: string,
    actionUrl?: string
  ): Notification {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      planId,
      actionUrl,
    };

    const notifications = this.getNotifications(userId);
    notifications.unshift(notification); // Adiciona no início
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));

    // Mostrar notificação do navegador se permitido
    this.showBrowserNotification(title, message);

    return notification;
  }

  getNotifications(userId: string): Notification[] {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!stored) return [];
    
    const all: Notification[] = JSON.parse(stored);
    return all.filter(n => n.userId === userId);
  }

  getUnreadNotifications(userId: string): Notification[] {
    return this.getNotifications(userId).filter(n => !n.read);
  }

  getUnreadCount(userId: string): number {
    return this.getUnreadNotifications(userId).length;
  }

  markAsRead(notificationId: string): void {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!stored) return;
    
    const all: Notification[] = JSON.parse(stored);
    const notification = all.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(all));
    }
  }

  markAllAsRead(userId: string): void {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!stored) return;
    
    const all: Notification[] = JSON.parse(stored);
    all.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(all));
  }

  deleteNotification(notificationId: string): void {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!stored) return;
    
    const all: Notification[] = JSON.parse(stored);
    const filtered = all.filter(n => n.id !== notificationId);
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(filtered));
  }

  clearAllNotifications(userId: string): void {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (!stored) return;
    
    const all: Notification[] = JSON.parse(stored);
    const filtered = all.filter(n => n.userId !== userId);
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(filtered));
  }

  // ========== NOTIFICAÇÕES DO NAVEGADOR ==========

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  showBrowserNotification(title: string, body: string): void {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'planocerto',
    });
  }

  // ========== NOTIFICAÇÕES DE EXEMPLO ==========

  createWelcomeNotification(userId: string): void {
    this.createNotification(
      userId,
      'system',
      '👋 Bem-vindo ao PlanoCerto!',
      'Configure alertas de preço e nunca perca uma promoção!',
      undefined,
      '/dashboard'
    );
  }

  createNewPlanNotification(userId: string, planName: string, planId: string): void {
    this.createNotification(
      userId,
      'new_plan',
      '🆕 Novo Plano Disponível!',
      `Confira o novo plano: ${planName}`,
      planId,
      `/plano/${planId}`
    );
  }
}

export const notifications = new NotificationService();
