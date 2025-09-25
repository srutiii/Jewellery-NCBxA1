import React, { useState, useEffect } from 'react';
import CustomerCard from './CustomerCard';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
    }
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand">Customers</h2>
        <input
          type="text"
          placeholder="Search customers..."
          className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-light"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(c => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}
    </section>
  );
}
