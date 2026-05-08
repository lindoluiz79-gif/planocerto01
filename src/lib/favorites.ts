// Sistema de favoritos usando localStorage
export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('planocerto-favorites');
  return stored ? JSON.parse(stored) : [];
}

export function toggleFavorite(planId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(planId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(planId);
  }
  
  localStorage.setItem('planocerto-favorites', JSON.stringify(favorites));
  return index === -1; // retorna true se adicionou
}

export function isFavorite(planId: string): boolean {
  return getFavorites().includes(planId);
}

// Sistema de histórico
export function addToHistory(planId: string) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const filtered = history.filter(id => id !== planId);
  filtered.unshift(planId);
  const limited = filtered.slice(0, 10); // mantém últimos 10
  localStorage.setItem('planocerto-history', JSON.stringify(limited));
}

export function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('planocerto-history');
  return stored ? JSON.parse(stored) : [];
}

// Sistema de comparação
export function getComparison(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('planocerto-comparison');
  return stored ? JSON.parse(stored) : [];
}

export function toggleComparison(planId: string): boolean {
  const comparison = getComparison();
  const index = comparison.indexOf(planId);
  
  if (index > -1) {
    comparison.splice(index, 1);
  } else {
    if (comparison.length >= 3) return false; // máximo 3 planos
    comparison.push(planId);
  }
  
  localStorage.setItem('planocerto-comparison', JSON.stringify(comparison));
  return index === -1;
}

export function clearComparison() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('planocerto-comparison', JSON.stringify([]));
}

export function isInComparison(planId: string): boolean {
  return getComparison().includes(planId);
}
