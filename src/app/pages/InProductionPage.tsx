import { useOutletContext } from 'react-router';
import { InProduction } from '../components/InProduction';
import { Order, OrderStatus } from '../types/order';

interface OutletContext {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function InProductionPage() {
  const { orders, onStatusChange, onPrint, onDelete } = useOutletContext<OutletContext>();
  return <InProduction orders={orders} onStatusChange={onStatusChange} onPrint={onPrint} onDelete={onDelete} />;
}