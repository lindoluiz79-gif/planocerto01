import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { login } from "@/lib/auth";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — PlanoCerto" },
      { name: "description", content: "Entre na sua conta PlanoCerto." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = login(email, password);
    if (user) {
      navigate({ to: "/dashboard" });
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Acesse sua conta para sincronizar seus dados
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-card border border-border p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Criar conta
            </a>
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
