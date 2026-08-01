import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@features/auth';
import { getAuthModule } from '../auth-module';
import { ProfileSummaryCard } from './components/ProfileSummaryCard';
import { UpdateBasicInfoForm } from './components/UpdateBasicInfoForm';
import { UpdatePasswordForm } from './components/UpdatePasswordForm';
import type { UserProfile } from '../domain/ports/profile-gateway';

export function ProfileSettings(): React.ReactElement {
  const { session, refresh } = useAuth();
  const module = getAuthModule();
  
  const profileQuery = useQuery({
    queryKey: ['profile', session?.userId],
    queryFn: async (): Promise<UserProfile> => {
      const result = await module.getProfileUseCase.execute();
      if (result.isErr()) throw result.error;
      return result.value;
    },
    staleTime: 60_000,
  });

  const handleRefresh = async () => {
    await refresh();
    await profileQuery.refetch();
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
          <ProfileSummaryCard session={session} />
        </div>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          <UpdateBasicInfoForm 
            initialUsername={session?.username}
            initialEmail={session?.email}
            onSuccess={handleRefresh}
          />
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
