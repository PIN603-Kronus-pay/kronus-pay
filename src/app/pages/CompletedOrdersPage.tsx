import { useOutletContext } from 'react-router';
import { CompletedOrders } from '../components/CompletedOrders';
import { Order, OrderStatus } from '../types/order';

interface OutletContext {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function CompletedOrdersPage() {
  const { orders, onStatusChange, onPrint, onDelete } = useOutletContext<OutletContext>();
  return <CompletedOrders orders={orders} onStatusChange={onStatusChange} onPrint={onPrint} onDelete={onDelete} />;
}