import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Calculator, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/calculadora")({
  head: () => ({
    meta: [
      { title: "Calculadora de Economia — PlanoCerto" },
      { name: "description", content: "Calcule quanto você pode economizar com um plano mais barato." },
    ],
  }),
  component: CalculadoraPage,
});

function CalculadoraPage() {
  const [precoAtual, setPrecoAtual] = useState("");
  const [precoNovo, setPrecoNovo] = useState("");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculated(true);
  };

  const atual = Number(precoAtual);
  const novo = Number(precoNovo);
  const economiaMensal = atual - novo;
  const economiaAnual = economiaMensal * 12;
  const economia5Anos = economiaMensal * 60;
  const percentual = atual > 0 ? ((economiaMensal / atual) * 100).toFixed(1) : 0;

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Calculadora de Economia</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Descubra quanto você pode economizar trocando de plano
        </p>
      </header>

      <form
        onSubmit={handleCalculate}
        className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-card)] space-y-4 mb-6"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Preço do seu plano atual (R$/mês)
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={precoAtual}
            onChange={(e) => setPrecoAtual(e.target.value)}
            className="input"
            placeholder="Ex: 350"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Preço do novo plano (R$/mês)
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={precoNovo}
            onChange={(e) => setPrecoNovo(e.target.value)}
            className="input"
            placeholder="Ex: 245"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Calcular economia
        </button>
      </form>

      {calculated && economiaMensal > 0 && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white p-6 text-center">
            <TrendingDown className="w-12 h-12 mx-auto mb-3" />
            <div className="text-4xl font-bold mb-2">
              R$ {economiaMensal.toFixed(2)}
            </div>
            <div className="text-green-100">
              Economia mensal ({percentual}%)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                R$ {economiaAnual.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Economia em 1 ano
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                R$ {economia5Anos.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Economia em 5 anos
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-secondary p-4">
            <h3 className="font-semibold text-foreground mb-2">
              💡 O que você pode fazer com essa economia:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Investir em um fundo de emergência</li>
              <li>• Fazer um curso de qualificação profissional</li>
              <li>• Economizar para uma viagem em família</li>
              <li>• Aumentar sua reserva financeira</li>
            </ul>
          </div>
        </div>
      )}

      {calculated && economiaMensal <= 0 && (
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-center">
          <p className="text-yellow-800">
            O novo plano não gera economia. Considere avaliar outros benefícios como cobertura e rede credenciada.
          </p>
        </div>
      )}

      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}
