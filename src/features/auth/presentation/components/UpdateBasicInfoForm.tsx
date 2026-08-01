import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, Input, Button } from '@shared/ui';
import { getAuthModule } from '../../auth-module';

interface UpdateBasicInfoFormProps {
  initialUsername?: string | undefined;
  initialEmail?: string | undefined;
  onSuccess: () => Promise<void>;
}

export function UpdateBasicInfoForm({ initialUsername, initialEmail, onSuccess }: UpdateBasicInfoFormProps): React.ReactElement {
  const module = getAuthModule();
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const { register: registerUsername, handleSubmit: handleUsernameSubmit, setError: setUsernameError, formState: { errors: usernameErrors } } = useForm({
    defaultValues: { username: initialUsername ?? '' },
  });

  const { register: registerEmail, handleSubmit: handleEmailSubmit, setError: setEmailError, formState: { errors: emailErrors } } = useForm({
    defaultValues: { email: initialEmail ?? '' },
  });

  const onUpdateUsername = async (data: { username: string }): Promise<void> => {
    setIsUpdatingUsername(true);
    const result = await module.updateUsernameUseCase.execute(data.username);
    setIsUpdatingUsername(false);
    if (result.isErr()) {
      const appError = result.error as any;
      if (appError.validationErrors) {
        const vErrors = appError.validationErrors as Record<string, string[]>;
        for (const [key, messages] of Object.entries(vErrors)) {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          setUsernameError(fieldName as any, { type: 'server', message: messages[0] ?? 'Invalid field' });
        }
        return;
      }
      toast.error(result.error.message);
      return;
    }
    toast.success('Username updated successfully');
    await onSuccess();
  };

  const onUpdateEmail = async (data: { email: string }): Promise<void> => {
    setIsUpdatingEmail(true);
    const result = await module.updateEmailUseCase.execute(data.email);
    setIsUpdatingEmail(false);
    if (result.isErr()) {
      const appError = result.error as any;
      if (appError.validationErrors) {
        const vErrors = appError.validationErrors as Record<string, string[]>;
        for (const [key, messages] of Object.entries(vErrors)) {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          setEmailError(fieldName as any, { type: 'server', message: messages[0] ?? 'Invalid field' });
        }
        return;
      }
      toast.error(result.error.message);
      return;
    }
    toast.success('Email updated successfully');
    await onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-slate-400" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <div className="space-y-6">
        <form onSubmit={(e) => { void handleUsernameSubmit(onUpdateUsername)(e); }} className="flex items-end gap-4">
          <div className="flex-1">
            <Input 
              label="Username" 
              error={usernameErrors.username?.message ?? ''}
              {...registerUsername('username', { required: 'Username is required' })} 
            />
          </div>
          <Button type="submit" isLoading={isUpdatingUsername} className="mb-[2px] h-10">Update</Button>
        </form>

        <form onSubmit={(e) => { void handleEmailSubmit(onUpdateEmail)(e); }} className="flex items-end gap-4">
          <div className="flex-1">
            <Input 
              label="Email Address" 
              type="email"
              error={emailErrors.email?.message ?? ''}
              {...registerEmail('email', { required: 'Email is required' })} 
            />
          </div>
          <Button type="submit" isLoading={isUpdatingEmail} className="mb-[2px] h-10">Update</Button>
        </form>
      </div>
    </Card>
  );
}
