import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell(): React.ReactElement {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
