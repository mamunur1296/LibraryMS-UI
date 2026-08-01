import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, Input, Button } from '@shared/ui';
import { getAuthModule } from '../../auth-module';

export function UpdatePasswordForm(): React.ReactElement {
  const module = getAuthModule();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, setError: setPasswordError, formState: { errors: passwordErrors } } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onUpdatePassword = async (data: any): Promise<void> => {
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('confirmPassword', { type: 'manual', message: 'New passwords do not match' });
      return;
    }
    setIsUpdatingPassword(true);
    const result = await module.updatePasswordUseCase.execute(data.currentPassword, data.newPassword);
    setIsUpdatingPassword(false);
    if (result.isErr()) {
      const appError = result.error as any;
      if (appError.validationErrors) {
        const vErrors = appError.validationErrors as Record<string, string[]>;
        for (const [key, messages] of Object.entries(vErrors)) {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          setPasswordError(fieldName as any, { type: 'server', message: messages[0] ?? 'Invalid field' });
        }
        return;
      }
      toast.error(result.error.message);
      return;
    }
    toast.success('Password updated successfully');
    resetPassword();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-slate-400" />
          Change Password
        </CardTitle>
      </CardHeader>
      <form onSubmit={(e) => { void handlePasswordSubmit(onUpdatePassword)(e); }} className="space-y-4">
        <Input 
          label="Current Password" 
          type="password"
          error={passwordErrors.currentPassword?.message ?? ''}
          {...registerPassword('currentPassword', { required: 'Required' })} 
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="New Password" 
            type="password"
            error={passwordErrors.newPassword?.message ?? ''}
            {...registerPassword('newPassword', { required: 'Required', minLength: 6 })} 
          />
          <Input 
            label="Confirm New Password" 
            type="password"
            error={passwordErrors.confirmPassword?.message ?? ''}
            {...registerPassword('confirmPassword', { required: 'Required' })} 
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isUpdatingPassword}>Change Password</Button>
        </div>
      </form>
    </Card>
  );
}
