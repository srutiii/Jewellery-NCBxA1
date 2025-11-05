import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  purchases?: number;
};

export default function CustomerDetailModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      try {
        // Use API endpoint instead of direct Firebase query
        const response = await fetch(`http://localhost:3000/customers/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCustomer(data as Customer);
          setForm(data as Partial<Customer>);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
      setLoading(false);
    }
    if (id) fetchCustomer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      // Use API endpoint instead of direct Firebase write
      const response = await fetch(`http://localhost:3000/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          purchases: Number(form.purchases) || 0,
        }),
      });
      
      if (response.ok) {
        setEditMode(false);
        setCustomer({ id, ...form } as Customer);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-soft p-8 w-full max-w-md text-center">Loading...</div>
    </div>
  );
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-soft p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-brand text-xl"
          onClick={() => navigate(-1)}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-brand mb-4">{editMode ? (
          <input
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            className="border rounded-xl px-3 py-1 w-full"
            disabled={saving}
          />
        ) : customer.name}</h3>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold">Full Name:</span> {customer.full_name || customer.name}</div>
          <div><span className="font-semibold">Gender:</span> {customer.gender}</div>
          <div><span className="font-semibold">Email:</span> {customer.email || customer.email_address}</div>
          <div><span className="font-semibold">Phone:</span> {customer.phone || customer.contact_number}</div>
          <div><span className="font-semibold">Address:</span> {customer.address}</div>
          <div><span className="font-semibold">City:</span> {customer.city}</div>
          <div><span className="font-semibold">Community:</span> {customer.community}</div>
          <div><span className="font-semibold">Sub Community:</span> {customer.sub_community}</div>
          <div><span className="font-semibold">Location:</span> {customer.location}</div>
          <div><span className="font-semibold">Marital Status:</span> {customer.marital_status}</div>
          <div><span className="font-semibold">Anniversary Date:</span> {customer.anniversary_date}</div>
          <div><span className="font-semibold">Date of Birth:</span> {customer.date_of_birth || customer.dob}</div>
          <div><span className="font-semibold">Gift Recipient Relationship:</span> {customer.gift_recipient_relationship}</div>
          <div><span className="font-semibold">Occasion:</span> {customer.occasion || customer.occasion_for_purchase}</div>
          <div><span className="font-semibold">Budget:</span> {customer.budget || customer.budget_mentioned}</div>
          <div><span className="font-semibold">Expressed Interest/Intent:</span> {customer.expressed_interest_or_intent}</div>
          <div><span className="font-semibold">Frequency of Visit:</span> {customer.frequency_of_visit}</div>
          <div><span className="font-semibold">In-store Query:</span> {customer.in_store_query}</div>
          <div><span className="font-semibold">Items Shown/Discussed:</span> {customer.items_shown_or_discussed}</div>
          <div><span className="font-semibold">Created At:</span> {customer.created_at ? (typeof customer.created_at === 'string' ? customer.created_at : new Date(customer.created_at.seconds * 1000).toLocaleString()) : ''}</div>
          <div><span className="font-semibold">Updated At:</span> {customer.updated_at ? (typeof customer.updated_at === 'string' ? customer.updated_at : new Date(customer.updated_at.seconds * 1000).toLocaleString()) : ''}</div>
          
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          {editMode ? (
            <>
              <button
                className="bg-gray-200 px-4 py-2 rounded-xl font-semibold"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >Cancel</button>
              <button
                className="bg-brand text-white px-4 py-2 rounded-xl font-semibold shadow-soft hover:bg-brand-dark transition"
                onClick={handleSave}
                disabled={saving}
              >{saving ? 'Saving...' : 'Save'}</button>
            </>
          ) : (
            <button
              className="bg-brand text-white px-4 py-2 rounded-xl font-semibold shadow-soft hover:bg-brand-dark transition"
              onClick={() => setEditMode(true)}
            >Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}
