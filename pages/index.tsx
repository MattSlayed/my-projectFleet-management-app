import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Car, Users, Wrench, TrendingUp, Clock, DollarSign, Gauge, AlertCircle, ArrowRight } from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('An error occurred while loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900">Dashboard</h1>
              <p className="mt-2 text-lg text-neutral-600">
                Welcome to NOVATEK Fleet Management
              </p>
            </div>
            <Badge variant="success" size="lg" dot>
              System Online
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-32">
                <Skeleton variant="text" lines={3} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-error-50 border-error-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <p className="text-error-900 font-medium">{error}</p>
              <Button variant="ghost" size="sm" onClick={fetchStats}>
                Retry
              </Button>
            </div>
          </Card>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Vehicles"
                value={stats.totalVehicles}
                icon={Car}
                color="primary"
              />
              <StatsCard
                title="Active Vehicles"
                value={stats.activeVehicles}
                icon={TrendingUp}
                color="success"
              />
              <StatsCard
                title="In Maintenance"
                value={stats.vehiclesInMaintenance}
                icon={Wrench}
                color="warning"
              />
              <StatsCard
                title="Total Drivers"
                value={stats.totalDrivers}
                icon={Users}
                color="info"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Active Trips"
                value={stats.activeTrips}
                icon={Clock}
                color="primary"
              />
              <StatsCard
                title="Upcoming Maintenance"
                value={stats.upcomingMaintenance}
                icon={AlertCircle}
                color="error"
              />
              <StatsCard
                title="Total Mileage"
                value={formatNumber(stats.totalMileage)}
                icon={Gauge}
                color="success"
              />
              <StatsCard
                title="Monthly Maintenance"
                value={formatCurrency(stats.monthlyMaintenanceCost)}
                icon={DollarSign}
                color="secondary"
              />
            </div>
          </>
        ) : null}

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" description="Common operations and shortcuts" />
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<Car className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => router.push('/vehicles')}
                  className="justify-start h-auto py-4"
                >
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Manage Vehicles</div>
                    <div className="text-xs text-neutral-600">View and manage fleet vehicles</div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<Wrench className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => router.push('/maintenance')}
                  className="justify-start h-auto py-4"
                >
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Maintenance Records</div>
                    <div className="text-xs text-neutral-600">Track service and repairs</div>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<TrendingUp className="h-5 w-5" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => router.push('/reports')}
                  className="justify-start h-auto py-4"
                >
                  <div className="flex-1 text-left">
                    <div className="font-semibold">View Reports</div>
                    <div className="text-xs text-neutral-600">Analytics and insights</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader title="Recent Activity" description="Latest system updates" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-success-50 rounded-lg border border-success-100">
                  <div className="p-2 bg-success-100 rounded-lg">
                    <Car className="h-4 w-4 text-success-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-success-900">
                      System initialized successfully
                    </p>
                    <p className="text-xs text-success-700 mt-1">
                      Fleet management system is ready to use
                    </p>
                  </div>
                  <Badge variant="success" size="sm">New</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
