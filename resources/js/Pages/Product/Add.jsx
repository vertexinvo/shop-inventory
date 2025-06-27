import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit, FaPlus, FaMinus } from 'react-icons/fa'
import { MdContentPaste, MdDelete, MdInfoOutline } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from '@/Components/Modal';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from "react-icons/md";
import './product.css'
import CategoryForm from '@/Partials/CategoryForm';
import BrandForm from '@/Partials/BrandForm';
import SupplierForm from '@/Partials/SupplierForm';
import SupplierinvoiceForm from '@/Partials/SupplierinvoiceForm';

export default function Add(props) {
  const { auth, categories, brands, code, invoicecode, suppliers, supplierinvoices, categories_object_model } = props
  const [isNewSupplierModel, setIsNewSupplierModel] = useState(false);
  const [isNewSupplierInvoiceModel, setIsNewSupplierInvoiceModel] = useState(false);
  const [isCategoryModel, setIsCategoryModel] = useState(false);
  const [isBrandModel, setIsBrandModel] = useState(false);
  const [notremember, setNotRemember] = useState(false);

  const [supplierId, setSupplierId] = useState('');

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3b82f6' : base.borderColor,
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : base.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      },
      minHeight: '48px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f0f9ff' : base.backgroundColor,
      color: state.isSelected ? 'white' : base.color,
    }),
  };

  const [allowDescription, setAllowDescription] = useState(false);
  const [allowSpecifications, setAllowSpecifications] = useState(false);

  return (
    <AuthenticatedLayout
      Product={auth.Product}
      header={
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MdKeyboardBackspace size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Purchase</h2>
          </div>
        </div>
      }
    >
      <Head title="Add Purchase" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <Formik 
              enableReinitialize 
              initialValues={{
                name: '', model: '', specifications: '', purchase_price: '', selling_price: '', warranty_period: '', 
                is_borrow: '0', shop_name: '', shop_address: '', shop_phone: '', shop_email: '', identity_type: 'none', 
                identity_value: '', warranty_type: 'none', is_warranty: '0', categories: [], brands: [], quantity: 1,
                description: '', supplier_invoice_no: '', weight: '', is_supplier: '0', customfield: [], type: 'new'
              }}
              validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                model: Yup.string(),
                specifications: Yup.string(),
                purchase_price: Yup.number().required('Purchase price is required').positive('Must be positive'),
                selling_price: Yup.number().required('Selling price is required').positive('Must be positive'),
                type: Yup.string().required('Type is required'),
                quantity: Yup.number().when('identity_type', {
                  is: 'imei',
                  then: scheme => scheme.required().max(1, 'Quantity must be 1 for IMEI').min(1, 'Quantity must be 1 for IMEI'),
                  otherwise: scheme => scheme.positive('Must be positive').required('Quantity is required')
                }),
                weight: Yup.number().positive('Must be positive'),
                is_supplier: Yup.string().required('Supplier status is required'),
                supplier_invoice_no: Yup.string().when('is_supplier', {
                  is: '1',
                  then: scheme => scheme.required('Invoice number is required'),
                  otherwise: scheme => scheme.optional()
                }),
                is_borrow: Yup.string().required('Borrow status is required'),
                shop_name: Yup.string(),
                shop_address: Yup.string(),
                shop_phone: Yup.string().matches(/^[0-9]*$/, 'Must be only digits'),
                description: Yup.string(),
                shop_email: Yup.string().email('Invalid email address'),
                identity_type: Yup.string().required('Identity type is required'),
                identity_value: Yup.string().when('identity_type', {
                  is: 'none',
                  then: scheme => scheme.optional(),
                  otherwise: scheme => scheme.required('This field is required')
                }),
                is_warranty: Yup.string().required('Warranty status is required'),
                warranty_type: Yup.string().when('is_warranty', {
                  is: '1',
                  then: scheme => scheme.required('Warranty type is required').notOneOf(['none'], 'Select a valid warranty type'),
                  otherwise: scheme => scheme.optional()
                }),
                warranty_period: Yup.number().when('is_warranty', {
                  is: '1',
                  then: scheme => scheme.required('Warranty period is required').positive('Must be positive'),
                  otherwise: scheme => scheme.optional()
                }),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                  if (key !== 'image') {
                    formData.append(key, values[key]);
                  }
                });
                
                if (values.image) {
                  formData.append('image', values.image);
                }

                router.post(route('product.store'), formData, { 
                  forceFormData: true, 
                  onSuccess: ({ props }) => { 
                    if (!props.flash.error) { 
                      resetForm();  
         
                    } 
                  }, 
                  preserveScroll: true 
                });

                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <MdInfoOutline className="text-blue-500" />
                      Basic Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">General details about the product.</p>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Field
                            name="name"
                            id="name"
                            type="text"
                            className={`block w-full rounded-md border ${errors.name && touched.name ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder="e.g. iPhone 13 Pro"
                          />
                          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                          Model Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Field
                            name="model"
                            id="model"
                            type="text"
                            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                            placeholder="e.g. A2487"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Condition <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="type"
                            id="type"
                            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                          >
                            <option value="new">New</option>
                            <option value="used">Used</option>
                          </Field>
                          <ErrorMessage name="type" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Field
                            name="quantity"
                            id="quantity"
                            type="number"
                            min="1"
                            className={`block w-full rounded-md border ${errors.quantity && touched.quantity ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder="e.g. 5"
                          />
                          <ErrorMessage name="quantity" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                          Specifications
                        </label>
                        <button
                          type="button"
                          onClick={() => setAllowSpecifications(!allowSpecifications)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {allowSpecifications ? 'Hide Editor' : 'Add Specifications'}
                        </button>
                      </div>
                      {allowSpecifications && (
                        <div className="mt-2">
                          <ReactQuill
                            theme="snow"
                            className="rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={values.specifications}
                            onChange={(e) => setFieldValue('specifications', e)}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                              ]
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <button
                          type="button"
                          onClick={() => setAllowDescription(!allowDescription)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {allowDescription ? 'Hide Editor' : 'Add Description'}
                        </button>
                      </div>
                      {allowDescription && (
                        <div className="mt-2">
                          <ReactQuill
                            theme="snow"
                            className="rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={values.description}
                            onChange={(e) => setFieldValue('description', e)}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean']
                              ]
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <FaWallet className="text-blue-500" />
                      Pricing Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Financial details for inventory and sales.</p>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">
                          Purchase Price <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">Rs</span>
                          </div>
                          <Field
                            name="purchase_price"
                            id="purchase_price"
                            type="number"
                            step="0.01"
                            min="0"
                            className={`block w-full pl-7 pr-12 rounded-md border ${errors.purchase_price && touched.purchase_price ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">PKR</span>
                          </div>
                          <ErrorMessage name="purchase_price" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">
                          Selling Price <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">Rs</span>
                          </div>
                          <Field
                            name="selling_price"
                            id="selling_price"
                            type="number"
                            step="0.01"
                            min="0"
                            className={`block w-full pl-7 pr-12 rounded-md border ${errors.selling_price && touched.selling_price ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">PKR</span>
                          </div>
                          <ErrorMessage name="selling_price" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                          Weight (kg)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Field
                            name="weight"
                            id="weight"
                            type="number"
                            step="0.01"
                            min="0"
                            className={`block w-full rounded-md border ${errors.weight && touched.weight ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder="e.g. 0.5"
                          />
                          <ErrorMessage name="weight" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories & Branding Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <GiTwoCoins className="text-blue-500" />
                      Categories & Branding
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Organize your product for better inventory management.</p>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                            Categories
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsCategoryModel(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + New Category
                          </button>
                        </div>
                        <div className="mt-1">
                          <Select
                            onChange={(e) => setFieldValue("categories", e.map((item) => item.value))}
                            isMulti
                            name="categories"
                            options={categories}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={customStyles}
                            placeholder="Select categories..."
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="brands" className="block text-sm font-medium text-gray-700">
                            Brands
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsBrandModel(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            + New Brand
                          </button>
                        </div>
                        <div className="mt-1">
                          <Select
                            onChange={(e) => setFieldValue("brands", e.map((item) => item.value))}
                            isMulti
                            name="brands"
                            options={brands}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={customStyles}
                            placeholder="Select brands..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Identification Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <MdContentPaste className="text-blue-500" />
                      Product Identification
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Unique identifiers for inventory tracking.</p>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Identification Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["none", "imei", "sku", "serial"].map((type) => (
                          <div key={type} className="relative">
                            <Field
                              className="sr-only"
                              id={`identity_${type}`}
                              value={type}
                              type="radio"
                              name="identity_type"
                            />
                            <label
                              htmlFor={`identity_${type}`}
                              className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-all duration-200 ${values.identity_type === type
                                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                  : "border-gray-300 hover:border-blue-300 bg-white"
                                }`}
                            >
                              <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                              {type === 'imei' && (
                                <span className="text-xs text-gray-500 mt-1">For mobile devices</span>
                              )}
                              {type === 'sku' && (
                                <span className="text-xs text-gray-500 mt-1">Stock keeping unit</span>
                              )}
                              {type === 'serial' && (
                                <span className="text-xs text-gray-500 mt-1">Serial number</span>
                              )}
                              {type === 'none' && (
                                <span className="text-xs text-gray-500 mt-1">No unique ID</span>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="identity_type" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {values.identity_type !== "none" && (
                      <div className="mt-6">
                        <label htmlFor="identity_value" className="block text-sm font-medium text-gray-700">
                          {values.identity_type.charAt(0).toUpperCase() + values.identity_type.slice(1)} Number <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <Field
                            name="identity_value"
                            id="identity_value"
                            type="text"
                            className={`block w-full rounded-md border ${errors.identity_value && touched.identity_value ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            placeholder={`Enter ${values.identity_type} number`}
                          />
                          <ErrorMessage name="identity_value" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warranty Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                      Warranty Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Product warranty details for customer support.</p>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Warranty Included? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_warranty"
                            value="1"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_warranty"
                            value="0"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                      </div>
                      <ErrorMessage name="is_warranty" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {values.is_warranty === "1" && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="warranty_type" className="block text-sm font-medium text-gray-700">
                            Warranty Type <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <Field
                              as="select"
                              name="warranty_type"
                              id="warranty_type"
                              className={`block w-full rounded-md border ${errors.warranty_type && touched.warranty_type ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                            >
                              <option value="">Select warranty type</option>
                              <option value="years">Years</option>
                              <option value="months">Months</option>
                              <option value="days">Days</option>
                            </Field>
                            <ErrorMessage name="warranty_type" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="warranty_period" className="block text-sm font-medium text-gray-700">
                            Warranty Period <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <Field
                              name="warranty_period"
                              id="warranty_period"
                              type="number"
                              min="1"
                              className={`block w-full rounded-md border ${errors.warranty_period && touched.warranty_period ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                              placeholder="e.g. 12"
                            />
                            <ErrorMessage name="warranty_period" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Supplier Information Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Supplier Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Details about the product supplier.</p>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Purchased from Supplier? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_supplier"
                            value="1"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_supplier"
                            value="0"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                      </div>
                      <ErrorMessage name="is_supplier" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {values.is_supplier === "1" && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="supplier_invoice_no" className="block text-sm font-medium text-gray-700">
                            Supplier Invoice Number <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setNotRemember(!notremember);
                              setFieldValue('supplier_invoice_no', '');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {notremember ? 'I remember it' : "Don't remember?"}
                          </button>
                        </div>

                        {!notremember ? (
                          <div className="mt-1">
                            <Field
                              name="supplier_invoice_no"
                              id="supplier_invoice_no"
                              type="text"
                              className={`block w-full rounded-md border ${errors.supplier_invoice_no && touched.supplier_invoice_no ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                              placeholder="e.g. INV-2023-001"
                            />
                            <ErrorMessage name="supplier_invoice_no" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        ) : (
                          <>
                            <div className="mt-1">
                              <select
                                onChange={(e) => {
                                  setFieldValue('supplier_invoice_no', '');
                                  setSupplierId(e.target.value);
                                  router.get(route('product.create'), { supplier_id: e.target.value }, { preserveState: true, preserveScroll: true });
                                }}
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                id="supplier_select"
                              >
                                <option value="">Select supplier</option>
                                {suppliers.map((supplier) => (
                                  <option key={supplier.id} value={supplier.id}>
                                    {supplier.person_name} ({supplier.code}) - {supplier.contact}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {supplierinvoices.length > 0 && (
                              <div className="mt-3">
                                <Field
                                  as="select"
                                  name="supplier_invoice_no"
                                  id="supplier_invoice_select"
                                  className={`block w-full rounded-md border ${errors.supplier_invoice_no && touched.supplier_invoice_no ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3`}
                                >
                                  <option value="">Select invoice number</option>
                                  {supplierinvoices.map((item) => (
                                    <option key={item.id} value={item.invoice_no}>
                                      {item.invoice_no}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage name="supplier_invoice_no" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            )}
                          </>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setIsNewSupplierInvoiceModel(true)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            + New Invoice
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsNewSupplierModel(true)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            + New Supplier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Borrow Information Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      Borrow Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Details if the product is borrowed from another shop.</p>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Is this a borrowed product? <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_borrow"
                            value="1"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="is_borrow"
                            value="0"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                      </div>
                      <ErrorMessage name="is_borrow" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    {values.is_borrow === "1" && (
                      <>
                        <div className="mt-6">
                          <p className="text-sm text-red-600 font-medium">Please provide at least one contact method for the shop</p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700">
                              Shop Name
                            </label>
                            <div className="mt-1">
                              <Field
                                name="shop_name"
                                id="shop_name"
                                type="text"
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                placeholder="e.g. Gadget World"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="shop_phone" className="block text-sm font-medium text-gray-700">
                              Shop Phone
                            </label>
                            <div className="mt-1">
                              <Field
                                name="shop_phone"
                                id="shop_phone"
                                type="tel"
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                placeholder="e.g. 0123456789"
                              />
                              <ErrorMessage name="shop_phone" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="shop_email" className="block text-sm font-medium text-gray-700">
                              Shop Email
                            </label>
                            <div className="mt-1">
                              <Field
                                name="shop_email"
                                id="shop_email"
                                type="email"
                                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                placeholder="e.g. contact@gadgetworld.com"
                              />
                              <ErrorMessage name="shop_email" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label htmlFor="shop_address" className="block text-sm font-medium text-gray-700">
                            Shop Address
                          </label>
                          <div className="mt-1">
                            <Field
                              as="textarea"
                              name="shop_address"
                              id="shop_address"
                              rows={3}
                              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                              placeholder="Full shop address"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Fields Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Additional Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Add any extra details about the product.</p>

                    <FieldArray name="customfield">
                      {({ push, remove }) => (
                        <div className="mt-6 space-y-4">
                          {values.customfield && values.customfield.length > 0 ? (
                            values.customfield.map((field, index) => (
                              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                <div>
                                  <Field
                                    name={`customfield.${index}.name`}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                    type="text"
                                    placeholder="Field name"
                                  />
                                  <ErrorMessage
                                    name={`customfield.${index}.name`}
                                    component="div"
                                    className="mt-1 text-sm text-red-600"
                                  />
                                </div>
                                <div>
                                  <Field
                                    name={`customfield.${index}.value`}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                                    type="text"
                                    placeholder="Field value"
                                  />
                                  <ErrorMessage
                                    name={`customfield.${index}.value`}
                                    component="div"
                                    className="mt-1 text-sm text-red-600"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <FaMinus className="mr-1" /> Remove
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
                              <p className="text-sm text-gray-500">No additional fields added yet</p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => push({ name: '', value: '' })}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaPlus className="mr-1" /> Add Custom Field
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => router.get(route('product.index'))}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Product'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal show={isNewSupplierModel} onClose={() => setIsNewSupplierModel(false)} maxWidth="2xl">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Supplier
            </h3>
          </div>
          <div className="p-6">
            <SupplierForm codeRoute="product.create" setIsNewSupplierModel={setIsNewSupplierModel} />
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsNewSupplierModel(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={isNewSupplierInvoiceModel} onClose={() => setIsNewSupplierInvoiceModel(false)} maxWidth="2xl">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Invoice
            </h3>
          </div>
          <div className="p-6">
            <SupplierinvoiceForm codeRoute="product.create" setIsNewSupplierInvoiceModel={setIsNewSupplierInvoiceModel} />
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsNewSupplierInvoiceModel(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={isCategoryModel} onClose={() => setIsCategoryModel(false)} maxWidth="lg">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Category
            </h3>
          </div>
          <div className="p-6">
            <CategoryForm 
              categories={categories_object_model} 
              cancelBtnAccToModel={true} 
              cancelOnClick={() => setIsCategoryModel(false)} 
            />
          </div>
        </div>
      </Modal>

      <Modal show={isBrandModel} onClose={() => setIsBrandModel(false)} maxWidth="lg">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Brand
            </h3>
          </div>
          <div className="p-6">
            <BrandForm 
              cancelBtnAccToModel={true} 
              cancelOnClick={() => setIsBrandModel(false)} 
            />
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}