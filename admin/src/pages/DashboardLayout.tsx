import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import CustomerGrid from '../components/CustomerGrid';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Topbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <CustomerGrid />
        <Outlet />
      </main>
    </div>
  );
}
