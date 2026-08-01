import React from 'react';
import { Card, Badge } from '@shared/ui';
import type { AuthSession } from '../../domain/entities/auth-session';

interface ProfileSummaryCardProps {
  session: AuthSession | null;
}

export function ProfileSummaryCard({ session }: ProfileSummaryCardProps): React.ReactElement {
  return (
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
  );
}
