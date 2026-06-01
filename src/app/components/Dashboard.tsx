import { Order } from '../types/order';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function Dashboard({ orders }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Estatísticas gerais
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const inProductionCount = orders.filter((o) => o.status === 'in_production').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  // Dados por status
  const statusData = [
    { id: 'status-new', name: 'Novos', value: newOrdersCount, fill: '#0088FE' },
    { id: 'status-production', name: 'Em Produção', value: inProductionCount, fill: '#00C49F' },
    { id: 'status-completed', name: 'Concluídos', value: completedCount, fill: '#FFBB28' },
  ];

  // Dados por forma de pagamento
  const paymentData = orders.reduce((acc, order) => {
    const existing = acc.find((item) => item.name === order.paymentMethod);
    if (existing) {
      existing.value += order.total;
    } else {
      acc.push({ name: order.paymentMethod, value: order.total });
    }
    return acc;
  }, [] as { name: string; value: number }[]).map((item, index) => ({
    ...item,
    id: `payment-${index}`,
  }));

  // Receita por dia (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const revenueByDay = last7Days.map((date, index) => {
    const dayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });
    const total = dayOrders.reduce((sum, order) => sum + order.total, 0);
    return {
      id: `day-${index}`,
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      receita: total,
      pedidos: dayOrders.length,
    };
  });

  // Top produtos
  const productsMap = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (acc[item.name]) {
        acc[item.name].quantity += item.quantity;
        acc[item.name].revenue += item.price * item.quantity;
      } else {
        acc[item.name] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productsMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((product, index) => ({
      ...product,
      id: `product-${index}`,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(paidRevenue)} recebido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Aguardando processamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProductionCount}</div>
            <p className="text-xs text-muted-foreground">Sendo preparados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Pedidos finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gráfico de receita por dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Receita dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Receita"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de pizza - Status dos pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Pedidos</CardTitle>
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

        {/* Gráfico de barras - Receita por forma de pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#FF8042" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}