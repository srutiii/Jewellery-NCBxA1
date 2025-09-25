import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  return (
    <div
      className="bg-white rounded-xl shadow-soft p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/customer-detail/${customer.id}`)}
    >
      <span className="font-bold text-lg text-brand mb-2">
        {customer.full_name || customer.name || customer.email || customer.email_address || 'No Name'}
      </span>
      <span className="text-sm text-gray-500">View Details</span>
    </div>
  );
}
