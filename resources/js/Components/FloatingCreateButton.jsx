import React from 'react'
import { router } from '@inertiajs/react';

const FloatingCreateButton = ({ routeName, title = "Create", className = "" }) => {
    return (
      <button
        onClick={() => router.get(route(routeName))}
        className={`fixed bottom-6 right-6 bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        title={title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    );
  };

export default FloatingCreateButton;