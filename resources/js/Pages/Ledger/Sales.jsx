import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaUserCheck, FaUserLock, FaUsers } from 'react-icons/fa6';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { SiMicrosoftexcel } from "react-icons/si";


export default function Sales(props) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const { auth, sales } = props
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('dashboard'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales Ledger</h2>
        </>}
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
                  <Form className="flex flex-col md:flex-row w-full md:space-x-2 space-y-2 md:space-y-0">
                    <div className="relative w-full md:w-auto">
                      <Field
                        name="search"
                        type="text"
                        placeholder="Search..."
                        className="py-2 px-4 md:p-5  lg:p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black w-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('search', '');
                          router.get(route('ledger.sales'));
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        ✖
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600 w-full md:w-auto"
                    >
                      Search
                    </button>

                    <a
                       href={route('ledger.sales.csvexport')}
                      className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'>
                      <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                        <SiMicrosoftexcel className="mr-2 h-5 w-5" />
                        Export CSV File
                      </span>
                    </a>
                  </Form>
                )}
              </Formik>
            </div>
          </div>


          <div className="overflow-x-auto">
            <div class="font-[sans-serif] overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="whitespace-nowrap">
                  <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                   
                    <th class="p-4 text-left text-sm font-semibold ">User ID</th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Person Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Contact
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Address
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Orders
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Amount
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Amount Paid
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Amount Pending
                    </th>
                    {/* <th class="p-4 text-left text-sm font-semibold ">
                      Action
                    </th> */}
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">

                  {sales.data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No data available
                    </td>
                  </tr> 
                   ) : null} 

                   {sales.data.map((item, index) => ( 
                  <tr
                    //  key={user.id} 
                    class="odd:bg-gray-50 border-b border-gray-300">
                    
                    <td class="p-4 text-sm">{item.code || item.id}</td>
                    <td class="p-4 text-sm">
                      <div class="flex items-center cursor-pointer w-max">
                        
                        <div class="ml-4 ">    {/* persone name and email */}
                            <p class="text-sm text-black ">Person Name :  { item.name || 'N/A'}
                              </p>
                            {item.email &&
                             <p class="text-xs text-gray-500 mt-0.5">Email :{  item.email || 'N/A'}
                              </p>
                              } 

                          </div>     
                      </div>
                    </td>

                   

                    <td class="p-4 text-sm">{  item.phone || 'N/A'}</td>{/* contact */}
                    <td class="p-4 text-sm">{ item.address || 'N/A'}</td>{/* address */}
                    <td class="p-4 text-sm">{ item.total_orders || 0}</td>{/* total order */}
                    <td class="p-4 text-sm">{item.total_orders_amount || 0}</td>{/* total amount */}
                    <td class="p-4 text-sm">{item.total_orders_amount_paid || 0}</td>{/* total amount paid */}
                    <td class="p-4 text-sm">{item.total_order_amount_pending || 0}</td>{/* total amount pending */}
                    {/* <td class="p-4 flex items-center gap-2">
                      <button
                        onClick={() => router.get(route('supplier.invoices', item.id))} className="mr-4 flex items-center space-x-2 bg-blue-500 text-white rounded px-4 py-1" title="View Invoice"
                      >
                        <LiaFileInvoiceSolid className="w-6 fill-black " size={25} />
                        <span className="text-white hover:text-black">Orders</span>
                      </button>
                    </td> */}
                  </tr>
                   ))} 

                </tbody>
              </table>
            </div>

            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing
                {sales.from} - {sales.to} of {sales.total} 
              </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button
                       onClick={() => sales.links[0].url ? router.get(sales.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous"
                      >
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = sales.links.findIndex((l) => l.active);

                      return sales.links
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
                                  className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-black dark:bg-gray-100 border border-r-0 border-black dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple"
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
                      <button onClick={() => sales.links[sales.links.length - 1].url && window.location.assign(sales.links[sales.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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

