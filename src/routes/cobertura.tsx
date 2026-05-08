import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PLANS } from "@/data/plans";
import { PlanCard } from "@/components/PlanCard";
import { MapPin, Search } from "lucide-react";

export const Route = createFileRoute("/cobertura")({
  head: () => ({
    meta: [
      { title: "Cobertura por Região — PlanoCerto" },
      { name: "description", content: "Veja quais planos estão disponíveis na sua região." },
    ],
  }),
  component: CoberturaPage,
});

function CoberturaPage() {
  const [cep, setCep] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // Buscar CEP real usando ViaCEP API
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setLocation({
          cep,
          cidade: 'CEP não encontrado',
          estado: '',
          bairro: ''
        });
      } else {
        setLocation({
          cep,
          cidade: data.localidade,
          estado: data.uf,
          bairro: data.bairro || 'Centro'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setLocation({
        cep,
        cidade: 'Erro ao buscar CEP',
        estado: '',
        bairro: ''
      });
    } finally {
      setLoading(false);
    }
  };

  // Simular disponibilidade por região
  const availablePlans = searched ? PLANS.filter(p => p.recomendadoMei || Math.random() > 0.3) : [];

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Cobertura por Região</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Descubra quais planos estão disponíveis no seu CEP
        </p>
      </header>

      <form onSubmit={handleSearch} className="rounded-2xl bg-card border border-border p-5 mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              required
              value={cep}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  setCep(value.replace(/(\d{5})(\d)/, '$1-$2'));
                }
              }}
              className="input"
              placeholder="Digite seu CEP (ex: 01310-100)"
              maxLength={9}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Buscando planos disponíveis...</p>
        </div>
      )}

      {searched && !loading && location && (
        <>
          <div className="rounded-xl bg-secondary p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">📍 Localização encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {location.bairro}, {location.cidade} - {location.estado}
            </p>
            <p className="text-xs text-muted-foreground mt-1">CEP: {location.cep}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {availablePlans.length} plano{availablePlans.length !== 1 ? 's' : ''} disponível{availablePlans.length !== 1 ? 'eis' : ''} na sua região
            </h2>
          </div>

          <div className="space-y-4">
            {availablePlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {availablePlans.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-secondary">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum plano disponível
              </h3>
              <p className="text-muted-foreground">
                Infelizmente não encontramos planos para sua região no momento.
              </p>
            </div>
          )}
        </>
      )}

      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}
