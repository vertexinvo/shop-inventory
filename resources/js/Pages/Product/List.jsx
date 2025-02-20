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

export default function List(props) {
  const { auth, stock, startdate,enddate, products ,totalstock,totalstockavailable,totalstocknotavailable,totalStockValue,totaliteminstock,categories,brands} = props
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
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('dashboard'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchase</h2>
        </>}
    >
      <Head title="Purchase" />

      <div class="p-5 mx-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3">
        <Link href={route('product.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL PRODUCT</p>
                <p class="text-lg">{totalstock}</p>
              </div>
              <div class="my-auto">
                <FaBoxes size={40} />
              </div>
            </div>
          </div>
        </Link>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL ITEMS IN STOCK</p>
                <p class="text-lg">{totaliteminstock}</p>
              </div>
              <div class="my-auto">
                <FaBoxes  size={40} />
              </div>
            </div>
          </div>


        <Link href={route('product.index', { status: 0 })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL PRODUCT OUT OF STOCK</p>
                <p class="text-lg">{totalstocknotavailable}</p>
              </div>
              <div class="my-auto">
                <HiMiniArchiveBoxXMark size={40} />
              </div>
            </div>
          </div>
        </Link>


        <Link href={route('product.index', { status: 1 })}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL PRODUCT IN STOCK</p>
                <p class="text-lg">{totalstockavailable}</p>
              </div>
              <div class="my-auto">
                <FaBox size={40} />
              </div>
            </div>
          </div>
        </Link>

      
      


    
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
              <div class="my-auto">
                <p class="font-bold">TOTAL STOCK VALUE</p>
                <p class="text-lg">{totalStockValue}</p>
              </div>
              <div class="my-auto">
                <GiMoneyStack  size={40} />
              </div>
            </div>
          </div>

        


      </div>




      <div className="flex flex-col px-4  mt-5 mx-auto w-full">
        <div className="w-full ">

        <div  class="rounded-lg bg-white p-6 text-surface shadow-lg dark:bg-neutral-700 dark:text-white dark:shadow-black/30">
  <h2 class="mb-5 text-3xl font-semibold">CSV Import Guide</h2>
 {!accordion &&  <button className='bg-cyan-700 text-white px-4 py-2 rounded' onClick={() => setAccordion(!accordion)}>Read Guide</button>}
  {accordion &&(<>
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
                    <label className='group relative flex items-center justify-center p-0.5 text-center font-medium transition-all focus:z-10 focus:outline-none border border-transparent bg-cyan-700 text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg'>
                      <span className="flex items-center transition-all duration-200 rounded-md px-4 py-2 text-sm">
                        <SiMicrosoftexcel className="mr-2 h-5 w-5" />
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
  </>)}

</div>


          <div className="flex flex-col md:flex-row justify-end items-center mt-5 mb-4">

            <div className="flex flex-col md:flex-row w-full md:justify-end space-y-2 md:space-y-0 md:space-x-2">
              <select
                name="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                w-full md:w-[150px] p-2.5 pr-10 
                                    
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => router.get(route('product.index'), { status: e.target.value, category: params.get('category'), brand: params.get('brand'), search: params.get('search'), startdate : startdate,enddate:enddate, supplierinvoiceno: params.get('supplierinvoiceno'),invoicecode: params.get('invoicecode')}, { preserveState: true })}
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
                onChange={(e) => router.get(route('product.index'), { category: e.target.value , status: params.get('status'), brand: params.get('brand') , search: params.get('search') ,startdate : startdate,enddate:enddate, supplierinvoiceno: params.get('supplierinvoiceno'),invoicecode: params.get('invoicecode')  }, { preserveState: true , preserveScroll: true})}
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
                onChange={(e) => router.get(route('product.index'), { brand: e.target.value, category: params.get('category'), status: params.get('status'), search: params.get('search'), startdate : startdate,enddate:enddate, supplierinvoiceno: params.get('supplierinvoiceno'),invoicecode: params.get('invoicecode') }, { preserveState: true, preserveScroll: true })}
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
                onClick={() => router.get(route('product.create'))}
                className="text-white w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
              >
                Create
              </button>

              <Formik
                enableReinitialize
                initialValues={{ search: params.get('search') || '' }}
                onSubmit={(values) => {
                  router.get(route('product.index'), { search: values.search , status: params.get('status'), brand: params.get('brand'), category: params.get('category'), startdate : startdate,enddate:enddate, supplierinvoiceno: params.get('supplierinvoiceno'),invoicecode: params.get('invoicecode') }, {
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

                    <a
                      href={route('product.csvexport')}
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
                      Purchase ID
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Product Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                       Quantity
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Purchase price
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Selling price
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Categories
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Brands
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Warranty period
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Is Borrow
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Supplier Invoice
                    </th>

                    <th class="p-4 text-left text-sm font-semibold ">
                      Stock Status
                    </th>
                   
                    <th class="p-4 text-left text-sm font-semibold ">
                      Is Exchange
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Type
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Other Info
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Created At
                    </th>
                    <th class="p-4 text-left text-sm font-semibold ">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody class="whitespace-nowrap">

                  {products.data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="p-4 text-center">
                        No purchases found.
                      </td>
                    </tr>
                  )}
                  {products.data.map((product, index) => (

                    <tr
                    key={product.id}
                     className={`${product?.stock?.quantity === 0 || product?.stock?.quantity === null ? 'bg-red-100' : 'odd:bg-white even:bg-gray-50'}   ${selectId.includes(product.id) ? 'border-black border-4' : 'border-gray-300 border-b'}`}
                     onContextMenu={(e) => {
                      e.preventDefault(); // Prevents default right-click menu
                      show({ event: e, props: product }); // Shows custom menu
                    }}
                     >
                      <td className="pl-4 w-8">
                        <input
                          id={`checkbox-${product.id}`} // Unique id for each checkbox
                          type="checkbox"
                          className="hidden peer"
                          value={product.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectId((prev) => [...prev, product.id]); // Add user ID to state
                            } else {
                              setSelectId((prev) => prev.filter((id) => id !== product.id)); // Remove user ID from state
                            }
                          }}
                          checked={selectId.includes(product.id)} // Bind state to checkbox
                        />
                        <label
                          htmlFor={`checkbox-${product.id}`} // Match label with checkbox id
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
                      <td class="p-4 text-sm text-blue-600">
                        <button onClick={() => router.get(route('product.show', product.code || product.id))} className='text-blue-600' title="Order" type='button'>
                        {product?.code || product?.id}
                        </button>
                      </td>
                      <td class=" text-sm">
                        <div class="flex items-center cursor-pointer w-max">
                          {/* <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" /> */}
                          <div class="ml-4 " onClick={() => {
                            router.get(route('product.edit', product.id))

                          }}>
                            <p class="text-sm text-black ">Name : {product.name}</p>
                            {product.model && <p class="text-xs text-gray-500 mt-0.5">Model :{product.model} </p>}
                            {product.identity_type !== 'none' && <p class="text-xs text-gray-500 mt-0.5">{product.identity_type}:{product.identity_value} </p>}
                          </div>
                        </div>
                      </td>

                      <td class="p-4 text-sm text-black">
                        {product?.stock?.quantity || 0}
                      </td>
                   
                      <td class="p-4 text-sm text-black">
                        {product.purchase_price || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {product.selling_price || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {product?.categories?.map((category) => category.name).join(', ') || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {product?.brands?.map((brand) => brand.name).join(', ') || 'N/A'}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {product.is_warranty == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                        {product.is_warranty == '1' && (<p class="text-xs text-gray-500 mt-0.5">{product.warranty_period} - {product.warranty_type} </p>)}
                      </td>
                      <td class="p-4 text-sm text-black">
                        {product.is_borrow == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                        {product.is_borrow == '1' && (<p class="text-xs text-gray-500 mt-0.5">
                          <ul class="list-disc">
                            {product.shop_name && <li>Name: {product.shop_name}</li>}
                            {product.shop_address && <li>Address: {product.shop_address}</li>}
                            {product.shop_phone && <li>Phone: {product.shop_phone}</li>}
                            {product.shop_email && <li>Email: {product.shop_email}</li>}
                          </ul>
                        </p>)}
                      </td>
                     
                      <td class="p-4 text-sm text-black">
                        {product.is_supplier == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                        {product.is_supplier == '1' && (<p class="text-xs text-gray-500 mt-0.5">{ product.supplier_invoice_no} - ({ product.supplier_name})</p>)}
                      </td>


                      <td class="p-4">
                        <label class="relative cursor-pointer">
                          <input type="checkbox" onClick={() => router.put(route('product.status', product.id), {}, { preserveScroll: true })} class="sr-only peer" checked={product?.stock?.status || false} />
                          <div
                            class="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black">
                          </div>
                        </label>
                      </td>

                   

                      <td class="p-4 text-sm text-black">
                        {product.is_exchange !== 1 && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                        {product.is_exchange === 1  && (<a href={route('order.show', product.exchange_order_code || product.exchange_order_id )} class="text-xs text-blue-500 mt-0.5">Order# { product.exchange_order_code || product.exchange_order_id}</a>)}
                      </td>

                      <td class="p-4 text-sm text-black">
                        {`${product.type.charAt(0).toUpperCase()}${product.type.slice(1)}`}
                      </td>

                      <td class="p-4 text-sm text-black">
                      { 
                        (product.customfield && product.customfield !== 'null' && product.customfield !== '' && JSON.parse(product.customfield).length > 0) ? 
                        JSON.parse(product.customfield).map((field, index) => (
                          <p className="text-xs text-gray-500 mt-0.5" key={index}>
                            <span className="font-semibold">{field.name}:</span> {field.value}
                          </p>
                        )) : 
                        'N/A'
                      }
                      </td>

                      <td class="p-4 text-sm text-black">
                        {FormatDate(product.created_at)}
                        </td>

                   


                      <td class="p-4 flex items-center gap-2">

                      
                          <Dropdown >
                            <Dropdown.Trigger>
                              <button className="text-gray-500 hover:text-black focus:outline-none">
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                              </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                              <Dropdown.Link href={route('product.show', product.code || product.id)}>View</Dropdown.Link>
                              <Dropdown.Link href={route('product.edit', product.id)}>Edit</Dropdown.Link>
                              <button class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out " type='button' onClick={() => setIsDeleteModalOpen(product)} >Delete</button>
                              {product.identity_type !== 'imei' &&
                                    <Dropdown.Link href={route('stock.index', { product_id: product.id })}>Stock</Dropdown.Link>
     
                              }
                            
                            </Dropdown.Content>
                          </Dropdown>
                  
                     
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
                onClick={({ props }) => handleMenuClick({ props, action: "stock" })}
                hidden={({ props }) => props.identity_type === "imei"}
              >
                Stock
              </Item>
              <Item
                onClick={({ props }) => handleMenuClick({ props, action: "delete" })}
                className="text-red-600"
              >
                Delete
              </Item>
              
            
            </Menu>
          

            </div>
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {products.from} - {products.to} of {products.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
             
               
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">
                    <li>
                      <button onClick={() => products.links[0].url ? router.get(products.links[0].url, { status: params.get('status') || '', search: params.get('search') || '' , category: params.get('category') || '' ,brand: params.get('brand') || '', startdate: params.get('startdate') || '', enddate: params.get('enddate') || '' ,supplierinvoiceno : params.get('supplierinvoiceno') || '', invoicecode : params.get('invoicecode') || ''}) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
                      let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
                      const activeIndex = products.links.findIndex((l) => l.active);

                      return products.links
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
                                  onClick={() => link.url && window.location.assign(link.url + `&status=${params.get('status') || ''}` + `&search=${params.get('search') || ''}` + `&category=${params.get('category') || ''}` + `&brand=${params.get('brand') || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || ''}` + `&supplierinvoiceno=${params.get('supplierinvoiceno') || ''}` + `&invoicecode=${params.get('invoicecode') || ''}`)}
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
                      <button onClick={() => products.links[products.links.length - 1].url && window.location.assign(products.links[products.links.length - 1].url + `&status=${params.get('status') || ''}` + `&search=${params.get('search') || ''}` + `&category=${params.get('category') || ''}` + `&brand=${params.get('brand') || ''}` + `&startdate=${params.get('startdate') || ''}` + `&enddate=${params.get('enddate') || ''}` + `&supplierinvoiceno=${params.get('supplierinvoiceno') || ''}` + `&invoicecode=${params.get('invoicecode') || ''}`)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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
                onClick={()=>{setDaterangeModel(false)}}
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