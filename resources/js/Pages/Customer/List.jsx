import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaUserCheck, FaUserLock, FaUsers } from 'react-icons/fa6';
import { SiMicrosoftexcel } from "react-icons/si";


export default function List(props) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const { auth, users, totalcustomers, totalactivecus, totalinactivecus } = props
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
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Customer</h2>
        </>}
    >
      <Head title="Customer" />
      <div class="px-5 mx-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 py-5">

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL CUSTOMERS</p>
              <p class="text-lg">{totalcustomers}</p>
            </div>
            <div class="my-auto">
              <FaUsers size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">ACTIVE CUSTOMERS</p>
              <p class="text-lg">{totalactivecus}</p>
            </div>
            <div class="my-auto">
              <FaUserCheck size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">INACTIVE CUSTOMERS</p>
              <p class="text-lg">{totalinactivecus}</p>
            </div>
            <div class="my-auto">
              <FaUserLock size={40} />
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-col px-5  mt-10 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">

            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">


              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white  w-full  md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                >
                  Bulk Delete
                </button>
              )}
              <button
                onClick={() => router.get(route('customer.create'))}
                className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
              >
                Create
              </button>

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('customer.index'), { search: values.search }, { preserveState: true });
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
                          router.get(route('customer.index'));
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
                      href={route('customer.csvexport')}
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
                    <th class="pl-4 w-8">
                      <input id="checkbox" type="checkbox" class="hidden peer"
                        onChange={(e) => setSelectId(e.target.checked ? users.data.map((user) => user.id) : [])}
                        checked={selectId.length === users.data.length}
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
                    <th class="p-4 text-left text-sm font-semibold ">User ID</th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Name
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Email
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Phone
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Address
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Orders
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Active
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">

                  {users.data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  ) : null}

                  {users.data.map((user, index) => (
                    <tr key={user.id} class={`odd:bg-gray-50 ${selectId.includes(user.id) ? 'border-black border-4' : 'border-gray-300 border-b'}`}>
                      <td className="pl-4 w-8">
                        <input
                          id={`checkbox-${user.id}`} // Unique id for each checkbox
                          type="checkbox"
                          className="hidden peer"
                          value={user.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectId((prev) => [...prev, user.id]); // Add user ID to state
                            } else {
                              setSelectId((prev) => prev.filter((id) => id !== user.id)); // Remove user ID from state
                            }
                          }}
                          checked={selectId.includes(user.id)} // Bind state to checkbox
                        />
                        <label
                          htmlFor={`checkbox-${user.id}`} // Match label with checkbox id
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
                      <td class="p-4 text-sm">{user.code || user.id}</td>
                      <td class="p-4 text-sm">
                        <div class="flex items-center cursor-pointer w-max">
                          {/* <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" /> */}
                          <div class="ml-4">
                            <p class="text-sm text-black">{user.name || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 text-sm">{user.email || 'N/A'}</td>
                      <td class="p-4 text-sm">{user.phone || 'N/A'}</td>
                      <td class="p-4 text-sm">{user.address || 'N/A'}</td>
                      <td class="p-4 text-sm">{user.total_orders || 0}</td>
                      <td class="p-4">
                        <label class="relative cursor-pointer">
                          <input type="checkbox" onClick={() => router.put(route('customer.status', user.id))} class="sr-only peer" checked={user.status} />
                          <div
                            class="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black">
                          </div>
                        </label>
                      </td>
                      <td class="p-4 flex items-center gap-2">
                        <button
                          onClick={() => router.get(route('customer.edit', user.id))}
                          title="Edit"
                          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 rounded text-white px-3 py-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-black" viewBox="0 0 348.882 348.882">
                            <path
                              d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                            />
                            <path
                              d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                            />
                          </svg>
                          <span className="text-white hover:text-black">Edit</span>
                        </button>

                        <button
                          onClick={() => setIsDeleteModalOpen(user)}
                          title="Delete"
                          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 rounded text-white px-3 py-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-black" viewBox="0 0 24 24">
                            <path
                              d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            />
                            <path
                              d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            />
                          </svg>
                          <span className="text-white hover:text-black">Delete</span>
                        </button>

                        <Link
                          href={route('order.instantorder', { searchid: user.id })}
                          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                          title="Instant Order"
                        >
                          <HiOutlineShoppingBag className='text-black' size={23} />
                          <span className="text-sm">Instant Order</span>
                        </Link>

                        <Link
                          href={route('order.index', { searchuserid: user.id })}
                          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                          title="Order History"
                        >
                          <svg
                            id="Layer_1"
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 117.78 122.88"
                            width="23"
                            height="23"
                          >
                            <title>order-history</title>
                            <path d="M70.71,116.29H7.46a7.48,7.48,0,0,1-5.27-2.19L2,113.87a7.43,7.43,0,0,1-2-5V7.46A7.45,7.45,0,0,1,2.19,2.19L2.42,2a7.42,7.42,0,0,1,5-2H91.88a7.48,7.48,0,0,1,7.46,7.46V66.63a3.21,3.21,0,0,1-.06.63,28.75,28.75,0,1,1-28.57,49ZM85.18,82.12h2.89a2,2,0,0,1,1.43.59,2.06,2.06,0,0,1,.6,1.44V94.77h9.59a2,2,0,0,1,2,2v3a2.12,2.12,0,0,1-.6,1.44l-.08.07a2,2,0,0,1-1.35.52H84a1,1,0,0,1-1-1V84a2,2,0,0,1,.59-1.29,2,2,0,0,1,1.43-.6Zm7.75-16.47V7.46a1.1,1.1,0,0,0-1.05-1H7.46a1.08,1.08,0,0,0-.66.23l-.08.08a1.06,1.06,0,0,0-.31.74V108.84a1,1,0,0,0,.23.65l.09.08a1,1,0,0,0,.73.32H65A28.75,28.75,0,0,1,89,65.38a28,28,0,0,1,3.9.27Zm12.36,12.22A23,23,0,1,0,112,94.13a22.92,22.92,0,0,0-6.73-16.26Zm-84.5-3.78h9A1.18,1.18,0,0,1,31,75.27v9a1.18,1.18,0,0,1-1.18,1.18h-9a1.18,1.18,0,0,1-1.18-1.18v-9a1.18,1.18,0,0,1,1.18-1.18Zm22,9.28a3.65,3.65,0,0,1,0-7.18h9.58a3.65,3.65,0,0,1,0,7.18Zm-22-61.22h9A1.18,1.18,0,0,1,31,23.33v9a1.18,1.18,0,0,1-1.18,1.18h-9a1.18,1.18,0,0,1-1.18-1.18v-9a1.18,1.18,0,0,1,1.18-1.18Zm22,9.27a3.33,3.33,0,0,1-3-3.58,3.34,3.34,0,0,1,3-3.59H78.25a3.34,3.34,0,0,1,3,3.59,3.33,3.33,0,0,1-3,3.58ZM18.34,54.1a2,2,0,0,1,.38-2.82,2.23,2.23,0,0,1,3-.09l2.1,2.17L29.07,48a1.93,1.93,0,0,1,2.82.3,2.23,2.23,0,0,1,.18,3l-7,7.14a1.94,1.94,0,0,1-2.82-.3l-.16-.19a1.94,1.94,0,0,1-.31-.26L18.34,54.1Zm24.4,2.69a3.34,3.34,0,0,1-3-3.59,3.34,3.34,0,0,1,3-3.59H78.25a3.34,3.34,0,0,1,3,3.59,3.34,3.34,0,0,1-3,3.59Z" />
                          </svg>
                          <span className="text-sm">Order History</span>
                        </Link>

                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {users.from} - {users.to} of {users.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => users.links[0].url ? router.get(users.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = users.links.findIndex((l) => l.active);

                      return users.links
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
                      <button onClick={() => users.links[users.links.length - 1].url && window.location.assign(users.links[users.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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

        router.delete(route('customer.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />




      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these users?" onConfirm={() => {

        router.post(route('customer.bulkdestroy'), { ids: selectId.join(',') }, {
          onSuccess: () => {
            setIsBulkDeleteModalOpen(false);
            setSelectId([]);
          },
        });

      }} />



    </AuthenticatedLayout>
  );
}

