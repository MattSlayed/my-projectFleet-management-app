import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { User } from '@/types';
import {
  ArrowLeft,
  Mail,
  Shield,
  Calendar,
  Users,
  Truck,
  MapPin,
  Edit,
  Trash2,
  TrendingUp,
  UserPlus,
  XCircle
} from 'lucide-react';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import DriverAssignmentForm from '@/components/DriverAssignmentForm';

interface UserWithRelations extends User {
  driverAssignments?: Array<{
    id: string;
    vehicle: {
      id: string;
      make: string;
      model: string;
      licensePlate: string;
    };
    status: string;
    createdAt: string;
  }>;
  trips?: Array<{
    id: string;
    vehicle: {
      id: string;
      make: string;
      model: string;
    };
    startLocation: string;
    endLocation: string;
    status: string;
    createdAt: string;
  }>;
}

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<Array<any>>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignmentToEnd, setAssignmentToEnd] = useState<string | null>(null);
  const [endingAssignment, setEndingAssignment] = useState(false);
  const [creatingAssignment, setCreatingAssignment] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'User deleted successfully',
          description: 'The user has been removed from the system',
          variant: 'success' as const,
          duration: 3000,
        };
        setToasts((prev) => [...prev, toast]);

        setTimeout(() => {
          router.push('/drivers');
        }, 1500);
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
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleCreateAssignment = async (data: any) => {
    setCreatingAssignment(true);
    try {
      const response = await fetch('/api/driver-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: id,
        }),
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'Vehicle assigned successfully',
          description: 'The vehicle has been assigned to this driver',
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        // Refresh user data
        fetchUser();
        setAssignModalOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create assignment');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error creating assignment',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setCreatingAssignment(false);
    }
  };

  const handleEndAssignment = async () => {
    if (!assignmentToEnd) return;

    setEndingAssignment(true);
    try {
      const response = await fetch(`/api/driver-assignments/${assignmentToEnd}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
        }),
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'Assignment completed',
          description: 'The vehicle assignment has been ended',
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        // Refresh user data
        fetchUser();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to end assignment');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error ending assignment',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setEndingAssignment(false);
      setAssignmentToEnd(null);
    }
  };

  const roleConfig = {
    admin: { variant: 'error' as const, icon: Shield, label: 'Administrator' },
    manager: { variant: 'primary' as const, icon: Users, label: 'Manager' },
    user: { variant: 'success' as const, icon: Users, label: 'User / Driver' },
  };

  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'secondary' as const, label: 'Inactive' },
    completed: { variant: 'secondary' as const, label: 'Completed' },
    in_progress: { variant: 'primary' as const, label: 'In Progress' },
    cancelled: { variant: 'error' as const, label: 'Cancelled' },
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 animate-fade-in">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/drivers')}
          >
            Back to Drivers
          </Button>
          <Card className="bg-error-50 border-error-200">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-error-600" />
              <p className="text-error-900 font-medium">{error || 'User not found'}</p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const role = roleConfig[user.role as keyof typeof roleConfig];
  const RoleIcon = role.icon;
  const activeAssignments = user.driverAssignments?.filter(a => a.status === 'active') || [];
  const completedTrips = user.trips?.filter(t => t.status === 'completed') || [];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold text-neutral-900">{user.name || 'No name'}</h1>
              <p className="mt-2 text-neutral-600">User profile and activity</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              leftIcon={<Edit className="h-5 w-5" />}
              onClick={() => router.push(`/drivers/${id}/edit`)}
            >
              Edit User
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-5 w-5" />}
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete User
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">User Information</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Mail className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-900 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <RoleIcon className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Role</p>
                  <Badge variant={role.variant} icon={<RoleIcon className="h-3 w-3" />}>
                    {role.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Joined</p>
                  <p className="font-medium text-neutral-900">{formatShortDate(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Last Updated</p>
                  <p className="font-medium text-neutral-900">{formatShortDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Active Assignments</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">
                    {activeAssignments.length}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Truck className="h-8 w-8 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Trips</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">
                    {user.trips?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <MapPin className="h-8 w-8 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Completed Trips</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">
                    {completedTrips.length}
                  </p>
                </div>
                <div className="p-3 bg-info-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-info-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Vehicle Assignments</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="h-4 w-4" />}
                onClick={() => setAssignModalOpen(true)}
              >
                Assign Vehicle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {user.driverAssignments && user.driverAssignments.length > 0 ? (
              <div className="space-y-3">
                {user.driverAssignments.map((assignment) => {
                  const status = statusConfig[assignment.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Truck className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {assignment.vehicle.make} {assignment.vehicle.model}
                          </p>
                          <p className="text-sm text-neutral-500 font-mono">
                            {assignment.vehicle.licensePlate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <p className="text-sm text-neutral-500">
                          {formatShortDate(assignment.createdAt)}
                        </p>
                        {assignment.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<XCircle className="h-4 w-4" />}
                            onClick={() => setAssignmentToEnd(assignment.id)}
                          >
                            End Assignment
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-neutral-100 rounded-full inline-block mb-3">
                  <Truck className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600">No vehicle assignments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Trips</h2>
          </CardHeader>
          <CardContent>
            {user.trips && user.trips.length > 0 ? (
              <div className="space-y-3">
                {user.trips.map((trip) => {
                  const status = statusConfig[trip.status as keyof typeof statusConfig];
                  return (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-success-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {trip.startLocation} → {trip.endLocation}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {trip.vehicle.make} {trip.vehicle.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <p className="text-sm text-neutral-500">
                          {formatShortDate(trip.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 bg-neutral-100 rounded-full inline-block mb-3">
                  <MapPin className="h-8 w-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600">No trips recorded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${user.name || user.email}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />

      {/* Assign Vehicle Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Vehicle"
        description="Assign a vehicle to this driver"
        size="md"
      >
        <DriverAssignmentForm
          userId={id as string}
          onSubmit={handleCreateAssignment}
          onCancel={() => setAssignModalOpen(false)}
          loading={creatingAssignment}
        />
      </Modal>

      {/* End Assignment Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assignmentToEnd}
        onClose={() => setAssignmentToEnd(null)}
        onConfirm={handleEndAssignment}
        title="End Assignment"
        description="Are you sure you want to end this vehicle assignment? This will mark the assignment as completed."
        confirmText="End Assignment"
        cancelText="Cancel"
        variant="warning"
        loading={endingAssignment}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </Layout>
  );
}
