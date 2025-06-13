import React from 'react';

export default function Card({ title, value, icon, link }) {
  const card = (
    <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-200 hover:scale-[1.01] transition-all duration-200 ease-in-out transform">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-xl font-semibold mt-1">{value}</p>
      </div>
      <div className="text-gray-600">{icon}</div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block w-full">
        {card}
      </a>
    );
  }

  return card;
}
