import { useOutletContext } from 'react-router';
import { EmployeesList } from '../components/EmployeesList';
import { Employee } from '../types/employee';

interface OutletContext {
  employees: Employee[];
  onToggleEmployeeStatus: (id: string) => void;
  onDeleteEmployee: (id: string) => void;
}

export function EmployeesPage() {
  const { employees, onToggleEmployeeStatus, onDeleteEmployee } = useOutletContext<OutletContext>();
  return (
    <EmployeesList
      employees={employees}
      onToggleStatus={onToggleEmployeeStatus}
      onDelete={onDeleteEmployee}
    />
  );
}
