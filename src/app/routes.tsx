import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AddEmployeePage } from './pages/AddEmployeePage';
import { ReportsPage } from './pages/ReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'payments', Component: PaymentsPage },
      { path: 'employees', Component: EmployeesPage },
      { path: 'add-employee', Component: AddEmployeePage },
      { path: 'reports', Component: ReportsPage },
    ],
  },
]);
