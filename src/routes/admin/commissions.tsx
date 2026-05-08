import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { commissions } from "@/lib/payments";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/commissions")({
  head: () => ({
    meta: [
      { title: "Comissões — Admin — PlanoCerto" },
    ],
  }),
  component: AdminCommissions,
});

function AdminCommissions() {
  const user = getCurrentUser();
  const [commissionList, setCommissionList] = useState(commissions.getCommissions());
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');

  useEffect(() => {
    // Atualizar lista a cada 5 segundos
    const interval = setInterval(() => {
      setCommissionList(commissions.getCommissions());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Verificar se é admin (em produção, verificar no backend)
  const isAdmin = user?.email === 'admin@planocerto.com.br';

  if (!user) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Você precisa estar logado</p>
          <Link
            to="/login"
            className="text-primary hover:underline"
          >
            Fazer login
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Acesso restrito a administradores</p>
          <Link
            to="/"
            className="text-primary hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </AppShell>
    );
  }

  const totalPaid = commissions.getTotalCommissions();
  const totalPending = commissions.getPendingCommissions();
  const totalCommissions = commissionList.length;

  const filteredCommissions = commissionList.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          💰 Painel de Comissões
        </h1>
        <p className="text-muted-foreground">
          Acompanhe as comissões geradas pelas conversões
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Pago</span>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            R$ {totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 mb-1">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Pendente</span>
          </div>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
            R$ {totalPending.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {totalCommissions}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'Todas' },
          { value: 'pending', label: 'Pendentes' },
          { value: 'paid', label: 'Pagas' },
          { value: 'cancelled', label: 'Canceladas' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Comissões */}
      <div className="space-y-3">
        {filteredCommissions.length === 0 ? (
          <div className="text-center py-12 bg-secondary rounded-xl">
            <p className="text-muted-foreground">
              Nenhuma comissão encontrada
            </p>
          </div>
        ) : (
          filteredCommissions.map((commission) => (
            <div
              key={commission.id}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {commission.operadora}
                    </h3>
                    {commission.status === 'paid' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {commission.status === 'pending' && (
                      <Clock className="w-4 h-4 text-orange-600" />
                    )}
                    {commission.status === 'cancelled' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plano: {commission.planId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(commission.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    R$ {commission.amount.toFixed(2)}
                  </p>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                      commission.status === 'paid'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : commission.status === 'pending'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {commission.status === 'paid' ? 'Pago' : commission.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Informações */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
          ℹ️ Como funciona
        </h3>
        <ul className="text-sm text-blue-600 dark:text-blue-500 space-y-1">
          <li>• Comissões são geradas quando usuários clicam em "Contratar"</li>
          <li>• Status "Pendente" aguarda confirmação da operadora</li>
          <li>• Status "Pago" indica que a comissão foi recebida</li>
          <li>• Pagamentos são realizados mensalmente</li>
        </ul>
      </div>
    </AppShell>
  );
}
