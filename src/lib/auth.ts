// Sistema de autenticação simples
export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('planocerto-user');
  return stored ? JSON.parse(stored) : null;
}

export function signup(email: string, name: string, password: string): User {
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    createdAt: new Date().toISOString(),
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('planocerto-user', JSON.stringify(user));
    localStorage.setItem('planocerto-password-hash', btoa(password)); // Não fazer em produção!
  }
  
  return user;
}

export function login(email: string, password: string): User | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('planocerto-user');
  if (!stored) return null;
  
  const user = JSON.parse(stored);
  const storedPassword = localStorage.getItem('planocerto-password-hash');
  
  if (user.email === email && storedPassword === btoa(password)) {
    return user;
  }
  
  return null;
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('planocerto-user');
  localStorage.removeItem('planocerto-password-hash');
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Sincronizar dados na nuvem (simulado com localStorage)
export function syncUserData() {
  if (typeof window === 'undefined') return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  const userData = {
    favorites: localStorage.getItem('planocerto-favorites'),
    history: localStorage.getItem('planocerto-history'),
    comparison: localStorage.getItem('planocerto-comparison'),
    theme: localStorage.getItem('planocerto-theme'),
    priceAlerts: localStorage.getItem('planocerto-price-alerts'),
    lastSync: new Date().toISOString(),
  };
  
  localStorage.setItem(`planocerto-sync-${user.id}`, JSON.stringify(userData));
}

export function restoreUserData() {
  if (typeof window === 'undefined') return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  const stored = localStorage.getItem(`planocerto-sync-${user.id}`);
  if (!stored) return;
  
  const userData = JSON.parse(stored);
  
  if (userData.favorites) localStorage.setItem('planocerto-favorites', userData.favorites);
  if (userData.history) localStorage.setItem('planocerto-history', userData.history);
  if (userData.comparison) localStorage.setItem('planocerto-comparison', userData.comparison);
  if (userData.theme) localStorage.setItem('planocerto-theme', userData.theme);
  if (userData.priceAlerts) localStorage.setItem('planocerto-price-alerts', userData.priceAlerts);
}
