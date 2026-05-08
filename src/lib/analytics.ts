// Sistema de analytics simples
export type AnalyticsEvent = {
  event: string;
  timestamp: string;
  data?: any;
};

export function trackEvent(event: string, data?: any) {
  if (typeof window === 'undefined') return;
  
  const analyticsEvent: AnalyticsEvent = {
    event,
    timestamp: new Date().toISOString(),
    data
  };
  
  // Salvar localmente
  const stored = localStorage.getItem('planocerto-analytics');
  const events = stored ? JSON.parse(stored) : [];
  events.push(analyticsEvent);
  
  // Manter apenas últimos 1000 eventos
  if (events.length > 1000) {
    events.shift();
  }
  
  localStorage.setItem('planocerto-analytics', JSON.stringify(events));
  
  // Em produção, enviar para servidor de analytics
  console.log('[Analytics]', event, data);
}

export function trackPageView(path: string) {
  trackEvent('page_view', { path });
}

export function trackPlanView(planId: string, planName: string) {
  trackEvent('plan_view', { planId, planName });
}

export function trackPlanClick(planId: string, planName: string) {
  trackEvent('plan_click', { planId, planName });
}

export function trackSearch(filters: any) {
  trackEvent('search', filters);
}

export function trackFavorite(planId: string, action: 'add' | 'remove') {
  trackEvent('favorite', { planId, action });
}

export function trackComparison(planIds: string[]) {
  trackEvent('comparison', { planIds });
}

export function getAnalytics() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('planocerto-analytics');
  return stored ? JSON.parse(stored) : [];
}

export function getPopularPlans() {
  const events = getAnalytics();
  const planViews: Record<string, number> = {};
  
  events
    .filter((e: AnalyticsEvent) => e.event === 'plan_view')
    .forEach((e: AnalyticsEvent) => {
      const planId = e.data?.planId;
      if (planId) {
        planViews[planId] = (planViews[planId] || 0) + 1;
      }
    });
  
  return Object.entries(planViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
}

export function getConversionRate() {
  const events = getAnalytics();
  const views = events.filter((e: AnalyticsEvent) => e.event === 'plan_view').length;
  const clicks = events.filter((e: AnalyticsEvent) => e.event === 'plan_click').length;
  
  return views > 0 ? (clicks / views) * 100 : 0;
}
