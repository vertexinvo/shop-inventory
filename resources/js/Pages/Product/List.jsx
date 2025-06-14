import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit, FaBoxes, FaFileDownload, FaCalendar, FaSearch, FaPlus, FaChevronDown, FaChevronRight, FaFilter, FaAlignJustify } from 'react-icons/fa'
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
import { FaCalendarCheck, FaCheck, FaCross, FaEye, FaPencil, FaQrcode, FaRotateRight, FaTrash, FaTrashCan, FaXmark } from 'react-icons/fa6';
import { Fragment } from "react";
import { FaThLarge } from "react-icons/fa"; // Optional: for icons
import Card from '@/Components/Cards';
import TabSwitcher from '@/Components/TabSwitcher';

export default function List(props) {
  const { auth, stock, startdate, enddate, products, totalstock, totalstockavailable, totalstocknotavailable, totalStockValue, totaliteminstock, categories, brands } = props
  const { url } = usePage();
  const params = new URLSearchParams(url.split('?')[1]);
  const [expanded, setExpanded] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);
  const [isPrintQRModalOpen, setIsPrintQRModalOpen] = useState(false);
  const [daterangeModel, setDaterangeModel] = useState(false);
  const [importCsvModel, setImportCsvModel] = useState(false);
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' ya 'filters'
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


  const toggleExpand = async (id) => {
    if (expanded.includes(id)) {
      setExpanded((prev) => prev.filter((e) => e !== id));
    } else {
      setExpanded((prev) => [...prev, id]);


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
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>
          </div>

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
                  href={route('product.csvexport')}
                  download
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export Excel (.csv)
                </a>
                <button
                  onClick={() => setImportCsvModel(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Import Excel (.csv)
                </button>
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

                  href={route('product.create')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Product
                </Link>
              </Dropdown.Content>
            </Dropdown>
          </div>
        </div>
      }
    >

      <Head title="Purchase" />

      <div className="mt-4 mx-4 p-4 bg-white shadow-sm rounded-2xl">
        {/* Top Bar: Tabs + Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">

          {/* Group Button for Tabs */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Card title="Total Products"
              value={totalstock}
              icon={<FaBoxes size={36} />}
              link={route('product.index')} />
            <Card title="Stock keeping unit"
              value={totaliteminstock}
              icon={<FaBoxes size={36} />} />
            <Card title="Out of Stock"
              value={totalstocknotavailable}
              icon={<HiMiniArchiveBoxXMark size={36} />} link={route('product.index', { status: 0 })} />
            <Card title="In Stock"
              value={totalstockavailable}
              icon={<FaBox size={36} />}
              link={route('product.index', { status: 1 })} />
            <Card title="Total Stock Value"
              value={<span>{totalStockValue}</span>}
              icon={<GiMoneyStack size={36} />} />
          </div>
        )}

        {/* Filters Section */}
        {activeTab === 'filters' && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow">
            Filters
          </div>
        )}
      </div>




      <div className="flex flex-col px-4 mx-auto w-full mt-4">
        <div className="w-full ">
          {/* Filter Dropdowns */}

          <div className="flex items-center justify-between gap-4 mb-6">

            {/* <FloatingCreateButton routeName="product.create" title="Create" /> */}

            {/* create a simple button to create a new product */}
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
              className="text-white flex justify-center items-center gap-2 w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-900 md:w-auto"
            >
              <FaCalendarCheck className='h-4 w-4' />
              Date&nbsp;Range&nbsp;Filter
            </button>


            {/* reset filters */}
            <button
              onClick={() => {
                router.get(route('product.index'))
              }}
              className="text-gray-700 flex justify-center items-center gap-2 w-full py-2 px-4 rounded-lg  bg-gray-200 hover:bg-slate-300 md:w-auto"
            >
              <FaRotateRight className='h-4 w-4' />
              Reset&nbsp;Filters
            </button>


          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="whitespace-nowrap text-xs uppercase bg-gray-100 text-gray-700 tracking-wide border-b">
                <tr>
                  <th className="px-4 py-3 w-6">
                    <input
                      id="checkbox"
                      type="checkbox"
                      className="hidden peer"
                      onChange={(e) => {
                        setSelectId(
                          e.target.checked ? products.data.map((order) => order.id) : []
                        )
                      }}
                      checked={selectId.length === products.data.length}
                    />
                    <label
                      htmlFor="checkbox"
                      className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                    >
                      <FaCheck className="w-full fill-white" />
                    </label>
                  </th>

                  <th className="px-2 py-3 w-40 truncate text-left">Product</th>
                  <th className="px-2 py-3 w-20">Inventory</th>
                  <th className="px-2 py-3 w-28">Purchase Price</th>
                  <th className="px-2 py-3 w-28">Selling Price</th>
                  <th className="px-2 py-3 w-36">

                    <Dropdown>
                      <Dropdown.Trigger>
                        <div className="flex items-center justify-between cursor-pointer">
                          {`Category (${params.get('category') || 'All'})`}
                          <button className="text-gray-500 hover:text-gray-700 transition" title="Filter Categories">
                            <FaFilter className="w-4 h-4" />
                          </button>
                        </div>
                      </Dropdown.Trigger>
                      <Dropdown.Content >
                        <select
                          onClick={(e) => e.stopPropagation()}
                          name="category"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) =>
                            router.get(
                              route('product.index'),
                              {
                                category: e.target.value,
                                status: params.get('status'),
                                brand: params.get('brand'),
                                search: params.get('search'),
                                startdate: startdate,
                                enddate: enddate,
                                supplierinvoiceno: params.get('supplierinvoiceno'),
                                invoicecode: params.get('invoicecode'),
                              },
                              { preserveState: true, preserveScroll: true }
                            )
                          }
                          value={params.get('category') || ''}
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category.name} value={category.name}>
                              {category.name} ({category.total_products})
                            </option>
                          ))}
                        </select>
                      </Dropdown.Content>
                    </Dropdown>

                  </th>
                  <th className="px-2 py-3 w-32">

                    {/* {`Brands (${params.get('brand') || 'All'})`} */}
                    <Dropdown>
                      <Dropdown.Trigger>
                        <div className="flex items-center justify-between cursor-pointer">
                          {`Brands (${params.get('brand') || 'All'})`}
                          <button className="text-gray-500 hover:text-gray-700 transition" title="Filter Brands">
                            <FaFilter className="w-4 h-4" />
                          </button>
                        </div>
                      </Dropdown.Trigger>
                      <Dropdown.Content>
                        <select
                          onClick={(e) => e.stopPropagation()}
                          name="brand"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) =>
                            router.get(
                              route('product.index'),
                              {
                                brand: e.target.value,
                                category: params.get('category'),
                                status: params.get('status'),
                                search: params.get('search'),
                                startdate: startdate,
                                enddate: enddate,
                                supplierinvoiceno: params.get('supplierinvoiceno'),
                                invoicecode: params.get('invoicecode'),
                              },
                              { preserveState: true, preserveScroll: true }
                            )
                          }
                          value={params.get('brand') || ''}
                        >
                          <option value="">All Brands</option>
                          {brands.map((brand) => (
                            <option key={brand.name} value={brand.name}>
                              {brand.name} ({brand.total_products})
                            </option>
                          ))}
                        </select>
                      </Dropdown.Content>
                    </Dropdown>

                  </th>
                  <th className="px-2 py-3 w-20">
                    <Dropdown>
                      <Dropdown.Trigger>
                        <div className="flex items-center justify-between cursor-pointer">
                          {`Status (${params.get('status') === '1' ? 'In Stock' : params.get('status') === '0' ? 'Out of Stock' : 'All'})`}
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
                              route('product.index'),
                              {
                                status: e.target.value,
                                category: params.get('category'),
                                brand: params.get('brand'),
                                search: params.get('search'),
                                startdate: startdate,
                                enddate: enddate,
                                supplierinvoiceno: params.get('supplierinvoiceno'),
                                invoicecode: params.get('invoicecode'),
                              },
                              { preserveState: true }
                            )
                          }
                          value={params.get('status') || ''}
                        >
                          <option value="">All Statuses</option>
                          <option value="1">In Stock</option>
                          <option value="0">Out of Stock</option>
                        </select>
                      </Dropdown.Content>
                    </Dropdown>

                  </th>
                  <th className="px-2 py-3 w-32 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="whitespace-nowrap text-gray-800">
                {products.data.length === 0 && (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-gray-500">
                      No data available.
                    </td>
                  </tr>
                )}

                {products.data.map((product) => {
                  const isExpanded = expanded.includes(product.id);
                  return (
                    <Fragment key={product.id}>
                      <tr
                        onContextMenu={(e) => {
                          e.preventDefault(); // Prevents default right-click menu
                          show({ event: e, props: product }); // Shows custom menu
                        }}
                        className={`h-12 transition duration-200 ${product?.stock?.quantity === 0 || product?.stock?.quantity === null
                          ? "bg-red-100 hover:bg-red-200"
                          : product?.stock?.quantity < 5
                            ? "bg-yellow-100 hover:bg-yellow-200"
                            : "odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                          } ${selectId.includes(product.id) ? "border-cyan-200 border-b" : "border-gray-200 border-b"}`}
                      >
                        <td className="px-4">
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
                            <FaCheck className="w-full fill-white" />
                          </label>
                        </td>





                        <td className="px-2 py-1 truncate flex cursor-pointer hover:text-cyan-600 transition" onClick={() => toggleExpand(product.id)}>
                          {/* <button
                            onClick={() => toggleExpand(product.id)}
                            className="text-gray-500 hover:text-gray-700 transition"
                            title="Toggle stock details"
                          > */}
                          <div className='flex items-center gap-4'>
                            {isExpanded ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />}
                            <div>
                              <p className="text-gray-800  truncate">{product.name}</p>
                              {product.model && (
                                <p className="text-sm text-gray-500 truncate">Model: {product.model}</p>
                              )}
                            </div>
                          </div>
                          {/* </button> */}
                        </td>

                        <td
                          className={`px-2 py-1 text-center font-medium ${product?.stock?.quantity === 0 || product?.stock?.quantity === null
                            ? 'text-red-600'
                            : product?.stock?.quantity < 5
                              ? 'text-yellow-600'
                              : 'text-gray-800'
                            }`}
                        >
                          {product?.stock?.quantity ?? 0}
                          <span className="text-xs text-gray-500 ms-1">Unit</span>
                        </td>

                        <td className="px-2 py-3 text-center">{product.purchase_price_stocklog || "N/A"}</td>
                        <td className="px-2 py-3 text-center">{product.selling_price || "N/A"}</td>

                        <td className="px-2 py-1 text-left">
                          {product?.categories?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.categories.slice(0, 3).map((category) => (
                                <span key={category.name} className="px-2 py-1 border border-gray-300 rounded text-xs truncate bg-white">
                                  {category.name}
                                </span>
                              ))}
                              {product.categories.length > 3 && (
                                <span className="px-2 py-1 border border-gray-300 rounded text-xs bg-gray-100">
                                  +{product.categories.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>N/A</span>
                          )}
                        </td>

                        <td className="px-2 py-1 text-left">
                          {product?.brands?.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.brands.slice(0, 3).map((brand) => (
                                <span key={brand.name} className="px-2 py-1 border border-gray-300 rounded text-xs truncate bg-white">
                                  {brand.name}
                                </span>
                              ))}
                              {product.brands.length > 3 && (
                                <span className="px-2 py-1 border border-gray-300 rounded text-xs bg-gray-100">
                                  +{product.brands.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>N/A</span>
                          )}
                        </td>

                        <td className="px-2 py-1 w-20">
                          <label className="relative cursor-pointer inline-block">
                            <input
                              type="checkbox"
                              onClick={() =>
                                router.put(route("product.status", product.id), {}, { preserveScroll: true })
                              }
                              className="sr-only peer"
                              checked={product?.stock?.status || false}
                            />

                            <div
                              className={`flex items-center w-24 h-8 px-1 rounded-full transition relative 
        ${product?.stock?.status ? "bg-green-100 justify-start" : "bg-red-100 justify-end"}`}
                            >
                              <span
                                className={`absolute w-full text-xs text-center z-0 font-medium transition duration-200 
          ${product?.stock?.status ? "text-green-700" : "text-red-700"}`}
                              >
                                {product?.stock?.status ? "Active" : "Inactive"}
                              </span>

                              <div className="w-6 h-6 bg-white border border-gray-300 rounded-full z-10 transition peer-checked:translate-x-full"></div>
                            </div>
                          </label>
                        </td>




                        <td className="px-2 py-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Link
                              href={route("product.show", product.code || product.id)}
                              title="View"
                              className="text-cyan-500 hover:text-cyan-700"
                            >
                              <FaEye className="w-4 h-4" />
                            </Link>

                            <Link
                              href={route("product.edit", product.id)}
                              title="Edit"
                              className="text-yellow-500 hover:text-yellow-700"
                            >
                              <FaEdit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => setIsDeleteModalOpen(product)}
                              title="Delete"
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>

                            <Link
                              href={route("stock.index", { product_id: product.id })}
                              title="Stock"
                              className="text-green-500 hover:text-green-700"
                            >
                              <FaBoxes className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row for stock info */}
                      {isExpanded && (
                        <tr className="bg-gray-50 text-sm border-t border-gray-200">
                          <td colSpan="10" className="px-10 py-4 text-gray-600">
                            <div className="space-y-4">
                              <div>
                                { product?.stock?.stock_logs.length > 0 ? (
                                  <div className="grid grid-cols-5 gap-2 text-sm ms-12 font-medium ">
                                    {/* Grid Header */}
                                    <div className="font-semibold text-gray-700 bg-slate-200 p-2 rounded-l-xl">Available</div>
                                    <div className="font-semibold text-gray-700 bg-slate-200 p-2">Type</div>
                                    <div className="font-semibold text-gray-700 bg-slate-200 p-2">Supplier Invoice</div>
                                    <div className="font-semibold text-gray-700 bg-slate-200 p-2">Remarks</div>
                                    <div className="font-semibold text-gray-700 bg-slate-200 p-2 rounded-r-xl">Date</div>
                                    {/* Grid Rows */}
                                    {product?.stock?.stock_logs.map((log) => (
                                      <div key={log.id} className="contents">
                                        <div className="p-1 text-gray-800">{log?.quantity || '-'}</div>
                                        <div className="p-1 text-gray-800">{log?.type || '-'}</div>
                                        <div className="p-1 text-gray-800">{(log?.supplier_invoice_no + `(${log?.supplier_name})`) || '-'}</div>
                                        <div className="p-1 text-gray-800">{log?.remarks || '-'}</div>
                                        <div className="p-1 text-gray-800">{new Date(log?.created_at).toLocaleString()}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mt-1">No stock logs available.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {products.from} - {products.to} of {products.total} </span>
              <span class="col-span-2"></span>

              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">


                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">
                    <li>
                      <button onClick={() => products.links[0].url ? router.get(products.links[0].url, { status: params.get('status') || '', search: params.get('search') || '', category: params.get('category') || '', brand: params.get('brand') || '', startdate: params.get('startdate') || '', enddate: params.get('enddate') || '', supplierinvoiceno: params.get('supplierinvoiceno') || '', invoicecode: params.get('invoicecode') || '' }) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
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

          {/* pagination */}

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
          <h1 className="text-2xl font-bold mb-4">Products QR Codes</h1>
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