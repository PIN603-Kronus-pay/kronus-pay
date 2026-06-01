import { Order, OrderStatus } from '../types/order';
import { OrderCard } from '../components/OrderCard';

interface CompletedOrdersProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function CompletedOrders({ orders, onStatusChange, onPrint, onDelete }: CompletedOrdersProps) {
  const completedOrders = orders.filter((order) => order.status === 'completed');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pedidos Concluídos</h2>
          <p className="text-muted-foreground">
            {completedOrders.length} {completedOrders.length === 1 ? 'pedido concluído' : 'pedidos concluídos'}
          </p>
        </div>
      </div>

      {completedOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum pedido concluído ainda.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              onPrint={onPrint}
              onDelete={onDelete}
              showStatusChange={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}