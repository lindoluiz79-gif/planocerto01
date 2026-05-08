import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Search, Sparkles, HeartPulse, Crown, Zap, Star, Quote } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { payments } from "@/lib/payments";
import { TESTIMONIALS } from "@/data/testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlanoCerto — Compare planos de saúde para MEI e autônomos" },
      { name: "description", content: "Compare planos de saúde para MEI e autônomos brasileiros. Gratuito e rápido." },
    ],
  }),
  component: Index,
});

function Index() {
  const user = getCurrentUser();
  const isPremium = user ? payments.isPremium(user.id) : false;

  return (
    <AppShell>
      <div className="text-center pt-6 pb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] mb-5">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">PlanoCerto</h1>
        <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
          Compare planos de saúde feitos para <strong className="text-foreground">MEI e autônomos</strong>.
          Encontre o plano ideal pelo seu orçamento ou pelo seu perfil.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          to="/buscar"
          className="group block rounded-2xl bg-blue-200 border border-blue-300 p-5 shadow-[var(--shadow-card)] hover:bg-[image:var(--gradient-primary)] hover:text-primary-foreground hover:border-transparent transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-300 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <Search className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-blue-900 group-hover:text-white transition-colors">Buscar planos por preço</h2>
              <p className="text-sm text-blue-600 group-hover:text-primary-foreground/90 transition-colors">Veja opções dentro do seu orçamento</p>
            </div>
          </div>
        </Link>

        <Link
          to="/recomendar"
          className="group block rounded-2xl bg-blue-200 border border-blue-300 p-5 shadow-[var(--shadow-card)] hover:bg-[image:var(--gradient-primary)] hover:text-primary-foreground hover:border-transparent transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-300 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <Sparkles className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-blue-900 group-hover:text-white transition-colors">Encontrar o plano ideal para mim</h2>
              <p className="text-sm text-blue-600 group-hover:text-primary-foreground/90 transition-colors">Responda 5 perguntas rápidas</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          to="/calculadora"
          className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-colors"
        >
          <div className="text-2xl mb-2">🧮</div>
          <div className="font-semibold text-foreground text-sm">Calculadora</div>
          <div className="text-xs text-muted-foreground">Veja sua economia</div>
        </Link>

        <Link
          to="/simulador"
          className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-colors"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-semibold text-foreground text-sm">Simulador</div>
          <div className="text-xs text-muted-foreground">Melhor tipo de plano</div>
        </Link>

        <Link
          to="/faq"
          className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-colors"
        >
          <div className="text-2xl mb-2">❓</div>
          <div className="font-semibold text-foreground text-sm">FAQ</div>
          <div className="text-xs text-muted-foreground">Tire suas dúvidas</div>
        </Link>

        <Link
          to="/glossario"
          className="rounded-xl bg-card border border-border p-4 hover:border-primary transition-colors"
        >
          <div className="text-2xl mb-2">📖</div>
          <div className="font-semibold text-foreground text-sm">Glossário</div>
          <div className="text-xs text-muted-foreground">Termos técnicos</div>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3 text-center">
        {[
          { n: "100%", l: "Gratuito" },
          { n: "50+", l: "Planos" },
          { n: "18", l: "Operadoras" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-secondary p-3">
            <div className="text-lg font-bold text-primary">{s.n}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Depoimentos */}
      <div className="mt-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            O que nossos usuários dizem
          </h2>
          <p className="text-sm text-muted-foreground">
            Mais de 5.000 pessoas já encontraram o plano ideal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.slice(0, 4).map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-xl bg-card border border-border p-5 hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-primary/20" />
                <p className="text-sm text-muted-foreground pl-6 italic">
                  "{testimonial.text}"
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Contratou: <span className="text-primary font-medium">{testimonial.plan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/sobre"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            Ver mais avaliações
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Premium Features Preview */}
      {!isPremium && (
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
              <Crown className="w-5 h-5" />
              <span>Recursos Premium</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Desbloqueie todo o potencial do PlanoCerto
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔔</div>
              <div className="text-xs font-semibold text-foreground">Alertas Ilimitados</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">⚖️</div>
              <div className="text-xs font-semibold text-foreground">Comparação Ilimitada</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xs font-semibold text-foreground">Consultoria Chat</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🚫</div>
              <div className="text-xs font-semibold text-foreground">Sem Anúncios</div>
            </div>
          </div>

          <Link
            to="/premium"
            className="block w-full text-center bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Conhecer Premium
          </Link>
        </div>
      )}
    </AppShell>
  );
}
