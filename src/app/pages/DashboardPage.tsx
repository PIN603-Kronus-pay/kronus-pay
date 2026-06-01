import { useOutletContext } from 'react-router';
import { DashboardPayments } from '../components/DashboardPayments';
import { Employee, Payment } from '../types/employee';

interface OutletContext {
  employees: Employee[];
  payments: Payment[];
}

export function DashboardPage() {
  const { employees, payments } = useOutletContext<OutletContext>();
  return <DashboardPayments employees={employees} payments={payments} />;
}
