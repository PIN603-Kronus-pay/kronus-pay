import { Link, useLocation } from 'react-router';
import { cn } from './ui/utils';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  UserPlus,
  FileText,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pagamentos', href: '/payments', icon: CreditCard },
  { name: 'Funcionários', href: '/employees', icon: Users },
  { name: 'Adicionar Funcionário', href: '/add-employee', icon: UserPlus },
  { name: 'Relatórios', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Gestão de Pagamentos</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
