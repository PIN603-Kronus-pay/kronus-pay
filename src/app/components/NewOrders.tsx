import { Order, OrderStatus } from '../types/order';
import { OrderCard } from '../components/OrderCard';

interface NewOrdersProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function NewOrders({ orders, onStatusChange, onPrint, onDelete }: NewOrdersProps) {
  const newOrders = orders.filter((order) => order.status === 'new');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Novos Pedidos</h2>
          <p className="text-muted-foreground">
            {newOrders.length} {newOrders.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'}
          </p>
        </div>
      </div>

      {newOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum novo pedido no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onPrint={onPrint}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}