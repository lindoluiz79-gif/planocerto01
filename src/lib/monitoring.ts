// Sistema de Monitoramento e Logs
// Em produção, integrar com Sentry, LogRocket, etc.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
  userAgent?: string;
  url?: string;
};

export class MonitoringService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sentryDSN?: string;

  constructor(sentryDSN?: string) {
    this.sentryDSN = sentryDSN;
    this.setupErrorHandlers();
  }

  private setupErrorHandlers() {
    // Capturar erros não tratados
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Capturar promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        reason: event.reason,
      });
    });

    // Capturar erros de recursos
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.warn('Resource loading error', {
          target: (event.target as any)?.src || (event.target as any)?.href,
        });
      }
    }, true);
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (level === 'error' && data?.error) {
      entry.stack = data.error.stack;
    }

    this.logs.push(entry);

    // Limitar tamanho do array
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console
    const consoleMethod = level === 'debug' ? 'log' : level;
    console[consoleMethod](`[${level.toUpperCase()}]`, message, data);

    // Enviar para servidor em produção
    if (level === 'error' || level === 'warn') {
      this.sendToServer(entry);
    }

    // Salvar localmente
    this.saveToLocalStorage();
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  private async sendToServer(entry: LogEntry) {
    try {
      // Em produção, enviar para Sentry, LogRocket, etc.
      if (this.sentryDSN) {
        // await fetch(this.sentryDSN, {
        //   method: 'POST',
        //   body: JSON.stringify(entry),
        // });
      }

      // Ou para seu próprio backend
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      const recentLogs = this.logs.slice(-100); // Últimos 100
      localStorage.setItem('planocerto-logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to save logs to localStorage:', error);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('planocerto-logs');
  }

  // Métricas de performance
  trackPageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaint = timing.responseStart - timing.navigationStart;

      this.info('Page load metrics', {
        loadTime,
        domReady,
        firstPaint,
        url: window.location.href,
      });
    }
  }

  // Rastreamento de usuário
  trackUser(userId: string, userData?: any) {
    this.info('User identified', {
      userId,
      ...userData,
    });
  }

  // Rastreamento de eventos customizados
  trackEvent(eventName: string, properties?: any) {
    this.info(`Event: ${eventName}`, properties);
  }

  // Breadcrumbs (rastro de ações do usuário)
  private breadcrumbs: Array<{ timestamp: string; message: string; data?: any }> = [];

  addBreadcrumb(message: string, data?: any) {
    this.breadcrumbs.push({
      timestamp: new Date().toISOString(),
      message,
      data,
    });

    // Limitar a 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs.shift();
    }
  }

  getBreadcrumbs() {
    return [...this.breadcrumbs];
  }

  // Relatório de erro completo
  captureException(error: Error, context?: any) {
    this.error('Exception captured', {
      error,
      message: error.message,
      stack: error.stack,
      context,
      breadcrumbs: this.getBreadcrumbs(),
    });
  }

  // Health check
  async checkHealth() {
    const health = {
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit,
      } : null,
      storage: {
        localStorage: this.getStorageSize('localStorage'),
        sessionStorage: this.getStorageSize('sessionStorage'),
      },
      errors: this.getLogs('error').length,
      warnings: this.getLogs('warn').length,
    };

    this.info('Health check', health);
    return health;
  }

  private getStorageSize(storage: 'localStorage' | 'sessionStorage'): number {
    let size = 0;
    const store = window[storage];
    for (const key in store) {
      if (store.hasOwnProperty(key)) {
        size += store[key].length + key.length;
      }
    }
    return size;
  }
}

export const monitoring = new MonitoringService();

// Inicializar monitoramento
export function initMonitoring() {
  // Rastrear carregamento da página
  if (document.readyState === 'complete') {
    monitoring.trackPageLoad();
  } else {
    window.addEventListener('load', () => monitoring.trackPageLoad());
  }

  // Rastrear mudanças de rota
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      monitoring.addBreadcrumb('Navigation', {
        from: lastPath,
        to: window.location.pathname,
      });
      lastPath = window.location.pathname;
    }
  }, 1000);

  // Health check periódico
  setInterval(() => {
    monitoring.checkHealth();
  }, 5 * 60 * 1000); // A cada 5 minutos
}
