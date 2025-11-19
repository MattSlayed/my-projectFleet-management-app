import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import VehicleForm from '@/components/VehicleForm';

export default function NewVehicle() {
  const router = useRouter();

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
