import { useOutletContext } from 'react-router';
import { PaymentsList } from '../components/PaymentsList';
import { Employee, Payment } from '../types/employee';

interface OutletContext {
  employees: Employee[];
  payments: Payment[];
  onMarkPaymentAsPaid: (id: string, amount: number) => void;
}

export function PaymentsPage() {
  const { employees, payments, onMarkPaymentAsPaid } = useOutletContext<OutletContext>();
  return (
    <PaymentsList
      payments={payments}
      employees={employees}
      onMarkAsPaid={onMarkPaymentAsPaid}
    />
  );
}