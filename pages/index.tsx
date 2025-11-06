import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Car, Users, Wrench, TrendingUp, Clock, DollarSign, Gauge, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Vehicles"
                value={stats.totalVehicles}
                icon={Car}
                color="blue"
              />
              <StatsCard
                title="Active Vehicles"
                value={stats.activeVehicles}
                icon={TrendingUp}
                color="green"
              />
              <StatsCard
                title="In Maintenance"
                value={stats.vehiclesInMaintenance}
                icon={Wrench}
                color="yellow"
              />
              <StatsCard
                title="Total Drivers"
                value={stats.totalDrivers}
                icon={Users}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Active Trips"
                value={stats.activeTrips}
                icon={Clock}
                color="blue"
              />
              <StatsCard
                title="Upcoming Maintenance"
                value={stats.upcomingMaintenance}
                icon={AlertCircle}
                color="red"
              />
              <StatsCard
                title="Total Mileage"
                value={formatNumber(stats.totalMileage)}
                icon={Gauge}
                color="green"
              />
              <StatsCard
                title="Monthly Maintenance"
                value={formatCurrency(stats.monthlyMaintenanceCost)}
                icon={DollarSign}
                color="purple"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/vehicles')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Car className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Vehicles</span>
                </div>
              </button>
              <button
                onClick={() => router.push('/maintenance')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Wrench className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Maintenance Records</span>
                </div>
              </button>
              <button
                onClick={() => router.push('/reports')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">View Reports</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Car className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    System initialized successfully
                  </p>
                  <p className="text-xs text-gray-500">Fleet management system is ready to use</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
