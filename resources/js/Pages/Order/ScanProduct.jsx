import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";

const ScanProduct = () => {
  return (
    <>
    <AuthenticatedLayout
   
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('order.index'))}
            title="Back"
          /><h2 className="font-semibold text-xl text-gray-800 leading-tight">Scan Product</h2>
        </>}
    >
      <Head title="Scan Product" />
      <div className="p-4 bg-white">
      <div className='text-2xl mb-4'>
        Scan The QR
        <img src='/images/scanQR.jpg' alt="Inventory" className="h-32 w-32 mt-2" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Product Info</th>
              <th className="border px-4 py-2">Supplier Invoice</th>
              <th className="border px-4 py-2">Purchase Price</th>
              <th className="border px-4 py-2">Selling Price</th>
              <th className="border px-4 py-2">Categories</th>
              <th className="border px-4 py-2">Brands</th>
              <th className="border px-4 py-2">Warranty Period</th>
              <th className="border px-4 py-2">Is Borrow</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Stock Status</th>
              <th className="border px-4 py-2">Is Exchange</th>
              <th className="border px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border">
              <td className="border px-4 py-2">Example Product</td>
              <td className="border px-4 py-2">INV-12345</td>
              <td className="border px-4 py-2">$50</td>
              <td className="border px-4 py-2">$75</td>
              <td className="border px-4 py-2">Electronics</td>
              <td className="border px-4 py-2">BrandX</td>
              <td className="border px-4 py-2">1 Year</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">In Stock</td>
              <td className="border px-4 py-2">No</td>
              <td className="border px-4 py-2">Retail</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

      </AuthenticatedLayout>
    </>
  )
}

export default ScanProduct