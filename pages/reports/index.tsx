import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function Reports() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
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

  const reportTypes = [
    {
      title: 'Fleet Overview',
      description: 'Comprehensive overview of all fleet vehicles and their status',
      icon: BarChart3,
      color: 'blue',
    },
    {
      title: 'Maintenance Costs',
      description: 'Analysis of maintenance expenses over time',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Vehicle Utilization',
      description: 'Track vehicle usage and efficiency metrics',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Service Schedule',
      description: 'Upcoming and overdue maintenance schedules',
      icon: Calendar,
      color: 'yellow',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">
            Generate insights and reports about your fleet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.title}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start">
                  <div className={`p-3 bg-${report.color}-50 rounded-lg`}>
                    <Icon className={`h-6 w-6 text-${report.color}-600`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                    <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
                      Generate Report →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report History</h2>
          <p className="text-sm text-gray-500">No reports generated yet</p>
        </div>
      </div>
    </Layout>
  );
}
