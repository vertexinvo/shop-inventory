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

 

  const goToLedger = (codeOrId) => {
    router.get(route('ledger.supplier.supplierLedger', codeOrId));
  };


  return (
    <AuthenticatedLayout
      Product={auth.Product}
      header={

        <>
        
        </>
      }
    >
      <Head title="Supplier" />

      <div className="flex flex-col px-4 mt-4 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">
            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">

              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('ledger.supplier'), { search: values.search }, { preserveState: true });
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
                                  router.get(route('ledger.supplier'));
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
                onChange={(e) => router.get(route('ledger.supplier'), { status: e.target.value }, { preserveState: true })}
                value={status}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>

              </select> */}
          

            </div>
          </div>



          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="whitespace-nowrap text-xs uppercase bg-gray-200 text-gray-700 tracking-wide border-b">
                <tr>
                  
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
                        <button
                        onClick={() => goToLedger(item.code || item.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        Ledger
                      </button>
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
                      router.get(route('ledger.supplier'), {
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
                        router.get(route('ledger.supplier'), {
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

     

    </AuthenticatedLayout>
  );
}

