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

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'customers'));
        const data: any[] = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.full_name || d.name || d.email || d.email_address || '',
            full_name: d.full_name,
            email: d.email,
            email_address: d.email_address,
          };
        });
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

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
              <FiSearch className="absolute -3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customeleftrs..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200 w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <FiFilter className="w-5 h-5 text-gray-600" />
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
