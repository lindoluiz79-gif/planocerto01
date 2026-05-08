import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

// Track commission
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { planId, operadora, userId, amount } = req.body;

    // Insert commission
    const result = await db.query(
      `INSERT INTO commissions (plan_id, operadora, user_id, amount, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [planId, operadora, userId, amount, 'pending', new Date()]
    );

    res.json({ 
      success: true, 
      commission: result.rows[0],
    });
  } catch (error: any) {
    console.error('Track commission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all commissions (admin only)
router.get('/list', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM commissions';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      commissions: result.rows,
      total: result.rowCount,
    });
  } catch (error: any) {
    console.error('List commissions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get commission stats (admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_commissions,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_paid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
        SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) as total_cancelled,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as count_paid,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as count_pending,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as count_cancelled
      FROM commissions
    `);

    const byOperadora = await db.query(`
      SELECT 
        operadora,
        COUNT(*) as count,
        SUM(amount) as total,
        AVG(amount) as average
      FROM commissions
      WHERE status = 'paid'
      GROUP BY operadora
      ORDER BY total DESC
    `);

    res.json({
      overall: stats.rows[0],
      byOperadora: byOperadora.rows,
    });
  } catch (error: any) {
    console.error('Commission stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update commission status (admin only)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const result = await db.query(
      'UPDATE commissions SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [status, new Date(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comissão não encontrada' });
    }

    res.json({ 
      success: true, 
      commission: result.rows[0],
    });
  } catch (error: any) {
    console.error('Update commission error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
