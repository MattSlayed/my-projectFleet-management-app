import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import MaintenanceForm from '@/components/MaintenanceForm';
import { Wrench, Calendar, DollarSign, Car, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';

interface MaintenanceRecord {
  id: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  serviceDate: string;
  servicedBy: string;
  notes?: string;
  vehicle: {
    id: string;
    name: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  createdAt: string;
}

export default function Maintenance() {
  const router = useRouter();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState<Array<any>>([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/maintenance');
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setError(null);
      } else {
        setError('Failed to load maintenance records');
      }
    } catch (error) {
      console.error('Failed to fetch maintenance records:', error);
      setError('An error occurred while loading records');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: any) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'Record added successfully',
          description: 'Maintenance record has been created',
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        fetchRecords();
        setAddModalOpen(false);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create record');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error creating record',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedRecord) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/maintenance/${selectedRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'Record updated successfully',
          description: 'Maintenance record has been updated',
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        fetchRecords();
        setEditModalOpen(false);
        setSelectedRecord(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update record');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error updating record',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/maintenance/${selectedRecord.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const toast = {
          id: Date.now().toString(),
          title: 'Record deleted successfully',
          description: 'Maintenance record has been removed',
          variant: 'success' as const,
          duration: 5000,
        };
        setToasts((prev) => [...prev, toast]);

        fetchRecords();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete record');
      }
    } catch (error) {
      const toast = {
        id: Date.now().toString(),
        title: 'Error deleting record',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'error' as const,
        duration: 5000,
      };
      setToasts((prev) => [...prev, toast]);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedRecord(null);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const typeConfig = {
    routine: { variant: 'primary' as const, label: 'Routine' },
    repair: { variant: 'error' as const, label: 'Repair' },
    inspection: { variant: 'success' as const, label: 'Inspection' },
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Maintenance Records</h1>
            <p className="mt-2 text-neutral-600">Track all vehicle maintenance activities</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Maintenance Record
          </Button>
        </div>

        {/* Loading State */}
        {loading && <SkeletonTable rows={5} />}

        {/* Error State */}
        {!loading && error && (
          <Card className="bg-error-50 border-error-200">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-error-600" />
              <p className="text-error-900 font-medium">{error}</p>
              <Button variant="ghost" size="sm" onClick={fetchRecords}>
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && records.length === 0 && (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-neutral-100 rounded-full">
                <Wrench className="h-12 w-12 text-neutral-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">No maintenance records</h3>
                <p className="text-neutral-600 mt-1">
                  Get started by adding your first maintenance record
                </p>
              </div>
              <Button
                variant="primary"
                leftIcon={<Plus className="h-5 w-5" />}
                onClick={() => setAddModalOpen(true)}
              >
                Add Maintenance Record
              </Button>
            </div>
          </Card>
        )}

        {/* Records Table */}
        {!loading && !error && records.length > 0 && (
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Service Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Serviced By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {records.map((record) => {
                    const type = typeConfig[record.type];
                    return (
                      <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-full">
                              <Car className="h-5 w-5 text-primary-600" aria-hidden="true" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-neutral-900">
                                {record.vehicle.name}
                              </div>
                              <div className="text-xs text-neutral-500 font-mono">
                                {record.vehicle.licensePlate}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={type.variant}>{type.label}</Badge>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-neutral-900">{record.description}</div>
                          {record.notes && (
                            <div className="text-xs text-neutral-500 mt-1 truncate">
                              {record.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {formatShortDate(record.serviceDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm font-medium text-neutral-900">
                            <DollarSign className="h-4 w-4 text-success-600" aria-hidden="true" />
                            {formatCurrency(record.cost)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {record.servicedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Edit className="h-4 w-4" />}
                              onClick={() => {
                                setSelectedRecord(record);
                                setEditModalOpen(true);
                              }}
                              aria-label="Edit record"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Trash2 className="h-4 w-4" />}
                              onClick={() => {
                                setSelectedRecord(record);
                                setDeleteModalOpen(true);
                              }}
                              aria-label="Delete record"
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
                Showing <span className="font-semibold text-neutral-900">{records.length}</span> maintenance record{records.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Maintenance Record"
        description="Create a new maintenance record for a vehicle"
        size="lg"
      >
        <MaintenanceForm
          onSubmit={handleAdd}
          onCancel={() => setAddModalOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Maintenance Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRecord(null);
        }}
        title="Edit Maintenance Record"
        description="Update maintenance record details"
        size="lg"
      >
        {selectedRecord && (
          <MaintenanceForm
            maintenance={selectedRecord}
            vehicleId={selectedRecord.vehicle.id}
            onSubmit={handleEdit}
            onCancel={() => {
              setEditModalOpen(false);
              setSelectedRecord(null);
            }}
            loading={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleDelete}
        title="Delete Maintenance Record"
        description={`Are you sure you want to delete this maintenance record? This action cannot be undone.`}
        confirmText="Delete Record"
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
