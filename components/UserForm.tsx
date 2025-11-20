import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations';
import { User } from '@/types';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name || '',
          email: user.email,
          role: user.role,
          password: '', // Don't pre-fill password
        }
      : {
          role: 'user',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="John Doe"
              fullWidth
            />

            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john@example.com"
              fullWidth
              required
            />

            <Input
              label={user ? 'New Password (leave blank to keep current)' : 'Password'}
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Min. 6 characters"
              helpText={user ? 'Leave blank to keep current password' : 'Minimum 6 characters required'}
              fullWidth
              required={!user}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">
                Role <span className="text-error-600">*</span>
              </label>
              <select
                {...register('role')}
                className="input w-full"
                aria-invalid={errors.role ? 'true' : 'false'}
                aria-describedby={errors.role ? 'role-error' : undefined}
              >
                <option value="user">User (Driver)</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.role && (
                <p id="role-error" className="text-sm text-error-600" role="alert">
                  {errors.role.message}
                </p>
              )}
              <p className="text-sm text-neutral-500">
                Users can be assigned as drivers to vehicles
              </p>
            </div>
          </div>

          <div className="bg-info-50 border border-info-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-info-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-info-900">Role Permissions</h3>
                <div className="mt-2 text-sm text-info-700 space-y-1">
                  <p><strong>User:</strong> Can be assigned as a driver, view their trips and assignments</p>
                  <p><strong>Manager:</strong> Can manage vehicles, drivers, and view reports</p>
                  <p><strong>Administrator:</strong> Full system access including user management</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {user ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
}
