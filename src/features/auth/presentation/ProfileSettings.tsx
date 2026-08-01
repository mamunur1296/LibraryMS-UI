import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@features/auth';
import { getAuthModule } from '../auth-module';
import { Card, CardHeader, CardTitle, Input, Button, Badge } from '@shared/ui';
import type { UserProfile } from '../domain/ports/profile-gateway';

export function ProfileSettings(): React.ReactElement {
  const { session, refresh } = useAuth();
  const module = getAuthModule();
  
  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile> => {
      const result = await module.getProfileUseCase.execute();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    staleTime: 60_000,
  });

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { register: registerUsername, handleSubmit: handleUsernameSubmit, setError: setUsernameError, formState: { errors: usernameErrors } } = useForm({
    defaultValues: { username: session?.username ?? '' },
  });

  const { register: registerEmail, handleSubmit: handleEmailSubmit, setError: setEmailError, formState: { errors: emailErrors } } = useForm({
    defaultValues: { email: session?.email ?? '' },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, setError: setPasswordError, formState: { errors: passwordErrors } } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
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
    await refresh();
    await profileQuery.refetch();
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
    await refresh();
    await profileQuery.refetch();
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account and security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center p-4">
              <div className="h-24 w-24 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-3xl font-bold mb-4 border-4 border-white shadow-sm">
                {session?.username?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{session?.username}</h2>
              <p className="text-sm text-slate-500">{session?.email}</p>
              
              <div className="mt-4 flex gap-2">
                <Badge variant={session?.isAdmin() === true ? 'primary' : 'neutral'}>
                  {session?.role}
                </Badge>
                {session?.branchName !== null && session?.branchName !== undefined && (
                  <Badge variant="info">{session.branchName}</Badge>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
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
        </div>
      </div>
    </div>
  );
}
