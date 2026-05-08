import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth";
import { savedFilters, SUGGESTED_FILTERS, type SavedFilter } from "@/lib/saved-filters";
import { Bookmark, Trash2, Play, Copy, Share2, TrendingUp, Clock, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/filtros-salvos")({
  head: () => ({
    meta: [
      { title: "Filtros Salvos — PlanoCerto" },
      { name: "description", content: "Gerencie seus filtros de busca salvos" },
    ],
  }),
  component: FiltrosSalvosPage,
});

function FiltrosSalvosPage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    loadFilters();
  }, [user]);

  const loadFilters = () => {
    if (!user) return;
    setFilters(savedFilters.getFilters(user.id));
    setStats(savedFilters.getStats(user.id));
  };

  const handleDelete = (filterId: string) => {
    if (confirm("Tem certeza que deseja excluir este filtro?")) {
      savedFilters.deleteFilter(filterId);
      loadFilters();
      toast.success("Filtro excluído!");
    }
  };

  const handleUse = (filter: SavedFilter) => {
    savedFilters.useFilter(filter.id);
    
    // Construir URL com parâmetros
    const params = new URLSearchParams();
    if (filter.filters.idade) params.set('idade', filter.filters.idade);
    if (filter.filters.cidade) params.set('cidade', filter.filters.cidade);
    if (filter.filters.estado) params.set('estado', filter.filters.estado);
    if (filter.filters.orcamento) params.set('orcamento', filter.filters.orcamento);
    if (filter.filters.operadora) params.set('operadora', filter.filters.operadora);
    if (filter.filters.precisaOdonto) params.set('odonto', 'true');
    if (filter.filters.precisaDependentes) params.set('dependentes', 'true');
    if (filter.filters.ordenacao) params.set('ordem', filter.filters.ordenacao);
    
    navigate({ to: `/buscar?${params.toString()}` });
  };

  const handleDuplicate = (filter: SavedFilter) => {
    const newName = prompt("Nome do novo filtro:", `${filter.name} (cópia)`);
    if (newName) {
      savedFilters.duplicateFilter(filter.id, newName);
      loadFilters();
      toast.success("Filtro duplicado!");
    }
  };

  const handleShare = (filter: SavedFilter) => {
    const encoded = savedFilters.exportFilter(filter.id);
    const shareUrl = `${window.location.origin}/filtros-salvos?import=${encoded}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copiado! Compartilhe com seus amigos.");
  };

  const handleCreateSuggested = (suggested: typeof SUGGESTED_FILTERS[0]) => {
    if (!user) return;
    savedFilters.createFilter(user.id, suggested.name, suggested.filters);
    loadFilters();
    toast.success(`Filtro "${suggested.name}" criado!`);
  };

  if (!user) {
    return null;
  }

  const mostUsed = savedFilters.getMostUsedFilters(user.id, 3);
  const recent = savedFilters.getRecentFilters(user.id, 3);

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Filtros Salvos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Salve suas buscas favoritas para acesso rápido
        </p>
      </header>

      {/* Estatísticas */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Filtros salvos</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalUses}</div>
            <div className="text-xs text-muted-foreground">Usos totais</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.avgUsesPerFilter.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Média de usos</div>
          </div>
        </div>
      )}

      {/* Filtros Sugeridos */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filtros Sugeridos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTED_FILTERS.map((suggested) => {
            const alreadyExists = filters.some(f => f.name === suggested.name);
            return (
              <div
                key={suggested.name}
                className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{suggested.name}</h3>
                  {alreadyExists && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Salvo
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {suggested.filters.orcamento && `Até R$ ${suggested.filters.orcamento}`}
                  {suggested.filters.precisaOdonto && " • Com Odonto"}
                  {suggested.filters.precisaDependentes && " • Com Dependentes"}
                </div>
                {!alreadyExists && (
                  <button
                    onClick={() => handleCreateSuggested(suggested)}
                    className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Salvar este filtro
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mais Usados */}
      {mostUsed.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Mais Usados</h2>
          </div>
          <div className="space-y-2">
            {mostUsed.map((filter) => (
              <FilterCard
                key={filter.id}
                filter={filter}
                onUse={handleUse}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recentes */}
      {recent.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Usados Recentemente</h2>
          </div>
          <div className="space-y-2">
            {recent.map((filter) => (
              <FilterCard
                key={filter.id}
                filter={filter}
                onUse={handleUse}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Todos os Filtros */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bookmark className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Todos os Filtros</h2>
        </div>

        {filters.length === 0 ? (
          <div className="text-center py-12 bg-secondary rounded-xl">
            <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-foreground font-semibold mb-2">Nenhum filtro salvo</p>
            <p className="text-sm text-muted-foreground mb-4">
              Salve seus filtros favoritos para acesso rápido
            </p>
            <Link
              to="/buscar"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Ir para Busca
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filters.map((filter) => (
              <FilterCard
                key={filter.id}
                filter={filter}
                onUse={handleUse}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FilterCard({
  filter,
  onUse,
  onDelete,
  onDuplicate,
  onShare,
}: {
  filter: SavedFilter;
  onUse: (filter: SavedFilter) => void;
  onDelete: (id: string) => void;
  onDuplicate: (filter: SavedFilter) => void;
  onShare: (filter: SavedFilter) => void;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{filter.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            {filter.filters.orcamento && (
              <span className="bg-secondary px-2 py-1 rounded">
                💰 Até R$ {filter.filters.orcamento}
              </span>
            )}
            {filter.filters.estado && (
              <span className="bg-secondary px-2 py-1 rounded">
                📍 {filter.filters.estado}
              </span>
            )}
            {filter.filters.operadora && filter.filters.operadora !== 'todas' && (
              <span className="bg-secondary px-2 py-1 rounded">
                🏥 {filter.filters.operadora}
              </span>
            )}
            {filter.filters.precisaOdonto && (
              <span className="bg-secondary px-2 py-1 rounded">🦷 Odonto</span>
            )}
            {filter.filters.precisaDependentes && (
              <span className="bg-secondary px-2 py-1 rounded">👨‍👩‍👧‍👦 Dependentes</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {filter.useCount} {filter.useCount === 1 ? 'uso' : 'usos'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onUse(filter)}
          className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4" />
          Usar
        </button>
        <button
          onClick={() => onDuplicate(filter)}
          className="p-2 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors"
          title="Duplicar"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onShare(filter)}
          className="p-2 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors"
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(filter.id)}
          className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {filter.lastUsed && (
        <div className="mt-2 text-xs text-muted-foreground">
          Último uso: {new Date(filter.lastUsed).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
}
