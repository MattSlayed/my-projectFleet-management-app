import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { User } from '@/types';
import { Users, Mail, UserPlus, Shield, Calendar, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';
import { ConfirmModal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';

export default function Drivers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<Array<any>>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('An error occurred while loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'User deleted successfully',
          description: `${userToDelete.name || userToDelete.email} has been removed`,
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        // Refresh the users list
        fetchUsers();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error deleting user',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const roleConfig = {
    admin: { variant: 'error' as const, icon: Shield, label: 'Administrator' },
    manager: { variant: 'primary' as const, icon: Users, label: 'Manager' },
    user: { variant: 'success' as const, icon: Users, label: 'User / Driver' },
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Drivers & Users</h1>
            <p className="mt-2 text-neutral-600">Manage system users and assign drivers</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<UserPlus className="h-5 w-5" />}
            onClick={() => router.push('/drivers/new')}
          >
            Add User / Driver
          </Button>
        </div>

        {/* Loading State */}
        {loading && <SkeletonTable rows={5} />}

        {/* Error State */}
        {!loading && error && (
          <Card className="bg-error-50 border-error-200">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-error-600" />
              <p className="text-error-900 font-medium">{error}</p>
              <Button variant="ghost" size="sm" onClick={fetchUsers}>
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && users.length === 0 && (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-neutral-100 rounded-full">
                <Users className="h-12 w-12 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">No users found</h3>
                <p className="text-neutral-600 mt-1">
                  Get started by adding your first user or driver
                </p>
              </div>
              <Button
                variant="primary"
                leftIcon={<UserPlus className="h-5 w-5" />}
                onClick={() => router.push('/drivers/new')}
              >
                Add User / Driver
              </Button>
            </div>
          </Card>
        )}

        {/* Users Table */}
        {!loading && !error && users.length > 0 && (
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {users.map((user) => {
                    const role = roleConfig[user.role as keyof typeof roleConfig];
                    const RoleIcon = role.icon;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-full">
                              <Users className="h-5 w-5 text-primary-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-neutral-900">
                                {user.name || 'No name'}
                              </div>
                              <div className="text-xs text-neutral-500">
                                ID: {user.id.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-neutral-900">
                            <Mail className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                            <span className="font-mono">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={role.variant}
                            icon={<RoleIcon className="h-3 w-3" />}
                          >
                            {role.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {formatShortDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Eye className="h-4 w-4" />}
                              onClick={() => router.push(`/drivers/${user.id}`)}
                              aria-label="View user details"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Edit className="h-4 w-4" />}
                              onClick={() => router.push(`/drivers/${user.id}/edit`)}
                              aria-label="Edit user"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Trash2 className="h-4 w-4" />}
                              onClick={() => handleDeleteClick(user)}
                              aria-label="Delete user"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Count */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{users.length}</span> user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name || userToDelete?.email}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </Layout>
  );
}
