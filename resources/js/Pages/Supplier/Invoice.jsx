import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal';
// Yup
import * as Yup from 'yup';
import { RiAiGenerate } from 'react-icons/ri';
import { FaPen } from "react-icons/fa";
import { IoIosSave } from 'react-icons/io';
import { MdKeyboardBackspace } from 'react-icons/md';
import { SiMicrosoftexcel } from "react-icons/si";




export default function List(props) {
  let { auth, supplier, suppliers, search } = props

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(null);

  const [isNewSupplierInvoiceModel, setIsNewSupplierInvoiceModel] = useState(false);

  const [supplierInvoiceAmounts, setSupplierInvoiceAmounts] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);

  const [supplierEdit , setSupplierEdit] = useState(null);

  const handleAmountChange = (e, orderId) => {
    const updatedAmount = e.target.value;
    setSupplierInvoiceAmounts((prevState) => ({
      ...prevState,
      [orderId]: updatedAmount,
    }));
  };

  const handleSaveAmount = async (orderId) => {
    const amountToSave = supplierInvoiceAmounts[orderId] || 0; // Default to 0 if not set
    // Assuming you have a router to handle this request
    await router.put(route('order.amountupdate', orderId), { paid_amount: amountToSave });
  };




  return (
    <AuthenticatedLayout
      Product={auth.Product}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('supplier.index'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Supplier #{suppliers.code}</h2>


        </>

      }
    >
      <Head title="Invoice" />



      <div className="p-4 items-center  ">

        <div class="flex items-center justify-center bg-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 w-full shadow rounded-lg border">
            <div class="px-4 py-5 sm:px-6 ">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Name: {suppliers.person_name || 'N/A'}
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Email: {suppliers.email || 'N/A'}
              </p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Code:</dt>
                  <b><dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{suppliers.code || 'N/A'}</dd></b>
                </div>
                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Contact:</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{suppliers.contact || 'N/A'}</dd>
                </div>

                <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Address:</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{suppliers.address || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4  mt-2 mx-auto w-full">
        <div className="w-full ">
          <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">
            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">
              <Formik
                enableReinitialize
                initialValues={{ search: '' }}
                onSubmit={(values) => {
                  router.get(route('supplier.invoices', suppliers.id), { search: values.search }, { preserveState: true });
                }}

              >
                {({ values, setFieldValue, handleSubmit, errors, touched }) => (

                  <Form className="flex flex-col md:flex-row w-full md:space-x-2 space-y-2 md:space-y-0">
                    <button
                      onClick={() => setIsNewSupplierInvoiceModel(true)}
                      className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
                    >
                      Create Invoice
                    </button>
                    <div className="relative w-full md:w-auto">

                      <Field
                        name="search"
                        type="text"
                        placeholder="Search..."
                        className=" py-2 px-4 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black w-full"
                      />
                      <button
                        type="button"
                        onClick={() => { setFieldValue('search', ''); router.get(route('supplier.invoices', suppliers.id)); }}
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

                    <a
                      href={route('supplierinvoices.csvexport')}
                      className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'
                    >
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

            <div className="font-[sans-serif] overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="whitespace-nowrap">
                  <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                    <th className="p-4 text-left text-sm font-semibold ">Invoice No</th>
                    <th className="p-4 text-left text-sm font-semibold ">Invoice Date</th>
                    <th className="p-4 text-left text-sm font-semibold ">Due Date</th>
                    <th className="p-4 text-left text-sm font-semibold ">Total Payment</th>
                    <th className="p-4 text-left text-sm font-semibold ">Paid Amount</th>
                    <th className="p-4 text-left text-sm font-semibold ">Outstanding</th>
                    <th className="p-4 text-left text-sm font-semibold ">Payment Method</th>
                    <th className="p-4 text-left text-sm font-semibold ">Cheque No</th>
                    <th className="p-4 text-left text-sm font-semibold ">Cheque Date</th>
                    <th className="p-4 text-left text-sm font-semibold ">Bank Name</th>
                    <th className="p-4 text-left text-sm font-semibold ">Note</th>
                    <th className="p-4 text-left text-sm font-semibold ">Status</th>
                    <th className="p-4 text-left text-sm font-semibold ">Action</th>
                  </tr>
                </thead>

                <tbody className="whitespace-nowrap">
                  {supplier.data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="p-4 text-center">
                        No Invoices found.
                      </td>
                    </tr>
                  )}
                  {supplier.data.map((item, index) => (

                    <tr className={`${item?.paid_amount == 0 ? 'bg-red-100' : (item.total_payment - item.paid_amount) > 0 ? 'bg-yellow-100' : '' } border-b border-gray-300`} key={index}>
                      <td className="p-4 text-sm text-blue-600"><Link href={route('product.index', {supplierinvoiceno: item.invoice_no})}>{item.invoice_no || 'N/A'}</Link></td>
                      <td className="p-4 text-sm text-black">{item.invoice_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.due_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.total_payment || 'N/A'}</td>

                      <td className="p-4 text-sm text-black">
                        <div className="flex items-center w-[130px] ">
                          <input
                            name="phone"
                            className="appearance-none border rounded py-2 px-3 focus:ring-black focus:border-black text-grey-darker w-full"
                            type="number"
                            step="0.01"
                            value={supplierInvoiceAmounts[item.id] || item.paid_amount || 0} // Use order-specific value
                            onChange={(e) => handleAmountChange(e, item.id)} // Pass the order id
                          />
                          <IoIosSave
                            className="ml-2 cursor-pointer"
                            size={30}
                            onClick={async() => await router.put(route('supplier-invoice.amountupdate', item.id), { paid_amount: supplierInvoiceAmounts[item.id] || item.paid_amount || 0 })} // Save the updated amount
                          />
                        </div>
                        {/* {item.paid_amount || 'N/A'} */}
                      </td>
                      <td className="p-4 text-sm text-black">{item.total_payment - item.paid_amount}</td>
                      <td className="p-4 text-sm text-black">{item.method || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.cheque_no || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.cheque_date || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.bank_name || 'N/A'}</td>
                      <td className="p-4 text-sm text-black">{item.note || 'N/A'}</td>
                      <td className="p-4 text-sm text-black flex  ">
                        <button onClick={() => setIsStatusModalOpen(item)}>
                          {item.status === "pending" ? (
                            <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded  "
                            > {item.status || 'N/A'}<FaPen className="ms-1" />
                            </span>) : item.status === "paid" && (
                              <span className="flex items-center bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded  "
                              >{item.status || 'N/A'}<FaPen className="ms-1" />
                              </span>
                            )}
                        </button>
                       
                      </td>

                      <td className="p-4 text-sm text-black">
                        <button onClick={() => setIsDeleteModalOpen(item)} title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                            <path
                              d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                              data-original="#000000" />
                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                              data-original="#000000" />
                          </svg>
                        </button>
                        &nbsp;&nbsp;
                        <button onClick={() => setSupplierEdit(item)} title="Edit">
                          <FaPen className="text-blue-500 hover:text-blue-700" />
                        </button>
                        
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {supplier.from} - {supplier.to} of {supplier.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => supplier.links[0].url ? router.get(supplier.links[0].url, { search: search || '' }) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = supplier.links.findIndex((l) => l.active);

                      return supplier.links
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
                                  onClick={() => link.url && window.location.assign(link.url + `&search=${search || ''}`)}
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
                      <button onClick={() => supplier.links[supplier.links.length - 1].url && window.location.assign(supplier.links[supplier.links.length - 1].url + `&search=${search || ''}`)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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
      <Modal show={isNewSupplierInvoiceModel || supplierEdit !== null} onClose={() =>{ setIsNewSupplierInvoiceModel(false) ; setSupplierEdit(null)}}>
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
          {supplierEdit !== null ? "Update Invoice" : "Create New Invoice"}  
            </div>
          </div>

          <div className="px-10 mb-5">
            <Formik enableReinitialize initialValues={{
               supplier_code: suppliers.code || "",
               invoice_no: supplierEdit?.invoice_no || "",
               invoice_date: supplierEdit?.invoice_date || "",
               due_date: supplierEdit?.due_date || "",
               total_payment: supplierEdit?.total_payment || "",
               paid_amount: supplierEdit?.paid_amount || "",
               status: supplierEdit?.status || "",
               method: supplierEdit?.method || "",
               cheque_no: supplierEdit?.cheque_no || "",
               cheque_date: supplierEdit?.cheque_date || "",
               bank_name: supplierEdit?.bank_name || "",
               bank_branch: supplierEdit?.bank_branch || "",
               bank_account: supplierEdit?.bank_account || "",
               online_payment_link: supplierEdit?.online_payment_link || "",
               payment_proof: supplierEdit?.payment_proof || "",
               note: supplierEdit?.note || "",
            }}
              validationSchema={Yup.object({
                supplier_code: Yup.string().required("Supplier Code is required"),
                invoice_no: Yup.string().required("Invoice No is required"),
                invoice_date: Yup.date().required("Invoice Date is required"),
                due_date: Yup.date().required("Due Date is required"),
                total_payment: Yup.number().required(
                  "Total Pending Payment is required"
                ),
                paid_amount: Yup.number().required("Paid Amount is required"),
                status: Yup.string().required("Status is required"),
                method: Yup.string().required("Method is required"),
                cheque_no: Yup.string().when("method", {
                  is: "cheque",
                  then: (scheme) => scheme.required("Cheque No is required"),
                  otherwise: (scheme) => scheme.optional(),
                }),
                cheque_date: Yup.string().when("method", {
                  is: "cheque",
                  then: (scheme) => scheme.required("Cheque Date is required"),
                  otherwise: (scheme) => scheme.optional(),
                }),
                bank_name: Yup.string(),
                bank_branch: Yup.string(),
                bank_account: Yup.string(),
                online_payment_link: Yup.string().url("Must be a valid URL"),
                payment_proof: Yup.string(),
                note: Yup.string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
              
                supplierEdit !== null ? router.put(route('supplier-invoice.update', supplierEdit.id), values, {
                  onSuccess: () => {
                    setIsNewSupplierInvoiceModel(false);
                    setSupplierEdit(null);
                  },
                  preserveScroll: true,
                  preserveState: true,
                }) :
                router.post(route('supplier-invoice.store'), values, {
                  onSuccess: () => {
                    setIsNewSupplierInvoiceModel(false);
                  },
                  preserveScroll: true,
                  preserveState: true,
                });

              }}
            >
              {({ isSubmitting, values, errors, setFieldValue, }) => {

                const generateInvoiceNo = () => {
                  router.get(route('supplier.invoices', suppliers.id), { invoicecode: true }, {
                    onSuccess: (response) => {
                      setFieldValue('invoice_no', response.props.invoicecode);
                    },
                    preserveScroll: true,
                    preserveState: true
                  });
                }

                return (
                  <Form>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2">Supplier Code</label>
                      <Field disabled={supplierEdit !== null} name="supplier_code" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier code" />

                      <ErrorMessage name="supplier_code" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Invoice No
                      </label>
                      <div className="flex gap-2 items-center">
                        <Field
                          name="invoice_no"
                          className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                          type="text"
                          placeholder="Enter invoice no"
                        />
                        <RiAiGenerate onClick={() => generateInvoiceNo()} size={40} color="black" />
                      </div>
                      <ErrorMessage
                        name="invoice_no"
                        component="div"
                        className="text-red-500 text-xs mt-1"

                      />
                      {values.invoice_no !== '' &&
                        <button type="button" onClick={() => {
                          //copy to clipboard
                          navigator.clipboard.writeText(values.invoice_no);
                          toast.success('Copied to clipboard');
                        }} className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2' >Copy</button>
                      }
                    </div>
                    {/* Invoice Date */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Invoice Date
                      </label>
                      <Field
                        name="invoice_date"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="date"
                      />
                      <ErrorMessage
                        name="invoice_date"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Due Date */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Due Date
                      </label>
                      <Field
                        name="due_date"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="date"
                      />
                      <ErrorMessage
                        name="due_date"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Total Pending Payment */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Total Payment
                      </label>
                      <Field
                        name="total_payment"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="number"
                        placeholder="Enter total payment"
                      />
                      <ErrorMessage
                        name="total_payment"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* paid amount */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Paid Amount
                      </label>
                      <Field
                        name="paid_amount"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="number"
                        placeholder="Enter paid amount"
                      />
                      <ErrorMessage
                        name="paid_amount"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Payment Status
                      </label>
                      <Field
                        as="select"
                        name="status"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>

                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Payment Method
                      </label>
                      <Field
                        as="select"
                        name="method"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                      >
                        <option value="">Select method</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank">Bank</option>
                        <option value="online">Online</option>
                      </Field>
                      <ErrorMessage
                        name="method"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>




                    {values.method === "cheque" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Cheque No
                          </label>
                          <Field
                            name="cheque_no"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter cheque no"
                          />
                          <ErrorMessage
                            name="cheque_no"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>


                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Cheque Date
                          </label>
                          <Field
                            name="cheque_date"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="date"
                          />
                          <ErrorMessage
                            name="cheque_date"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    {values.method === "bank" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Bank Name
                          </label>
                          <Field
                            name="bank_name"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank name"
                          />
                          <ErrorMessage
                            name="bank_name"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>


                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Brank Brank
                          </label>
                          <Field
                            name="bank_branch"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank branch"
                          />
                          <ErrorMessage
                            name="bank_branch"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Bank Account No
                          </label>
                          <Field
                            name="bank_account"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank account no"
                          />
                          <ErrorMessage
                            name="bank_account"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    {values.method === "online" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Online payment link
                          </label>
                          <Field
                            name="online_payment_link"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="url"
                            placeholder="Enter online payment link"
                          />
                          <ErrorMessage
                            name="online_payment_link"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Note (optional)
                      </label>
                      <Field
                        name="note"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        as="textarea"
                        placeholder="Enter note"
                      ></Field>
                      <ErrorMessage
                        name="note"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>


                    <div className="flex items-center justify-start gap-1 mt-8">
                      <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                      </button>
                      <button onClick={() => {setIsNewSupplierInvoiceModel(false); setSupplierEdit(null);}} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                        Close
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </Modal>


      


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

            router.put(route('supplier-invoice.changeStatus', isStatusModalOpen?.id), values, {
              onSuccess: () => {
                resetForm();
                setIsStatusModalOpen(null);
              },
            });
          }}

        >
          {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Change Status</h2>


              <div className="relative z-0 w-full mb-5 group">

                <Field name="status" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" as="select">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </Field>

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

        router.delete(route('supplier-invoice.destroy', isDeleteModalOpen?.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />
    </AuthenticatedLayout>
  );
}

