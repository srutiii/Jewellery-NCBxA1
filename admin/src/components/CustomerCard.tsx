import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiEye, FiMail, FiPhone } from 'react-icons/fi';

type CustomerCardProps = {
  customer: {
    id: string;
    name?: string;
    full_name?: string;
    email?: string;
    email_address?: string;
  };
};

export default function CustomerCard({ customer }: CustomerCardProps) {
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-customer/${customer.id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/customer-detail/${customer.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-brand/20 transform hover:-translate-y-1">
      {/* Customer Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {(
            customer.full_name?.[0] ||
            customer.name?.[0] ||
            customer.email?.[0] ||
            customer.email_address?.[0] ||
            'N'
          ).toUpperCase()}
        </div>
      </div>

      {/* Customer Info */}
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-brand transition-colors">
          {customer.full_name || customer.name || customer.email || customer.email_address || 'Unnamed Customer'}
        </h3>

        {(customer.email || customer.email_address) && (
          <div className="flex items-center justify-center text-sm text-gray-500 mb-1">
            <FiMail className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[200px]">{customer.email || customer.email_address}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleView}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
        >
          <FiEye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 px-3 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
        >
          <FiEdit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
