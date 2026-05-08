// Testes para sistema de favoritos
// Para rodar: npm test (após configurar Jest/Vitest)

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getFavorites, 
  toggleFavorite, 
  isFavorite,
  getHistory,
  addToHistory 
} from '../favorites';

describe('Favorites System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getFavorites', () => {
    it('should return empty array when no favorites', () => {
      const favorites = getFavorites();
      expect(favorites).toEqual([]);
    });

    it('should return stored favorites', () => {
      localStorage.setItem('planocerto-favorites', JSON.stringify(['plan-1', 'plan-2']));
      const favorites = getFavorites();
      expect(favorites).toEqual(['plan-1', 'plan-2']);
    });
  });

  describe('toggleFavorite', () => {
    it('should add plan to favorites', () => {
      const added = toggleFavorite('plan-1');
      expect(added).toBe(true);
      expect(getFavorites()).toContain('plan-1');
    });

    it('should remove plan from favorites', () => {
      toggleFavorite('plan-1');
      const removed = toggleFavorite('plan-1');
      expect(removed).toBe(false);
      expect(getFavorites()).not.toContain('plan-1');
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorited plan', () => {
      toggleFavorite('plan-1');
      expect(isFavorite('plan-1')).toBe(true);
    });

    it('should return false for non-favorited plan', () => {
      expect(isFavorite('plan-1')).toBe(false);
    });
  });

  describe('History', () => {
    it('should add plan to history', () => {
      addToHistory('plan-1');
      expect(getHistory()).toContain('plan-1');
    });

    it('should limit history to 10 items', () => {
      for (let i = 0; i < 15; i++) {
        addToHistory(`plan-${i}`);
      }
      expect(getHistory().length).toBe(10);
    });

    it('should move recent item to top', () => {
      addToHistory('plan-1');
      addToHistory('plan-2');
      addToHistory('plan-1');
      const history = getHistory();
      expect(history[0]).toBe('plan-1');
    });
  });
});
