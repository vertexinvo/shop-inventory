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
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Ledger</h2>
        </>}
    >
      <Head title="Ledger" />
      

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
                      // href={route('customer.csvexport')}
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
                      // checked={selectId.length === users.data.length}
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
                    <th class="p-4 text-left text-sm font-semibold ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">

                  {/* {users.data.length === 0 ? ( */}
                  {/* <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No data available
                    </td>
                  </tr> */}
                  {/* ) : null} */}

                  {/* {users.data.map((user, index) => ( */}
                  <tr
                    //  key={user.id} 
                    class="odd:bg-gray-50 border-b border-gray-300">
                    <td className="pl-4 w-8">
                      <input
                        // id={`checkbox-${user.id}`}  // Unique id for each checkbox
                        type="checkbox"
                        className="hidden peer"
                      // value={user.id}
                      // onChange={(e) => {
                      //   if (e.target.checked) {
                      //     setSelectId((prev) => [...prev, user.id]); // Add user ID to state
                      //   } else {
                      //     setSelectId((prev) => prev.filter((id) => id !== user.id)); // Remove user ID from state
                      //   }
                      // }}
                      // checked={selectId.includes(user.id)} // Bind state to checkbox
                      />
                      <label
                        // htmlFor={`checkbox-${user.id}`} // Match label with checkbox id
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
                    <td class="p-4 text-sm">
                      <div class="flex items-center cursor-pointer w-max">
                        <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" />
                  
                        <div class="ml-4 ">    {/* persone name and email */}
                            <p class="text-sm text-black ">Person Name :  {'N/A'}
                              </p>
                            {/* {item.email && */}
                             <p class="text-xs text-gray-500 mt-0.5">Email :{'N/A'}
                              </p>
                              {/* } */}

                          </div>     
                      </div>
                    </td>

                   

                    <td class="p-4 text-sm">{'N/A'}</td>{/* contact */}
                    <td class="p-4 text-sm">{'N/A'}</td>{/* address */}
                    <td class="p-4 text-sm">{0}</td>{/* total order */}
                    <td class="p-4 text-sm">{0}</td>{/* total amount */}
                    <td class="p-4 text-sm">{0}</td>{/* total amount paid */}
                    <td class="p-4 text-sm">{0}</td>{/* total amount pending */}
                    <td class="p-4 flex items-center gap-2">
                      <button
                        onClick={() => router.get(route('supplier.invoices', item.id))} className="mr-4 flex items-center space-x-2 bg-blue-500 text-white rounded px-4 py-1" title="View Invoice"
                      >
                        <LiaFileInvoiceSolid className="w-6 fill-black " size={25} />
                        <span className="text-white hover:text-black">Invoice</span>
                      </button>
                    </td>
                  </tr>
                  {/* ))} */}

                </tbody>
              </table>
            </div>

            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing
                {/* {users.from} - {users.to} of {users.total}  */}
              </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button
                      // onClick={() => users.links[0].url ? router.get(users.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous"
                      >
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {/* {(() => {
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
                    })()} */}


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





    </AuthenticatedLayout>
  );
}

