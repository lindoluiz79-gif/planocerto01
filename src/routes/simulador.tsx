import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador de Uso — PlanoCerto" },
      { name: "description", content: "Descubra qual tipo de plano é melhor para você." },
    ],
  }),
  component: SimuladorPage,
});

function SimuladorPage() {
  const [consultas, setConsultas] = useState("");
  const [exames, setExames] = useState("");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculated(true);
  };

  const numConsultas = Number(consultas);
  const numExames = Number(exames);
  
  // Valores médios estimados
  const custoConsulta = 200;
  const custoExame = 150;
  const coparticipacaoConsulta = 40;
  const coparticipacaoExame = 30;

  const custoSemPlano = (numConsultas * custoConsulta) + (numExames * custoExame);
  const custoCoparticipacao = (numConsultas * coparticipacaoConsulta) + (numExames * coparticipacaoExame);
  
  // Plano sem coparticipação geralmente é 30-40% mais caro
  const mensalidadeSemCopay = 300;
  const mensalidadeComCopay = 200;
  
  const custoAnualSemCopay = mensalidadeSemCopay * 12;
  const custoAnualComCopay = (mensalidadeComCopay * 12) + custoCoparticipacao;

  const melhorOpcao = custoAnualComCopay < custoAnualSemCopay ? 'com' : 'sem';
  const economia = Math.abs(custoAnualSemCopay - custoAnualComCopay);

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Simulador de Uso</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Descubra se vale mais a pena plano com ou sem coparticipação
        </p>
      </header>

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ O que é coparticipação?</h3>
        <p className="text-sm text-blue-700">
          Planos com coparticipação têm mensalidade menor, mas você paga um valor a cada consulta ou exame. 
          É ideal para quem usa pouco o plano.
        </p>
      </div>

      <form
        onSubmit={handleCalculate}
        className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-card)] space-y-4 mb-6"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Quantas consultas você faz por ano?
          </label>
          <input
            type="number"
            required
            min={0}
            value={consultas}
            onChange={(e) => setConsultas(e.target.value)}
            className="input"
            placeholder="Ex: 6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Quantos exames você faz por ano?
          </label>
          <input
            type="number"
            required
            min={0}
            value={exames}
            onChange={(e) => setExames(e.target.value)}
            className="input"
            placeholder="Ex: 4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Simular melhor opção
        </button>
      </form>

      {calculated && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center ${
            melhorOpcao === 'com' 
              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
          }`}>
            <div className="text-xl font-semibold mb-2">
              Melhor opção para você:
            </div>
            <div className="text-3xl font-bold">
              Plano {melhorOpcao === 'com' ? 'COM' : 'SEM'} coparticipação
            </div>
            <div className="mt-2 opacity-90">
              Economia de R$ {economia.toFixed(2)}/ano
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl bg-card border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">
                📊 Comparação anual
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sem coparticipação:</span>
                  <span className="font-semibold text-foreground">R$ {custoAnualSemCopay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com coparticipação:</span>
                  <span className="font-semibold text-foreground">R$ {custoAnualComCopay.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="text-muted-foreground">Diferença:</span>
                  <span className="font-bold text-primary">R$ {economia.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-secondary p-4">
              <h3 className="font-semibold text-foreground mb-2">
                💡 Recomendação
              </h3>
              <p className="text-sm text-muted-foreground">
                {melhorOpcao === 'com' ? (
                  <>
                    Com seu perfil de uso ({numConsultas} consultas e {numExames} exames/ano), 
                    um plano com coparticipação é mais econômico. Você paga menos na mensalidade 
                    e o custo das coparticipações ainda fica abaixo de um plano sem coparticipação.
                  </>
                ) : (
                  <>
                    Com seu perfil de uso ({numConsultas} consultas e {numExames} exames/ano), 
                    um plano sem coparticipação é mais vantajoso. Você usa bastante o plano, 
                    então vale a pena pagar uma mensalidade maior e não ter custos extras.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}
