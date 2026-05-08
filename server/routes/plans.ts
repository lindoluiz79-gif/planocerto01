import express from 'express';
import { PLANS } from '../../src/data/plans';

const router = express.Router();

// Get all plans
router.get('/', (req, res) => {
  try {
    const { operadora, maxPrice, minRating } = req.query;

    let filteredPlans = [...PLANS];

    if (operadora) {
      filteredPlans = filteredPlans.filter(p => p.operadora === operadora);
    }

    if (maxPrice) {
      filteredPlans = filteredPlans.filter(p => p.precoMensal <= Number(maxPrice));
    }

    if (minRating) {
      filteredPlans = filteredPlans.filter(p => p.rating >= Number(minRating));
    }

    res.json({
      plans: filteredPlans,
      total: filteredPlans.length,
    });
  } catch (error: any) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get plan by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const plan = PLANS.find(p => p.id === id);

    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json({ plan });
  } catch (error: any) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get plan reviews
router.get('/:id/reviews', (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, fetch from database
    // For now, return mock data
    res.json({
      reviews: [],
      total: 0,
      averageRating: 0,
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
