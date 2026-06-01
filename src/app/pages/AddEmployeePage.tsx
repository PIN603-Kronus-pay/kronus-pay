import { useOutletContext, useNavigate } from 'react-router';
import { AddEmployeeForm } from '../components/AddEmployeeForm';
import { Employee } from '../types/employee';

interface OutletContext {
  onAddEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
}

export function AddEmployeePage() {
  const { onAddEmployee } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const handleAdd = (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    onAddEmployee(employee);
    navigate('/employees');
  };

  return <AddEmployeeForm onAdd={handleAdd} />;
}
