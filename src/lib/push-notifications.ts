// Sistema de Push Notifications Avançado - PlanoCerto

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  // Inicializar service worker e push notifications
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications não suportadas neste navegador');
      return false;
    }

    try {
      // Registrar service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registrado:', this.registration);

      // Aguardar ativação
      await navigator.serviceWorker.ready;

      // Verificar se já tem subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar push notifications:', error);
      return false;
    }
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Verificar se tem permissão
  hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Inscrever para push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    try {
      // VAPID public key (chave de exemplo - em produção use uma real)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrpcPBblQjBITjdymfc1FBSMMvi5F7oSKJwFAAYWe-F_gYpSBDg';
      
      const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);

      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      console.log('✅ Push subscription criada:', this.subscription);

      // Salvar subscription localmente
      localStorage.setItem('push-subscription', JSON.stringify(this.subscription.toJSON()));

      return this.subscription;
    } catch (error) {
      console.error('❌ Erro ao criar push subscription:', error);
      return null;
    }
  }

  // Cancelar inscrição
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      localStorage.removeItem('push-subscription');
      console.log('✅ Push subscription cancelada');
      return true;
    } catch (error) {
      console.error('❌ Erro ao cancelar push subscription:', error);
      return false;
    }
  }

  // Verificar se está inscrito
  async isSubscribed(): Promise<boolean> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return false;
    }

    this.subscription = await this.registration.pushManager.getSubscription();
    return this.subscription !== null;
  }

  // Mostrar notificação local (sem servidor)
  async showLocalNotification(
    title: string,
    options: {
      body?: string;
      icon?: string;
      badge?: string;
      image?: string;
      tag?: string;
      requireInteraction?: boolean;
      data?: any;
      actions?: Array<{ action: string; title: string; icon?: string }>;
    } = {}
  ): Promise<void> {
    if (!this.hasPermission()) {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      // Fallback para notificação do navegador
      new Notification(title, {
        icon: '/icon-192.png',
        ...options,
      });
      return;
    }

    await this.registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }

  // ========== NOTIFICAÇÕES ESPECÍFICAS DO PLANOCERTO ==========

  // Alerta de preço
  async notifyPriceAlert(planName: string, oldPrice: number, newPrice: number, planId: string) {
    const savings = oldPrice - newPrice;
    await this.showLocalNotification('💰 Alerta de Preço!', {
      body: `${planName} baixou de R$ ${oldPrice.toFixed(2)} para R$ ${newPrice.toFixed(2)}! Economize R$ ${savings.toFixed(2)}/mês`,
      tag: `price-alert-${planId}`,
      requireInteraction: true,
      data: { url: `/plano/${planId}`, type: 'price_alert' },
      actions: [
        { action: 'view', title: '👀 Ver Plano' },
        { action: 'close', title: '✖️ Fechar' },
      ],
    });
  }

  // Novo plano disponível
  async notifyNewPlan(planName: string, operadora: string, price: number, planId: string) {
    await this.showLocalNotification('🆕 Novo Plano Disponível!', {
      body: `${operadora} - ${planName} por apenas R$ ${price.toFixed(2)}/mês`,
      tag: `new-plan-${planId}`,
      data: { url: `/plano/${planId}`, type: 'new_plan' },
      actions: [
        { action: 'view', title: '👀 Ver Detalhes' },
        { action: 'close', title: '✖️ Fechar' },
      ],
    });
  }

  // Lembrete de carência
  async notifyCarenciaEnding(planName: string, days: number) {
    await this.showLocalNotification('⏰ Carência Terminando!', {
      body: `Sua carência do ${planName} termina em ${days} dia${days > 1 ? 's' : ''}. Você poderá usar todos os serviços em breve!`,
      tag: 'carencia-alert',
      requireInteraction: true,
    });
  }

  // Lembrete de pagamento
  async notifyPaymentReminder(planName: string, dueDate: string, amount: number) {
    await this.showLocalNotification('💳 Lembrete de Pagamento', {
      body: `Pagamento do ${planName} vence em ${dueDate}. Valor: R$ ${amount.toFixed(2)}`,
      tag: 'payment-reminder',
      requireInteraction: true,
      data: { url: '/dashboard', type: 'payment_reminder' },
    });
  }

  // Plano favorito em promoção
  async notifyFavoriteOnSale(planName: string, discount: number, planId: string) {
    await this.showLocalNotification('🎉 Seu Favorito em Promoção!', {
      body: `${planName} está com ${discount}% de desconto! Aproveite!`,
      tag: `favorite-sale-${planId}`,
      requireInteraction: true,
      data: { url: `/plano/${planId}`, type: 'favorite_sale' },
      actions: [
        { action: 'view', title: '🛒 Ver Oferta' },
        { action: 'close', title: '✖️ Fechar' },
      ],
    });
  }

  // Comparação salva atualizada
  async notifyComparisonUpdate(comparisonName: string) {
    await this.showLocalNotification('📊 Comparação Atualizada', {
      body: `Sua comparação "${comparisonName}" foi atualizada com novos preços`,
      tag: 'comparison-update',
      data: { url: '/comparar', type: 'comparison_update' },
    });
  }

  // Recomendação personalizada
  async notifyPersonalizedRecommendation(planName: string, reason: string, planId: string) {
    await this.showLocalNotification('✨ Recomendação Personalizada', {
      body: `${planName} - ${reason}`,
      tag: `recommendation-${planId}`,
      data: { url: `/plano/${planId}`, type: 'recommendation' },
      actions: [
        { action: 'view', title: '👀 Ver Plano' },
        { action: 'close', title: '✖️ Fechar' },
      ],
    });
  }

  // Boas-vindas
  async notifyWelcome(userName: string) {
    await this.showLocalNotification(`👋 Bem-vindo, ${userName}!`, {
      body: 'Configure alertas de preço e nunca perca uma promoção!',
      tag: 'welcome',
      data: { url: '/dashboard', type: 'welcome' },
    });
  }

  // ========== FUNCIONALIDADES AVANÇADAS ==========

  // Agendar notificação local
  scheduleNotification(
    title: string,
    options: any,
    delayMs: number
  ): number {
    return window.setTimeout(() => {
      this.showLocalNotification(title, options);
    }, delayMs);
  }

  // Cancelar notificação agendada
  cancelScheduledNotification(timerId: number): void {
    clearTimeout(timerId);
  }

  // Registrar background sync
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration || !('sync' in this.registration)) {
      console.warn('Background Sync não suportado');
      return;
    }

    try {
      await (this.registration as any).sync.register(tag);
      console.log('✅ Background sync registrado:', tag);
    } catch (error) {
      console.error('❌ Erro ao registrar background sync:', error);
    }
  }

  // Registrar periodic background sync (verificar preços periodicamente)
  async registerPeriodicSync(
    tag: string,
    minInterval: number = 24 * 60 * 60 * 1000 // 24 horas
  ): Promise<void> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration || !('periodicSync' in this.registration)) {
      console.warn('Periodic Background Sync não suportado');
      return;
    }

    try {
      await (this.registration as any).periodicSync.register(tag, {
        minInterval,
      });
      console.log('✅ Periodic sync registrado:', tag);
    } catch (error) {
      console.error('❌ Erro ao registrar periodic sync:', error);
    }
  }

  // Enviar mensagem para service worker
  async sendMessageToSW(message: any): Promise<void> {
    if (!this.registration || !this.registration.active) {
      return;
    }

    this.registration.active.postMessage(message);
  }

  // Limpar cache
  async clearCache(): Promise<void> {
    await this.sendMessageToSW({ type: 'CLEAR_CACHE' });
  }

  // Atualizar service worker
  async updateServiceWorker(): Promise<void> {
    if (!this.registration) {
      return;
    }

    await this.registration.update();
    await this.sendMessageToSW({ type: 'SKIP_WAITING' });
  }

  // Verificar se está online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Obter status da instalação PWA
  isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // ========== HELPERS ==========

  // Converter VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotifications = new PushNotificationService();

// Auto-inicializar quando o módulo for carregado
if (typeof window !== 'undefined') {
  pushNotifications.initialize().catch(console.error);
}
