import React from 'react';

export default function Topbar() {
  return (
    <header className="flex items-center justify-between bg-white shadow-soft rounded-xl mx-4 mt-4 p-4 font-sans">
      <div className="flex items-center gap-3">
        <img src="/src/assets/logo-nemichand.svg" alt="Nemichand Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-brand">Nemichand Bamalwa</span>
      </div>
      <div className="flex items-center gap-4">
        <img src="/src/assets/profile-placeholder.svg" alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
        <button className="bg-brand text-white px-4 py-2 rounded-xl font-semibold shadow-soft hover:bg-brand-dark transition">Logout</button>
      </div>
    </header>
  );
}
