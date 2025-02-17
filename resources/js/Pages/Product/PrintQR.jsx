import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { MdKeyboardBackspace } from 'react-icons/md';

const PrintQR = ({ products }) => {

     const setting = usePage().props.setting;

  return (
    <>
<AuthenticatedLayout
  header={
    <>
      <MdKeyboardBackspace
        size={20}
        className="mr-2 cursor-pointer text-gray-600 hover:text-gray-800 transition duration-300"
        onClick={() => router.get(route('product.index'))}
        title="Back"
      />
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">QR Codes</h2>
    </>
  }
>
  <Head title="Purchase" />

  <style>
    {`
      @media print {
        /* Hide unnecessary elements */
        .no-print,
        nav,
        aside,
        .fixed,
        .toastify-container,
        .ConfirmModal {
          display: none !important;
        }

        /* Adjust main content for full width */
        .sm\\:ml-64 {
          margin-left: 0 !important;
        }

        /* Ensure the grid layout is optimized for printing */
        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* 5 columns for printing */
          gap: 10px; /* Adjust gap for printing */
        }

        /* Ensure each QR code container fits well on the page */
        .flex.flex-col {
          page-break-inside: avoid; /* Avoid breaking QR codes across pages */
          border: 1px solid #ccc; /* Add border for better visibility */
          padding: 10px; /* Add padding for spacing */
          text-align: center; /* Center content */
        }

        /* Adjust QR code size for printing */
        .react-qr-code {
          width: 100% !important;
          height: auto !important;
          max-width: 150px; /* Limit QR code size for printing */
          margin: 0 auto; /* Center QR code */
        }

        /* Add a gap before content begins */
        .print-gap {
          margin-top: 20px;
        }

        /* Handle page breaks for large content */
        .page-break {
          page-break-before: always;
        }

        /* Hide the print button during printing */
        .hide-print {
          display: none;
        }
      }
    `}
  </style>

  <div className="p-4 sm:p-6 md:p-8 lg:p-10 my-8 mx-8  rounded-lg border border-gray-300 bg-gradient-to-br from-gray-50 to-white">
    <div className="my-4 text-center hide-print">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Purchases QR Codes</h1>
      <p className="text-gray-600">Scan the QR codes to view product details.</p>
    </div>

    {/* Responsive Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
  {products.map((product, index) =>
    Array.from({ length: product?.stock?.quantity || 1 }).map((_, qtyIndex) => (
      <div
        key={`${index}-${qtyIndex}`} // Unique key using product index and quantity index
        className="flex flex-col border border-gray-200 items-center justify-center p-6 rounded-lg bg-white hover:shadow-md transition-shadow duration-300 break-inside-avoid"
      >
        <QRCode
          value={product?.code || product?.id || 'N/A'}
          size={150}
          logoOpacity={0.8}
          className="rounded-lg"
          logoImage={setting.site_favicon}
        />
        <div className="mt-3 text-sm font-medium text-gray-700">
          {product?.code || product?.id || 'N/A'}
        </div>
      </div>
    ))
  )}
</div>


    {/* Print Button */}
    <div className="mt-8 text-center hide-print">
      <button
        onClick={() => window.print()}

        className="bg-black text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
      >
        Print QR Codes
      </button>
    </div>
  </div>
</AuthenticatedLayout>
    </>



  );
};

export default PrintQR;