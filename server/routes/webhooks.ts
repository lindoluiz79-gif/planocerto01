import express from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { sendEmail } from '../services/email';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Stripe Webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Create subscription in database
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          const endDate = new Date();
          if (planId === 'premium-yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          await db.query(
            `INSERT INTO subscriptions (user_id, plan_id, status, provider, provider_subscription_id, start_date, end_date, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [userId, planId, 'active', 'stripe', session.subscription, new Date(), endDate, new Date()]
          );

          // Send confirmation email
          const user = await db.query('SELECT email, name FROM users WHERE id = $1', [userId]);
          if (user.rows.length > 0) {
            await sendEmail({
              to: user.rows[0].email,
              subject: '🎉 Bem-vindo ao PlanoCerto Premium!',
              html: `
                <h1>Olá ${user.rows[0].name}!</h1>
                <p>Sua assinatura Premium foi ativada com sucesso!</p>
                <p>Agora você tem acesso a:</p>
                <ul>
                  <li>✅ Alertas de preço ilimitados</li>
                  <li>✅ Comparação ilimitada</li>
                  <li>✅ Consultoria por chat</li>
                  <li>✅ Sem anúncios</li>
                  <li>✅ E muito mais!</li>
                </ul>
                <p><a href="${process.env.VITE_APP_URL}/dashboard">Acessar Dashboard</a></p>
              `,
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await db.query(
          'UPDATE subscriptions SET status = $1 WHERE provider_subscription_id = $2',
          [subscription.status, subscription.id]
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await db.query(
          'UPDATE subscriptions SET status = $1, cancelled_at = $2 WHERE provider_subscription_id = $3',
          ['cancelled', new Date(), subscription.id]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Notify user about payment failure
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mercado Pago Webhook
router.post('/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Fetch payment details from Mercado Pago API
      // Process payment and update subscription
      
      console.log('Mercado Pago payment:', paymentId);
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('Mercado Pago webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PagSeguro Webhook
router.post('/pagseguro', async (req, res) => {
  try {
    const { notificationCode, notificationType } = req.body;

    if (notificationType === 'transaction') {
      // Fetch transaction details from PagSeguro API
      // Process payment and update subscription
      
      console.log('PagSeguro transaction:', notificationCode);
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('PagSeguro webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
