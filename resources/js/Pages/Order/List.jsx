import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import { VscGraph } from "react-icons/vsc";
import { PiListChecksFill } from "react-icons/pi";
import { FaBoxOpen } from "react-icons/fa6";
import { FaCheck, FaEdit, FaEye, FaPen, FaTrash } from "react-icons/fa";
import * as Yup from 'yup';
import './order.css'
import { IoIosSave } from "react-icons/io";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast } from 'react-toastify';
import { SiMicrosoftexcel } from "react-icons/si";
import { MdOutlinePayments } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import { QRCode } from 'react-qrcode-logo';
import Dropdown from '@/Components/Dropdown';
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { GrMoney } from 'react-icons/gr';
import { CiTimer } from 'react-icons/ci';
import FloatingCreateButton from '@/Components/FloatingCreateButton';
import { BiExport } from 'react-icons/bi';


export default function List(props) {
  const { auth, todaysPendingOrderAmount, todayProfit, orders, todaysOrder, pendingCount, completedCount, total, status, searchuserid, search, totalPaidAmount, totalPendingAmount, monthlyTotalPaidAmount, monthlyTotalPendingAmount, yearlyTotalPaidAmount, yearlyTotalPendingAmount } = props
  console.log(totalPendingAmount);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [orderAmounts, setOrderAmounts] = useState({});
  const [daterangeModel, setDaterangeModel] = useState(false);
  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  )
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);


  const handleEdit = (orderId) => {
    router.get(route("order.edit", orderId));
  };
  const handleView = (orderId) => {
    router.get(route("order.show", orderId));
  };
  const handleDelete = (orderId) => {
    setIsDeleteModalOpen(orderId);
  };
  const handleBulkDelete = () => {
    if (selectId.length === 0) {
      toast.error("Please select at least one order to delete.");
      return;
    }
    setIsBulkDeleteModalOpen(false);
    router.delete(route("order.bulkdelete"), {
      data: { ids: selectId },
      preserveState: true,
      onSuccess: () => {
        setSelectId([]);
        toast.success("Selected orders deleted successfully.");
      },
      onError: () => {
        toast.error("Failed to delete selected orders.");
      },
    });
  };
  const handleDaterangeSubmit = () => {
    const startDate = dateRange.startDate.toISOString().split('T')[0];
    const endDate = dateRange.endDate.toISOString().split('T')[0];

    router.get(route('order.index'), {
      startdate: startDate,
      enddate: endDate,
      search: params.get('search') || '',
      searchuserid: params.get('searchuserid') || '',
      status: params.get('status') || ''
    }, { preserveState: true });
    setDaterangeModel(false);
  };

  const handleAmountChange = (e, orderId) => {
    const updatedAmount = e.target.value;
    setOrderAmounts((prevState) => ({
      ...prevState,
      [orderId]: updatedAmount,
    }));

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, paid_amount: updatedAmount } : order
    );
  }


  const { show } = useContextMenu({ id: "context-menu" });

  const handleMenuClick = ({ props, action }) => {
    const order = props;
    if (action === "view") {
      router.get(route("order.show", order.id));
    } else if (action === "edit") {
      router.get(route("order.edit", order.id));
    } else if (action === "delete") {
      setIsDeleteModalOpen(order)
    }
  };

  const formatProfit = (profit) => {
    if (profit < 0) {
      return <span className="text-red-500">Loss: {Math.abs(profit)}</span>;
    }
    return <span>{profit}</span>;
  };

  const rolename = auth.user.roles.map((role) => role.name);


  return (
    <AuthenticatedLayout
      Order={auth.Order}
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
              href={route('order.csvexport')}
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
      <Head title="Sale" />



      {/* <div className='flex justify-end px-5 py-2 mx-4 '>
        <select name="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  w-[150px] p-2.5  " id="">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div> */}

      <div class=" mx-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 py-5">

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TODAY'S PROFIT</p>
              <p className="text-lg"> {rolename.includes('superadmin') ? formatProfit(todayProfit) : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <GrMoney size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TODAY'S PENDING AMOUNT</p>
              <p className="text-lg"> {rolename.includes('superadmin') ? formatProfit(todaysPendingOrderAmount) : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <CiTimer size={40} />
            </div>
          </div>
        </div>


        <Link href={route('order.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TODAYS ORDERS</p>
                <p class="text-lg">{todaysOrder}</p>
              </div>
              <div class="my-auto">
                <VscGraph size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('order.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL ORDERS</p>
                <p class="text-lg">{total}</p>
              </div>
              <div class="my-auto">
                <VscGraph size={40} />
              </div>
            </div>
          </div>
        </Link>

        <Link href={route('order.index', { status: 'pending' })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">PENDING ORDERS</p>
                <p class="text-lg">{pendingCount}</p>
              </div>
              <div class="my-auto">
                <FaBoxOpen size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('order.index', { status: 'completed' })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">COMPLETED ORDERS</p>
                <p class="text-lg">{completedCount}</p>
              </div>
              <div class="my-auto">
                <PiListChecksFill size={40} />
              </div>
            </div>
          </div>
        </Link>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL COMPLETED AMOUNT</p>
              <p class="text-lg">{totalPaidAmount}</p>
            </div>
            <div class="my-auto">
              <MdOutlinePayments size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL PENDING AMOUNT</p>
              <p class="text-lg">{parseFloat(totalPendingAmount).toFixed(2)}</p>
            </div>
            <div class="my-auto">
              <FaMoneyBills size={40} />
            </div>
          </div>
        </div>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">MONTHLY COMPLETED AMOUNT</p>
              <p class="text-lg">{parseFloat(monthlyTotalPaidAmount).toFixed(2)}</p>
            </div>
            <div class="my-auto">
              <FaMoneyBills size={40} />
            </div>
          </div>
        </div>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">MONTHLY PENDING AMOUNT</p>
              <p class="text-lg">{parseFloat(monthlyTotalPendingAmount).toFixed(2)}</p>
            </div>
            <div class="my-auto">
              <FaMoneyBills size={40} />
            </div>
          </div>
        </div>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">YEARLY COMPLETED AMOUNT</p>
              <p class="text-lg">{parseFloat(yearlyTotalPaidAmount).toFixed(2)}</p>
            </div>
            <div class="my-auto">
              <FaMoneyBills size={40} />
            </div>
          </div>
        </div>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">YEARLY PENDING AMOUNT</p>
              <p class="text-lg">{parseFloat(yearlyTotalPendingAmount).toFixed(2)}</p>
            </div>
            <div class="my-auto">
              <FaMoneyBills size={40} />
            </div>
          </div>
        </div>

      </div>



      <div className="flex flex-col px-4 mx-auto w-full">
        <div className="w-full ">

          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">
            <Formik
              enableReinitialize
              initialValues={{ search: '' }}
              onSubmit={(values) => {
                router.get(route('order.index'), { search: values.search, searchuserid: params.get('searchuserid'), status: params.get('status'), startdate: params.get('startdate'), enddate: params.get('enddate') }, { preserveState: true });
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
                        router.get(route('order.index'));
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
                  {/* <button
                      type="submit"
                      className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600 w-full md:w-auto"
                    >
                      <SiMicrosoftexcel className="mr-2 h-5 w-5" />
                      Export Excel
                    </button> */}



                </Form>

              )}

            </Formik>

            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">
              <button
                onClick={() => router.get(route('order.instantorder'))}
                className="text-white w-full md:w-64  py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
              >
                Instant Sale
              </button>


              <select
                name="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                w-full md:w-[150px] p-2.5 pr-10 
                                    
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('order.index'), { status: e.target.value, startdate: params.get('startdate'), enddate: params.get('enddate'), search: params.get('search'), searchuserid: params.get('searchuserid') }, { preserveState: true })}
                value={status}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancel">Cancelled</option>
              </select>

              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white  w-full md:w-64 lg:w-80 py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                >
                  Bulk Delete
                </button>
              )}

              <FloatingCreateButton routeName="order.create" title="Create" />



              <button
                onClick={() => setDaterangeModel(true)}
                className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
              >
                Date&nbsp;Range&nbsp;Filter
              </button>


            </div>
          </div>



          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input
                      id="checkbox"
                      type="checkbox"
                      className="hidden peer"
                      onChange={(e) => {
                        setSelectId(
                          e.target.checked ? orders.data.map((order) => order.id) : []
                        )
                      }}
                      checked={selectId.length === orders.data.length}
                    />
                    <label
                      htmlFor="checkbox"
                      className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                    >
                      <FaCheck className="w-full fill-white" />
                    </label>
                  </th>
                  <th className="px-4 py-3 text-left">Sale Date</th>
                  <th className="px-4 py-3 text-left">Bill No.</th>
                  <th className="px-4 py-3 text-left">Sale Info</th>
                  <th className="px-4 py-3 text-left">Payable</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Sale ID</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {orders.data.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-4 text-center text-gray-500">No order found.</td>
                  </tr>
                )}

                {orders.data.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 ${order.status === "pending" && order.paid_amount <= 0
                      ? "bg-red-50"
                      : order.status === "pending" && parseFloat(order.paid_amount) < parseFloat(order.payable_amount)
                        ? "bg-yellow-50"
                        : ""
                      } ${selectId.includes(order.id) ? "border-l-4 border-black" : ""}`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      show({ event: e, props: order });
                    }}
                  >
                    <td className="px-4 py-2 w-8">
                      <input
                        id={`checkbox-${order.id}`}
                        type="checkbox"
                        className="hidden peer"
                        value={order.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectId((prev) => [...prev, order.id]);
                          } else {
                            setSelectId((prev) => prev.filter((id) => id !== order.id));
                          }
                        }}
                        checked={selectId.includes(order.id)}
                      />
                      <label
                        htmlFor={`checkbox-${order.id}`}
                        className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                      >
                        <FaCheck className="w-full fill-white" />
                      </label>
                    </td>

                    <td className="px-4 py-2 text-gray-800">{order.order_date || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-800">{order.bill_no || "N/A"}</td>

                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{order.name}</p>
                          {order.email && (
                            <p className="text-xs text-gray-500">{order.email}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2 text-gray-800">{order.payable_amount}</td>

                    <td className="px-4 py-2">
                      <div className="flex items-center w-[130px]">
                        <input
                          className="border rounded px-2 py-1 text-sm focus:ring-black focus:border-black w-full"
                          type="number"
                          step="0.01"
                          value={orderAmounts[order.id] || order.paid_amount || 0}
                          onChange={(e) => handleAmountChange(e, order.id)}
                        />
                        <IoIosSave
                          className="ml-2 cursor-pointer text-gray-600 hover:text-black"
                          size={24}
                          onClick={async () => {
                            await router.put(route("order.amountupdate", order.id), {
                              paid_amount: orderAmounts[order.id] || order.paid_amount || 0,
                            });
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          if (order.status === "cancel") {
                            toast.error("You can't change the status because it is already canceled.");
                          } else {
                            setIsStatusModalOpen(order);
                          }
                        }}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded flex items-center ${order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {order.status || "N/A"}
                        {order.status !== "cancel" && <FaPen className="ml-1" />}
                      </button>
                    </td>

                    <td className="px-4 py-2 text-blue-600 cursor-pointer">
                      <button
                        onClick={() =>
                          router.get(route("order.show", order.code || order.id))
                        }
                        title="View"
                        type="button"
                      >
                        {order.code || order.id}
                      </button>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(order.id)}
                          title="View"
                          className="text-cyan-500 hover:text-cyan-700"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(order.id)}
                          title="Edit"
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order)}
                          title="Delete"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>



            {/* Context Menu */}
            <Menu id="context-menu">
              <Item onClick={({ props }) => handleMenuClick({ props, action: "view" })}>
                View
              </Item>
              <Item onClick={({ props }) => handleMenuClick({ props, action: "edit" })}>
                Edit
              </Item>
              {/* Show Stock option only if identity_type is not 'imei' */}

              <Item
                onClick={({ props }) => handleMenuClick({ props, action: "delete" })}
                className="text-red-600"
              >
                Delete
              </Item>


            </Menu>

            {/* Pagination */}
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {orders.from} - {orders.to} of {orders.total} </span>
              <span class="col-span-2"></span>


              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => orders.links[0].url ? router.get(orders.links[0].url, { status: status || '', searchuserid: searchuserid || '', search: search || '', startdate: params.get('startdate') || '', enddate: params.get('enddate') || '' }) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
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
                                  onClick={() => link.url && window.location.assign(link.url + `&status=${status || ''}` + `&search=${search || ''}` + `&searchuserid=${searchuserid || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || ''}`)}
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
                      <button onClick={() => orders.links[orders.links.length - 1].url && window.location.assign(orders.links[orders.links.length - 1].url + `&status=${status || ''}` + `&search=${search || ''}` + `&searchuserid=${searchuserid || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || ''}`)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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
      <Modal
        show={isStatusModalOpen !== null}
        onClose={() => setIsStatusModalOpen(null)}
        maxWidth="2xl"
      >
        <Formik
          initialValues={{
            status: isStatusModalOpen?.status || 'pending',
          }}
          validationSchema={Yup.object({
            status: Yup.string().required('Status is required'),
          })}
          onSubmit={(values, { resetForm }) => {

            router.put(route('order.changeStatus', isStatusModalOpen?.id), values, {
              onSuccess: () => {
                resetForm();
                setIsStatusModalOpen(null);
              },
            });
          }}

        >
          {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4">Order Status</h2>


              <div className="relative z-0 w-full mb-5 group">

                <Field name="status" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" as="select">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancel">Cancel</option>
                </Field>
                {/* if cancel selected show messamge you sure want to cancel and cant change status */}
                {values.status === 'cancel' && <div className="text-red-600 text-sm mt-1">You sure want to cancel and cant change status</div>}
                <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
              </div>


              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="submit"
                  className="text-white bg-black hover:bg-gray-600 dark:bg-white   dark:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>

      </Modal>

      <ConfirmModal isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={() => {

        router.delete(route('order.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />




      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these sales?" onConfirm={() => {

        router.post(route('order.bulkdestroy'), { ids: selectId.join(',') }, {
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
                    router.get(route('order.index', {
                      startdate: dateRange.startDate,
                      enddate: dateRange.endDate,
                      status: params.get('status') || '',
                      search: params.get('search') || '',
                      searchuserid: searchuserid || '',

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

