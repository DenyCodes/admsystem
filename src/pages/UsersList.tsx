import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/StateComponents';
import { StatusBadge, statusLabels } from '@/components/common/StatusBadge';
import { useUsers } from '@/hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
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
import type { UserRole, UserStatus } from '@/types';

const UsersList = () => {
  const { data: users, loading, error, refetch, toggleUserStatus } = useUsers();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    try {
      await toggleUserStatus(userId);
      toast({
        title: 'Status atualizado',
        description: `Usuário ${currentStatus === 'active' ? 'desativado' : 'ativado'} com sucesso.`,
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Usuários</h1>
        <p className="page-subtitle">Gerencie os usuários do sistema</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | 'all')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos tipos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Gerente</SelectItem>
            <SelectItem value="seller">Vendedor</SelectItem>
            <SelectItem value="customer">Cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading && <LoadingState message="Carregando usuários..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filteredUsers.length === 0 && (
        <EmptyState 
          title="Nenhum usuário encontrado" 
          description="Tente ajustar os filtros de busca."
        />
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge variant={user.role}>
                      {statusLabels[user.role]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>
                    <StatusBadge variant={user.status}>
                      {statusLabels[user.status]}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                      >
                        {user.status === 'active' ? (
                          <ToggleRight className="h-4 w-4 text-success" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/users/${user.id}`} title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersList;
