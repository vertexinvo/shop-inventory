import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function List(props) {
  const { auth, orders } = props

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);

  console.log(orders);
  return (
    <AuthenticatedLayout
      Order={auth.Order}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order</h2>}
    >
      <Head title="Order" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">

            <div className="flex flex-col md:flex-row space-x-0 md:space-x-2">

              {selectId.length > 0 &&
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Bulk Delete
                </button>
              }
              <button
                onClick={() => router.get(route('order.instantorder'))}
                className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
              >
                Instant Order
              </button>
              <button
                onClick={() => router.get(route('order.create'))}
                className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
              >
                Create
              </button>

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('order.index'), { search: values.search }, { preserveState: true });
                }}

              >
                {({ values, setFieldValue, handleSubmit, errors, touched }) => (

                  <Form className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
                    <div className="relative">
                      <Field
                        name="search"
                        type="text"
                        placeholder="Search..."
                        className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black w-full"          
                      />
                      <button
                        type="button"
                        onClick={() => { setFieldValue('search', ''); router.get(route('product.index')) }}
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
            <div class="font-[sans-serif] overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="whitespace-nowrap">
                  <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                    <th class="pl-4 w-8">
                      <input id="checkbox" type="checkbox" class="hidden peer"
                        onChange={(e) => setSelectId(e.target.checked ? orders.data.map((order) => order.id) : [])}
                        checked={selectId.length === orders.data.length}
                      />
                      <label for="checkbox"
                        class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full fill-white" viewBox="0 0 520 520">
                          <path
                            d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                            data-name="7-Check" data-original="#000000" />
                        </svg>
                      </label>
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Order Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Phone
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Address
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Payment Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Payable Amount
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Paid Amount
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Online Payment Link
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Charges Info
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Discount
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Installment Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Status
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">

                  {orders.data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="p-4 text-center">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {orders.data.map((order, index) => (


                    <tr className={`  ${order?.stock?.quantity === 0 || order?.stock?.quantity === null ? 'bg-red-100' : 'odd:bg-white even:bg-gray-50'}`}>

                      <td className="pl-4 w-8">
                        <input
                          id={`checkbox-${order.id}`} // Unique id for each checkbox
                          type="checkbox"
                          className="hidden peer"
                          value={order.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectId((prev) => [...prev, order.id]); // Add user ID to state
                            } else {
                              setSelectId((prev) => prev.filter((id) => id !== order.id)); // Remove user ID from state
                            }
                          }}
                          checked={selectId.includes(order.id)} // Bind state to checkbox
                        />
                        <label
                          htmlFor={`checkbox-${order.id}`} // Match label with checkbox id
                          className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full fill-white"
                            viewBox="0 0 520 520"
                          >
                            <path
                              d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                            />
                          </svg>
                        </label>
                      </td>
                      <td class="text-sm text-black">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4 ">
                            <p class="text-sm text-black ">Order Name : {order.name}</p>
                            {order.email && <p class="text-xs text-gray-500 mt-0.5">Email :{order.email} </p>}
                          </div>
                        </div>
                      </td>

                      <td class="p-4 text-sm text-black">
                        {order.phone || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {order.address || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {order.total || 'N/A'}
                      </td>
                      {/* <td class=" text-sm text-black">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4 ">
                            <p class="text-sm text-black ">{order.method}</p>
                            <p class="text-sm text-black ">Cheque No : <span class="text-xs text-gray-500 mt-0.5">{order.cheque_no}</span></p>
                            <p class="text-sm text-black ">Bank Name : <span class="text-xs text-gray-500 mt-0.5">{order.bank_name}</span></p>
                            <p class="text-sm text-black ">Bank Branch : <span class="text-xs text-gray-500 mt-0.5">{order.bank_branch}</span></p>
                            <p class="text-sm text-black ">Bank Amount : <span class="text-xs text-gray-500 mt-0.5">{order.bank_account}</span></p>
                          
                               </div>
                        </div>
                      </td> */}


                      <td class="text-sm text-black">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4">
                            <p class="text-sm text-black">{order.method}</p>
                            {order.method === "cheque" && (
                              <>
                                <p class="text-sm text-black">Cheque No: <span class="text-xs text-gray-500">{order.cheque_no}</span></p>
                                <p class="text-sm text-black">Bank Name: <span class="text-xs text-gray-500">{order.bank_name}</span></p>
                                <p class="text-sm text-black">Bank Branch: <span class="text-xs text-gray-500">{order.bank_branch}</span></p>
                                <p class="text-sm text-black">Bank Amount: <span class="text-xs text-gray-500">{order.bank_account}</span></p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>


                      {order.method === "check" && (
                        <td class="text-sm text-black">

                          <div class="flex items-center cursor-pointer w-max">
                            <div class="ml-4">
                              <p class="text-sm text-black ">{order.method}</p>

                            </div>
                          </div>

                        </td>)}

                      {/* asf */}
                      <td class="p-4 text-sm text-black">
                        {order.payable_amount || 'N/A'}
                      </td><td class="p-4 text-sm text-black">
                        {order.paid_amount || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {order.method === "online" ? order.online_payment_link || "N/A" : "N/A"}
                      </td>

                      <td class=" text-sm text-black">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4 ">
                            <p class="text-sm text-black ">Extra Charges : {order.extra_charges || '0'}</p>
                            <p class="text-sm text-black ">Shipping Charges : {order.shipping_charges || '0'}</p>
                            <p class="text-sm text-black ">Tax : {order.tax || '0'}</p>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 text-sm text-black">
                        {order.discount || 'N/A'}
                      </td>
                      <td class=" pt-4 pb-4 text-sm text-black">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4 ">
                            {!order.is_installment ? <p class="text-sm text-black ">No</p> : <>
                              <p class="text-sm text-black ">Installment Amount : <span class="text-xs text-gray-500 mt-0.5">{order.installment_amount || 'N/A'}</span></p>
                              <p class="text-sm text-black ">Installment Period : <span class="text-xs text-gray-500 mt-0.5">{order.installment_period || 'N/A'}</span></p>
                              <p class="text-sm text-black ">Installment Count : <span class="text-xs text-gray-500 mt-0.5">{order.installment_count || 'N/A'}</span></p>
                              <p class="text-sm text-black ">Installment Start Date : <span class="text-xs text-gray-500 mt-0.5">{order.installment_start_date || 'N/A'}</span></p>
                              <p class="text-sm text-black ">Installment End Date : <span class="text-xs text-gray-500 mt-0.5">{order.installment_end_date || 'N/A'}</span></p>
                            </>}
                          </div>
                        </div>
                      </td>
                      <td class="p-4 text-sm text-black">
                        {order.status || 'N/A'}
                      </td>


                      <td class="p-4">
                        <button className='w-6 h-6 mr-4' onClick={() => router.get(route('order.show', { id: order.id }))} >
                          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                          </svg>
                        </button>
                        <button onClick={() => router.get(route('order.edit', product.id))} class="mr-4" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-black hover:fill-gray-700"
                            viewBox="0 0 348.882 348.882">
                            <path
                              d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                              data-original="#000000" />
                            <path
                              d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                              data-original="#000000" />
                          </svg>
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(order)} title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                            <path
                              d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                              data-original="#000000" />
                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                              data-original="#000000" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span class="flex items-center col-span-3"> Showing {orders.from} - {orders.to} of {orders.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => orders.links[0].url ? router.get(orders.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = orders.links.findIndex((l) => l.active);

                      return orders.links
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
                      <button onClick={() => orders.links[orders.links.length - 1].url && window.location.assign(orders.links[orders.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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

      <ConfirmModal isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={() => {

        router.delete(route('order.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />




      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these products?" onConfirm={() => {

        router.post(route('product.bulkdestroy'), { ids: selectId.join(',') }, {
          onSuccess: () => {
            setIsBulkDeleteModalOpen(false);
            setSelectId([]);
          },
        });

      }} />

    </AuthenticatedLayout>
  );
}

