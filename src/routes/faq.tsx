import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { FAQ } from "@/data/faq";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes — PlanoCerto" },
      { name: "description", content: "Tire suas dúvidas sobre planos de saúde para MEI." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AppShell>
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Perguntas Frequentes</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Tire suas dúvidas sobre planos de saúde para MEI e autônomos
        </p>
      </header>

      <div className="space-y-3">
        {FAQ.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-card border border-border overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-5 text-left flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-foreground pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
