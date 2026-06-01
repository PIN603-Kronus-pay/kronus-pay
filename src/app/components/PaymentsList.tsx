import { Payment, Employee } from '../types/employee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calendar, DollarSign, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useState } from 'react';

interface PaymentsListProps {
  payments: Payment[];
  employees: Employee[];
  onMarkAsPaid: (id: string, amount: number) => void;
}

export function PaymentsList({ payments, employees, onMarkAsPaid }: PaymentsListProps) {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getStatusBadge = (payment: Payment) => {
    if (payment.status === 'paid') {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Pago
        </Badge>
      );
    } else if (payment.status === 'partially_paid') {
      return (
        <Badge className="bg-yellow-500">
          <Clock className="h-3 w-3 mr-1" />
          Parcial
        </Badge>
      );
    } else {
      const isPastDue = new Date(payment.dueDate) < new Date();
      return (
        <Badge variant={isPastDue ? 'destructive' : 'secondary'}>
          <AlertCircle className="h-3 w-3 mr-1" />
          {isPastDue ? 'Atrasado' : 'Pendente'}
        </Badge>
      );
    }
  };

  const handleMarkAsPaid = (payment: Payment) => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      onMarkAsPaid(payment.id, amount);
      setSelectedPayment(null);
      setPaymentAmount('');
    }
  };

  // Ordenar por data de vencimento
  const sortedPayments = [...payments].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Pagamentos de Funcionários</h2>
        <p className="text-muted-foreground">Gerencie os pagamentos mensais</p>
      </div>

      <div className="grid gap-4">
        {sortedPayments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {payment.employeeName}
                    {getStatusBadge(payment)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Referência: {formatMonth(payment.referenceMonth)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Valor Total
                  </p>
                  <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Vencimento
                  </p>
                  <p className="text-lg font-semibold">{formatDate(payment.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pago</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(payment.paidAmount)}
                    {payment.paidAmount < payment.amount && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Falta: {formatCurrency(payment.amount - payment.paidAmount)})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {payment.status !== 'paid' && (
                <div className="mt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment.id);
                          setPaymentAmount((payment.amount - payment.paidAmount).toString());
                        }}
                      >
                        Registrar Pagamento
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Registrar Pagamento</AlertDialogTitle>
                        <AlertDialogDescription>
                          Funcionário: {payment.employeeName}
                          <br />
                          Valor total: {formatCurrency(payment.amount)}
                          <br />
                          Já pago: {formatCurrency(payment.paidAmount)}
                          <br />
                          Restante: {formatCurrency(payment.amount - payment.paidAmount)}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2 py-4">
                        <label htmlFor="amount" className="text-sm font-medium">
                          Valor do Pagamento (R$)
                        </label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          max={payment.amount - payment.paidAmount}
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPaymentAmount('')}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleMarkAsPaid(payment)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {payment.paidAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Pago em: {formatDate(payment.paidAt)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum pagamento registrado ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
