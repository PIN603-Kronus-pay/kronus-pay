import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Toaster } from './ui/sonner';
import { mockEmployees, mockPayments } from '../utils/mockData';
import { Employee, Payment } from '../types/employee';
import { toast } from 'sonner';

export function Layout() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  // Gerar pagamentos automáticos para funcionários ativos no início de cada mês
  useEffect(() => {
    const checkAndGeneratePayments = () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

      // Verificar se já existem pagamentos para o mês atual
      const currentMonthPayments = payments.filter(p => p.referenceMonth === currentMonth);

      if (currentMonthPayments.length === 0) {
        // Gerar pagamentos para todos os funcionários ativos
        const newPayments: Payment[] = employees
          .filter(emp => emp.isActive)
          .map(emp => ({
            id: `pay-${currentMonth}-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            amount: emp.salary,
            referenceMonth: currentMonth,
            dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
            status: 'pending' as const,
            paidAmount: 0,
          }));

        if (newPayments.length > 0) {
          setPayments(prev => [...newPayments, ...prev]);
          toast.info('Pagamentos do mês gerados', {
            description: `${newPayments.length} pagamentos criados para ${new Date(today.getFullYear(), today.getMonth()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
          });
        }
      }

      // Lembrete no dia 1º do mês
      if (today.getDate() === 1) {
        const pendingPayments = payments.filter(p =>
          p.referenceMonth === currentMonth &&
          p.status !== 'paid'
        );

        if (pendingPayments.length > 0) {
          toast.warning('Lembrete de Pagamentos', {
            description: `Existem ${pendingPayments.length} pagamentos pendentes para este mês`,
          });
        }
      }
    };

    checkAndGeneratePayments();
  }, [employees, payments]);

  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    setEmployees(prev => [...prev, newEmployee]);

    toast.success('Funcionário cadastrado', {
      description: `${newEmployee.name} foi adicionado com sucesso`,
    });
  };

  const handleToggleEmployeeStatus = (employeeId: string) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === employeeId) {
          const newStatus = !emp.isActive;
          toast.info(newStatus ? 'Funcionário ativado' : 'Funcionário desativado', {
            description: emp.name,
          });
          return { ...emp, isActive: newStatus };
        }
        return emp;
      })
    );
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setEmployees(prev => prev.filter(e => e.id !== employeeId));

    // Remover pagamentos futuros do funcionário
    setPayments(prev => prev.filter(p => p.employeeId !== employeeId || p.status === 'paid'));

    toast.success('Funcionário excluído', {
      description: employee?.name,
    });
  };

  const handleMarkPaymentAsPaid = (paymentId: string, amount: number) => {
    setPayments(prev =>
      prev.map(payment => {
        if (payment.id === paymentId) {
          const newPaidAmount = payment.paidAmount + amount;
          const newStatus = newPaidAmount >= payment.amount ? 'paid' : 'partially_paid';

          toast.success(
            newStatus === 'paid' ? 'Pagamento concluído' : 'Pagamento parcial registrado',
            {
              description: `${payment.employeeName} - R$ ${amount.toFixed(2)}`,
            }
          );

          return {
            ...payment,
            paidAmount: newPaidAmount,
            status: newStatus,
            paidAt: newStatus === 'paid' ? new Date() : payment.paidAt,
          };
        }
        return payment;
      })
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster />
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto">
          <Outlet
            context={{
              employees,
              payments,
              onAddEmployee: handleAddEmployee,
              onToggleEmployeeStatus: handleToggleEmployeeStatus,
              onDeleteEmployee: handleDeleteEmployee,
              onMarkPaymentAsPaid: handleMarkPaymentAsPaid,
            }}
          />
        </div>
      </main>
    </div>
  );
}