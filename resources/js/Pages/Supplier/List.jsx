import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit, FaCheck, FaSearch, FaEllipsisV, FaChevronDown } from 'react-icons/fa'
import { MdDelete, MdPending } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { BiCopy, BiExport } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { PiListChecksFill } from 'react-icons/pi';
import { FaBoxOpen, FaXmark } from 'react-icons/fa6';
import { VscGraph } from 'react-icons/vsc';
import { MdKeyboardBackspace } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Dropdown from '@/Components/Dropdown';
import FloatingCreateButton from '@/Components/FloatingCreateButton';
import { FaFilter, FaThLarge } from "react-icons/fa"; // Optional: for icons
import TabSwitcher from '@/Components/TabSwitcher';
import Card from '@/Components/Cards';
export default function List(props) {
  const { auth, suppliers, totalPendingAmount, totalPaidAmount, totalSuppliers, status, search } = props
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);


  const [activeTab, setActiveTab] = useState('cards'); // 'cards' ya 'filters'
  const { show } = useContextMenu({ id: "context-menu" });

  const handleMenuClick = ({ props, action }) => {
    const item = props;
    if (action === "invoice") {
      router.get(route('supplier.invoices', item.id));
    } else if (action === "edit") {
      router.get(route('supplier.edit', item.id));
    } else if (action === "delete") {
      setIsDeleteModalOpen(item)
    } else if (action === "ledger") {
      router.get(route('ledger.supplier.supplierLedger', item.code || item.id));
    }
  };



  return (
    <AuthenticatedLayout
      Product={auth.Product}
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
                  href={route('supplier.csvexport')}
                  download
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export Excel (.csv)
                </a>
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
                  href={route('supplier.create')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Supplier
                </Link>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </>
      }
    >
      <Head title="Supplier" />
      <div className="mt-4 mx-4 p-4 bg-white shadow-sm rounded-2xl">
        {/* Top Bar: Tabs only (no dropdown in this case) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* Dropdown Filter only when 'cards' tab is active */}
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
              title="Total Suppliers"
              value={totalSuppliers}
              icon={<VscGraph size={36} />}
              link={route('supplier.index')}
            />
            <Card
              title="Pending Amount"
              value={<span >{totalPendingAmount}</span>}
              icon={<FaBoxOpen size={36} />}
              link={route('supplier.index', { status: 'pending' })}
            />
            <Card
              title="Completed Amount"
              value={<span >{totalPaidAmount}</span>}
              icon={<PiListChecksFill size={36} />}
              link={route('supplier.index', { status: 'paid' })}
            />
          </div>
        )}

        {/* Filters Section */}
        {activeTab === 'filters' && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Filter Options</h3>
            <select
              name="filter"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  w-full md:w-[150px] p-2.5 pr-10  
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) =>
                router.get(
                  route('supplier.index'),
                  { status: e.target.value },
                  { preserveState: true }
                )
              }
              value={status}
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        )}
      </div>






      <div className="flex flex-col px-4 mt-4 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">
            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('supplier.index'), { search: values.search }, { preserveState: true });
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
                              placeholder="Search suppliers..."
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
                                  router.get(route('supplier.index'));
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
              {/* <select
                name="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                          w-full md:w-[150px] p-2.5  pr-10  
                                              
                                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('supplier.index'), { status: e.target.value }, { preserveState: true })}
                value={status}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>

              </select> */}
              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                >
                  Bulk Delete
                </button>
              )}



            </div>
          </div>



          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="whitespace-nowrap text-xs uppercase bg-gray-200 text-gray-700 tracking-wide border-b">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input
                      id="checkbox"
                      type="checkbox"
                      className="hidden peer"
                      onChange={(e) =>
                        setSelectId(
                          e.target.checked ? suppliers.data.map((item) => item.id) : []
                        )
                      }
                      checked={selectId.length === suppliers.data.length}
                    />
                    <label
                      htmlFor="checkbox"
                      className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                    >
                      <FaCheck className="w-full fill-white" />
                    </label>
                  </th>
                  <th className="px-4 py-3 text-left ">Supplier Info</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 ">Total Invoices</th>
                  <th className="px-4 py-3 ">Total Amount</th>
                  <th className="px-4 py-3 ">Amount Paid</th>
                  <th className="px-4 py-3 ">Amount Pending</th>
                  <th className="px-4 py-3 ">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.data.length === 0 && (
                  <tr>
                    <td colSpan="10" className="px-4 py-1 text-center text-gray-500">
                      No Supplier found.
                    </td>
                  </tr>
                )}

                {suppliers.data.map((item) => (
                  <tr
                    key={item.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      show({ event: e, props: item });
                    }}
                    className={`${item?.total_amount_paid === 0 && item?.total_amount > 0
                      ? 'bg-red-50'
                      : item?.total_amount_paid > 0 && item?.total_amount_pending > 0
                        ? 'bg-yellow-50'
                        : ''
                      } ${selectId.includes(item.id) ? 'border-l-4 border-black' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-1 w-8">
                      <input
                        id={`checkbox-${item.id}`}
                        type="checkbox"
                        className="hidden peer"
                        value={item.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectId((prev) => [...prev, item.id]);
                          } else {
                            setSelectId((prev) => prev.filter((id) => id !== item.id));
                          }
                        }}
                        checked={selectId.includes(item.id)}
                      />
                      <label
                        htmlFor={`checkbox-${item.id}`}
                        className="relative flex items-center justify-center w-5 h-5 bg-black border border-gray-400 rounded cursor-pointer p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white"
                      >
                        <FaCheck className="w-full fill-white" />
                      </label>
                    </td>

                    {/* Supplier Info */}
                    <td className="px-4 py-1 text-gray-800">
                      <div>
                        <p className="font-medium">Person: {item.person_name}</p>
                        {item.email && (
                          <p className="text-xs text-gray-500">Email: {item.email}</p>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-1 text-gray-700">{item?.contact || 'N/A'}</td>

                    {/* Address */}
                    <td className="px-4 py-1 text-gray-700">{item?.address || 'N/A'}</td>

                    {/* Code */}
                    <td className="px-4 py-3.5 flex items-center text-blue-600">
                      <Link
                        href={route('product.index', { invoicecode: item.code })}
                        className="hover:underline "
                      >
                        {item?.code || 'N/A'}
                      </Link>
                      <BiCopy
                        size={18}
                        onClick={() => {
                          navigator.clipboard.writeText(item.code);
                          toast.success('Copied!');
                        }}
                        className="ml-2 text-gray-500 cursor-pointer hover:text-black"
                      />
                    </td>

                    {/* Invoices & Amounts */}
                    <td className="px-4 py-1 text-gray-700 text-center">
                      {item?.total_supplierinvoices || 0}
                    </td>
                    <td className="px-4 py-1 text-gray-700 text-center">
                      {item?.total_amount || 0}
                    </td>
                    <td className="px-4 py-1 text-gray-700 text-center">
                      {item?.total_amount_paid || 0}
                    </td>
                    <td className="px-4 py-1 text-gray-700 text-center">
                      {item?.total_amount_pending || 0}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-center">
                      <Dropdown>
                        <Dropdown.Trigger>
                          <button className="text-gray-500 hover:text-black focus:outline-none">
                            <FaEllipsisV className="w-5 h-5" />
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          <Dropdown.Link href={route('supplier.invoices', item.id)}>Invoice</Dropdown.Link>
                          <Dropdown.Link href={route('ledger.supplier.supplierLedger', item.code || item.id)}>Ledger</Dropdown.Link>
                          <Dropdown.Link href={route('supplier.edit', item.id)}>Edit</Dropdown.Link>
                          <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(item)}
                            className="block w-full px-4 py-2 text-start text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </Dropdown.Content>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-500 bg-gray-50 border-t">
              <span>
                Showing {suppliers.from} - {suppliers.to} of {suppliers.total}
              </span>
              <div className="space-x-2">
                {suppliers.to < suppliers.total && (
                  <button
                    onClick={() =>
                      router.get(route('supplier.index'), {
                        status: status || '',
                        search: search || '',
                        per_page: params.get('per_page')
                          ? parseInt(params.get('per_page')) + 10
                          : 20,
                      })
                    }
                    className="px-3 py-1 bg-white border rounded shadow hover:bg-gray-100"
                  >
                    Load More
                  </button>
                )}
                {params.get('per_page') &&
                  parseInt(params.get('per_page')) > 10 && (
                    <button
                      onClick={() =>
                        router.get(route('supplier.index'), {
                          status: status || '',
                          search: search || '',
                          per_page: Math.max(
                            10,
                            parseInt(params.get('per_page')) - 10
                          ),
                        })
                      }
                      className="px-3 py-1 bg-white border rounded shadow hover:bg-gray-100"
                    >
                      Load Less
                    </button>
                  )}
              </div>
            </div>
          </div>



        </div>
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={() => {

        router.delete(route('supplier.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />




      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these supplier?" onConfirm={() => {

        router.post(route('supplier.bulkdestroy'), { ids: selectId.join(',') }, {
          onSuccess: () => {
            setIsBulkDeleteModalOpen(false);
            setSelectId([]);
          },
        });

      }} />

    </AuthenticatedLayout>
  );
}

