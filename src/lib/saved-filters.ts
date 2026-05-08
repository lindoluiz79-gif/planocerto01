// Sistema de Filtros Salvos

export type SavedFilter = {
  id: string;
  userId: string;
  name: string;
  filters: {
    idade?: string;
    cidade?: string;
    estado?: string;
    orcamento?: string;
    operadora?: string;
    precisaOdonto?: boolean;
    precisaDependentes?: boolean;
    ordenacao?: 'preco' | 'avaliacao' | 'popularidade';
  };
  createdAt: string;
  lastUsed?: string;
  useCount: number;
};

class SavedFiltersService {
  private readonly STORAGE_KEY = 'planocerto-saved-filters';

  // Criar filtro salvo
  createFilter(userId: string, name: string, filters: SavedFilter['filters']): SavedFilter {
    const filter: SavedFilter = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name,
      filters,
      createdAt: new Date().toISOString(),
      useCount: 0,
    };

    const saved = this.getFilters(userId);
    saved.push(filter);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));

    return filter;
  }

  // Obter todos os filtros do usuário
  getFilters(userId: string): SavedFilter[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    const all: SavedFilter[] = JSON.parse(stored);
    return all.filter(f => f.userId === userId);
  }

  // Obter filtro por ID
  getFilter(filterId: string): SavedFilter | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    const all: SavedFilter[] = JSON.parse(stored);
    return all.find(f => f.id === filterId) || null;
  }

  // Atualizar filtro
  updateFilter(filterId: string, updates: Partial<SavedFilter>): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return;

    const all: SavedFilter[] = JSON.parse(stored);
    const filter = all.find(f => f.id === filterId);
    
    if (filter) {
      Object.assign(filter, updates);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
  }

  // Deletar filtro
  deleteFilter(filterId: string): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return;

    const all: SavedFilter[] = JSON.parse(stored);
    const filtered = all.filter(f => f.id !== filterId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // Usar filtro (incrementa contador e atualiza lastUsed)
  useFilter(filterId: string): SavedFilter | null {
    const filter = this.getFilter(filterId);
    if (!filter) return null;

    this.updateFilter(filterId, {
      lastUsed: new Date().toISOString(),
      useCount: filter.useCount + 1,
    });

    return this.getFilter(filterId);
  }

  // Obter filtros mais usados
  getMostUsedFilters(userId: string, limit = 5): SavedFilter[] {
    const filters = this.getFilters(userId);
    return filters
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }

  // Obter filtros recentes
  getRecentFilters(userId: string, limit = 5): SavedFilter[] {
    const filters = this.getFilters(userId);
    return filters
      .filter(f => f.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      .slice(0, limit);
  }

  // Duplicar filtro
  duplicateFilter(filterId: string, newName: string): SavedFilter | null {
    const original = this.getFilter(filterId);
    if (!original) return null;

    return this.createFilter(original.userId, newName, { ...original.filters });
  }

  // Exportar filtros (para compartilhar)
  exportFilter(filterId: string): string {
    const filter = this.getFilter(filterId);
    if (!filter) return '';

    const exportData = {
      name: filter.name,
      filters: filter.filters,
    };

    return btoa(JSON.stringify(exportData));
  }

  // Importar filtro (de link compartilhado)
  importFilter(userId: string, encodedData: string): SavedFilter | null {
    try {
      const decoded = JSON.parse(atob(encodedData));
      return this.createFilter(userId, decoded.name, decoded.filters);
    } catch {
      return null;
    }
  }

  // Limpar filtros antigos (não usados há mais de 90 dias)
  cleanOldFilters(userId: string): number {
    const filters = this.getFilters(userId);
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    
    let removed = 0;
    filters.forEach(filter => {
      const lastUsedDate = filter.lastUsed ? new Date(filter.lastUsed).getTime() : new Date(filter.createdAt).getTime();
      
      if (lastUsedDate < ninetyDaysAgo && filter.useCount === 0) {
        this.deleteFilter(filter.id);
        removed++;
      }
    });

    return removed;
  }

  // Obter estatísticas
  getStats(userId: string) {
    const filters = this.getFilters(userId);
    const totalUses = filters.reduce((sum, f) => sum + f.useCount, 0);
    const mostUsed = filters.reduce((max, f) => f.useCount > max.useCount ? f : max, filters[0]);

    return {
      total: filters.length,
      totalUses,
      mostUsed: mostUsed || null,
      avgUsesPerFilter: filters.length > 0 ? totalUses / filters.length : 0,
    };
  }
}

export const savedFilters = new SavedFiltersService();

// Filtros sugeridos (pré-definidos)
export const SUGGESTED_FILTERS: Omit<SavedFilter, 'id' | 'userId' | 'createdAt' | 'useCount'>[] = [
  {
    name: 'MEI Econômico',
    filters: {
      orcamento: '200',
      operadora: 'todas',
      precisaOdonto: false,
      precisaDependentes: false,
      ordenacao: 'preco',
    },
  },
  {
    name: 'Família Completa',
    filters: {
      orcamento: '500',
      operadora: 'todas',
      precisaOdonto: true,
      precisaDependentes: true,
      ordenacao: 'avaliacao',
    },
  },
  {
    name: 'Melhor Avaliado',
    filters: {
      operadora: 'todas',
      precisaOdonto: false,
      precisaDependentes: false,
      ordenacao: 'avaliacao',
    },
  },
  {
    name: 'Mais Popular',
    filters: {
      operadora: 'todas',
      precisaOdonto: false,
      precisaDependentes: false,
      ordenacao: 'popularidade',
    },
  },
  {
    name: 'Com Odonto',
    filters: {
      orcamento: '300',
      operadora: 'todas',
      precisaOdonto: true,
      precisaDependentes: false,
      ordenacao: 'preco',
    },
  },
];
