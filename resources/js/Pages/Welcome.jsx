import { Link } from "@inertiajs/react";
import React from "react";

export default function Welcome() {
  return (
    // <div className="bg-slate-700 min-h-screen flex items-center justify-center">
    <div className="bg-white md:p-12 lg:p-12 xl:p-12 p-8 mx-auto h-screen">
      <header className="flex justify-between items-center mb-6">
        <a href="#">
          <img
            src="/images/logo2.png"
            className="block h-10 w-auto fill-current text-gray-800"
          />
        </a>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 2xl:text-6xl">
            Inventory Management
          </h1>
          <p className="text-gray-600 mb-6 2xl:text-3xl">
            Streamline your operations and gain full control over your inventory with a powerful, efficient, and user-friendly management solution. Optimize stock levels, reduce waste, and ensure seamless supply chain operations.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2  2xl:text-2xl">
            <li>Monitor stock in real-time with precision tracking.</li>
            <li>Improve decision-making through detailed analytics.</li>
            <li>Reduce operational costs with automated workflows.</li>
          </ul>

          <Link
            href={route("login")}
            className="mt-6 relative inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
        <div className="relative flex justify-center">
          <img
            src="https://cdn.create.vista.com/api/media/small/678997560/stock-vector-clipboard-text-inventory-control-boxes-inventory-management-vector-illustration"
            className="w-3/4 h-auto object-contain"
          />
        </div>
      </div>
    </div>
    // </div>
  );
}
