import { Payment, Employee } from '../types/employee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, Users, AlertCircle, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';

interface DashboardPaymentsProps {
  payments: Payment[];
  employees: Employee[];
}

const STATUS_COLORS = {
  paid: '#10b981',
  partially_paid: '#f59e0b',
  pending: '#ef4444',
};

export function DashboardPayments({ payments, employees }: DashboardPaymentsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  // Estatísticas gerais
  const activeEmployees = employees.filter((e) => e.isActive).length;
  const totalSalaries = employees
    .filter((e) => e.isActive)
    .reduce((sum, emp) => sum + emp.salary, 0);

  const currentMonthPayments = payments.filter((p) => {
    const now = new Date();
    return p.referenceMonth === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const paidPayments = payments.filter((p) => p.status === 'paid');
  const pendingPayments = payments.filter((p) => p.status === 'pending' || p.status === 'partially_paid');

  const totalPaid = paidPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);

  // Previsão do próximo mês
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthForecast = employees
    .filter((e) => e.isActive)
    .reduce((sum, emp) => sum + emp.salary, 0);

  // Dados de pagamentos por status
  const statusData = [
    { id: 'status-paid', name: 'Pagos', value: paidPayments.length, fill: STATUS_COLORS.paid },
    { id: 'status-partial', name: 'Parciais', value: payments.filter(p => p.status === 'partially_paid').length, fill: STATUS_COLORS.partially_paid },
    { id: 'status-pending', name: 'Pendentes', value: payments.filter(p => p.status === 'pending').length, fill: STATUS_COLORS.pending },
  ].filter(item => item.value > 0);

  // Histórico de pagamentos (últimos 6 meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const monthPayments = payments.filter(p => p.referenceMonth === monthStr);
    const paid = monthPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const pending = monthPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);

    return {
      id: `month-${i}`,
      month: formatMonth(monthStr),
      pago: paid,
      pendente: pending,
    };
  });

  // Top funcionários por salário
  const topEmployees = [...employees]
    .filter(e => e.isActive)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 5)
    .map((emp, index) => ({
      id: `emp-${index}`,
      name: emp.name.split(' ')[0] + ' ' + (emp.name.split(' ')[1] || ''),
      salary: emp.salary,
    }));

  return (
    <div className="p-6 space-y-8">
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral da gestão de pagamentos</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Folha mensal: {formatCurrency(totalSalaries)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {paidPayments.length} pagamentos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments.length} pagamentos pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão Próximo Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(nextMonthForecast)}</div>
            <p className="text-xs text-muted-foreground">
              {nextMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de histórico de pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Histórico de Pagamentos (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pago"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Pago"
                />
                <Line
                  type="monotone"
                  dataKey="pendente"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Pendente"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de pizza - Status dos pagamentos */}
        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Status dos Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top funcionários por salário */}
        {topEmployees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Maiores Salários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topEmployees} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Bar dataKey="salary" fill="#3b82f6" name="Salário" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Distribuição de salários */}
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos do Mês Atual</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {currentMonthPayments.length > 0 ? (
                currentMonthPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{payment.employeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.status === 'paid' ? 'Pago' : payment.status === 'partially_paid' ? 'Parcial' : 'Pendente'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        Pago: {formatCurrency(payment.paidAmount)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pagamento registrado para o mês atual
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
