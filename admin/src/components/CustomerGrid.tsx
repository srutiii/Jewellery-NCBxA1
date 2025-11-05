import React, { useState, useEffect } from 'react';
import CustomerCard from './CustomerCard';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FiSearch, FiUsers, FiFilter } from 'react-icons/fi';

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  purchases?: number;
};

export default function CustomerGrid() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      // Use API endpoint instead of direct Firebase query
      const response = await fetch('http://localhost:3000/customers');
      const apiData = await response.json();

      const data: any[] = apiData.map((d: any) => ({
        id: d.id,
        name: d.full_name || d.name || d.email || d.email_address || '',
        full_name: d.full_name,
        email: d.email,
        email_address: d.email_address,
      }));

      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  }

  async function handleSyncToOdoo() {
    setSyncing(true);
    try {
      const response = await fetch('http://localhost:3000/customers/sync-all-odoo', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Sync completed!\n\nCreated: ${result.created}\nUpdated: ${result.updated}\nFailed: ${result.failed}`);
      } else {
        alert('❌ Sync failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error syncing to Odoo:', error);
      alert('❌ Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  }

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand/10 rounded-xl">
              <FiUsers className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
              <p className="text-gray-500">Manage and view all customer information</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <FiFilter className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleSyncToOdoo}
              disabled={syncing}
              className="px-4 py-3 bg-brand text-white rounded-xl hover:bg-brand/90 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync to Odoo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-brand/10 to-brand/5 rounded-xl p-4">
            <div className="text-2xl font-bold text-brand">{customers.length}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600">{filtered.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">
              {customers.filter(c => c.email || c.email_address).length}
            </div>
            <div className="text-sm text-gray-600">With Email</div>
          </div>
        </div>
      </div>

      {/* Customer Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
            <p className="text-gray-500">Loading customers...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No customers found</h3>
          <p className="text-gray-500">
            {search ? 'Try adjusting your search terms' : 'No customers have been added yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(c => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}
    </section>
  );
}
