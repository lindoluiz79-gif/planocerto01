// Sistema de Acessibilidade

export class AccessibilityManager {
  private announcer: HTMLElement | null = null;

  constructor() {
    this.createAnnouncer();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }

  // Screen Reader Announcer
  private createAnnouncer() {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.announcer);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.announcer) return;

    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = '';
    
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = message;
      }
    }, 100);
  }

  // Navegação por teclado
  private setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Esc para fechar modais
      if (e.key === 'Escape') {
        this.closeModals();
      }

      // Tab trap em modais
      if (e.key === 'Tab') {
        this.handleTabTrap(e);
      }

      // Atalhos de teclado
      if (e.ctrlKey || e.metaKey) {
        this.handleShortcuts(e);
      }
    });
  }

  private closeModals() {
    // Fechar todos os modais abertos
    const modals = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
    modals.forEach((modal) => {
      const closeButton = modal.querySelector('[aria-label*="fechar"], [aria-label*="close"]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    });
  }

  private handleTabTrap(e: KeyboardEvent) {
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  private handleShortcuts(e: KeyboardEvent) {
    // Ctrl/Cmd + K: Buscar
    if (e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="search"]') as HTMLElement;
      searchInput?.focus();
      this.announce('Campo de busca focado');
    }

    // Ctrl/Cmd + /: Ajuda
    if (e.key === '/') {
      e.preventDefault();
      window.location.href = '/faq';
      this.announce('Navegando para página de ajuda');
    }
  }

  // Gerenciamento de foco
  private setupFocusManagement() {
    // Adicionar indicador de foco visível
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // Verificar contraste de cores
  checkColorContrast(foreground: string, background: string): {
    ratio: number;
    passAA: boolean;
    passAAA: boolean;
  } {
    const ratio = this.calculateContrastRatio(foreground, background);
    return {
      ratio,
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7,
    };
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    // Simplificado - em produção usar biblioteca como chroma.js
    return 0.5;
  }

  // Adicionar labels ARIA
  addAriaLabel(element: HTMLElement, label: string) {
    element.setAttribute('aria-label', label);
  }

  addAriaDescribedBy(element: HTMLElement, descriptionId: string) {
    element.setAttribute('aria-describedby', descriptionId);
  }

  // Gerenciar estados ARIA
  setAriaExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  setAriaPressed(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString());
  }

  setAriaChecked(element: HTMLElement, checked: boolean) {
    element.setAttribute('aria-checked', checked.toString());
  }

  // Navegação por landmarks
  setupLandmarks() {
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }

    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  }

  // Skip links
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `;
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Modo de alto contraste
  enableHighContrast() {
    document.body.classList.add('high-contrast');
    localStorage.setItem('high-contrast', 'true');
    this.announce('Modo de alto contraste ativado');
  }

  disableHighContrast() {
    document.body.classList.remove('high-contrast');
    localStorage.removeItem('high-contrast');
    this.announce('Modo de alto contraste desativado');
  }

  // Tamanho de fonte
  increaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize * 1.1}px`;
    this.announce('Tamanho da fonte aumentado');
  }

  decreaseFontSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize * 0.9}px`;
    this.announce('Tamanho da fonte diminuído');
  }

  resetFontSize() {
    document.documentElement.style.fontSize = '';
    this.announce('Tamanho da fonte restaurado');
  }
}

export const accessibility = new AccessibilityManager();

// CSS para acessibilidade
export const accessibilityStyles = `
  /* Foco visível para navegação por teclado */
  .keyboard-navigation *:focus {
    outline: 3px solid var(--primary);
    outline-offset: 2px;
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Alto contraste */
  .high-contrast {
    filter: contrast(1.5);
  }

  .high-contrast * {
    border-color: currentColor !important;
  }

  /* Skip link */
  .skip-link:focus {
    position: absolute;
    top: 0 !important;
    left: 0;
    z-index: 9999;
  }

  /* Reduzir movimento para usuários sensíveis */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
