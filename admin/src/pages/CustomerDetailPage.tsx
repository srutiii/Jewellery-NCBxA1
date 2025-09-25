import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      const ref = doc(db, 'customers', id!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCustomer({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }
    if (id) fetchCustomer();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!customer) return <div className="p-8 text-center">Customer not found</div>;

  return (
    <div className="min-h-screen bg-brand-light">
      <Topbar />
      <div className="w-full mx-auto px-4">
        <button className="mb-2 text-brand underline" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="text-2xl font-bold text-brand mb-2">{customer.full_name || customer.name}</h2>
        <div className="space-y-1 text-sm mb-4">
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
        </div>
        <h3 className="text-xl font-bold mb-1">Details & Purchase History</h3>
        <div className="overflow-x-auto mb-2">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-brand text-white">
              <tr>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Occasion</th>
                <th className="px-2 py-1 text-left">Budget</th>
                <th className="px-2 py-1 text-left">Interest/Intent</th>
                <th className="px-2 py-1 text-left">Frequency of Visit</th>
                <th className="px-2 py-1 text-left">In-store Query</th>
                <th className="px-2 py-1 text-left">Items Shown/Discussed</th>
                <th className="px-2 py-1 text-left">Purchase ID</th>
                <th className="px-2 py-1 text-left">Item</th>
                <th className="px-2 py-1 text-left">Category</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Metal</th>
                <th className="px-2 py-1 text-left">Gemstone</th>
                <th className="px-2 py-1 text-left">Price</th>
                <th className="px-2 py-1 text-left">Discount</th>
                <th className="px-2 py-1 text-left">Sub Community</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(customer.purchase_history) && customer.purchase_history.length > 0 ? (
                customer.purchase_history
                  .sort((a: any, b: any) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
                  .map((purchase: any, idx: number) => (
                    <tr key={purchase.purchase_id || idx} className="border-b">
                      <td className="px-2 py-1">{purchase.purchase_date}</td>
                      <td className="px-2 py-1">{customer.occasion || customer.occasion_for_purchase}</td>
                      <td className="px-2 py-1">{customer.budget || customer.budget_mentioned}</td>
                      <td className="px-2 py-1">{customer.expressed_interest_or_intent}</td>
                      <td className="px-2 py-1">{customer.frequency_of_visit}</td>
                      <td className="px-2 py-1">{customer.in_store_query}</td>
                      <td className="px-2 py-1">{customer.items_shown_or_discussed}</td>
                      <td className="px-2 py-1">{purchase.purchase_id}</td>
                      <td className="px-2 py-1">{purchase.item_description}</td>
                      <td className="px-2 py-1">{purchase.item_category}</td>
                      <td className="px-2 py-1">{purchase.item_type}</td>
                      <td className="px-2 py-1">{purchase.metal_type} {purchase.metal_purity}</td>
                      <td className="px-2 py-1">{purchase.gemstone_details?.type}</td>
                      <td className="px-2 py-1">₹{purchase.price}</td>
                      <td className="px-2 py-1">{purchase.discount_applied?.type} {purchase.discount_applied?.percentage ? `${purchase.discount_applied.percentage}%` : ''}</td>
                      <td className="px-2 py-1">{purchase.sub_community}</td>
                    </tr>
                  ))
              ) : (
                <tr><td colSpan={16} className="px-3 py-2 text-center text-gray-400">No purchase history</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
