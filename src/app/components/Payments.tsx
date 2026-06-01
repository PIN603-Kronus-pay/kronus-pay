import { Order, PaymentMethod } from '../types/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { DollarSign, CreditCard, Banknote, Smartphone, ArrowLeftRight, Check, Clock } from 'lucide-react';

interface PaymentsProps {
  orders: Order[];
  onPaymentStatusChange: (orderId: string, newStatus: 'pending' | 'paid') => void;
}

export function Payments({ orders, onPaymentStatusChange }: PaymentsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    const icons = {
      'Dinheiro': <Banknote className="h-4 w-4" />,
      'Cartão de Crédito': <CreditCard className="h-4 w-4" />,
      'Cartão de Débito': <CreditCard className="h-4 w-4" />,
      'PIX': <Smartphone className="h-4 w-4" />,
      'Transferência': <ArrowLeftRight className="h-4 w-4" />,
    };
    return icons[method];
  };

  // Calcular totais por forma de pagamento
  const paymentSummary = orders.reduce((acc, order) => {
    if (!acc[order.paymentMethod]) {
      acc[order.paymentMethod] = {
        total: 0,
        paid: 0,
        pending: 0,
        count: 0,
      };
    }
    acc[order.paymentMethod].total += order.total;
    acc[order.paymentMethod].count += 1;
    if (order.paymentStatus === 'paid') {
      acc[order.paymentMethod].paid += order.total;
    } else {
      acc[order.paymentMethod].pending += order.total;
    }
    return acc;
  }, {} as Record<PaymentMethod, { total: number; paid: number; pending: number; count: number }>);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalPaid = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, order) => sum + order.total, 0);
  const totalPending = orders.filter(o => o.paymentStatus === 'pending').reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pagamentos</h2>
        <p className="text-muted-foreground">Resumo de todas as formas de pagamento</p>
      </div>

      {/* Cards de resumo geral */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Recebidos</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumo por forma de pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Forma de Pagamento</CardTitle>
          <CardDescription>Totais discriminados por método de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(paymentSummary).map(([method, data]) => (
              <div key={method} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getPaymentIcon(method as PaymentMethod)}
                  <div>
                    <p className="font-medium">{method}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.count} {data.count === 1 ? 'pedido' : 'pedidos'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(data.total)}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">Pago: {formatCurrency(data.paid)}</span>
                    {data.pending > 0 && (
                      <span className="text-yellow-600">Pendente: {formatCurrency(data.pending)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela detalhada de todos os pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Pagamentos</CardTitle>
          <CardDescription>Lista completa de todos os pagamentos - Altere o status conforme necessário</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(order.paymentMethod)}
                      {order.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.paymentStatus === 'paid' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Pago
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pendente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.paymentStatus === 'pending' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() => onPaymentStatusChange(order.id, 'paid')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como Pago
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        onClick={() => onPaymentStatusChange(order.id, 'pending')}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Marcar como Pendente
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}