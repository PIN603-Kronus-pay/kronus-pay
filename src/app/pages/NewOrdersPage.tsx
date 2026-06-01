import { useOutletContext } from 'react-router';
import { NewOrders } from '../components/NewOrders';
import { Order, OrderStatus } from '../types/order';

interface OutletContext {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onPrint: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export function NewOrdersPage() {
  const { orders, onStatusChange, onPrint, onDelete } = useOutletContext<OutletContext>();
  return <NewOrders orders={orders} onStatusChange={onStatusChange} onPrint={onPrint} onDelete={onDelete} />;
}