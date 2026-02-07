import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        active: "bg-success/10 text-success",
        inactive: "bg-muted text-muted-foreground",
        pending: "bg-pending/10 text-pending",
        processing: "bg-accent/10 text-accent",
        completed: "bg-success/10 text-success",
        cancelled: "bg-destructive/10 text-destructive",
        paid: "bg-success/10 text-success",
        admin: "bg-accent/10 text-accent",
        manager: "bg-pending/10 text-pending",
        seller: "bg-warning/10 text-warning",
        customer: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "inactive",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

// Helper to get label translations
export const statusLabels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  processing: 'Processando',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  paid: 'Pago',
  admin: 'Admin',
  manager: 'Gerente',
  seller: 'Vendedor',
  customer: 'Cliente',
};
