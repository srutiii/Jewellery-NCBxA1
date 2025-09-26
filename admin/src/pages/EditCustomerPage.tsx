import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FiSave, FiArrowLeft, FiUser, FiMail, FiMapPin } from 'react-icons/fi';

type CustomerData = {
  // Primary fields
  full_name?: string;
  email_address?: string;
  contact_number?: string;
  address?: string;
  community?: string;
  sub_community?: string;
  location?: string;
  gender?: string;
  marital_status?: string;
  occasion_for_purchase?: string;
  date_of_birth?: string;
  anniversary_date?: string;
  budget_mentioned?: string;

  // Legacy fields for backward compatibility
  phone?: string;
  email?: string;
  city?: string;
  dob?: string;
  occasion?: string;
  budget?: string;

  // Additional fields
  purchase_history?: any[];
  gift_recipient_relationship?: string;
  items_shown_or_discussed?: string;
  expressed_interest_or_intent?: string;
  in_store_query?: string;
  frequency_of_visit?: string;
  diamond_shape?: string;
  first_visit?: string;
  lead_source?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
};

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState<CustomerData>({});

  useEffect(() => {
    async function fetchCustomer() {
      if (!id) return;

      try {
        const docRef = doc(db, 'customers', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCustomer(docSnap.data() as CustomerData);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'customers', id);

      // Ensure both contact_number and phone are updated for consistency
      const updateData = {
        ...customer,
        updated_at: new Date()
      };

      // Sync legacy fields with current fields
      if (customer.contact_number) {
        updateData.phone = customer.contact_number;
      }
      if (customer.email_address) {
        updateData.email = customer.email_address;
      }
      if (customer.location) {
        updateData.city = customer.location;
      }
      if (customer.date_of_birth) {
        updateData.dob = customer.date_of_birth;
      }
      if (customer.occasion_for_purchase) {
        updateData.occasion = customer.occasion_for_purchase;
      }
      if (customer.budget_mentioned) {
        updateData.budget = customer.budget_mentioned;
      }

      await updateDoc(docRef, updateData);

      navigate('/');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-brand hover:bg-brand/5 rounded-xl transition-all duration-200"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Edit Customer</h1>
                <p className="text-gray-500">Update customer information</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiUser className="w-5 h-5 text-brand" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={customer.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={customer.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={customer.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    value={customer.marital_status || ''}
                    onChange={(e) => handleInputChange('marital_status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiMail className="w-5 h-5 text-brand" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={customer.email_address || ''}
                    onChange={(e) => handleInputChange('email_address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={customer.contact_number || ''}
                    onChange={(e) => handleInputChange('contact_number', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={customer.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Community Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FiMapPin className="w-5 h-5 text-brand" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Community & Location</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Community</label>
                  <input
                    type="text"
                    value={customer.community || ''}
                    onChange={(e) => handleInputChange('community', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Community</label>
                  <input
                    type="text"
                    value={customer.sub_community || ''}
                    onChange={(e) => handleInputChange('sub_community', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={customer.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}