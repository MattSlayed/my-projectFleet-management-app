import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import UserForm from '@/components/UserForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function NewDriver() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Array<any>>([]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Show success toast
        const toast = {
          id: Date.now().toString(),
          title: 'User created successfully',
          description: `${data.name || data.email} has been added to the system`,
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/drivers');
        }, 1500);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error creating user',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    }
  };

  const handleCancel = () => {
    router.push('/drivers');
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/drivers')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Add New User / Driver</h1>
            <p className="mt-2 text-neutral-600">
              Create a new user account that can be assigned as a driver
            </p>
          </div>
        </div>

        {/* Form */}
        <UserForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </Layout>
  );
}
