import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaUserCheck, FaUserLock, FaUsers, FaXmark } from 'react-icons/fa6';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { SiMicrosoftexcel } from "react-icons/si";
import { BiExport } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';


export default function Sales(props) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const { auth, sales } = props
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => window.history.back()}
              title="Back"
            />
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <a
              href={route('ledger.sales.csvexport')}
              className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'
            >
              <span className="flex items-center gap-x-1 transition-all duration-200 rounded-md px-4 py-2 text-sm">
                <BiExport className="h-5 w-5" />
                Export CSV File
              </span>
            </a>

          </div>
        </div>
      }
    >
      <Head title="Sales Ledger" />


      <div className="flex flex-col px-5  mt-10 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">

            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">



              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('ledger.sales'), { search: values.search }, { preserveState: true });
                }}
              >
                {({ values, setFieldValue, handleSubmit, errors, touched }) => (
                  <Form className="w-full flex items-center gap-3">
                    <div className="relative w-full md:max-w-md">
                      <Field name="search">
                        {({ field, form }) => (
                          <div className="relative">
                            <input
                              {...field}
                              type="text"
                              placeholder="Search..."
                              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-md placeholder-gray-400 text-gray-800"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit();
                              }}
                            />
                            {/* Search Icon */}
                            <button
                              type="submit"
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 focus:outline-none transition-colors"
                              aria-label="Search"
                            >
                              <FaSearch className="w-4 h-4" />
                            </button>
                            {/* Clear Icon */}
                            {field.value && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue('search', '');
                                  router.get(route('ledger.sales'));
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                                aria-label="Clear search"
                              >
                                <FaXmark className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="whitespace-nowrap text-xs uppercase bg-gray-200 text-gray-700 tracking-wide border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">User ID</th>
                  <th className="p-4 text-left text-sm font-semibold">Person Info</th>
                  <th className="p-4 text-left text-sm font-semibold">Contact</th>
                  <th className="p-4 text-left text-sm font-semibold">Address</th>
                  <th className="p-4 text-left text-sm font-semibold">Total Orders</th>
                  <th className="p-4 text-left text-sm font-semibold">Total Amount</th>
                  <th className="p-4 text-left text-sm font-semibold">Total Amount Paid</th>
                  <th className="p-4 text-left text-sm font-semibold">Total Amount Pending</th>
                  <th className="p-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="whitespace-nowrap">
                {sales.data.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  sales.data.map((item) => (
                    <tr
                      key={item.id || item.code}
                      className="odd:bg-gray-50 border-b border-gray-300"
                    >
                      <td className="p-4 text-sm">{item.code || item.id}</td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <p className="text-sm text-black">
                              Person Name: {item.name || 'N/A'}
                            </p>
                            {item.email && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Email: {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{item.phone || 'N/A'}</td>
                      <td className="p-4 text-sm">{item.address || 'N/A'}</td>
                      <td className="p-4 text-sm">{item.total_orders || 0}</td>
                      <td className="p-4 text-sm">{item.total_orders_amount || 0}</td>
                      <td className="p-4 text-sm">{item.total_orders_amount_paid || 0}</td>
                      <td className="p-4 text-sm">{item.total_order_amount_pending || 0}</td>
                      <td className="p-4 flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.get(
                              route('ledger.customers.salesLedger', item.code || item.id)
                            )
                          }
                          className="mr-4 flex items-center space-x-2 bg-blue-500 text-white rounded px-4 py-1"
                          title="View Invoice"
                        >
                          <LiaFileInvoiceSolid className="w-5 h-5 text-white" />
                          <span className="hover:text-black">Ledger</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
            <span className="flex items-center col-span-3">
              Showing {sales.from} - {sales.to} of {sales.total}
            </span>
            <span className="col-span-2"></span>

            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul className="inline-flex items-center">
                  {/* Previous button */}
                  <li>
                    <button
                      onClick={() => sales.links[0].url && router.visit(sales.links[0].url)}
                      className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none"
                      aria-label="Previous"
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>

                  {/* Page numbers */}
                  {(() => {
                    let lastShownIndex = -1;
                    const activeIndex = sales.links.findIndex((l) => l.active);
                    return sales.links
                      .slice(1, -1)
                      .filter((link, index, array) => {
                        const currentIndex = parseInt(link.label, 10);
                        if (isNaN(currentIndex)) return true;

                        const rangeStart = Math.max(0, activeIndex - 2);
                        const rangeEnd = Math.min(array.length - 1, activeIndex + 2);

                        return (
                          index < 3 ||
                          index > array.length - 4 ||
                          (index >= rangeStart && index <= rangeEnd)
                        );
                      })
                      .map((link, index) => {
                        const currentIndex = parseInt(link.label, 10);
                        const isEllipsis =
                          !isNaN(currentIndex) &&
                          lastShownIndex !== -1 &&
                          currentIndex - lastShownIndex > 1;

                        if (!isNaN(currentIndex)) {
                          lastShownIndex = currentIndex;
                        }

                        return (
                          <li key={index}>
                            {isEllipsis ? (
                              <span className="px-3 py-1">...</span>
                            ) : link.active ? (
                              <button
                                className="px-3 py-1 text-white bg-black rounded-md"
                                aria-current="page"
                              >
                                {link.label}
                              </button>
                            ) : (
                              <button
                                onClick={() => link.url && router.visit(link.url)}
                                className="px-3 py-1 rounded-md"
                              >
                                {link.label}
                              </button>
                            )}
                          </li>
                        );
                      });
                  })()}

                  {/* Next button */}
                  <li>
                    <button
                      onClick={() =>
                        sales.links[sales.links.length - 1].url &&
                        router.visit(sales.links[sales.links.length - 1].url)
                      }
                      className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none"
                      aria-label="Next"
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </span>
          </div>
        </div>


      </div>





    </AuthenticatedLayout>
  );
}

