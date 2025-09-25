import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import CustomerGrid from '../components/CustomerGrid';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-brand-light">
      <Topbar />
      <main className="p-6">
        <CustomerGrid />
        <Outlet />
      </main>
    </div>
  );
}
