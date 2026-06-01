import { Employee } from '../types/employee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
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

interface EmployeesListProps {
  employees: Employee[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeesList({ employees, onToggleStatus, onDelete }: EmployeesListProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold mb-1">Funcionários</h2>
        <p className="text-muted-foreground">Gerencie os funcionários cadastrados</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id} className={!employee.isActive ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {employee.name}
                    {employee.isActive ? (
                      <UserCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <UserX className="h-4 w-4 text-red-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    CPF: {employee.cpf}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Salário</p>
                <p className="text-lg font-semibold">{formatCurrency(employee.salary)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="text-sm">{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Contratação</p>
                <p className="text-sm">{formatDate(employee.hireDate)}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant={employee.isActive ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => onToggleStatus(employee.id)}
                  className="flex-1"
                >
                  {employee.isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o funcionário {employee.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(employee.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum funcionário cadastrado ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
