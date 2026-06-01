import { Order, OrderStatus } from '../types/order';
import { OrderCard } from '../components/OrderCard';

interface InProductionProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function InProduction({ orders, onStatusChange, onPrint, onDelete }: InProductionProps) {
  const inProductionOrders = orders.filter((order) => order.status === 'in_production');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pedidos em Produção</h2>
          <p className="text-muted-foreground">
            {inProductionOrders.length} {inProductionOrders.length === 1 ? 'pedido sendo preparado' : 'pedidos sendo preparados'}
          </p>
        </div>
      </div>

      {inProductionOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum pedido em produção no momento.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inProductionOrders.map((order) => (
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