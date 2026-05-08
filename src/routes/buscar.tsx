import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { PlanCard } from "@/components/PlanCard";
import { PlanCardSkeleton } from "@/components/Skeleton";
import { AdBanner } from "@/components/AdBanner";
import { ESTADOS, PLANS, CIDADES_POR_ESTADO } from "@/data/plans";
import { Filter, X, Bookmark } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { savedFilters } from "@/lib/saved-filters";
import { toast } from "sonner";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar planos por preço — PlanoCerto" },
      { name: "description", content: "Filtre planos de saúde MEI pelo seu orçamento mensal." },
    ],
  }),
  component: BuscarPage,
});

function BuscarPage() {
  const [idade, setIdade] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("SP");
  const [orcamento, setOrcamento] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [modoDigitacao, setModoDigitacao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();
  
  // Filtros avançados
  const [operadoraSelecionada, setOperadoraSelecionada] = useState("todas");
  const [precisaOdonto, setPrecisaOdonto] = useState(false);
  const [precisaDependentes, setPrecisaDependentes] = useState(false);
  const [ordenacao, setOrdenacao] = useState<"preco" | "avaliacao" | "popularidade">("preco");

  // Obter cidades do estado selecionado
  const cidadesDisponiveis = CIDADES_POR_ESTADO[estado] || [];
  
  // Quando muda o estado, limpa a cidade se não estiver na lista
  const handleEstadoChange = (novoEstado: string) => {
    setEstado(novoEstado);
    const cidadesNovoEstado = CIDADES_POR_ESTADO[novoEstado] || [];
    if (!cidadesNovoEstado.includes(cidade) && !modoDigitacao) {
      setCidade("");
    }
  };

  const max = Number(orcamento);
  
  // Calcular resultados em tempo real
  const resultados = useMemo(() => {
    if (!submitted) return [];
    
    let filtered = PLANS.filter((p) => {
      if (max && p.precoMensal > max) return false;
      if (operadoraSelecionada !== "todas" && p.operadora !== operadoraSelecionada) return false;
      if (precisaOdonto && !p.cobreOdonto) return false;
      if (precisaDependentes && !p.cobreDependentes) return false;
      return true;
    });

    // Ordenação
    if (ordenacao === "preco") {
      filtered = filtered.sort((a, b) => a.precoMensal - b.precoMensal);
    } else if (ordenacao === "avaliacao") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (ordenacao === "popularidade") {
      filtered = filtered.sort((a, b) => b.popularidade - a.popularidade);
    }
    
    return filtered;
  }, [submitted, max, operadoraSelecionada, precisaOdonto, precisaDependentes, ordenacao]);

  const operadoras = ["todas", ...Array.from(new Set(PLANS.map(p => p.operadora)))];
  
  // Contar filtros ativos
  const filtrosAtivos = [
    operadoraSelecionada !== "todas",
    precisaOdonto,
    precisaDependentes,
  ].filter(Boolean).length;

  const handleSaveFilter = () => {
    if (!user) {
      toast.error("Você precisa estar logado para salvar filtros");
      return;
    }

    const filterName = prompt("Nome do filtro:");
    if (!filterName) return;

    savedFilters.createFilter(user.id, filterName, {
      idade,
      cidade,
      estado,
      orcamento,
      operadora: operadoraSelecionada,
      precisaOdonto,
      precisaDependentes,
      ordenacao,
    });

    toast.success("Filtro salvo com sucesso!");
  };

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Buscar por preço</h1>
        <p className="text-sm text-muted-foreground mt-1">Informe seus dados e seu orçamento mensal.</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          // Simular delay de busca
          setTimeout(() => {
            setSubmitted(true);
            setIsLoading(false);
          }, 800);
        }}
        className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-card)] space-y-4"
      >
        <Field label="Idade">
          <input type="number" required min={0} max={120} value={idade} onChange={(e) => setIdade(e.target.value)} className="input" />
        </Field>
        <Field label="Estado">
          <select value={estado} onChange={(e) => handleEstadoChange(e.target.value)} className="input">
            {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </Field>
        <Field label="Cidade">
          <div className="space-y-2">
            {!modoDigitacao ? (
              <>
                <select 
                  value={cidade} 
                  onChange={(e) => setCidade(e.target.value)} 
                  className="input"
                  required
                >
                  <option value="">Selecione uma cidade</option>
                  {cidadesDisponiveis.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setModoDigitacao(true);
                    setCidade("");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Minha cidade não está na lista
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  required 
                  value={cidade} 
                  onChange={(e) => setCidade(e.target.value)} 
                  className="input" 
                  placeholder="Digite o nome da sua cidade" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setModoDigitacao(false);
                    setCidade("");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  ← Voltar para seleção
                </button>
              </>
            )}
          </div>
        </Field>
        <Field label="Orçamento mensal máximo (R$)">
          <input type="number" required min={0} value={orcamento} onChange={(e) => setOrcamento(e.target.value)} className="input" placeholder="Ex: 300" />
        </Field>
        <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar planos"}
        </button>
      </form>

      {isLoading && (
        <div className="mt-6 space-y-4">
          <PlanCardSkeleton />
          <PlanCardSkeleton />
          <PlanCardSkeleton />
        </div>
      )}

      {submitted && !isLoading && (
        <>
          {/* Resumo da busca */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔍</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Buscando planos para você</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md">
                    👤 {idade} anos
                  </span>
                  <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md">
                    📍 {cidade}, {estado}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md">
                    💰 Até R$ {Number(orcamento).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-secondary p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Filtros avançados</h3>
                {filtrosAtivos > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                    {filtrosAtivos}
                  </span>
                )}
              </div>
              {filtrosAtivos > 0 && (
                <button
                  onClick={() => {
                    setOperadoraSelecionada("todas");
                    setPrecisaOdonto(false);
                    setPrecisaDependentes(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Limpar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Operadora</label>
                <select 
                  value={operadoraSelecionada} 
                  onChange={(e) => setOperadoraSelecionada(e.target.value)}
                  className="input"
                >
                  {operadoras.map(op => (
                    <option key={op} value={op}>
                      {op === "todas" ? "Todas as operadoras" : op}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ordenar por</label>
                <select 
                  value={ordenacao} 
                  onChange={(e) => setOrdenacao(e.target.value as any)}
                  className="input"
                >
                  <option value="preco">💰 Menor preço</option>
                  <option value="avaliacao">⭐ Melhor avaliação</option>
                  <option value="popularidade">🔥 Mais escolhido</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={precisaOdonto}
                  onChange={(e) => setPrecisaOdonto(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  🦷 Cobertura odontológica
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={precisaDependentes}
                  onChange={(e) => setPrecisaDependentes(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  👨‍👩‍👧‍👦 Aceita dependentes
                </span>
              </label>
            </div>
          </div>

          <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {resultados.length > 0 ? (
                  <>
                    <span className="text-primary">{resultados.length}</span> plano{resultados.length === 1 ? "" : "s"} encontrado{resultados.length === 1 ? "" : "s"}
                  </>
                ) : (
                  "Nenhum plano encontrado"
                )}
              </h2>
              <div className="flex items-center gap-2">
                {resultados.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {ordenacao === "preco" && "Ordenado por preço"}
                    {ordenacao === "avaliacao" && "Ordenado por avaliação"}
                    {ordenacao === "popularidade" && "Ordenado por popularidade"}
                  </span>
                )}
                {user && (
                  <button
                    onClick={handleSaveFilter}
                    className="flex items-center gap-1 text-xs bg-secondary text-foreground px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                    title="Salvar este filtro"
                  >
                    <Bookmark className="w-3 h-3" />
                    <span className="hidden sm:inline">Salvar</span>
                  </button>
                )}
              </div>
            </div>
            
            <AdBanner />
            
            {resultados.length === 0 && (
              <div className="text-center py-12 bg-secondary rounded-xl animate-in fade-in duration-300">
                <div className="text-4xl mb-3">😔</div>
                <p className="text-foreground font-semibold mb-2">Nenhum plano encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros ou aumentar o orçamento máximo
                </p>
              </div>
            )}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {resultados.map((p, index) => (
                <div 
                  key={p.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <PlanCard plan={p} />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
