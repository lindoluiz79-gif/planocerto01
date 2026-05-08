import express from 'express';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

// Initialize payment providers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

// Stripe Checkout
router.post('/stripe/checkout', authenticateToken, async (req, res) => {
  try {
    const { planId, userId } = req.body;

    // Get plan details
    const plans: Record<string, any> = {
      'premium': {
        name: 'Premium Mensal',
        price: 1990, // em centavos
        interval: 'month',
      },
      'premium-yearly': {
        name: 'Premium Anual',
        price: 19990,
        interval: 'year',
      },
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.name,
              description: 'Assinatura PlanoCerto Premium',
            },
            unit_amount: plan.price,
            recurring: {
              interval: plan.interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.VITE_APP_URL}/payment-success?plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/payment-cancel`,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mercado Pago Checkout
router.post('/mercadopago/checkout', authenticateToken, async (req, res) => {
  try {
    const { planId, userId } = req.body;

    const plans: Record<string, any> = {
      'premium': {
        title: 'Premium Mensal',
        price: 19.90,
      },
      'premium-yearly': {
        title: 'Premium Anual',
        price: 199.90,
      },
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    const preference = new Preference(mercadopago);
    
    const result = await preference.create({
      body: {
        items: [
          {
            title: plan.title,
            description: 'Assinatura PlanoCerto Premium',
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${process.env.VITE_APP_URL}/payment-success?plan=${planId}`,
          failure: `${process.env.VITE_APP_URL}/payment-cancel`,
          pending: `${process.env.VITE_APP_URL}/payment-pending`,
        },
        auto_return: 'approved',
        external_reference: userId,
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      },
    });

    res.json({ initPoint: result.init_point, preferenceId: result.id });
  } catch (error: any) {
    console.error('Mercado Pago checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PagSeguro Checkout
router.post('/pagseguro/checkout', authenticateToken, async (req, res) => {
  try {
    const { planId, userId } = req.body;

    // PagSeguro implementation
    // Nota: PagSeguro requer biblioteca específica ou chamadas HTTP diretas
    
    res.json({ 
      checkoutUrl: `https://pagseguro.uol.com.br/checkout/...`,
      message: 'PagSeguro integration - implementar conforme documentação',
    });
  } catch (error: any) {
    console.error('PagSeguro checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
router.get('/subscription/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Query database for subscription
    const subscription = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.json({ active: false, plan: 'free' });
    }

    const sub = subscription.rows[0];
    const now = new Date();
    const endDate = new Date(sub.end_date);

    if (endDate < now) {
      return res.json({ active: false, plan: 'free' });
    }

    res.json({
      active: true,
      plan: sub.plan_id,
      startDate: sub.start_date,
      endDate: sub.end_date,
      status: sub.status,
    });
  } catch (error: any) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/subscription/:userId/cancel', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get active subscription
    const subscription = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT 1',
      [userId, 'active']
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    const sub = subscription.rows[0];

    // Cancel on payment provider
    if (sub.provider === 'stripe' && sub.provider_subscription_id) {
      await stripe.subscriptions.cancel(sub.provider_subscription_id);
    }

    // Update database
    await db.query(
      'UPDATE subscriptions SET status = $1, cancelled_at = $2 WHERE id = $3',
      ['cancelled', new Date(), sub.id]
    );

    res.json({ 
      success: true, 
      message: 'Assinatura cancelada com sucesso',
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
