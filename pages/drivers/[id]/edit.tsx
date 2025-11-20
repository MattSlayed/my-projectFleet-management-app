import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { User } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

export default function EditDriver() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<any>>([]);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to load user');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError('An error occurred while loading user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Show success toast
        const toast = {
          id: Date.now().toString(),
          title: 'User updated successfully',
          description: `${data.name || data.email} has been updated`,
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/drivers/${id}`);
        }, 1500);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error updating user',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    }
  };

  const handleCancel = () => {
    router.push(`/drivers/${id}`);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Skeleton className="h-8 w-64" />
          <SkeletonCard />
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/drivers')}
          >
            Back to Drivers
          </Button>
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-900 font-medium">{error || 'User not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push(`/drivers/${id}`)}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Edit User / Driver</h1>
            <p className="mt-2 text-neutral-600">
              Update user account information
            </p>
          </div>
        </div>

        {/* Form */}
        <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </Layout>
  );
}
