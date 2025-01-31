import React from 'react';
import { QRCode } from 'react-qrcode-logo';

const PrintQR = ({ products }) => {
  console.log('Products:', products);

  return (
    <>
     {/* <AuthenticatedLayout
      Product={auth.Product}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('dashboard'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchase</h2>
        </>}
    > */}
      {/* <Head title="Purchase" /> */}
      <div className="my-4 text-center hide-print">
        <h1 className="text-2xl font-bold mb-4">Purchases QR Codes</h1>
      </div>

      {/* Scrollable Content */}
      
        {/* Grid Layout for QR Codes */}
        <div className="grid grid-cols-5 gap-4 print:grid-cols-3 print:gap-2">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col border border-gray-300 items-center justify-center p-4 break-inside-avoid"
            >
              {/* QR Code */}
              <QRCode
                value={product?.code || product?.id || 'N/A'} // Use optional chaining
                size={150} // Adjust size as needed
                logoOpacity={0.8} // Optional: Add a logo overlay
              />
              {/* Product Code/ID */}
              <div className="mt-2 text-sm font-medium">
                {product?.code || product?.id || 'N/A'}
              </div>
            </div>
          ))}
        </div>
     

      {/* Buttons */}
      <div className="mt-4 text-center">
        <button
          onClick={() => window.print()}
          className="ml-2 bg-black text-white py-2 px-4 mb-4 rounded shadow hover:bg-gray-600 transition duration-300"
        >
          Print
        </button>
      
      
      </div>
      {/* </AuthenticatedLayout> */}
    </>
    
    
  );
};

export default PrintQR;