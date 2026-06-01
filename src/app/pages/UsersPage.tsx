import { useOutletContext } from 'react-router';
import { UsersManagement } from '../components/UsersManagement';
import { User } from '../types/order';

interface OutletContext {
  users: User[];
  onCreateUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onDeleteUser: (userId: string) => void;
}

export function UsersPage() {
  const { users, onCreateUser, onDeleteUser } = useOutletContext<OutletContext>();
  return <UsersManagement users={users} onCreateUser={onCreateUser} onDeleteUser={onDeleteUser} />;
}
