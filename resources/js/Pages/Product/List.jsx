import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit, FaBoxes, FaFileDownload, FaCalendar, FaSearch } from 'react-icons/fa'
import { MdDelete, MdManageHistory } from 'react-icons/md';
import { GiMoneyStack, GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { FaBox } from "react-icons/fa";
import FormatDate from '@/Helpers/FormatDate';
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { MdKeyboardBackspace } from "react-icons/md";
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
import { FaCalendarCheck, FaQrcode, FaTrash, FaXmark } from 'react-icons/fa6';
import ProductGrid from './ProductGrid';



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
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    status: '',
  });

  const updateFilter = (key, value) => {
    let newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Send all filters
    router.get(route('product.index'), newFilters, { preserveState: true });
  };

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

            <div className="flex items-center justify-between gap-4 mb-6">

              <FloatingCreateButton routeName="product.create" title="Create" />


              <Formik
                enableReinitialize
                initialValues={{ search: params.get('search') || '' }}
                onSubmit={(values) => {
                  router.get(
                    route('product.index'),
                    {
                      search: values.search,
                      status: params.get('status'),
                      brand: params.get('brand'),
                      category: params.get('category'),
                      startdate: startdate,
                      enddate: enddate,
                      supplierinvoiceno: params.get('supplierinvoiceno'),
                      invoicecode: params.get('invoicecode'),
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
                              placeholder="Search products..."
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
                                  router.get(route('product.index'));
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
 
            {/* Table */}
            <div className="overflow-x-auto ">
              <ProductGrid
                products={products}
                selectId={selectId}
                setSelectId={setSelectId}
                filters={filters}
                updateFilter={updateFilter}
                categories={categories}
                brands={brands}
                router={router}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                show={show}
              />
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