import { useState } from 'react';
import { Payment, Employee } from '../types/employee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { FileText, Download } from 'lucide-react';

interface ReportsProps {
  payments: Payment[];
  employees: Employee[];
}

export function Reports({ payments, employees }: ReportsProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState<'pending' | 'paid' | 'all'>('all');

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

  const filterPayments = () => {
    let filtered = payments;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((p) => {
        const dueDate = new Date(p.dueDate);
        return dueDate >= start && dueDate <= end;
      });
    }

    if (reportType === 'pending') {
      filtered = filtered.filter((p) => p.status === 'pending' || p.status === 'partially_paid');
    } else if (reportType === 'paid') {
      filtered = filtered.filter((p) => p.status === 'paid');
    }

    return filtered;
  };

  const filteredPayments = filterPayments();

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = filteredPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);

  const generateReport = () => {
    const report = filteredPayments.map((p) => ({
      Funcionário: p.employeeName,
      Referência: formatMonth(p.referenceMonth),
      Vencimento: formatDate(p.dueDate),
      Valor: formatCurrency(p.amount),
      Pago: formatCurrency(p.paidAmount),
      Pendente: formatCurrency(p.amount - p.paidAmount),
      Status: p.status === 'paid' ? 'Pago' : p.status === 'partially_paid' ? 'Parcial' : 'Pendente',
    }));

    // Converter para CSV
    const headers = Object.keys(report[0] || {}).join(';');
    const rows = report.map((r) => Object.values(r).join(';'));
    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_pagamentos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-8">
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Relatórios</h2>
        <p className="text-muted-foreground">Gere relatórios de pagamentos por período</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <div className="flex gap-2">
                <Button
                  variant={reportType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={reportType === 'paid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('paid')}
                >
                  Pagos
                </Button>
                <Button
                  variant={reportType === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType('pending')}
                >
                  Pendentes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              Valor total: {formatCurrency(totalAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status === 'paid').length} pagamentos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredPayments.filter(p => p.status !== 'paid').length} pagamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Resultados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhes dos Pagamentos</CardTitle>
          <Button
            onClick={generateReport}
            disabled={filteredPayments.length === 0}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{payment.employeeName}</h4>
                        <Badge
                          variant={
                            payment.status === 'paid'
                              ? 'default'
                              : payment.status === 'partially_paid'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {payment.status === 'paid'
                            ? 'Pago'
                            : payment.status === 'partially_paid'
                            ? 'Parcial'
                            : 'Pendente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Referência: {formatMonth(payment.referenceMonth)} | Vencimento:{' '}
                        {formatDate(payment.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-green-600">
                        Pago: {formatCurrency(payment.paidAmount)}
                      </p>
                      {payment.amount > payment.paidAmount && (
                        <p className="text-sm text-red-600">
                          Pendente: {formatCurrency(payment.amount - payment.paidAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                  {payment.paidAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Data do pagamento: {formatDate(payment.paidAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhum pagamento encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
