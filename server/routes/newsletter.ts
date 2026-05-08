import express from 'express';
import { db } from '../db';
import { sendEmail } from '../services/email';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Check if already subscribed
    const existing = await db.query(
      'SELECT * FROM newsletter_subscriptions WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].subscribed) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      } else {
        // Resubscribe
        await db.query(
          'UPDATE newsletter_subscriptions SET subscribed = TRUE, unsubscribed_at = NULL WHERE email = $1',
          [email]
        );
      }
    } else {
      // New subscription
      await db.query(
        'INSERT INTO newsletter_subscriptions (email, name, subscribed, created_at) VALUES ($1, $2, $3, $4)',
        [email, name, true, new Date()]
      );
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: '📧 Bem-vindo à Newsletter do PlanoCerto!',
      html: `
        <h1>Olá${name ? ' ' + name : ''}!</h1>
        <p>Obrigado por se inscrever na nossa newsletter!</p>
        <p>Você receberá:</p>
        <ul>
          <li>✅ Novos planos de saúde</li>
          <li>✅ Dicas para economizar</li>
          <li>✅ Alertas de promoções</li>
          <li>✅ Conteúdo exclusivo</li>
        </ul>
        <p><a href="${process.env.VITE_APP_URL}">Visitar PlanoCerto</a></p>
      `,
    });

    res.json({ 
      success: true, 
      message: 'Inscrição realizada com sucesso!',
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    await db.query(
      'UPDATE newsletter_subscriptions SET subscribed = FALSE, unsubscribed_at = $1 WHERE email = $2',
      [new Date(), email]
    );

    res.json({ 
      success: true, 
      message: 'Inscrição cancelada com sucesso',
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
