import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";
// import { QrReader } from 'react-qr-reader';

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
        <div className='text-2xl'>
          Scan The Qr
          {/* <QrReader
            delay={300}
            style={{ width: '100%' }}
            onError={handleError}
            onScan={handleScan}
          /> */}
        </div>
        {/* show product detail that is scanned */}

     <div>
     Product Info	Supplier Invoice	Purchase price	Selling price	Categories	Brands	Warranty period	Is Borrow	Quantity	Stock Status	Is Exchange	Type
     </div>

      </AuthenticatedLayout>
    </>
  )
}

export default ScanProduct