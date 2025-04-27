import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete, MdPending } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { BiCopy, BiExport } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { PiListChecksFill } from 'react-icons/pi';
import { FaBoxOpen } from 'react-icons/fa6';
import { VscGraph } from 'react-icons/vsc';
import { MdKeyboardBackspace } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import Dropdown from '@/Components/Dropdown';
import FloatingCreateButton from '@/Components/FloatingCreateButton';

export default function List(props) {
  const { auth, suppliers, totalPendingAmount, totalPaidAmount, totalSuppliers, status, search } = props
  console.log(totalSuppliers)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);

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
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => router.get(route('dashboard'))}
              title="Back"
            />
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <a
              href={route('supplier.csvexport')}
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
      <Head title="Supplier" />

      <div class="mx-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-2 mt-10">
        <Link href={route('supplier.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL SUPPLIERS</p>
                <p class="text-lg">{totalSuppliers}</p>
              </div>
              <div class="my-auto">
                <VscGraph size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('supplier.index', { status: 'pending' })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">PENDING AMOUNT</p>
                <p class="text-lg">{totalPendingAmount}</p>
              </div>
              <div class="my-auto">
                <FaBoxOpen size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('supplier.index', { status: 'paid' })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">COMPLETED AMOUNT</p>
                <p class="text-lg">{totalPaidAmount}</p>
              </div>
              <div class="my-auto">
                <PiListChecksFill size={40} />
              </div>
            </div>
          </div>
        </Link>
      </div>





      <div className="flex flex-col px-4 mt-7 mx-auto w-full">
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
                          router.get(route('supplier.index'));
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

                  </Form>

                )}

              </Formik>
              <select
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

              </select>
              {selectId.length > 0 && (
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                >
                  Bulk Delete
                </button>
              )}

              <FloatingCreateButton routeName="supplier.create" title="Create" />

            </div>
          </div>





          <div className="overflow-x-auto">
            <div class="font-[sans-serif] overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="whitespace-nowrap">
                  <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                    <th class="pl-4 w-8">
                      <input id="checkbox" type="checkbox" class="hidden peer"
                        onChange={(e) => setSelectId(e.target.checked ? suppliers.data.map((item) => item.id) : [])}
                        checked={selectId.length === suppliers.data.length}
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
                      Supplier Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Contact
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Address
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Code
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Total Invoices
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

                  {suppliers.data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="p-4 text-center">
                        No Supplier found.
                      </td>
                    </tr>
                  )}
                  {suppliers.data.map((item, index) => (

                    <tr
                      onContextMenu={(e) => {
                        e.preventDefault(); // Prevents default right-click menu
                        show({ event: e, props: item }); // Shows custom menu
                      }}
                      className={`${item?.total_amount_paid == 0 && item?.total_amount > 0 ? 'bg-red-100' : item?.total_amount_paid > 0 && item?.total_amount_pending > 0 ? 'bg-yellow-100' : ''}  ${selectId.includes(item.id) ? 'border-black border-4' : 'border-gray-300 border-b'}`}>

                      <td className="pl-4 w-8">
                        <input
                          id={`checkbox-${item.id}`} // Unique id for each checkbox
                          type="checkbox"
                          className="hidden peer"
                          value={item.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectId((prev) => [...prev, item.id]); // Add user ID to state
                            } else {
                              setSelectId((prev) => prev.filter((id) => id !== item.id)); // Remove user ID from state
                            }
                          }}
                          checked={selectId.includes(item.id)} // Bind state to checkbox
                        />
                        <label
                          htmlFor={`checkbox-${item.id}`} // Match label with checkbox id
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


                      <td class=" text-sm">
                        <div class="flex items-center cursor-pointer w-max">
                          <div class="ml-4 ">
                            <p class="text-sm text-black ">Person Name : {item.person_name}</p>
                            {item.email && <p class="text-xs text-gray-500 mt-0.5">Email :{item.email} </p>}

                          </div>
                        </div>
                      </td>

                      <td class="p-4 text-sm text-black">
                        {item?.contact || 'N/A'}
                      </td>

                      <td class="p-4 text-sm text-black">
                        {item?.address || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black flex items-center">
                        <Link className='text-blue-600' href={route('product.index', { invoicecode: item.code })} >{item?.code || 'N/A'}</Link> <BiCopy size={20} onClick={() => { navigator.clipboard.writeText(item.code); toast.success('Copied!'); }} className="ml-2 cursor-pointer" />
                      </td>

                      <td class="p-4 text-sm text-black">
                        {item?.total_supplierinvoices || 0}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {item?.total_amount || 0}
                      </td>

                      {/* total_total_amount_paid */}
                      <td class="p-4 text-sm text-black">
                        {item?.total_amount_paid || 0}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {item?.total_amount_pending || 0}
                      </td>



                      <td class="p-4 flex items-center">

                        <Dropdown >
                          <Dropdown.Trigger>
                            <button className="text-gray-500 hover:text-black focus:outline-none">
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </Dropdown.Trigger>
                          <Dropdown.Content>
                            <Dropdown.Link href={route('supplier.invoices', item.id)}>Invoice</Dropdown.Link>
                            <Dropdown.Link href={route('ledger.supplier.supplierLedger', item.code || item.id)}>Ledger</Dropdown.Link>
                            <Dropdown.Link href={route('supplier.edit', item.id)}>Edit</Dropdown.Link>
                            <button class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out " type='button' onClick={() => setIsDeleteModalOpen(item)} >Delete</button>


                          </Dropdown.Content>
                        </Dropdown>





                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>


              {/* Context Menu */}
              <Menu id="context-menu">
                <Item onClick={({ props }) => handleMenuClick({ props, action: "invoice" })}>
                  Invoice
                </Item>
                <Item
                  onClick={({ props }) => handleMenuClick({ props, action: "ledger" })}
                  className="text-red-600"
                >
                  Ledger
                </Item>
                <Item onClick={({ props }) => handleMenuClick({ props, action: "edit" })}>
                  Edit
                </Item>
                <Item
                  onClick={({ props }) => handleMenuClick({ props, action: "delete" })}
                  className="text-red-600"
                >
                  Delete
                </Item>
              </Menu>


            </div>
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9">
              <span class="flex items-center col-span-3">
                Showing {suppliers.from} - {suppliers.to} of {suppliers.total}
              </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                {/* Load More Button - Hide when all data is loaded */}
                {suppliers.to < suppliers.total && (
                  <button
                    type="button"
                    onClick={() =>
                      router.get(route('supplier.index'), {
                        status: status || '',
                        search: search || '',
                        per_page: params.get('per_page') ? parseInt(params.get('per_page')) + 10 : 20,
                      })
                    }
                    class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                  >
                    Load More
                  </button>
                )}

                {/* Load Less Button - Hide when at minimum per_page */}
                {params.get('per_page') && parseInt(params.get('per_page')) > 10 && (
                  <button
                    type="button"
                    onClick={() =>
                      router.get(route('supplier.index'), {
                        status: status || '',
                        search: search || '',
                        per_page: Math.max(10, parseInt(params.get('per_page')) - 10),
                      })
                    }
                    class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                  >
                    Load Less
                  </button>
                )}
              </span>
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

