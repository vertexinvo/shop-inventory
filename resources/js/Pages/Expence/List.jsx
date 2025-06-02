import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaMoneyBills, FaUserCheck, FaUserLock, FaUsers } from 'react-icons/fa6';
import { SiMicrosoftexcel } from "react-icons/si";
import FormatDate from '@/Helpers/FormatDate';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Modal from '@/Components/Modal';
import { set } from 'date-fns';
import FloatingCreateButton from '@/Components/FloatingCreateButton';
import { FaCheck } from 'react-icons/fa';
import { FaMoneyBillWave, FaClock, FaCalendarAlt, FaHourglassHalf, FaChartLine, FaFileInvoiceDollar } from 'react-icons/fa';
export default function List(props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const { auth, expences, startdate, enddate, todayTotal, todayPending, monthTotal, monthPending, yearTotal, yearPending } = props
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [daterangeModel, setDaterangeModel] = useState(false);

  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  )


  return (
    <AuthenticatedLayout
      user={auth}
      header={
        <div className="flex items-center justify-between py-2">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => window.history.back()}
              title="Back"
            />
            <h2 className="text-xl text-gray-800 leading-tight">Expense</h2>
          </div>
        </div>
      }
    >
      <Head title="Expense" />


      <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-5">

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Today's Total Expense</p>
            <p className="text-xl font-bold text-blue-600">{todayTotal}</p>
          </div>
          <FaMoneyBillWave size={36} className="text-blue-500" />
        </div>

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Today's Pending Amount</p>
            <p className="text-xl font-bold text-orange-600">{todayPending}</p>
          </div>
          <FaClock size={36} className="text-orange-500" />
        </div>

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Month's Total Expense</p>
            <p className="text-xl font-bold text-indigo-600">{monthTotal}</p>
          </div>
          <FaChartLine size={36} className="text-indigo-500" />
        </div>

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Month's Pending Amount</p>
            <p className="text-xl font-bold text-amber-600">{monthPending}</p>
          </div>
          <FaHourglassHalf size={36} className="text-amber-500" />
        </div>

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Year's Total Expense</p>
            <p className="text-xl font-bold text-emerald-600">{yearTotal}</p>
          </div>
          <FaCalendarAlt size={36} className="text-emerald-500" />
        </div>

        <div className="bg-white border  rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Year's Pending Amount</p>
            <p className="text-xl font-bold text-rose-600">{yearPending}</p>
          </div>
          <FaFileInvoiceDollar size={36} className="text-rose-500" />
        </div>

      </div>


      <div class="mx-4">

        <div className="flex flex-col md:flex-row justify-start items-center mt-2 mb-4">

          <div className="flex flex-col md:flex-row w-full md:justify-start space-y-2 md:space-y-0 md:space-x-2">

            {selectId.length > 0 && (
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
              >
                Bulk Delete
              </button>
            )}
            <FloatingCreateButton routeName="expense.create" title="Create" />


            {/* Date range filter button */}
            <button
              onClick={() => setDaterangeModel(true)}
              className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
            >
              Date Range Filter
            </button>


          </div>
        </div>


        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="whitespace-nowrap text-xs uppercase bg-gray-200 text-gray-700 tracking-wide border-b">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input id="checkbox" type="checkbox" className="hidden peer"
                    onChange={(e) => setSelectId(e.target.checked ? expences.data.map((user) => user.id) : [])}
                    checked={selectId.length === expences.data.length}
                  />
                  <label
                    htmlFor="checkbox"
                    className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                  >
                    <FaCheck className="w-full fill-white" />
                  </label>
                </th>
                <th class="p-4 text-left  ">
                  Name
                </th>
                <th class="p-4 text-left  ">
                  Type
                </th>
                <th class="p-4 text-left ">
                  DateTime
                </th>
                <th class="p-4 text-left ">
                  Description
                </th>
                <th class="p-4 text-left ">
                  Amount
                </th>

                <th class="p-4 text-left ">
                  Status
                </th>
                <th class="p-4 text-left ">
                  Pending Amount
                </th>
                <th class="p-4 text-left ">
                  User Info
                </th>
                <th class="p-4 text-left ">
                  Action
                </th>
              </tr>
            </thead>

            <tbody class="whitespace-nowrap">

              {expences.data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center">
                    No data available
                  </td>
                </tr>
              ) : null}

              {expences.data.map((expance, index) => (
                <tr key={expance.id} class={`odd:bg-gray-50  ${selectId.includes(expance.id) ? 'border-black border-4' : 'border-gray-300 border-b'}`}>
                  <td className="pl-4 w-8">
                    <input
                      id={`checkbox-${expance.id}`} // Unique id for each checkbox
                      type="checkbox"
                      className="hidden peer"
                      value={expance.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectId((prev) => [...prev, expance.id]); // Add user ID to state
                        } else {
                          setSelectId((prev) => prev.filter((id) => id !== expance.id)); // Remove user ID from state
                        }
                      }}
                      checked={selectId.includes(expance.id)} // Bind state to checkbox
                    />
                    <label
                      htmlFor={`checkbox-${expance.id}`} // Match label with checkbox id
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
                  <td class="p-4 text-sm">{expance.name || 'N/A'}</td>
                  <td class="p-4 text-sm">{expance.type || 'N/A'}</td>
                  <td class="p-4 text-sm">{FormatDate(expance.datetime) || 'N/A'}</td>
                  <td class="p-4 text-sm">{expance.description ? expance.description?.substring(0, 50) + `...` : 'N/A'}</td>
                  <td class="p-4 text-sm">{expance.amount || 0}</td>
                  <td class="p-4 text-sm">{expance.status || 'N/A'}</td>
                  <td class="p-4 text-sm">{expance.pending_amount || 0}</td>
                  <td class="p-4 text-sm">{
                    expance.user ? (
                      <>
                        <p class="text-sm  leading-tight text-gray-800 mb-2">
                          ID : {expance.user.code || expance.user.id}
                        </p>
                        <p class="text-sm  leading-tight text-gray-800 mb-2">
                          Name : {expance.user.name || 'N/A'}
                        </p>
                        <p class="text-sm  leading-tight text-gray-800 mb-2">
                          Email : {expance.user.email || 'N/A'}
                        </p>
                        <p class="text-sm  leading-tight text-gray-800 mb-2">
                          Phone : {expance.user.phone || 'N/A'}
                        </p>
                      </>
                    ) : 'N/A'
                  }</td>

                  <td class="p-4 flex items-center gap-2">
                    <button
                      onClick={() => router.get(route('expense.edit', expance))}
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
                      onClick={() => setIsDeleteModalOpen(expance)}
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



                  </td>
                </tr>
              ))}

            </tbody>
          </table>


          <div class="grid px-4 py-3 text-xs tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
            <span class="flex items-center col-span-3"> Showing {expences.from} - {expences.to} of {expences.total} </span>
            <span class="col-span-2"></span>

            <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul class="inline-flex items-center">
                  <li>
                    <button onClick={() => expences.links[0].url ? router.get(expences.links[0].url + '&startdate=' + startdate + '&enddate=' + enddate) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                      <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                      </svg>
                    </button>
                  </li>
                  {(() => {
                    let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                    const activeIndex = expences.links.findIndex((l) => l.active);

                    return expences.links
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
                                onClick={() => link.url && window.location.assign(link.url + '&startdate=' + startdate + '&enddate=' + enddate)}
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
                    <button onClick={() => expences.links[expences.links.length - 1].url && window.location.assign(expences.links[expences.links.length - 1].url + '&startdate=' + startdate + '&enddate=' + enddate)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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

      <ConfirmModal isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={() => {

        router.delete(route('expense.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />


      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these users?" onConfirm={() => {

        router.post(route('expense.bulkdestroy'), { ids: selectId.join(',') }, {
          onSuccess: () => {
            setIsBulkDeleteModalOpen(false);
            setSelectId([]);
          },
        });

      }} />

      <Modal
        show={daterangeModel}
        onClose={() => setDaterangeModel(false)}
        maxWidth="2xl"
      >
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
              Date Range
            </div>
          </div>
          <div className="px-10 flex justify-center mb-5">
            <div className="text-center">
              <DateRangePicker
                ranges={[dateRange]}
                onChange={(item) => {
                  setDateRange(item.selection);
                }}
                className="w-96"
              />

              <div className="flex justify-center gap-4 mt-5">
                <button
                  type="button"
                  onClick={() => { setDaterangeModel(false) }}
                  className="text-gray-500 bg-[#eaebec] hover:bg-[#eaebec] focus:ring-4 focus:ring-[#eaebec] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {

                    // Ensure dateRange is available and has the correct values
                    router.get(route('expense.index', {
                      startdate: dateRange.startDate,
                      enddate: dateRange.endDate
                    }));
                  }}
                  className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

      </Modal>



    </AuthenticatedLayout>
  );
}

