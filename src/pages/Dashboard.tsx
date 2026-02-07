import { Users, UserCheck, ShoppingCart, DollarSign, Coins } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/common/StatCard';
import { LoadingState, ErrorState } from '@/components/common/StateComponents';
import { useDashboardStats } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';

const Dashboard = () => {
  const { data: stats, loading, error, refetch } = useDashboardStats();

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema</p>
      </div>

      {loading && <LoadingState message="Carregando estatísticas..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {stats && !loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="Total de Usuários"
            value={stats.totalUsers}
            icon={<Users className="h-5 w-5" />}
            description="Usuários cadastrados"
          />
          <StatCard
            title="Usuários Ativos"
            value={stats.activeUsers}
            icon={<UserCheck className="h-5 w-5" />}
            description={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% do total`}
          />
          <StatCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            icon={<ShoppingCart className="h-5 w-5" />}
            description="Pedidos realizados"
          />
          <StatCard
            title="Valor dos Pedidos"
            value={formatCurrency(stats.totalOrderValue)}
            icon={<DollarSign className="h-5 w-5" />}
            description="Valor total"
          />
          <StatCard
            title="Comissões"
            value={formatCurrency(stats.totalCommissions)}
            icon={<Coins className="h-5 w-5" />}
            description="Total em comissões"
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
