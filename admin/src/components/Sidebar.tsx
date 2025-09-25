import React from 'react';
import { FaUsers, FaHome } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-soft rounded-xl m-4 flex flex-col p-4 min-h-[90vh]">
      <div className="flex flex-col items-center gap-2 mb-8">
        <img src="/src/assets/logo-nemichand.svg" alt="Nemichand Logo" className="w-8 h-8 mb-2" />
        <h1 className="text-xl font-bold text-brand text-center">Nemichand Bamalwa</h1>
        <img src="/src/assets/profile-placeholder.svg" alt="Profile" className="w-12 h-12 rounded-full object-cover border mt-4 mb-2" />
        <button className="bg-brand text-white px-4 py-2 rounded-xl font-semibold shadow-soft hover:bg-brand-dark transition w-full mt-2">Logout</button>
      </div>
      <nav className="flex flex-col gap-4">
        <a href="#" className="flex items-center gap-2 text-brand font-semibold hover:bg-brand-light rounded-xl px-3 py-2 transition">
          <FaHome /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 text-brand font-semibold hover:bg-brand-light rounded-xl px-3 py-2 transition">
          <FaUsers /> Customers
        </a>
      </nav>
    </aside>
  );
}
