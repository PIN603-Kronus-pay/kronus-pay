export type PaymentStatus = 'pending' | 'paid' | 'partially_paid';

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  salary: number;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  referenceMonth: string; // formato: "YYYY-MM"
  dueDate: Date; // dia 1º do mês seguinte
  status: PaymentStatus;
  paidAmount: number;
  paidAt?: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  createdAt: Date;
}
