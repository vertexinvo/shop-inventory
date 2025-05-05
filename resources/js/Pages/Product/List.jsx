import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'

import { FaWallet, FaEdit, FaBoxes, FaFileDownload } from 'react-icons/fa'
import { MdDelete, MdManageHistory } from 'react-icons/md';
import { GiMoneyStack, GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { FaBox } from "react-icons/fa";
import FormatDate from '@/Helpers/FormatDate';
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { MdKeyboardBackspace } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import { QRCode } from 'react-qrcode-logo';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import FloatingCreateButton from '@/Components/FloatingCreateButton';
import { BiExport, BiImport } from 'react-icons/bi';

export default function List(props) {
  const { auth, stock, startdate, enddate, products, totalstock, totalstockavailable, totalstocknotavailable, totalStockValue, totaliteminstock, categories, brands } = props
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [isPrintQRModalOpen, setIsPrintQRModalOpen] = useState(false);
  const [daterangeModel, setDaterangeModel] = useState(false);
  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  )



  const handleFileSelect = (event) => {
    const file = event.target.files[0]; // Selecting the first file from the FileList object
    if (file) {
      // Check if the selected file is a CSV file
      if (file.type === "text/csv" || file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        router.post(route('product.csvstore'), {
          file: file
        });

      } else {
        console.error("Please select a CSV file."); // Handle non-CSV file selection
      }
    }
  };

  const { show } = useContextMenu({ id: "context-menu" });

  const handleMenuClick = ({ props, action }) => {
    const product = props;
    if (action === "view") {
      router.get(route("product.show", product.id));
    } else if (action === "edit") {
      router.get(route("product.edit", product.id));
    } else if (action === "delete") {
      setIsDeleteModalOpen(product)
    } else if (action === "stock") {
      router.get(route("stock.index", { product_id: product.id }));
    }
  };

  const [accordion, setAccordion] = useState(false);

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
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchases</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* <button
              onClick={() => router.get(route('customer.import'))} // Assuming a route for importing
              className="flex items-center space-x-1 text-gray-600 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <BiImport size={18} />
              <span>Import</span>
            </button> */}
            <a
              href={route('product.csvexport')}
              className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 rounded-lg'
            >
              <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                <BiExport className="mr-2 h-5 w-5" />
                Export CSV File
              </span>
            </a>
            <label className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 rounded-lg'>
              <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm ">
                <BiImport className="mr-2 h-5 w-5" />
                Import CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </span>
            </label>
          </div>
        </div>
      }
    >


      <Head title="Purchase" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {/* Total Products */}
        <Link href={route('product.index')}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-xl font-bold">{totalstock}</p>
            </div>
            <FaBoxes size={36} className="text-blue-500" />
          </div>
        </Link>

        {/* Total Items in Stock */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Items in Stock</p>
            <p className="text-xl font-bold">{totaliteminstock}</p>
          </div>
          <FaBoxes size={36} className="text-green-500" />
        </div>

        {/* Total Product Out of Stock */}
        <Link href={route('product.index', { status: 0 })}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
            <div>
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-xl font-bold">{totalstocknotavailable}</p>
            </div>
            <HiMiniArchiveBoxXMark size={36} className="text-red-500" />
          </div>
        </Link>

        {/* Total Product In Stock */}
        <Link href={route('product.index', { status: 1 })}>
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Stock</p>
              <p className="text-xl font-bold">{totalstockavailable}</p>
            </div>
            <FaBox size={36} className="text-green-600" />
          </div>
        </Link>

        {/* Total Stock Value */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Stock Value</p>
            <p className="text-xl font-bold text-emerald-600">{totalStockValue}</p>
          </div>
          <GiMoneyStack size={36} className="text-yellow-500" />
        </div>
      </div>


      <div className="flex flex-col px-4 mx-auto w-full">
        <div className="w-full ">

          {/* <div class="rounded-lg bg-white p-6 text-surface shadow-lg dark:bg-neutral-700 dark:text-white dark:shadow-black/30">
            <h2 class="mb-5 text-3xl font-semibold">CSV Import Guide</h2>
            {!accordion && <button className='bg-cyan-700 text-white px-4 py-2 rounded' onClick={() => setAccordion(!accordion)}>Read Guide</button>}
            {accordion && (<>
              <ul className='list-disc space-y-2'>
                <li>Download the CSV template and fill in the required fields.</li>
                <li>In the "warranty_type" column, values are "none" or "years" or "months" or "days".</li>
                <li>In the "identity_type" column, values are "none" or "sku" or "serial" or "imei".</li>
                <li>Upload the CSV file.</li>
                <li>Click on the "Import" button.</li>
                <li>After successful import, the products will be added to the database.</li>
              </ul>

              <div className='flex items-center space-x-2 mt-5'>
                <a
                  href='/productexample.csv'
                  className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'
                  download={'productexample.csv'}
                >
                  <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                    <FaFileDownload className="mr-2 h-5 w-5" />
                    Download&nbsp;CSV&nbsp;Template
                  </span>
                </a>

              </div>
            </>)}

          </div> */}


          <div className="flex flex-col md:flex-row justify-end items-center mt-5 mb-4">

            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">

              <FloatingCreateButton routeName="product.create" title="Create" />

              <Formik
                enableReinitialize
                initialValues={{ search: params.get('search') || '' }}
                onSubmit={(values) => {
                  router.get(route('product.index'), { search: values.search, status: params.get('status'), brand: params.get('brand'), category: params.get('category'), startdate: startdate, enddate: enddate, supplierinvoiceno: params.get('supplierinvoiceno'), invoicecode: params.get('invoicecode') }, {
                    preserveState: true,
                    preserveScroll: true,
                  });
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
                          router.get(route('product.index'));
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
                                w-full md:w-[150px] p-2.5 pr-10 
                                    
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('product.index'), { status: e.target.value, category: params.get('category'), brand: params.get('brand'), search: params.get('search'), startdate: startdate, enddate: enddate, supplierinvoiceno: params.get('supplierinvoiceno'), invoicecode: params.get('invoicecode') }, { preserveState: true })}
                value={params.get('status') || ''}
              >
                <option value="">Select Status</option>
                <option value="1">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>

              <select
                name="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                w-full md:w-[150px] p-2.5 pr-10 
                                    
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('product.index'), { category: e.target.value, status: params.get('status'), brand: params.get('brand'), search: params.get('search'), startdate: startdate, enddate: enddate, supplierinvoiceno: params.get('supplierinvoiceno'), invoicecode: params.get('invoicecode') }, { preserveState: true, preserveScroll: true })}
                value={params.get('category') || ''}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option value={category.name}>{category.name} ({category.total_products})</option>
                ))}

              </select>

              <select
                name="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                w-full md:w-[150px] p-2.5 pr-10 
                                    
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('product.index'), { brand: e.target.value, category: params.get('category'), status: params.get('status'), search: params.get('search'), startdate: startdate, enddate: enddate, supplierinvoiceno: params.get('supplierinvoiceno'), invoicecode: params.get('invoicecode') }, { preserveState: true, preserveScroll: true })}
                value={params.get('brand') || ''}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option value={brand.name}>{brand.name} ({brand.total_products})</option>
                ))}

              </select>



              {selectId.length > 0 && (
                <>
                  <Link href={route('product.printqr', { id: selectId.join(',') })}
                    className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-black rounded-lg hover:bg-gray-600 "
                  >
                    Print&nbsp;QR
                  </Link>

                  <button
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 "
                  >
                    Bulk&nbsp;Delete
                  </button>
                </>
              )}

              <button
                onClick={() => setDaterangeModel(true)}
                className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
              >
                Date&nbsp;Range&nbsp;Filter
              </button>



              <div class="inline-flex rounded-md shadow-sm" role="group">
                <Link href={route('brand.index')} class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white   dark:hover:text-white   dark:focus:bg-gray-700">
                  Brands
                </Link>

                <Link href={route('category.index')} class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white   dark:hover:text-white   dark:focus:bg-gray-700">
                  Categories
                </Link>
              </div>

            </div>
          </div>




          <div className="">
            <div class="font-[sans-serif] overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="whitespace-nowrap">
                  <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                    <th class="pl-4 w-8">
                      <input id="checkbox" type="checkbox" class="hidden peer"
                        onChange={(e) => setSelectId(e.target.checked ? products.data.map((product) => product.id) : [])}
                        checked={selectId.length === products.data.length}
                      />
                      <label htmlFor="checkbox"
                        class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full fill-white" viewBox="0 0 520 520">
                          <path d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z" />
                        </svg>
                      </label>
                    </th>
                    <th class="p-4 text-left text-sm font-semibold">Sno</th>
                    <th class="p-4 text-left text-sm font-semibold">Product</th>
                    <th class="p-4 text-left text-sm font-semibold">Quantity</th>
                    <th class="p-4 text-left text-sm font-semibold">Purchase Price</th>
                    <th class="p-4 text-left text-sm font-semibold">Selling Price</th>
                    <th class="p-4 text-left text-sm font-semibold">Category</th>
                    <th class="p-4 text-left text-sm font-semibold">Brand</th>
                    <th class="p-4 text-left text-sm font-semibold">Stock Status</th>
                    <th class="p-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">
                  {products.data.length === 0 && (
                    <tr>
                      <td colSpan="10" className="p-4 text-center">
                        No purchases found.
                      </td>
                    </tr>
                  )}
                  {products.data.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`${product?.stock?.quantity === 0 || product?.stock?.quantity === null ? 'bg-red-100' : 'odd:bg-white even:bg-gray-50'} ${selectId.includes(product.id) ? 'border-black border-4' : 'border-gray-300 border-b'}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        show({ event: e, props: product });
                      }}
                    >
                      <td className="pl-4 w-8">
                        <input
                          id={`checkbox-${product.id}`}
                          type="checkbox"
                          className="hidden peer"
                          value={product.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectId((prev) => [...prev, product.id]);
                            } else {
                              setSelectId((prev) => prev.filter((id) => id !== product.id));
                            }
                          }}
                          checked={selectId.includes(product.id)}
                        />
                        <label
                          htmlFor={`checkbox-${product.id}`}
                          className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-full fill-white" viewBox="0 0 520 520">
                            <path d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z" />
                          </svg>
                        </label>
                      </td>

                      <td class="p-4 text-sm">{index + 1}</td>
                      <td class="text-sm">
                        <div class="cursor-pointer" onClick={() => router.get(route('product.edit', product.id))}>
                          <p class="text-black text-sm font-semibold">{product.name}</p>
                          {product.model && <p class="text-xs text-gray-500">Model: {product.model}</p>}
                        </div>
                      </td>
                      <td class="p-4 text-sm">{product?.stock?.quantity || 0}</td>
                      <td class="p-4 text-sm">{product.purchase_price || 'N/A'}</td>
                      <td class="p-4 text-sm">{product.selling_price || 'N/A'}</td>
                      <td class="p-4 text-sm">
                        {product?.categories?.map((category) => category.name).join(', ') || 'N/A'}
                      </td>
                      <td class="p-4 text-sm">
                        {product?.brands?.map((brand) => brand.name).join(', ') || 'N/A'}
                      </td>
                      <td class="p-4">
                        <label class="relative cursor-pointer">
                          <input
                            type="checkbox"
                            onClick={() => router.put(route('product.status', product.id), {}, { preserveScroll: true })}
                            class="sr-only peer"
                            checked={product?.stock?.status || false}
                          />
                          <div class="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        </label>
                      </td>
                      <td class="p-4 flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <a
                            href={route('product.show', product.code || product.id)}
                            className="text-gray-500 hover:text-black focus:outline-none text-sm"
                          >
                            View
                          </a>

                          <a
                            href={route('product.edit', product.id)}
                            className="text-gray-500 hover:text-black focus:outline-none text-sm"
                          >
                            Edit
                          </a>

                          <button
                            onClick={() => setIsDeleteModalOpen(product)}
                            className="text-gray-500 hover:text-black focus:outline-none text-sm"
                          >
                            Delete
                          </button>

                          {product.identity_type !== 'imei' && (
                            <a
                              href={route('stock.index', { product_id: product.id })}
                              className="text-gray-500 hover:text-black focus:outline-none text-sm"
                            >
                              Stock
                            </a>
                          )}
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={() => {

        router.delete(route('product.destroy', isDeleteModalOpen.id), {
          preserveScroll: true,
          preserveState: true,
        })
        setIsDeleteModalOpen(null)
      }} />




      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these products?" onConfirm={() => {

        router.post(route('product.bulkdestroy'), { ids: selectId.join(',') }, {
          onSuccess: () => {
            setIsBulkDeleteModalOpen(false);
            setSelectId([]);
          },
        });

      }} />


      <Modal
        show={isPrintQRModalOpen}
        onClose={() => setIsPrintQRModalOpen(false)}
        maxWidth="6xl"
      >
        <div className="my-4 text-center hide-print">
          <h1 className="text-2xl font-bold mb-4">Purchases QR Codes</h1>
        </div>

        <div>
          <div
            id="printable-content"
            className="grid grid-cols-4 gap-4 max-h-[70vh] overflow-auto p-4" // Scrollable in modal
          >
            {products.data
              .filter((product) => selectId.includes(product.id)) // Show only selected products
              .map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col border border-gray-300 items-center justify-center p-4 break-inside-avoid"
                >
                  <QRCode
                    value={product.code || product.id}
                    size={150} // Adjusted size for better layout
                    logoOpacity={0.8}
                  />
                  <div className="mt-2">{product.code || product.id}</div>
                </div>
              ))}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => window.print()}
              className="ml-2 bg-black text-white py-2 px-4 mb-4 rounded shadow hover:bg-gray-600 transition duration-300"
            >
              Print
            </button>
            <button
              onClick={() => setIsPrintQRModalOpen(false)}
              className="ml-2 bg-red-500 text-white py-2 px-4 mb-4 rounded shadow hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>

        <style jsx global>{`
    @media print {
      body {
        font-size: 12px;
      }

      #printable-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 columns per row */
        gap: 20px;
        padding: 20px;
      }

      #printable-content > div {
        width: 50%;
        page-break-inside: avoid;
        text-align: center;
      }

      .hide-print {
        display: none;
      }

      .break-inside-avoid {
        page-break-inside: avoid; /* Prevents breaking items across pages */
      }

      button {
        display: none; /* Hides buttons during printing */
      }

      @page {
        size: A4; /* Ensures proper page size */
        margin: 20mm; /* Adjust the print margin */
      }
    }
  `}</style>
      </Modal>




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
                    router.get(route('product.index', {
                      startdate: dateRange.startDate,
                      enddate: dateRange.endDate,
                      status: params.get('status') || '',
                      search: params.get('search') || '',
                      category: params.get('category') || '',
                      brand: params.get('brand') || '',
                      supplierinvoiceno: params.get('supplierinvoiceno') || '',
                      invoicecode: params.get('invoicecode') || '',
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