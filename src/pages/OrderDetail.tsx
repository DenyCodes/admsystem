import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingState, ErrorState } from '@/components/common/StateComponents';
import { StatusBadge, statusLabels } from '@/components/common/StatusBadge';
import { useOrder, useOrders, getUserById } from '@/hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { OrderStatus, OrderItem } from '@/types';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, loading, error, refetch } = useOrder(id || '');
  const { updateOrder } = useOrders();
  const { toast } = useToast();

  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const user = order ? getUserById(order.userId) : null;
  const currentStatus = status ?? order?.status ?? 'pending';

  // Recalculate totals (simulated)
  const calculatedTotals = useMemo(() => {
    if (!order) return null;
    const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  }, [order]);

  const handleSave = async () => {
    if (!id || !order) return;
    
    setIsSaving(true);
    try {
      await updateOrder(id, { 
        status: currentStatus,
        ...calculatedTotals
      });
      toast({
        title: 'Pedido atualizado',
        description: 'O status do pedido foi alterado com sucesso.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o pedido.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = order && currentStatus !== order.status;

  return (
    <AdminLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pedidos
          </Link>
        </Button>
      </div>

      {loading && <LoadingState message="Carregando pedido..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {order && !loading && !error && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ID do Pedido</p>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                {user ? (
                  <Link to={`/users/${user.id}`} className="text-accent hover:underline">
                    {user.name}
                  </Link>
                ) : (
                  <p>Usuário não encontrado</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p>{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Select 
                  value={currentStatus} 
                  onValueChange={(v) => setStatus(v as OrderStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasChanges && (
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Salvando...' : 'Salvar Status'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Items & Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Preço Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              {calculatedTotals && (
                <div className="mt-6 border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(calculatedTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impostos (10%)</span>
                    <span>{formatCurrency(calculatedTotals.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(calculatedTotals.total)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderDetail;
