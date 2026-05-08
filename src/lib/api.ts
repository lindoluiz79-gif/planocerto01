// API Client - Estrutura pronta para backend real
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth-token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      // Fallback para dados locais em caso de erro
      return this.getFallbackData<T>(endpoint);
    }
  }

  private getFallbackData<T>(endpoint: string): T {
    // Retorna dados do localStorage como fallback
    const localData = localStorage.getItem(`cache-${endpoint}`);
    if (localData) {
      return JSON.parse(localData);
    }
    throw new Error('No data available');
  }

  // Plans
  async getPlans(filters?: any) {
    return this.request('/plans', {
      method: 'GET',
      ...(filters && { body: JSON.stringify(filters) }),
    });
  }

  async getPlan(id: string) {
    return this.request(`/plans/${id}`, { method: 'GET' });
  }

  // Reviews
  async getReviews(planId: string) {
    return this.request(`/plans/${planId}/reviews`, { method: 'GET' });
  }

  async createReview(planId: string, review: any) {
    return this.request(`/plans/${planId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = response.token;
    localStorage.setItem('auth-token', response.token);
    return response;
  }

  async signup(data: any) {
    const response = await this.request<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.token = response.token;
    localStorage.setItem('auth-token', response.token);
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth-token');
  }

  // User data sync
  async syncUserData(data: any) {
    return this.request('/user/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserData() {
    return this.request('/user/data', { method: 'GET' });
  }

  // Analytics
  async trackEvent(event: string, data: any) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, data }),
    });
  }

  // Newsletter
  async subscribeNewsletter(email: string) {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Price alerts
  async createPriceAlert(planId: string, targetPrice: number) {
    return this.request('/alerts/price', {
      method: 'POST',
      body: JSON.stringify({ planId, targetPrice }),
    });
  }

  // CEP lookup
  async lookupCEP(cep: string) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      return await response.json();
    } catch (error) {
      console.error('CEP lookup failed:', error);
      return null;
    }
  }
}

export const api = new APIClient();
