import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import * as Yup from 'yup';
import { MdKeyboardBackspace } from "react-icons/md";

export default function Setting(props) {
  const { auth, roles } = props
  return (
    <AuthenticatedLayout
      user={auth.user}
      header
      
    >
      <Head title="Setting" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  px-4 py-8">
        {/* Roles */}
        <Link href={route('role.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Roles</h2>
            <p className="text-sm text-gray-500 mt-1">Manage system access roles.</p>
          </div>
        </Link>

        {/* Categories */}
        <Link href={route('category.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Organize your product categories.</p>
          </div>
        </Link>

        {/* Brands */}
        <Link href={route('brand.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Brands</h2>
            <p className="text-sm text-gray-500 mt-1">Manage brand listings.</p>
          </div>
        </Link>

        {/* User Management */}
        <Link href={route('user.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">User Management</h2>
            <p className="text-sm text-gray-500 mt-1">Control user accounts and permissions.</p>
          </div>
        </Link>

        {/* Tax */}
        <Link href={route('tax.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Tax</h2>
            <p className="text-sm text-gray-500 mt-1">Set up applicable tax rules.</p>
          </div>
        </Link>

        {/* Shipping Charges */}
        <Link href={route('shippingrate.index')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Shipping Charges</h2>
            <p className="text-sm text-gray-500 mt-1">Configure delivery rates by zone.</p>
          </div>
        </Link>

        {/* Site Setting */}
        <Link href={route('setting.edit')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Site Setting</h2>
            <p className="text-sm text-gray-500 mt-1">Manage global site preferences.</p>
          </div>
        </Link>

        {/* Backup Database */}
        <a href={route('setting.db')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Backup Database</h2>
            <p className="text-sm text-gray-500 mt-1">Export and download backups safely.</p>
          </div>
        </a>

        {/* Activity Logs */}
        <a href={route('setting.activitylog')} className="block group">
          <div className="bg-white border border-gray-200 hover:border-black hover:shadow-lg transition rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-black">Activity Logs</h2>
            <p className="text-sm text-gray-500 mt-1">Track recent user/system activities.</p>
          </div>
        </a>
      </div>







    </AuthenticatedLayout>
  );
}

