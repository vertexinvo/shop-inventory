import { Link } from "@inertiajs/react";
import React from "react";

export default function Welcome() {
  return (
    // <div className="bg-slate-700 min-h-screen flex items-center justify-center">
      <div className="bg-white md:p-12 lg:p-18 mx-auto">
        <header className="flex justify-between items-center mb-8">
        <a href="javascript:void(0)"><img src="/images/logo2.png" className=" block h-10 w-auto fill-current text-gray-800" />    </a>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-14">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Inventory Management</h1>
            <p className="text-gray-600 mb-6">
              Vestibulum molestie nisi nec nunc viverra efficitur. 
              Efficturquam tristique aliquam. Proin ut est lectus, risus quis sagittis porta.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Fusce luctus blandit nisi.</li>
              <li>Ut imperdiet dui at tincidunt mattis.</li>
            </ul>

            <Link href={route('login')} className="mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition">Login</Link>
          </div>
          <div className="flex justify-center items-center relative">
            <div className="bg-pink-100 rounded-md p-4 absolute -top-4 -left-6 shadow-md">
              <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 19H7v-7h3v7zm5 0h-3v-4h3v4zm5-4h-3v7h3v-7zm2-6H2V3h20v6zM20 5H4v2h16V5z"></path>
              </svg>
            </div>
            <div className="bg-violet-200 w-20 h-20 flex items-center justify-center rounded-lg shadow-md"></div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <h2 className="font-bold text-lg mb-2">Inventory</h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>Items Checked</li>
                <li>Updated Lists</li>
              </ul>
            </div>
            <div className="bg-green-200 rounded-lg w-24 h-24 absolute -bottom-4 -right-6 shadow-md"></div>
          </div>
        </div>
      </div>
    // </div>
  );
}
