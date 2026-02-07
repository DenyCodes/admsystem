import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/StateComponents';
import { StatusBadge, statusLabels } from '@/components/common/StatusBadge';
import { StatCard } from '@/components/common/StatCard';
import { useCommissions, getUserById, getOrderById } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Coins, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CommissionStatus } from '@/types';

const CommissionsList = () => {
  const { data: commissions, loading, error, refetch } = useCommissions();
  
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');

  const filteredCommissions = useMemo(() => {
    if (!commissions) return [];
    return commissions.filter(comm => 
      statusFilter === 'all' || comm.status === statusFilter
    );
  }, [commissions, statusFilter]);

  const totals = useMemo(() => {
    if (!commissions) return { total: 0, pending: 0, paid: 0 };
    return {
      total: commissions.reduce((sum, c) => sum + c.amount, 0),
      pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
      paid: commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
    };
  }, [commissions]);

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Comissões</h1>
        <p className="page-subtitle">Acompanhe as comissões dos vendedores</p>
      </div>

      {/* Summary Cards */}
      {!loading && !error && commissions && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <StatCard
            title="Total em Comissões"
            value={formatCurrency(totals.total)}
            icon={<Coins className="h-5 w-5" />}
          />
          <StatCard
            title="Comissões Pendentes"
            value={formatCurrency(totals.pending)}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Comissões Pagas"
            value={formatCurrency(totals.paid)}
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CommissionStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading && <LoadingState message="Carregando comissões..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filteredCommissions.length === 0 && (
        <EmptyState 
          title="Nenhuma comissão encontrada" 
          description="Tente ajustar os filtros."
        />
      )}

      {!loading && !error && filteredCommissions.length > 0 && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.map((commission) => {
                const user = getUserById(commission.userId);
                const order = getOrderById(commission.orderId);
                return (
                  <TableRow key={commission.id}>
                    <TableCell>
                      {user ? (
                        <Link to={`/users/${user.id}`} className="text-accent hover:underline">
                          {user.name}
                        </Link>
                      ) : (
                        'Usuário não encontrado'
                      )}
                    </TableCell>
                    <TableCell>
                      <Link to={`/orders/${commission.orderId}`} className="font-mono text-sm text-accent hover:underline">
                        {commission.orderId}
                      </Link>
                    </TableCell>
                    <TableCell>{(commission.rate * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(commission.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={commission.status}>
                        {statusLabels[commission.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(commission.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default CommissionsList;
