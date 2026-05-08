// Sistema de tema claro/escuro
export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('planocerto-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  
  // Detecta preferência do sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  if (typeof window === 'undefined') return;
  localStorage.setItem('planocerto-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function toggleTheme(): 'light' | 'dark' {
  const current = getTheme();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

export function initTheme() {
  if (typeof window === 'undefined') return;
  const theme = getTheme();
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
