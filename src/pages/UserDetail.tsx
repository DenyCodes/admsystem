import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LoadingState, ErrorState } from '@/components/common/StateComponents';
import { StatusBadge, statusLabels } from '@/components/common/StatusBadge';
import { useUser, useUsers } from '@/hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserStatus } from '@/types';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, loading, error, refetch } = useUser(id || '');
  const { updateUser } = useUsers();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setStatus(user.status);
    }
  }, [user]);

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateUser(id, { name, email, status });
      toast({
        title: 'Usuário atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      refetch();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = user && (name !== user.name || email !== user.email || status !== user.status);

  return (
    <AdminLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para usuários
          </Link>
        </Button>
      </div>

      {loading && <LoadingState message="Carregando usuário..." />}
      
      {error && <ErrorState message={error} onRetry={refetch} />}

      {user && !loading && !error && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <StatusBadge variant={user.role} className="mt-1">
                  {statusLabels[user.role]}
                </StatusBadge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">País</p>
                <p>{user.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado em</p>
                <p>{formatDate(user.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Editar Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome do usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
                    <SelectTrigger id="status" className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" disabled={!hasChanges || isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                  {hasChanges && (
                    <p className="text-sm text-muted-foreground">Você tem alterações não salvas</p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserDetail;
