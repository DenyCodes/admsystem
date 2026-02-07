import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowUpDown } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/StateComponents';
import { StatusBadge, statusLabels } from '@/components/common/StatusBadge';
import { useOrders, getUserById } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
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
import type { OrderStatus } from '@/types';

type SortField = 'date' | 'value';
type SortDirection = 'asc' | 'desc';

const OrdersList = () => {
  const { data: orders, loading, error, refetch } = useOrders();
  
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];
    
    let filtered = orders.filter(order => 
      statusFilter === 'all' || order.status === statusFilter
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.total - b.total;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [orders, statusFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Pedidos</h1>
        <p className="page-subtitle">Gerencie os pedidos do sistema</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant={sortField === 'date' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleSort('date')}
          >
            Data
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            variant={sortField === 'value' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleSort('value')}
          >
            Valor
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingState message="Carregando pedidos..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filteredAndSortedOrders.length === 0 && (
        <EmptyState 
          title="Nenhum pedido encontrado" 
          description="Tente ajustar os filtros."
        />
      )}

      {!loading && !error && filteredAndSortedOrders.length > 0 && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOrders.map((order) => {
                const user = getUserById(order.userId);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell>{user?.name || 'Usuário não encontrado'}</TableCell>
                    <TableCell>
                      <StatusBadge variant={order.status}>
                        {statusLabels[order.status]}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/orders/${order.id}`} title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
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

export default OrdersList;
