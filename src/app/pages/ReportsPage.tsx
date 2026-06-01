import { useOutletContext } from 'react-router';
import { Reports } from '../components/Reports';
import { Employee, Payment } from '../types/employee';

interface OutletContext {
  employees: Employee[];
  payments: Payment[];
}

export function ReportsPage() {
  const { employees, payments } = useOutletContext<OutletContext>();
  return <Reports payments={payments} employees={employees} />;
}
