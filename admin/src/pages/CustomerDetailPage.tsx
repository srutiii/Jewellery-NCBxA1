import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import {
  FiArrowLeft,
  FiEdit3,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiShoppingBag,
  FiRefreshCw,
  FiInfo,
  FiTrash2
} from 'react-icons/fi';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch customer data via API
  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      console.log('Fetching customer via API:', id);
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/customers/${id}`);
        if (response.ok) {
          const customerData = await response.json();
          console.log('Customer data loaded:', customerData);
          setCustomer(customerData);
        } else {
          console.log('Customer not found');
          setCustomer(null);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // Add visibility change listener to refresh when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && id) {
        console.log('Tab became visible, refreshing data');
        handleRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [id]);

  // Add periodic refresh every 30 seconds
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(() => {
      console.log('Periodic refresh triggered');
      handleRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id]);

  // Manual refresh function
  const handleRefresh = async () => {
    if (!id) return;

    console.log('Manual refresh triggered for customer:', id);
    setRefreshing(true);
    try {
      // Use API endpoint instead of direct Firebase query
      const response = await fetch(`http://localhost:3000/customers/${id}`);
      if (response.ok) {
        const freshData = await response.json();
        console.log('Fresh data fetched:', freshData);
        setCustomer(freshData);
      } else {
        console.log('Customer not found during refresh');
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error refreshing customer:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Delete customer function
  const handleDelete = async () => {
    if (!id || !customer) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${customer.full_name || customer.name || 'this customer'}?\n\n` +
      `This will:\n` +
      `✓ Delete from Firebase immediately\n` +
      `✓ Delete from Odoo CRM when you click "Sync to Odoo"\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Customer deleted successfully!\n\nRemember to click "Sync to Odoo" to remove from CRM.');
        navigate('/');
      } else {
        const error = await response.json();
        alert('❌ Failed to delete customer: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('❌ Failed to delete customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-500">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Customer not found</h3>
          <p className="text-gray-500 mb-4">The customer you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
                <p className="text-gray-500">View and manage customer information</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate(`/edit-customer/${id}`)}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiEdit3 className="w-4 h-4" />
                Edit Customer
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8" key={customer?.id + customer?.updated_at}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-4">
                  {(customer.full_name || customer.name || 'U')[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {customer.full_name || customer.name || 'No Name'}
                </h2>
                <p className="text-gray-500">Customer ID: {customer.id}</p>
                {customer.updated_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last updated: {new Date(customer.updated_at.seconds * 1000).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                {(customer.email_address || customer.email) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiMail className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{customer.email_address || customer.email}</p>
                    </div>
                  </div>
                )}

                {(customer.contact_number || customer.phone) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiPhone className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{customer.contact_number || customer.phone}</p>
                    </div>
                  </div>
                )}

                {customer.address && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiMapPin className="w-5 h-5 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{customer.address}</p>
                      {(customer.location || customer.city) && (
                        <p className="text-sm text-gray-600">{customer.location || customer.city}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiUser className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="font-medium">{customer.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Marital Status</label>
                  <p className="font-medium">{customer.marital_status || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  <p className="font-medium">{formatDate(customer.date_of_birth || customer.dob)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Anniversary Date</label>
                  <p className="font-medium">{formatDate(customer.anniversary_date)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Community</label>
                  <p className="font-medium">{customer.community || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Sub Community</label>
                  <p className="font-medium">{customer.sub_community || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Business Intelligence */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiInfo className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Business Intelligence</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Occasion for Purchase</label>
                  <p className="font-medium">{customer.occasion_for_purchase || customer.occasion || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Budget Mentioned</label>
                  <p className="font-medium">{customer.budget_mentioned || customer.budget || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Frequency of Visit</label>
                  <p className="font-medium">{customer.frequency_of_visit || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gift Recipient Relationship</label>
                  <p className="font-medium">{customer.gift_recipient_relationship || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Items Shown/Discussed</label>
                  <p className="font-medium">{customer.items_shown_or_discussed || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Expressed Interest/Intent</label>
                  <p className="font-medium">{customer.expressed_interest_or_intent || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">In-store Query</label>
                  <p className="font-medium">{customer.in_store_query || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiShoppingBag className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Purchase History</h3>
              </div>

              {Array.isArray(customer.purchase_history) && customer.purchase_history.length > 0 ? (
                <div className="space-y-4">
                  {customer.purchase_history
                    .sort((a: any, b: any) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
                    .map((purchase: any, idx: number) => (
                      <div key={purchase.purchase_id || idx} className="border border-gray-200 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-gray-500">Purchase Date</label>
                            <p className="font-medium">{formatDate(purchase.purchase_date)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Item</label>
                            <p className="font-medium">{purchase.item_description || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Price</label>
                            <p className="font-medium">₹{purchase.price || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Category</label>
                            <p className="font-medium">{purchase.item_category || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Metal</label>
                            <p className="font-medium">{purchase.metal_type} {purchase.metal_purity}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Gemstone</label>
                            <p className="font-medium">{purchase.gemstone_details?.type || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Purchase History</h4>
                  <p className="text-gray-500">This customer hasn't made any purchases yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
