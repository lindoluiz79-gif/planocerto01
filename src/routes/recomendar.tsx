import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PlanCard } from "@/components/PlanCard";
import { PLANS } from "@/data/plans";

export const Route = createFileRoute("/recomendar")({
  head: () => ({
    meta: [
      { title: "Plano ideal para você — PlanoCerto" },
      { name: "description", content: "Responda 5 perguntas e receba a recomendação personalizada." },
    ],
  }),
  component: RecomendarPage,
});

type Resp = boolean;
const PERGUNTAS = [
  "Você tem filhos ou dependentes que precisam ser incluídos no plano?",
  "Você usa algum remédio de uso contínuo?",
  "Você precisa de cobertura odontológica?",
  "Você prefere ser atendido em hospitais particulares de grande porte?",
  "Você possui alguma doença crônica como diabetes, hipertensão ou similar?",
];

function pontuar(respostas: Resp[]) {
  const [dep, med, odonto, premium, cronica] = respostas;
  return PLANS.map((p) => {
    let s = 0;
    if (dep && p.cobreDependentes) s += 2;
    if (med && p.cobreMedicamentoContinuo) s += 2;
    if (odonto && p.cobreOdonto) s += 2;
    if (premium && p.hospitaisGrandePorte) s += 3;
    if (cronica && p.cobreDoencaCronica) s += 2;
    if (!premium && p.recomendadoMei) s += 1;
    s -= p.precoMensal / 200;
    return { plan: p, score: s };
  }).sort((a, b) => b.score - a.score);
}

function gerarMotivo(respostas: Resp[], plan: (typeof PLANS)[number]) {
  const motivos: string[] = [];
  if (respostas[3] && plan.hospitaisGrandePorte) motivos.push("rede premium");
  if (respostas[0] && plan.cobreDependentes) motivos.push("inclui dependentes");
  if (respostas[2] && plan.cobreOdonto) motivos.push("cobertura odontológica");
  if (respostas[1] && plan.cobreMedicamentoContinuo) motivos.push("apoio a uso contínuo");
  if (respostas[4] && plan.cobreDoencaCronica) motivos.push("acompanha doenças crônicas");
  if (!respostas[3] && plan.recomendadoMei) motivos.push("excelente custo-benefício para MEI");
  return motivos.length
    ? `Combina com seu perfil porque oferece ${motivos.slice(0, 3).join(", ")}.`
    : "Equilibra preço e cobertura para o seu perfil.";
}

function RecomendarPage() {
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<Resp[]>([]);
  const total = PERGUNTAS.length;
  const finalizado = respostas.length === total;

  const ranked = useMemo(() => (finalizado ? pontuar(respostas) : []), [finalizado, respostas]);

  if (finalizado) {
    const top = ranked[0].plan;
    const outros = ranked.slice(1, 3).map((r) => r.plan);
    return (
      <AppShell>
        <div className="text-center pt-2 pb-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Sua recomendação</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">O plano ideal para você é</h1>
        </div>
        <PlanCard plan={top} motivo={gerarMotivo(respostas, top)} destaque />

        <h2 className="text-lg font-semibold text-foreground mt-10 mb-4">Outras opções para o seu perfil</h2>
        <div className="space-y-4">
          {outros.map((p) => <PlanCard key={p.id} plan={p} />)}
        </div>

        <button
          onClick={() => { setRespostas([]); setStep(0); }}
          className="mt-8 w-full border border-border bg-card text-foreground font-medium py-3 rounded-xl hover:bg-secondary transition-colors"
        >
          Refazer questionário
        </button>
      </AppShell>
    );
  }

  const responder = (v: Resp) => {
    const novas = [...respostas, v];
    setRespostas(novas);
    setStep(step + 1);
  };

  const progress = ((step) / total) * 100;

  return (
    <AppShell>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Pergunta {step + 1} de {total}</span>
          <Link to="/" className="text-primary hover:underline">Cancelar</Link>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all duration-300" style={{ width: `${progress + (1/total)*100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-semibold text-foreground leading-snug mb-8 min-h-[6rem]">
          {PERGUNTAS[step]}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => responder(false)} className="py-5 rounded-xl border-2 border-border font-semibold text-foreground hover:border-primary hover:bg-secondary transition-colors">
            Não
          </button>
          <button onClick={() => responder(true)} className="py-5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Sim
          </button>
        </div>
      </div>
    </AppShell>
  );
}
