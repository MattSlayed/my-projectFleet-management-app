import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import VehicleForm from '@/components/VehicleForm';

export default function NewVehicle() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (
      status === 'authenticated' &&
      session?.user.role !== 'admin' &&
      session?.user.role !== 'manager'
    ) {
      router.push('/vehicles');
    }
  }, [status, session, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/vehicles');
      } else {
        alert('Failed to create vehicle');
      }
    } catch (error) {
      console.error('Failed to create vehicle:', error);
      alert('Failed to create vehicle');
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="mt-2 text-gray-600">Enter the vehicle details below</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <VehicleForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/vehicles')}
          />
        </div>
      </div>
    </Layout>
  );
}
