import { useOutletContext } from 'react-router';
import { NewOrderForm } from '../components/NewOrderForm';
import { Order } from '../types/order';

interface OutletContext {
  onCreateOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
}

export function CreateOrderPage() {
  const { onCreateOrder } = useOutletContext<OutletContext>();
  return <NewOrderForm onCreateOrder={onCreateOrder} />;
}
