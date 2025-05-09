import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit, FaBoxes, FaFileDownload, FaCalendar } from 'react-icons/fa'
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
import { FaCalendarCheck, FaCheck, FaCross, FaEye, FaPencil, FaQrcode, FaTrash, FaTrashCan, FaXmark } from 'react-icons/fa6';



export default function List(props) {
  const { auth, stock, startdate, enddate, products, totalstock, totalstockavailable, totalstocknotavailable, totalStockValue, totaliteminstock, categories, brands } = props
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [isPrintQRModalOpen, setIsPrintQRModalOpen] = useState(false);
  const [daterangeModel, setDaterangeModel] = useState(false);
  const [importCsvModel, setImportCsvModel] = useState(false);
  const [dateRange, setDateRange] = useState(
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  )
  const [showModal, setShowModal] = useState(false);

  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    // Add your import logic here
    console.log('Importing:', selectedFile.name);
    setShowModal(false);
  };
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
              download
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300"
            >
              <BiExport className="mr-2 h-5 w-5" />
              Export CSV File
            </a>

            {/* <div>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-cyan-300"
              >
                <BiImport className="mr-2 h-5 w-5" />
                Import CSV File
              </label>
            </div> */}

            <div>
              {/* Trigger Button */}
              <div>
                <button
                  className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  onClick={() => setImportCsvModel(true)}
                >
                  <BiImport className="mr-2 h-5 w-5" />
                  Import CSV File
                </button>
              </div>


            </div>

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


          <div className="p-6 bg-gray-50 rounded-2xl shadow-lg">
            {/* Filter Dropdowns */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex flex-col md:flex-row justify-end items-center my-4">

                <div className="flex flex-col md:flex-row w-full md:justify-end items-center gap-3">

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
                      <Form className="w-full flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:max-w-md">
                          <Field name="search">
                            {({ field, form }) => (
                              <>
                                <input
                                  {...field}
                                  type="text"
                                  placeholder="Search products..."
                                  className="w-full rounded-xl border border-gray-300 focus:ring-black focus:outline-none transition"
                                />
                                {field.value && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      form.setFieldValue('search', '');
                                      router.get(route('product.index'));
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label="Clear search"
                                  >
                                    <FaXmark className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </Field>
                        </div>

                        <button
                          type="submit"
                          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition w-full md:w-auto"
                        >
                          Search
                        </button>
                      </Form>


                    )}
                  </Formik>

                  {selectId.length > 0 && (
                    <>
                      <Link href={route('product.printqr', { id: selectId.join(',') })}
                        className="text-white  w-full md:w-64 lg:w-48  py-2 px-4 bg-black rounded-lg hover:bg-gray-600 flex justify-center items-center gap-2"
                      >
                        <FaQrcode className="w-4 h-4" />
                        Print&nbsp;QR
                      </Link>

                      <button
                        onClick={() => setIsBulkDeleteModalOpen(true)}
                        className="text-white w-full md:w-64 lg:w-48  py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 flex justify-center items-center gap-2"
                      >
                        <FaTrash className="w-4 h-4" />
                        Bulk&nbsp;Delete
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setDaterangeModel(true)}
                    className="text-white flex justify-center items-center gap-2 w-full py-2 px-4 rounded-lg bg-black hover:bg-gray-600 md:w-auto"
                  >
                    <FaCalendarCheck />
                    Date&nbsp;Range&nbsp;Filter
                  </button>

                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white">
                <thead className="whitespace-nowrap">
                  <tr className="tracking-wide text-left text-white uppercase bg-cyan-600 h-16">
                    <th className="p-4">
                      <input
                        id="checkbox"
                        type="checkbox"
                        className="hidden peer"
                        onChange={(e) => setSelectId(e.target.checked ? products.data.map((product) => product.id) : [])}
                        checked={selectId.length === products.data.length}
                      />
                      <label
                        htmlFor="checkbox"
                        className="relative flex items-center justify-center p-0.5 peer gosh-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-cyan-600 border border-white rounded overflow-hidden"
                      >
                        <FaCheck className="w-full h-3.5 fill-white" />
                      </label>
                    </th>
                    <th className="p-4">Sno</th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Product
                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Quantity

                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Purchase Price

                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Selling Price
                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Category
                        <select
                          className="appearance-none bg-cyan-600 text-white text-xs rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          onChange={(e) => router.get(route('product.index'), { category: e.target.value }, { preserveState: true })}
                        >
                          <option value="">All</option>
                          {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Brand
                        <select
                          className="appearance-none bg-cyan-600 text-white text-xs rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          onChange={(e) => router.get(route('product.index'), { brand: e.target.value }, { preserveState: true })}
                        >
                          <option value="">All</option>
                          {brands.map((brand) => (
                            <option key={brand.name} value={brand.name}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th className="p-4">
                      <div className="flex items-center gap-2">
                        Stock Status
                        <select
                          className="appearance-none bg-cyan-600 text-white text-xs rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                          onChange={(e) => router.get(route('product.index'), { status: e.target.value }, { preserveState: true })}
                        >
                          <option value="">All</option>
                          <option value="1">In Stock</option>
                          <option value="0">Out of Stock</option>
                        </select>
                      </div></th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="whitespace-nowrap">
                  {products.data.length === 0 && (
                    <tr>
                      <td colSpan="10" className="p-6 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {products.data.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`h-16 transition duration-200 ${product?.stock?.quantity === 0 || product?.stock?.quantity === null
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'odd:bg-white even:bg-gray-50 hover:bg-gray-100'
                        } ${selectId.includes(product.id) ? 'border-cyan-200 border-b' : 'border-gray-200 border-b'}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        show({ event: e, props: product });
                      }}
                    >
                      <td className="p-4">
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
                          className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-cyan-600 border border-gray-300 rounded overflow-hidden"
                        >
                          <FaCheck className="w-full h-3.5 fill-white" />
                        </label>
                      </td>

                      <td className="p-4 text-gray-700">{index + 1}</td>
                      <td className="p-4">
                        <div
                          className="cursor-pointer hover:text-cyan-600 transition"
                          onClick={() => router.get(route('product.edit', product.id))}
                        >
                          <p className="text-gray-800 font-medium">{product.name}</p>
                          {product.model && <p className="text-sm text-gray-500">Model: {product.model}</p>}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{product?.stock?.quantity || 0}</td>
                      <td className="p-4 text-gray-700">{product.purchase_price || 'N/A'}</td>
                      <td className="p-4 text-gray-700">{product.selling_price || 'N/A'}</td>
                      <td className="p-4 text-gray-700">
                        {product?.categories?.map((category) => category.name).join(', ') || 'N/A'}
                      </td>
                      <td className="p-4 text-gray-700">
                        {product?.brands?.map((brand) => brand.name).join(', ') || 'N/A'}
                      </td>
                      <td className="p-4">
                        <label className="relative cursor-pointer">
                          <input
                            type="checkbox"
                            onClick={() => router.put(route('product.status', product.id), {}, { preserveScroll: true })}
                            className="sr-only peer"
                            checked={product?.stock?.status || false}
                          />
                          <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <a
                            href={route('product.show', product.code || product.id)}
                            className="text-cyan-500 hover:text-cyan-700 transition text-sm flex items-center gap-1"
                            title="View"
                          >
                            <FaEye className="w-4 h-4" />
                          </a>
                          <a
                            href={route('product.edit', product.id)}
                            className="text-yellow-500 hover:text-yellow-700 transition text-sm flex items-center gap-1"
                            title="Edit"
                          >
                            <FaPencil className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setIsDeleteModalOpen(product)}
                            className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          {product.identity_type !== 'imei' && (
                            <a
                              href={route('stock.index', { product_id: product.id })}
                              className="text-green-500 hover:text-green-700 transition text-sm flex items-center gap-1"
                              title="Stock"
                            >
                              <FaBox className="w-4 h-4" />
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



      {/* Import CSV Modal */}
      <Modal
        show={importCsvModel}
        onClose={() => setImportCsvModel(false)}
        maxWidth="2xl"
        className="rounded-xl shadow-2xl"
      >
        <div className="relative p-6 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Import Products via CSV</h2>
            <button
              onClick={() => setImportCsvModel(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Guide Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">How to Import</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start">
                Get the CSV template and complete the necessary fields.
                <a
                  href="/productexample.csv"
                  className="inline-flex items-center text-cyan-600 hover:text-cyan-800 transition-colors duration-200 underline ml-1"
                  download="productexample.csv"
                >
                  Download now
                </a>
              </li>
              <li className="flex items-start">
                Use <code className="bg-gray-100 px-1 rounded">"warranty_type"</code>: "none", "years", "months", or "days".
              </li>
              <li className="flex items-start">
                Use <code className="bg-gray-100 px-1 rounded">"identity_type"</code>: "none", "sku", "serial", or "imei".
              </li>
              <li className="flex items-start">
                Upload the completed CSV file.
              </li>
              <li className="flex items-start">
                Click "Import" to process your file.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {/* Download Template */}

            {/* Import CSV */}
            <div className="flex items-center">
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <BiImport className="mr-2 h-5 w-5" />
                Import CSV File
              </label>
            </div>
          </div>
        </div>
      </Modal>



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

        <style jsx global>
          {`
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
          `
          }
        </style>
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
    </AuthenticatedLayout >
  );
}