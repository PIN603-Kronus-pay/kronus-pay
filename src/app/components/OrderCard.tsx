import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Order, OrderStatus } from '../types/order';
import { Printer, Clock, DollarSign, MapPin, Phone, Trash2 } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
  showStatusChange?: boolean;
}

export function OrderCard({ order, onStatusChange, onPrint, onDelete, showStatusChange = true }: OrderCardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap = {
      new: { label: 'Novo', variant: 'default' as const },
      in_production: { label: 'Em Produção', variant: 'secondary' as const },
      completed: { label: 'Concluído', variant: 'outline' as const },
    };
    return statusMap[status];
  };

  const getPaymentStatusBadge = (status: 'pending' | 'paid') => {
    return status === 'paid' 
      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Pago</Badge>
      : <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendente</Badge>;
  };

  const statusBadge = getStatusBadge(order.status);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Pedido #{order.id}
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </CardTitle>
            <CardDescription>{order.customer}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onPrint(order)}>
              <Printer className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Pedido</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você tem certeza que deseja excluir o pedido #{order.id} do cliente {order.customer}? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(order.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <span>{order.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{order.phone}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <h4 className="font-medium mb-2">Itens:</h4>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total:
            </span>
            <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pagamento:</span>
            <div className="flex gap-2">
              <Badge variant="secondary">{order.paymentMethod}</Badge>
              {getPaymentStatusBadge(order.paymentStatus)}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Criado em:
            </span>
            <span className="text-sm">{formatDate(order.createdAt)}</span>
          </div>

          {order.completedAt && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Concluído em:</span>
              <span className="text-sm">{formatDate(order.completedAt)}</span>
            </div>
          )}
        </div>

        {showStatusChange && (
          <div className="border-t pt-3">
            <label className="text-sm font-medium mb-2 block">Alterar Status:</label>
            <Select
              value={order.status}
              onValueChange={(value) => onStatusChange(order.id, value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="in_production">Em Produção</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
