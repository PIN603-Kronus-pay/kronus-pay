import { useState } from 'react';
import { Employee } from '../types/employee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AddEmployeeFormProps {
  onAdd: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
}

export function AddEmployeeForm({ onAdd }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      name: formData.name,
      cpf: formData.cpf,
      phone: formData.phone,
      salary: parseFloat(formData.salary),
      hireDate: new Date(formData.hireDate),
      isActive: true,
    });

    // Limpar formulário
    setFormData({
      name: '',
      cpf: '',
      phone: '',
      salary: '',
      hireDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Adicionar Funcionário</h2>
        <p className="text-muted-foreground">Cadastre um novo funcionário no sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Funcionário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setFormData((prev) => ({ ...prev, cpf: formatted }));
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData((prev) => ({ ...prev, phone: formatted }));
                  }}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salário (R$) *</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Data de Contratação *</Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Cadastrar Funcionário
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
