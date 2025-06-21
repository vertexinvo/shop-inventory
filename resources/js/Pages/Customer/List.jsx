import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaUserCheck, FaUserLock, FaUsers, FaXmark } from 'react-icons/fa6';
import { SiMicrosoftexcel } from "react-icons/si";
import FloatingCreateButton from '@/Components/FloatingCreateButton';
import { BiExport, BiImport } from 'react-icons/bi';
import { FaChevronDown, FaEllipsisV, FaSearch } from 'react-icons/fa';
import TabSwitcher from '@/Components/TabSwitcher';
import Card from '@/Components/Cards';
import Dropdown from '@/Components/Dropdown';


export default function List(props) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const { auth, users, totalcustomers, totalactivecus, totalinactivecus } = props
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' ya 'filters'
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Import/Export Dropdown */}
            <Dropdown>
              <Dropdown.Trigger>
                <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300">
                  File
                  <FaChevronDown className="h-3 w-3" />
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content className="mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <a
                  href={route('customer.csvexport')}
                  download
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export Excel (.csv)
                </a>
                <button
                  onClick={() => setImportCsvModel(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Import Excel (.csv)
                </button>
              </Dropdown.Content>
            </Dropdown>

            {/* Create Button dropdown */}
            <Dropdown>
              <Dropdown.Trigger>
                <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300">
                  Add new
                  <FaChevronDown className="h-3 w-3" />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content className="mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link

                  href={route('customer.create')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Customer
                </Link>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </>

      }
    >
      <Head title="Customer" />
      <div className="mt-4 mx-4 p-4 bg-white shadow-sm rounded-2xl">
        {/* Top Bar: Tabs + Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dropdown only when 'cards' tab is active */}
          {activeTab === 'cards' && (
            <select
              className="px-4 py-2 w-full sm:w-56 rounded-lg text-sm border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            >
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 1 Month</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last 1 Year</option>
            </select>
          )}
        </div>

        {/* Cards Section */}
        {activeTab === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            <Card
              title="Total Customers"
              value={totalcustomers}
              icon={<FaUsers size={36} />}
            />
            <Card
              title="Active Customers"
              value={totalactivecus}
              icon={<FaUserCheck size={36} />}
            />
            <Card
              title="Inactive Customers"
              value={totalinactivecus}
              icon={<FaUserLock size={36} />}
            />
          </div>
        )}

        {/* Filters Section */}
        {activeTab === 'filters' && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow">
            Filters
          </div>
        )}
      </div>



      <div className="flex flex-col px-5  mx-auto w-full">
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
              {/* <button
                onClick={() => router.get(route('customer.create'))}
                className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
              >
                Create
              </button> */}

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('customer.index'), { search: values.search }, { preserveState: true });
                }}
              >
                {({ values, setFieldValue, handleSubmit }) => (
                  <Form className="w-full flex items-center gap-3">
                    <div className="relative w-full md:max-w-md">
                      <Field name="search">
                        {({ field, form }) => (
                          <div className="relative">
                            <input
                              {...field}
                              type="text"
                              placeholder="Search customers..."
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
                                  form.setFieldValue('search', '');
                                  router.get(route('customer.index'));
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


          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="whitespace-nowrap text-xs uppercase bg-gray-100 text-gray-700 tracking-wide border-b">
                <tr>
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
                          data-name="7-Check" data-original="#000000" />F
                      </svg>
                    </label>
                  </th>
                  <th class="p-4 text-left text-xs  ">User ID</th>
                  <th class="p-4 text-left text-xs  ">
                    Name
                  </th>
                  <th class="p-4 text-left text-xs  ">
                    Email
                  </th>
                  <th class="p-4 text-left text-xs  ">
                    Phone
                  </th>
                  <th class="p-4 text-left text-xs  ">
                    Address
                  </th>
                  <th class="p-4 text-left text-xs  ">
                    Total Orders
                  </th>

                  <th class="p-4 text-left text-xs  ">
                    Active
                  </th>
                  <th class="p-4 text-left text-xs  ">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody class="whitespace-nowrap">

                {users.data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
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
                    <td class="p-4 text-sm">{user.name || 'N/A'}</td>
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
                    <td className="p-4 text-center">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className="text-gray-500 hover:text-black focus:outline-none">
                            <FaEllipsisV className="w-5 h-5" />
                          </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="48">
                          <Dropdown.Link
                            as="button"
                            onClick={() => router.get(route('customer.edit', user.id))}
                            className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 text-left"
                          >
                            Edit
                          </Dropdown.Link>

                          <Dropdown.Link
                            as="button"
                            onClick={() => setIsDeleteModalOpen(user)}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                          >
                            Delete
                          </Dropdown.Link>

                          <Dropdown.Link
                            href={route('order.instantorder', { searchid: user.id })}
                            className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 text-left"
                          >
                            Instant Order
                          </Dropdown.Link>

                          <Dropdown.Link
                            href={route('order.index', { searchuserid: user.id })}
                            className="block w-full px-4 py-2 text-sm  hover:bg-gray-100 text-left"
                          >
                            Order History
                          </Dropdown.Link>
                        </Dropdown.Content>
                      </Dropdown>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
            <div class="grid px-4 py-3 text-xs  tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
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

