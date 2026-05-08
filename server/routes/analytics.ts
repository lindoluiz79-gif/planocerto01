import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

// Track event
router.post('/track', async (req, res) => {
  try {
    const { userId, eventType, eventData } = req.body;

    await db.query(
      'INSERT INTO analytics_events (user_id, event_type, event_data, created_at) VALUES ($1, $2, $3, $4)',
      [userId || null, eventType, JSON.stringify(eventData), new Date()]
    );

    res.json({ success: true });
  } catch (error: any) {
    console.error('Track event error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analytics stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await db.query(`
      SELECT 
        event_type,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM analytics_events
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY event_type, DATE(created_at)
      ORDER BY date DESC
    `, [startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate || new Date()]);

    res.json({ stats: stats.rows });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
