import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from 'react-icons/md';

export default function Sales({ auth }) {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportSelection = (reportType) => {
    setSelectedReport(reportType);
    // Navigate to the specific report route
    if (reportType === 'sales') {
      router.visit(route('ledger.sales'));
    } else if (reportType === 'supplier') {
      router.visit(route('ledger.supplier'));
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}
    
    header={
             <div className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                                <MdKeyboardBackspace
                                    size={20}
                                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                                    onClick={() => window.history.back()}
                                    title="Back"
                                />
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Ledger</h2>
                            </div>
                        </div>
    }
    >
      <Head title="Reports" />

      <div className="flex flex-col px-5 mt-4 mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ledger</h1>
          <p className="text-gray-600">Select a report type to view detailed data</p>
        </div>

        {/* Report Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Sales Report Card */}
          <div 
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            onClick={() => handleReportSelection('sales')}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                
                <h2 className="text-xl font-semibold text-gray-900 ">Sales Ledger</h2>
              </div>
             <p className="text-gray-600 mb-4">
                Access detailed sales insights including revenue trends, product performance, and customer data.
                </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                <span>View Report</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Supplier Report Card */}
          <div 
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
            onClick={() => handleReportSelection('supplier')}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Supplier Ledger</h2>
              </div>
             <p className="text-gray-600 mb-4">
                Review supplier performance, purchase history, delivery statistics, and vendor relationships.
                </p>

              <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                <span>View Report</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </AuthenticatedLayout>
  );
}