import React from 'react';
import { FiLogOut, FiSettings, FiBell } from 'react-icons/fi';

export default function Topbar() {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Nemichand Bamalwa</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200">
              <FiBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200">
              <FiSettings className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">A</span>
              </div>
            </div>

            {/* Logout */}
            <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
