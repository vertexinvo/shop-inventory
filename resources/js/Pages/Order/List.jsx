import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import { VscGraph } from "react-icons/vsc";
import { PiListChecksFill } from "react-icons/pi";
import { FaBoxOpen, FaRotateRight, FaXmark } from "react-icons/fa6";
import { FaCalendarCheck, FaCheck, FaChevronDown, FaEdit, FaEye, FaFilter, FaPen, FaSearch, FaThLarge, FaTrash } from "react-icons/fa";
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
import TabSwitcher from '@/Components/TabSwitcher';
import Card from '@/Components/Cards';
import DropdownComponent from '@/Components/DropdownComponent';


export default function List(props) {
  const {products, auth, todaysPendingOrderAmount, todayProfit, orders, todaysOrder, pendingCount, completedCount, total, status, searchuserid, search, totalPaidAmount, totalPendingAmount, monthlyTotalPaidAmount, monthlyTotalPendingAmount, yearlyTotalPaidAmount, yearlyTotalPendingAmount ,} = props
  console.log(totalPendingAmount);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [orderAmounts, setOrderAmounts] = useState({});
  const [daterangeModel, setDaterangeModel] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const fileOptions = [
    {
      label: 'Export Excel (.csv)',
      href: route('order.csvexport'),
      download: true
    },
  ];

  const createOptions = [
    {
      label: 'Instant Invoice',
      href: route('order.instantorder')
    },
    {
      label: 'Invoice',
      href: route('order.create')
    }
  ];

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
      status: params.get('status') || '',
      productid: params.get('productid') || ''
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

  const [showAll, setShowAll] = useState(false);
  const cards = [
    {
      label: "TODAY'S PROFIT",
      value: rolename.includes('superadmin') ? formatProfit(todayProfit) : 'No Access',
      icon: <GrMoney size={36} />,
    },
    {
      label: "TODAY'S PENDING AMOUNT",
      value: rolename.includes('superadmin') ? formatProfit(todaysPendingOrderAmount) : 'No Access',
      icon: <CiTimer size={36} />,
    },
    {
      label: "TODAY'S ORDERS",
      value: todaysOrder,
      icon: <VscGraph size={36} />,
      link: route('order.index'),
    },
    {
      label: "TOTAL ORDERS",
      value: total,
      icon: <VscGraph size={36} />,
      link: route('order.index'),
    },
    {
      label: "PENDING ORDERS",
      value: pendingCount,
      icon: <FaBoxOpen size={36} />,
      link: route('order.index', { status: 'pending' }),
    },
    {
      label: "COMPLETED ORDERS",
      value: completedCount,
      icon: <PiListChecksFill size={36} />,
      link: route('order.index', { status: 'completed' }),
    },
    {
      label: "TOTAL COMPLETED AMOUNT",
      value: totalPaidAmount,
      icon: <MdOutlinePayments size={36} />,
    },
    {
      label: "TOTAL PENDING AMOUNT",
      value: parseFloat(totalPendingAmount).toFixed(2),
      icon: <FaMoneyBills size={36} />,
    },
    {
      label: "MONTHLY COMPLETED AMOUNT",
      value: parseFloat(monthlyTotalPaidAmount).toFixed(2),
      icon: <FaMoneyBills size={36} />,
    },
    {
      label: "MONTHLY PENDING AMOUNT",
      value: parseFloat(monthlyTotalPendingAmount).toFixed(2),
      icon: <FaMoneyBills size={36} />,
    },
    {
      label: "YEARLY COMPLETED AMOUNT",
      value: parseFloat(yearlyTotalPaidAmount).toFixed(2),
      icon: <FaMoneyBills size={36} />,
    },
    {
      label: "YEARLY PENDING AMOUNT",
      value: parseFloat(yearlyTotalPendingAmount).toFixed(2),
      icon: <FaMoneyBills size={36} />,
    },
  ];

  const visibleCards = showAll ? cards : cards.slice(0, 5);

  return (
    <AuthenticatedLayout
      Order={auth.Order}
      header={
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* File Dropdown */}
            <DropdownComponent
              triggerText="File"
              options={fileOptions}
            />
            {/* Create dropdown */}
            <DropdownComponent
              triggerText='Add new'
              className='bg-gray-800 text-white hover:bg-gray-700'
              options={createOptions}
            />
          </div>
        </>
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
      <div className="mt-4 mx-4 p-4 bg-white shadow-sm rounded-2xl">
        {/* Tabs */}
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cards View */}
        {activeTab === 'cards' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all mt-4">
              {visibleCards.map((card, index) => {
                const cardContent = (
                  <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                      <p className="text-xl font-bold">{card.value}</p>
                    </div>
                    {card.icon}
                  </div>
                );

                return (
                  <div key={index}>
                    <Card
                      title={card.label}
                      value={card.value}
                      icon={card.icon}
                      link={card.link}
                    />
                  </div>
                );
              })}
            </div>

            {/* Show More / Show Less Button */}
            {cards.length > 5 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm px-4 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-blue-50 transition"
                >
                  {showAll ? 'Show Less ↑' : 'Show More ↓'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Filters View */}
        {activeTab === 'filters' && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow">
            <div className="text-lg font-semibold mb-4">Filters</div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Select Product</label>
                  <select value={params.get('productid')} onChange={(e) => router.get(route('order.index'),  {
                    productid: e.target.value,
                    search: params.get('search'),
                    searchuserid: params.get('searchuserid'),
                    status: params.get('status'),
                    startdate: params.get('startdate'),
                    enddate: params.get('enddate'),
                  },
                  {
                    preserveState: true,
                    preserveScroll: true,
                  })} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">All</option>
                    {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name} {product.model ? `(${product.model})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              </div>
          </div>
        )}
      </div>





      <div className="flex flex-col px-4 mx-auto w-full">
        <div className="w-full ">

          <div className="flex flex-col md:flex-row justify-end items-center mt-4 mb-4">
            <Formik
              enableReinitialize
              initialValues={{ search: params.get('search') || '' }}
              onSubmit={(values) => {
                router.get(
                  route('order.index'),
                  {
                    search: values.search,
                    searchuserid: params.get('searchuserid'),
                    status: params.get('status'),
                    startdate: params.get('startdate'),
                    enddate: params.get('enddate'),
                    productid: params.get('productid'),
                  },
                  {
                    preserveState: true,
                    preserveScroll: true,
                  }
                );
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
                            placeholder="Search orders..."
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
                                router.get(route('order.index'));
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


            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">
              {/* <button
                onClick={() => router.get(route('order.instantorder'))}
                className="text-white w-full md:w-64  py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
              >
                Instant Sale
              </button> */}

              {/* 
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
              </select> */}

              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white  w-full md:w-64 lg:w-80 py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                >
                  Bulk Delete
                </button>
              )}

              {/* <FloatingCreateButton routeName="order.create" title="Create" /> */}



              <button
                onClick={() => setDaterangeModel(true)}
                className="text-white flex justify-center items-center gap-2 w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-900 md:w-auto"
              >
                <FaCalendarCheck className='h-4 w-4' />
                Date&nbsp;Range&nbsp;Filter
              </button>

              {/* reset filter */}
              <button
                onClick={() => {
                  router.get(route('order.index'))
                }}
                className="text-gray-700 flex justify-center items-center gap-2 w-full py-2 px-4 rounded-lg  bg-gray-200 hover:bg-slate-300 md:w-auto"
              >
                <FaRotateRight className='h-4 w-4' />
                Reset&nbsp;Filters
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
                  <th className="px-4 py-3 text-left">Sale ID</th>
                  <th className="px-4 py-3 text-left">Sale Info</th>
                  <th className="px-4 py-3 text-left">Bill No.</th>
                  <th className="px-4 py-3 text-left">Payable</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3 text-left">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <div className="flex items-center justify-between cursor-pointer">
                          {`Status (${params.get('status') === 'pending'
                            ? 'Pending'
                            : params.get('status') === 'completed'
                              ? 'Completed'
                              : params.get('status') === 'cancel'
                                ? 'Cancelled'
                                : 'All'})`}
                          <button className="text-gray-500 hover:text-gray-700 transition" title="Filter Status">
                            <FaFilter className="w-4 h-4" />
                          </button>
                        </div>
                      </Dropdown.Trigger>

                      <Dropdown.Content>
                        <select
                          onClick={(e) => e.stopPropagation()}
                          name="status"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) =>
                            router.get(
                              route('order.index'),
                              {
                                status: e.target.value,
                                startdate: params.get('startdate'),
                                enddate: params.get('enddate'),
                                search: params.get('search'),
                                searchuserid: params.get('searchuserid'),
                                productid: params.get('productid'),
                              },
                              { preserveState: true }
                            )
                          }
                          value={params.get('status') || ''}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancel">Cancelled</option>
                        </select>
                      </Dropdown.Content>
                    </Dropdown>


                  </th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {orders.data.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No order found.</td>
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
                    {/* Checkbox */}
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

                    {/* Sale ID */}
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

                    {/* Sale Info */}
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.name}</p>
                          {order.email && (
                            <p className="text-xs text-gray-500">{order.email}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Bill No. */}
                    <td className="px-4 py-2 text-gray-800">{order.bill_no || "N/A"}</td>

                    {/* Payable */}
                    <td className="px-4 py-2 text-gray-800">{order.payable_amount}</td>

                    {/* Paid (Editable input) */}
                    <td className="px-4 py-2">
                      <div className="flex items-center w-[110px]">
                        <input
                          className="border rounded-xl px-2 py-1 text-sm focus:ring-black focus:border-black w-full"
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

                    {/* Status */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          if (order.status === "cancel") {
                            toast.error("You can't change the status because it is already canceled.");
                          } else {
                            setIsStatusModalOpen(order);
                          }
                        }}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-xl flex items-center ${order.status === "pending"
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

                    {/* Actions */}
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
                      <button onClick={() => orders.links[0].url ? router.get(orders.links[0].url, { status: status || '', searchuserid: searchuserid || '', search: search || '', startdate: params.get('startdate') || '', enddate: params.get('enddate') || '' , productid: params.get('productid') || '' }) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
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
                                  onClick={() => link.url && window.location.assign(link.url + `&status=${status || ''}` + `&search=${search || ''}` + `&searchuserid=${searchuserid || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || '' }` + `&productid=${params.get('productid') || '' }`)}
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
                      <button onClick={() => orders.links[orders.links.length - 1].url && window.location.assign(orders.links[orders.links.length - 1].url + `&status=${status || ''}` + `&search=${search || ''}` + `&searchuserid=${searchuserid || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || ''}` + `&productid=${params.get('productid') || ''}`)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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
                      productid: params.get('productid') || '',

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

