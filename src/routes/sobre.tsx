import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, Info, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o PlanoCerto" },
      { name: "description", content: "Como funciona a comparação gratuita de planos de saúde para MEI." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Sobre o PlanoCerto</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Um comparador independente para MEI e autônomos brasileiros.
        </p>
      </header>

      <section className="rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground p-5 mb-6 shadow-[var(--shadow-elegant)]">
        <h2 className="font-semibold text-lg">100% gratuito</h2>
        <p className="text-sm opacity-90 mt-1">Você não paga nada para usar o PlanoCerto. Compare quantas vezes quiser.</p>
      </section>

      <div className="space-y-4">
        <Item icon={CheckCircle2} title="Como funciona a comparação">
          Reunimos planos das principais operadoras do Brasil voltados para MEI e autônomos. Você pode buscar pelo seu orçamento ou responder um questionário curto para receber uma recomendação personalizada conforme seu perfil.
        </Item>
        <Item icon={ExternalLink} title="Contratação direta na operadora">
          Ao clicar em <strong>“Quero contratar”</strong>, você é redirecionado para o site oficial da operadora escolhida. A contratação acontece diretamente com ela — o PlanoCerto não intermedia pagamentos nem coleta seus dados.
        </Item>
        <Item icon={Info} title="Aviso importante">
          As informações exibidas são uma referência. Preços, coberturas e disponibilidade podem variar conforme cidade, idade e operadora. Sempre confirme as condições no site oficial antes de contratar.
        </Item>
      </div>
    </AppShell>
  );
}

function Item({ icon: Icon, title, children }: { icon: typeof Info; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}
