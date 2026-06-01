import { Employee, Payment } from '../types/employee';

// Dados mockados de funcionários
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    salary: 3500.0,
    hireDate: new Date('2023-01-15'),
    isActive: true,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    phone: '(11) 91234-5678',
    salary: 4200.0,
    hireDate: new Date('2023-03-10'),
    isActive: true,
    createdAt: new Date('2023-03-10'),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    phone: '(11) 97654-3210',
    salary: 2800.0,
    hireDate: new Date('2023-06-20'),
    isActive: true,
    createdAt: new Date('2023-06-20'),
  },
  {
    id: '4',
    name: 'Ana Costa',
    cpf: '321.654.987-00',
    phone: '(11) 96543-2109',
    salary: 3800.0,
    hireDate: new Date('2024-01-05'),
    isActive: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    cpf: '789.123.456-00',
    phone: '(11) 95432-1098',
    salary: 3200.0,
    hireDate: new Date('2024-08-12'),
    isActive: false,
    createdAt: new Date('2024-08-12'),
  },
];

// Gerar pagamentos para os últimos 6 meses
function generatePayments(): Payment[] {
  const payments: Payment[] = [];
  const today = new Date();

  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const refDate = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
    const dueDate = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1);
    const referenceMonth = `${refDate.getFullYear()}-${String(refDate.getMonth() + 1).padStart(2, '0')}`;

    mockEmployees.forEach((employee, index) => {
      // Apenas gerar pagamentos para funcionários que já estavam contratados
      const hireDate = new Date(employee.hireDate);
      if (hireDate <= refDate) {
        const paymentId = `pay-${referenceMonth}-${employee.id}`;

        let status: 'pending' | 'paid' | 'partially_paid' = 'paid';
        let paidAmount = employee.salary;
        let paidAt: Date | undefined = new Date(dueDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000);

        // Mês atual - alguns pendentes
        if (monthsAgo === 0) {
          if (index % 3 === 0) {
            status = 'pending';
            paidAmount = 0;
            paidAt = undefined;
          } else if (index % 3 === 1) {
            status = 'partially_paid';
            paidAmount = employee.salary * 0.5;
            paidAt = undefined;
          }
        }
        // Mês passado - alguns parcialmente pagos
        else if (monthsAgo === 1 && index % 4 === 0) {
          status = 'partially_paid';
          paidAmount = employee.salary * 0.7;
        }

        payments.push({
          id: paymentId,
          employeeId: employee.id,
          employeeName: employee.name,
          amount: employee.salary,
          referenceMonth,
          dueDate,
          status,
          paidAmount,
          paidAt,
        });
      }
    });
  }

  return payments;
}

export const mockPayments: Payment[] = generatePayments();
