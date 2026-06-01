import { User } from '../types/order';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@sistema.com',
    role: 'admin',
    createdAt: new Date('2026-01-01T00:00:00'),
  },
  {
    id: '2',
    name: 'Operador João',
    email: 'joao@sistema.com',
    role: 'operator',
    createdAt: new Date('2026-02-15T00:00:00'),
  },
];
