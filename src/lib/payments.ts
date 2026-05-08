// Sistema de Pagamentos e Monetização
// Integração com Stripe, PagSeguro, Mercado Pago

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    interval: 'monthly',
    features: [
      'Busca básica de planos',
      'Comparação de até 3 planos',
      'Calculadora de economia',
      'Acesso ao blog',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.90,
    interval: 'monthly',
    popular: true,
    features: [
      'Tudo do plano Gratuito',
      'Alertas de preço ilimitados',
      'Comparação ilimitada',
      'Consultoria por chat',
      'Acesso antecipado a novos planos',
      'Sem anúncios',
      'Relatórios personalizados',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Anual',
    price: 199.90,
    interval: 'yearly',
    features: [
      'Tudo do plano Premium',
      '2 meses grátis',
      'Consultoria telefônica',
      'Suporte prioritário 24/7',
      'Análise personalizada',
    ],
  },
];

export class PaymentService {
  private stripeKey?: string;
  private mercadoPagoKey?: string;

  constructor() {
    this.stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    this.mercadoPagoKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  }

  // Stripe Integration
  async createStripeCheckout(planId: string, userId: string) {
    try {
      const response = await fetch('/api/payments/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId }),
      });

      const { sessionId } = await response.json();
      
      // Redirecionar para Stripe Checkout
      if ((window as any).Stripe) {
        const stripe = (window as any).Stripe(this.stripeKey!);
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }

  // Mercado Pago Integration
  async createMercadoPagoCheckout(planId: string, userId: string) {
    try {
      const response = await fetch('/api/payments/mercadopago/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId }),
      });

      const { initPoint } = await response.json();
      
      // Redirecionar para Mercado Pago
      window.location.href = initPoint;
    } catch (error) {
      console.error('Mercado Pago checkout error:', error);
      throw error;
    }
  }

  // PagSeguro Integration
  async createPagSeguroCheckout(planId: string, userId: string) {
    try {
      const response = await fetch('/api/payments/pagseguro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userId }),
      });

      const { checkoutUrl } = await response.json();
      
      // Redirecionar para PagSeguro
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('PagSeguro checkout error:', error);
      throw error;
    }
  }

  // Verificar status da assinatura
  async checkSubscriptionStatus(userId: string) {
    try {
      const response = await fetch(`/api/payments/subscription/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Subscription check error:', error);
      return { active: false, plan: 'free' };
    }
  }

  // Cancelar assinatura
  async cancelSubscription(userId: string) {
    try {
      const response = await fetch(`/api/payments/subscription/${userId}/cancel`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  // Simular pagamento (para desenvolvimento)
  async simulatePayment(planId: string, userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = {
          userId,
          planId,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        
        localStorage.setItem(`subscription-${userId}`, JSON.stringify(subscription));
        resolve(subscription);
      }, 2000);
    });
  }

  // Verificar se usuário é premium
  isPremium(userId: string): boolean {
    const stored = localStorage.getItem(`subscription-${userId}`);
    if (!stored) return false;

    const subscription = JSON.parse(stored);
    return subscription.status === 'active' && 
           subscription.planId !== 'free' &&
           new Date(subscription.endDate) > new Date();
  }
}

export const payments = new PaymentService();

// Sistema de Comissões
export type Commission = {
  id: string;
  planId: string;
  operadora: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
};

export class CommissionService {
  // Rastrear conversão (quando usuário clica em "Contratar")
  async trackConversion(planId: string, userId: string) {
    const commission: Commission = {
      id: Math.random().toString(36).substr(2, 9),
      planId,
      operadora: this.getOperadoraFromPlanId(planId),
      userId,
      amount: this.calculateCommission(planId),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Salvar localmente
    const commissions = this.getCommissions();
    commissions.push(commission);
    localStorage.setItem('planocerto-commissions', JSON.stringify(commissions));

    // Enviar para backend
    try {
      await fetch('/api/commissions/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commission),
      });
    } catch (error) {
      console.error('Failed to track commission:', error);
    }

    return commission;
  }

  private calculateCommission(planId: string): number {
    // Comissão baseada no plano (exemplo: 10% do valor mensal)
    const commissionRates: Record<string, number> = {
      'unimed-mei': 24.50,
      'hapvida-essencial': 15.90,
      'bradesco-top': 48.90,
      'sulamerica-exato': 29.90,
      'amil-mei': 18.90,
      'notredame-smart': 21.90,
    };

    return commissionRates[planId] || 20.00;
  }

  private getOperadoraFromPlanId(planId: string): string {
    const operadoras: Record<string, string> = {
      'unimed-mei': 'Unimed',
      'hapvida-essencial': 'Hapvida',
      'bradesco-top': 'Bradesco',
      'sulamerica-exato': 'SulAmérica',
      'amil-mei': 'Amil',
      'notredame-smart': 'NotreDame',
    };

    return operadoras[planId] || 'Desconhecida';
  }

  getCommissions(): Commission[] {
    const stored = localStorage.getItem('planocerto-commissions');
    return stored ? JSON.parse(stored) : [];
  }

  getTotalCommissions(): number {
    return this.getCommissions()
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
  }

  getPendingCommissions(): number {
    return this.getCommissions()
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
  }
}

export const commissions = new CommissionService();
