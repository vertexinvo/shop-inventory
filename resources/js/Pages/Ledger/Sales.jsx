import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { BiExport } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

export default function Sales({ auth, sales }) {
  const [selectId, setSelectId] = useState([]);

  const handleSearchSubmit = (values) => {
    router.get(route('ledger.sales'), { search: values.search }, { preserveState: true });
  };

  const handleClearSearch = (setFieldValue) => {
    setFieldValue('search', '');
    router.get(route('ledger.sales'));
  };

  const goToLedger = (codeOrId) => {
    router.get(route('ledger.customers.salesLedger', codeOrId));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => window.history.back()}
              title="Back"
            />
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales Ledger</h2>
          </div>
          <a
            href={route('ledger.sales.csvexport')}
            className='group relative flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg focus:ring-4 focus:ring-cyan-300'
          >
            <BiExport className="mr-2 w-5 h-5" /> Export CSV File
          </a>
        </div>
      }
    >
      <Head title="Sales Ledger" />

      <div className="flex flex-col px-5 mt-4 mx-auto w-full">
        <div className="flex justify-start items-center mb-4">
          <Formik initialValues={{ search: '' }} onSubmit={handleSearchSubmit}>
            {({ values, setFieldValue, handleSubmit }) => (
              <Form className="w-full max-w-md">
                <div className="relative">
                  <Field name="search">
                    {({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          placeholder="Search..."
                          className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-sm hover:shadow-md"
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <button
                          type="submit"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500"
                          aria-label="Search"
                        >
                          <FaSearch className="w-4 h-4" />
                        </button>
                        {field.value && (
                          <button
                            type="button"
                            onClick={() => handleClearSearch(setFieldValue)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                            aria-label="Clear search"
                          >
                            <FaXmark className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </Field>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="text-xs uppercase bg-gray-200 text-gray-700">
              <tr>
                {['User ID', 'Person Info', 'Contact', 'Address', 'Total Orders', 'Total Amount', 'Total Amount Paid', 'Total Amount Pending', 'Action'].map((label, idx) => (
                  <th key={idx} className="p-4 text-left text-sm font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center">No data available</td>
                </tr>
              ) : (
                sales.data.map((item) => (
                  <tr key={item.id || item.code} className="odd:bg-gray-50 border-b">
                    <td className="p-4 text-sm">{item.code || item.id}</td>
                    <td className="p-4 text-sm">
                      <p className="text-sm text-black">Person Name: {item.name || 'N/A'}</p>
                      {item.email && <p className="text-xs text-gray-500">Email: {item.email}</p>}
                    </td>
                    <td className="p-4 text-sm">{item.phone || 'N/A'}</td>
                    <td className="p-4 text-sm">{item.address || 'N/A'}</td>
                    <td className="p-4 text-sm">{item.total_orders || 0}</td>
                    <td className="p-4 text-sm">{item.total_orders_amount || 0}</td>
                    <td className="p-4 text-sm">{item.total_orders_amount_paid || 0}</td>
                    <td className="p-4 text-sm">{item.total_order_amount_pending || 0}</td>
                    <td className="p-4">
                      <button
                        onClick={() => goToLedger(item.code || item.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        Ledger
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 bg-gray-50 border-t flex flex-wrap items-center justify-between">
            <span>
              Showing {sales.from} - {sales.to} of {sales.total}
            </span>
            <nav aria-label="Pagination">
              <ul className="inline-flex items-center gap-1">
                {sales.links.map((link, index) => {
                  const label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                  return (
                    <li key={index}>
                      <button
                        onClick={() => link.url && router.visit(link.url)}
                        disabled={!link.url}
                        className={`px-3 py-1 rounded-md ${link.active ? 'bg-black text-white' : 'hover:bg-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                        dangerouslySetInnerHTML={{ __html: label }}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}