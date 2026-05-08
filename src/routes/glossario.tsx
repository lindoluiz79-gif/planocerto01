import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GLOSSARY } from "@/data/glossary";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: "Glossário — PlanoCerto" },
      { name: "description", content: "Entenda os termos técnicos de planos de saúde." },
    ],
  }),
  component: GlossarioPage,
});

function GlossarioPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Glossário</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Entenda os termos técnicos usados em planos de saúde
        </p>
      </header>

      <div className="grid gap-4">
        {GLOSSARY.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-card border border-border p-5"
          >
            <h3 className="font-semibold text-lg text-primary mb-2">
              {item.term}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
