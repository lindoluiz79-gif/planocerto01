import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Mail, Check } from "lucide-react";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter — PlanoCerto" },
      { name: "description", content: "Receba ofertas e dicas sobre planos de saúde." },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salvar email
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('planocerto-newsletter');
      const emails = stored ? JSON.parse(stored) : [];
      if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('planocerto-newsletter', JSON.stringify(emails));
      }
    }
    
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Inscrição confirmada!
          </h1>
          <p className="text-muted-foreground mb-6">
            Você receberá nossas novidades e ofertas exclusivas no email {email}
          </p>
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar para o início
          </a>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Receba ofertas exclusivas e dicas sobre planos de saúde
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-3">O que você vai receber:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <span>Alertas de promoções e descontos em planos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <span>Dicas para economizar no plano de saúde</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <span>Novidades sobre planos para MEI</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <span>Conteúdo educativo sobre saúde</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Seu melhor email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Inscrever-se gratuitamente
          </button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Sem spam. Cancele quando quiser.
          </p>
        </form>

        <style>{`
          .input { width: 100%; border: 1px solid var(--border); background: var(--background); color: var(--foreground); border-radius: 0.75rem; padding: 0.75rem 0.875rem; font-size: 0.95rem; outline: none; transition: border-color .15s; }
          .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
        `}</style>
      </div>
    </AppShell>
  );
}
