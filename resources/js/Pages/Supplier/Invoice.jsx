import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LiaFileInvoiceSolid } from "react-icons/lia";

export default function List(props) {
  const { auth, supplier, suppliers } = props

  return (
    <AuthenticatedLayout
      Product={auth.Product}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Suplier #{suppliers.code}</h2>}
    >
      <Head title="Invoice" />

    

        <div className="p-4 ">
          <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-200 py-4 px-6">
              <h3 className="text-xl font-semibold text-gray-800">{suppliers.person_name || 'N/A'}</h3>
              <p className="text-sm text-gray-600">{suppliers.email}</p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Contact Field */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Contact:</span>
                  <span className="text-gray-800">{suppliers.contact || 'N/A'}</span>
                </div>
                {/* Address Field */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Address:</span>
                  <span className="text-gray-800">{suppliers.address || 'N/A'}</span>
                </div>
                {/* Code Field */}
                <div className="flex justify-between ">
                  <span className="font-medium text-gray-600">Code:</span>
                  <span className="text-gray-800"><b>{suppliers.code}</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>
     
      <div className="flex flex-col px-4  mt-2 mx-auto w-full">
        <div className="w-full ">

          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">

            <div className="flex flex-col md:flex-row space-x-0 md:space-x-2">

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('supplier.index'), { search: values.search }, { preserveState: true });
                }}

              >
                {({ values, setFieldValue, handleSubmit, errors, touched }) => (

                  <Form className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
                    <div className="relative">
                      <Field
                        name="search"
                        type="text"
                        placeholder="Search..."
                        className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => { setFieldValue('search', ''); router.get(route('supplier.index')) }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        ✖
                      </button>
                    </div>


                    <button
                      type="submit"
                      className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
                    >
                      Search
                    </button>

                  </Form>
                )}
              </Formik>

            </div>
          </div>

          <div className="overflow-x-auto">
           
            <div className="font-[sans-serif] overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="whitespace-nowrap">
                  <tr>
                    <th class="p-4 text-left text-sm font-semibold text-black">
                      Supplier Id
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Invoice No</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Invoice Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Due Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Total Payment</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Paid Amount</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Outstanding</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Payment Method</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Cheque No</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Cheque Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Bank Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-black">Status</th>
                  </tr>
                </thead>

                <tbody className="whitespace-nowrap">
                  {supplier.data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="p-4 text-center">
                        No Supplier found.
                      </td>
                    </tr>
                  )}
                  {supplier.data.map((item, index) => (

                    <tr className={`${item?.total_amount_pending > 0 ? 'bg-red-100' : ''}`}>
                      <td className="p-4 text-sm text-black">{item.supplier_id || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.invoice_no || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.invoice_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.due_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.total_payment || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.paid_amount || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.outstanding || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.payment_method || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.cheque_no || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.cheque_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.bank_name || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.status}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span class="flex items-center col-span-3"> Showing {supplier.from} - {supplier.to} of {supplier.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => supplier.links[0].url ? router.get(supplier.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = supplier.links.findIndex((l) => l.active);

                      return supplier.links
                        .slice(1, -1) // Exclude the first and last items
                        .filter((link, index, array) => {
                          const currentIndex = parseInt(link.label, 10); // Parse label as number
                          if (isNaN(currentIndex)) return true; // Always include non-numeric items like "..."

                          // Adjust range dynamically based on the active index
                          const rangeStart = Math.max(0, activeIndex - 2); // Start range around active
                          const rangeEnd = Math.min(array.length - 1, activeIndex + 2); // End range around active

                          // Show links within the range or first/last few
                          return (
                            index < 3 || // First 3 pages
                            index > array.length - 4 || // Last 3 pages
                            (index >= rangeStart && index <= rangeEnd) // Pages close to the active page
                          );
                        })
                        .map((link, index, array) => {
                          const currentIndex = parseInt(link.label, 10); // Parse label as a number
                          const isEllipsis =
                            !isNaN(currentIndex) &&
                            lastShownIndex !== -1 &&
                            currentIndex - lastShownIndex > 1; // Check for gaps

                          // Update lastShownIndex only for valid numeric labels
                          if (!isNaN(currentIndex)) {
                            lastShownIndex = currentIndex;
                          }

                          return (
                            <li key={index}>
                              {isEllipsis ? (
                                <span className="px-3 py-1">...</span>
                              ) : link.active ? (
                                // Active page button
                                <button
                                  className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-blue-600 dark:bg-gray-100 border border-r-0 border-blue-600 dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple"
                                  aria-current="page"
                                >
                                  {link.label}
                                </button>
                              ) : (
                                // Inactive link button
                                <button
                                  onClick={() => link.url && window.location.assign(link.url)}
                                  className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                                >
                                  {link.label}
                                </button>
                              )}
                            </li>
                          );
                        });
                    })()}


                    <li>
                      <button onClick={() => supplier.links[supplier.links.length - 1].url && window.location.assign(supplier.links[supplier.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
                        <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
              </span>
            </div>
          </div>
        </div>


      </div>

    </AuthenticatedLayout>
  );
}

