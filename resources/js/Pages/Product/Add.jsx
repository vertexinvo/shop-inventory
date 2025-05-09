import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useState } from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdContentPaste, MdDelete } from 'react-icons/md';
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
      borderColor: state.isFocused ? 'black' : base.borderColor, // Change focus border color to black
      boxShadow: state.isFocused ? '0 0 0 1px black' : base.boxShadow, // Optional: Add shadow for focus
      '&:hover': {
        borderColor: state.isFocused ? 'black' : base.borderColor, // Keep border color on hover
      },
    }),
  };

  const [allowDescription, setAllowDescription] = useState(false);
  const [allowSpecifications, setAllowSpecifications] = useState(false);

  return (
    <AuthenticatedLayout
      Product={auth.Product}
      header={
        <div className="flex items-center justify-between py-2">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => window.history.back()}
              title="Back"
            />
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add purchase</h2>
          </div>
        </div>
      }
    >
      <Head title="Purchase" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div className="font-sans antialiased bg-grey-lightest">


            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto">
                  <Formik enableReinitialize initialValues={{
                    name: '', model: '', specifications: '', purchase_price: '', selling_price: '', warranty_period: '', is_borrow: '0', shop_name: '', shop_address: '', shop_phone: '', shop_email: ''
                    , identity_type: 'none', identity_value: '', warranty_type: 'none', is_warranty: '0',
                    categories: [],
                    brands: [], quantity: 1,
                    description: '', supplier_invoice_no: '', weight: '', is_supplier: '0', customfield: [], type: 'new'
                  }}
                    validationSchema={Yup.object({
                      name: Yup.string().required('Name is required'),
                      model: Yup.string(),
                      specifications: Yup.string(),
                      purchase_price: Yup.number().required('Purchase price is required'),
                      selling_price: Yup.number().required('Selling price is required'),
                      type: Yup.string().required('Type is required'),
                      quantity: Yup.number().when('identity_type', {
                        is: 'imei',
                        then: scheme => scheme.required().max(1, 'Quantity must be less than or equal to 1').min(1, 'Quantity must be greater than or equal to 1'),
                        otherwise: scheme => scheme.optional()
                      }),
                      weight: Yup.number(),
                      is_supplier: Yup.string().required('Is supplier is required'),

                      supplier_invoice_no: Yup.string().when('is_supplier', {
                        is: '1',
                        then: scheme => scheme.required(),
                        otherwise: scheme => scheme.optional()
                      }),

                      is_borrow: Yup.string().required('Is borrow is required'),
                      shop_name: Yup.string(),
                      shop_address: Yup.string(),
                      shop_phone: Yup.string(),
                      description: Yup.string(),
                      shop_email: Yup.string().email('Invalid email address'),

                      identity_type: Yup.string().required('Identity type is required'),
                      identity_value: Yup.string().when('identity_type', {
                        is: 'none',
                        then: scheme => scheme.optional(),
                        otherwise: scheme => scheme.required()
                      }),
                      is_warranty: Yup.string().required('Is warranty is required'),
                      //check warranty_type not equal to none if is_warranty is 1
                      warranty_type: Yup.string().when('is_warranty', {
                        is: '1',
                        then: scheme => scheme.required().notOneOf(['none'], 'Warranty type cannot be "none"'),
                        otherwise: scheme => scheme.optional()
                      }),
                      warranty_period: Yup.number().when('is_warranty', {
                        is: '1',
                        then: scheme => scheme.required(),
                        otherwise: scheme => scheme.optional()
                      }),

                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {

                      router.post(route('product.store'), values, { onSuccess: ({ props }) => { if (!props.flash.error) { resetForm(); } }, preserveScroll: true });
                    }}
                  >

                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                      <Form>
                        <div className="py-8 px-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg max-w-7xl mx-auto">
                          {/* Header */}
                          <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                            <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new product.</p>
                          </div>

                          {/* Name and Model */}
                          <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Name <span className="text-red-500">*</span></label>
                              <Field
                                name="name"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="name"
                                type="text"
                                placeholder="Enter product name"
                              />
                              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="model">Model <span className="text-gray-400">(optional)</span></label>
                              <Field
                                name="model"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="model"
                                type="text"
                                placeholder="Enter model"
                              />
                              <ErrorMessage name="model" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>

                          {/* Specifications */}
                          <div className="mb-8">
                            <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="specifications">
                              Specifications <span className="text-gray-400">(optional)</span>
                              <FaEdit
                                size={16}
                                className="cursor-pointer text-cyan-600 hover:text-cyan-800 transition"
                                onClick={() => setAllowSpecifications(!allowSpecifications)}
                              />
                            </label>
                            {allowSpecifications && (
                              <ReactQuill
                                theme="snow"
                                className="border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-cyan-500 transition duration-200"
                                value={values.specifications}
                                onChange={(e) => setFieldValue('specifications', e)}
                              />
                            )}
                            <ErrorMessage name="specifications" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Description */}
                          <div className="mb-8">
                            <label className="text-gray-700 text-sm font-medium mb-2 flex items-center gap-2" htmlFor="description">
                              Description <span className="text-gray-400">(optional)</span>
                              <FaEdit
                                size={16}
                                className="cursor-pointer text-cyan-600 hover:text-cyan-800 transition"
                                onClick={() => setAllowDescription(!allowDescription)}
                              />
                            </label>
                            {allowDescription && (
                              <ReactQuill
                                theme="snow"
                                className="border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-cyan-500 transition duration-200"
                                value={values.description}
                                onChange={(e) => setFieldValue('description', e)}
                              />
                            )}
                            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Purchase and Selling Price */}
                          <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="purchase_price">Purchase Price <span className="text-red-500">*</span></label>
                              <Field
                                name="purchase_price"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="purchase_price"
                                type="number"
                                step="0.01"
                                placeholder="Enter purchase price"
                              />
                              <ErrorMessage name="purchase_price" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="selling_price">Selling Price <span className="text-red-500">*</span></label>
                              <Field
                                name="selling_price"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="selling_price"
                                type="number"
                                step="0.01"
                                placeholder="Enter selling price"
                              />
                              <ErrorMessage name="selling_price" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>

                          {/* Quantity and Weight */}
                          <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="quantity">Quantity <span className="text-red-500">*</span></label>
                              <Field
                                name="quantity"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="quantity"
                                type="number"
                                min="1"
                                placeholder="Enter quantity"
                              />
                              <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="weight">Weight (kg) <span className="text-gray-400">(optional)</span></label>
                              <Field
                                name="weight"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="weight"
                                type="number"
                                step="0.01"
                                placeholder="Enter weight"
                              />
                              <ErrorMessage name="weight" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>

                          {/* Category */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-gray-700 text-sm font-medium" htmlFor="categories">Category <span className="text-gray-400">(optional)</span></label>
                              <button
                                type="button"
                                onClick={() => setIsCategoryModel(true)}
                                className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                              >
                                Create new category
                              </button>
                            </div>
                            <Select
                              onChange={(e) => setFieldValue("categories", e.map((item) => item.value))}
                              isMulti
                              name="categories"
                              options={categories}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: '0.5rem',
                                  borderColor: '#d1d5db',
                                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                  '&:hover': { borderColor: '#06b6d4' },
                                }),
                                menu: (base) => ({
                                  ...base,
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }),
                              }}
                            />
                            <ErrorMessage name="categories" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Brand */}
                          <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-gray-700 text-sm font-medium" htmlFor="brands">Brand <span className="text-gray-400">(optional)</span></label>
                              <button
                                type="button"
                                onClick={() => setIsBrandModel(true)}
                                className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                              >
                                Create new brand
                              </button>
                            </div>
                            <Select
                              onChange={(e) => setFieldValue("brands", e.map((item) => item.value))}
                              isMulti
                              name="brands"
                              options={brands}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: '0.5rem',
                                  borderColor: '#d1d5db',
                                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                  '&:hover': { borderColor: '#06b6d4' },
                                }),
                                menu: (base) => ({
                                  ...base,
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }),
                              }}
                            />
                            <ErrorMessage name="brands" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Type */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="type">Type <span className="text-red-500">*</span></label>
                            <Field
                              name="type"
                              as="select"
                              className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                              id="type"
                            >
                              <option value="new">New</option>
                              <option value="used">Used</option>
                            </Field>
                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Identity Type */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-3">Identity Type <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-4 gap-4">
                              {["none", "imei", "sku", "serial"].map((type, index) => (
                                <div key={type}>
                                  <Field
                                    className="hidden"
                                    id={`radio_${index + 1}`}
                                    value={type}
                                    type="radio"
                                    name="identity_type"
                                  />
                                  <label
                                    className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer text-center transition duration-200 shadow-sm ${values.identity_type === type
                                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                                        : "border-gray-300 hover:border-cyan-400 bg-white"
                                      }`}
                                    htmlFor={`radio_${index + 1}`}
                                  >
                                    <span className="text-sm font-medium uppercase">{type}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                            <ErrorMessage name="identity_type" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Identity Value */}
                          {values.identity_type !== "none" && (
                            <div className="mb-8">
                              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="identity_value">
                                {values.identity_type.charAt(0).toUpperCase() + values.identity_type.slice(1)} <span className="text-red-500">*</span>
                              </label>
                              <Field
                                name="identity_value"
                                className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                id="identity_value"
                                type="text"
                                placeholder={`Enter ${values.identity_type}`}
                              />
                              <ErrorMessage name="identity_value" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          )}

                          {/* Warranty */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-3">Warranty <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-8">
                              <label className="flex items-center">
                                <Field
                                  name="is_warranty"
                                  type="radio"
                                  value="1"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="flex items-center">
                                <Field
                                  name="is_warranty"
                                  type="radio"
                                  value="0"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">No</span>
                              </label>
                            </div>
                            <ErrorMessage name="is_warranty" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Warranty Details */}
                          {values.is_warranty === "1" && (
                            <div className="grid grid-cols-2 gap-6 mb-8">
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warranty_type">Warranty Type <span className="text-red-500">*</span></label>
                                <Field
                                  name="warranty_type"
                                  as="select"
                                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                  id="warranty_type"
                                >
                                  <option value="">Select Warranty Type</option>
                                  <option value="years">Year</option>
                                  <option value="months">Month</option>
                                  <option value="days">Day</option>
                                </Field>
                                <ErrorMessage name="warranty_type" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="warranty_period">Warranty Period <span className="text-red-500">*</span></label>
                                <Field
                                  name="warranty_period"
                                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                  id="warranty_period"
                                  type="number"
                                  step="1"
                                  placeholder="Enter warranty period"
                                />
                                <ErrorMessage name="warranty_period" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </div>
                          )}

                          {/* Borrow */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-3">Borrow <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-8">
                              <label className="flex items-center">
                                <Field
                                  name="is_borrow"
                                  type="radio"
                                  value="1"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="flex items-center">
                                <Field
                                  name="is_borrow"
                                  type="radio"
                                  value="0"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">No</span>
                              </label>
                            </div>
                            <ErrorMessage name="is_borrow" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Borrow Details */}
                          {values.is_borrow === "1" && (
                            <>
                              <div className="mb-8">
                                <label className="block text-red-500 text-sm font-medium mb-3">Fill at least one field below</label>
                              </div>
                              <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="shop_name">Shop Name</label>
                                  <Field
                                    name="shop_name"
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                    id="shop_name"
                                    type="text"
                                    placeholder="Enter shop name"
                                  />
                                  <ErrorMessage name="shop_name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="shop_phone">Shop Phone</label>
                                  <Field
                                    name="shop_phone"
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                    id="shop_phone"
                                    type="tel"
                                    placeholder="Enter shop phone"
                                  />
                                  <ErrorMessage name="shop_phone" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
                              <div className="mb-8">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="shop_address">Shop Address</label>
                                <Field
                                  as="textarea"
                                  name="shop_address"
                                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                  id="shop_address"
                                  rows="4"
                                  placeholder="Enter shop address"
                                />
                                <ErrorMessage name="shop_address" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div className="mb-8">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="shop_email">Shop Email</label>
                                <Field
                                  name="shop_email"
                                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                  id="shop_email"
                                  type="email"
                                  placeholder="Enter shop email"
                                />
                                <ErrorMessage name="shop_email" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </>
                          )}

                          {/* Supplier */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-3">Supplier <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-8">
                              <label className="flex items-center">
                                <Field
                                  name="is_supplier"
                                  type="radio"
                                  value="1"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="flex items-center">
                                <Field
                                  name="is_supplier"
                                  type="radio"
                                  value="0"
                                  className="mr-2 focus:ring-cyan-500 text-cyan-500"
                                />
                                <span className="text-sm text-gray-700">No</span>
                              </label>
                            </div>
                            <ErrorMessage name="is_supplier" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Supplier Invoice */}
                          {values.is_supplier === "1" && (
                            <div className="mb-8">
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-gray-700 text-sm font-medium">Supplier Invoice No</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNotRemember(!notremember);
                                    setFieldValue('supplier_invoice_no', '');
                                  }}
                                  className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                >
                                  {notremember ? 'Remember' : 'Not remember?'}
                                </button>
                              </div>
                              {!notremember ? (
                                <Field
                                  name="supplier_invoice_no"
                                  className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                  id="supplier_invoice_no"
                                  type="text"
                                  placeholder="Enter supplier invoice no"
                                />
                              ) : (
                                <>
                                  <select
                                    onChange={(e) => {
                                      setFieldValue('supplier_invoice_no', '');
                                      setSupplierId(e.target.value);
                                      router.get(route('product.create'), { supplier_id: e.target.value }, { preserveState: true, preserveScroll: true });
                                    }}
                                    className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                    id="supplier_invoice_no"
                                  >
                                    <option value="">Select supplier</option>
                                    {suppliers.map((supplier) => (
                                      <option key={supplier.id} value={supplier.id}>
                                        {supplier.person_name + ' - ' + supplier.code + ' - ' + supplier.contact}
                                      </option>
                                    ))}
                                  </select>
                                  {supplierinvoices.length > 0 && (
                                    <Field
                                      as="select"
                                      name="supplier_invoice_no"
                                      className="mt-3 appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                      id="supplier_invoice_no"
                                    >
                                      <option value="">Select supplier invoice no</option>
                                      {supplierinvoices.map((item) => (
                                        <option key={item.id} value={item.invoice_no}>
                                          {item.invoice_no}
                                        </option>
                                      ))}
                                    </Field>
                                  )}
                                </>
                              )}
                              <ErrorMessage name="supplier_invoice_no" component="div" className="text-red-500 text-xs mt-1" />
                              <div className="flex items-center gap-4 mt-3">
                                <button
                                  type="button"
                                  onClick={() => setIsNewSupplierInvoiceModel(true)}
                                  className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                >
                                  Create new invoice
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsNewSupplierModel(true)}
                                  className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                >
                                  Create new supplier
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Custom Fields */}
                          <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-medium mb-3">Other Details <span className="text-gray-400">(optional)</span></label>
                            <FieldArray name="customfield">
                              {({ push, remove }) => (
                                <div>
                                  {values.customfield && values.customfield.length > 0 ? (
                                    values.customfield.map((field, index) => (
                                      <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-start">
                                        <div>
                                          <Field
                                            name={`customfield.${index}.name`}
                                            className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                            type="text"
                                            placeholder="Field name"
                                          />
                                          <ErrorMessage
                                            name={`customfield.${index}.name`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Field
                                            name={`customfield.${index}.value`}
                                            className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 bg-white shadow-sm"
                                            type="text"
                                            placeholder="Field value"
                                          />
                                          <ErrorMessage
                                            name={`customfield.${index}.value`}
                                            component="div"
                                            className="text-red-500 text-xs mt-1"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className="text-red-500 text-sm font-medium hover:text-red-700 transition underline pt-3"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-sm">No custom fields added.</p>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => push({ name: '', value: '' })}
                                    className="mt-3 text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                  >
                                    Add Custom Field
                                  </button>
                                </div>
                              )}
                            </FieldArray>
                            <ErrorMessage name="customfield" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-4 mt-10">
                            <button
                              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-md"
                              type="submit"
                            >
                              Save Product
                            </button>
                            <button
                              onClick={() => router.get(route('product.index'))}
                              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-md"
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>

              </div>
            </div>
          </div>


        </div>
      </div>

      <Modal show={isNewSupplierModel} onClose={() => setIsNewSupplierModel(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
              Create New Supplier
            </div>
          </div>

          <div className="px-10 mb-5">
            <Formik enableReinitialize initialValues={{ person_name: '', email: '', contact: '', address: '', code: '' }}
              validationSchema={Yup.object({
                person_name: Yup.string().required('Name is required'),
                email: Yup.string().email('Invalid email address'),
                contact: Yup.string().required('Contact is required'),
                address: Yup.string(),
                code: Yup.string().required('Code is required'),
              })}
              onSubmit={(values, { setSubmitting }) => {
                router.post(route('supplier.store'), values, {
                  onSuccess: () => {
                    setIsNewSupplierModel(false);
                  },
                  preserveScroll: true,
                  preserveState: true,
                });

              }}
            >
              {({ isSubmitting, values, errors, setFieldValue, }) => {

                const generateCode = () => {
                  router.get(route('product.create'), { code: true }, {
                    onSuccess: (response) => {
                      setFieldValue('code', response.props.code);
                    },
                    preserveScroll: true,
                    preserveState: true
                  });
                }

                return (
                  <Form>
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Supplier Name</label>
                      <Field name="person_name" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier name" />
                      <ErrorMessage name="person_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_address">Supplier Address</label>
                      <Field name="address" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier address" />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_contact">Supplier Contact</label>
                      <Field name="contact" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="number" placeholder="Enter supplier contact" />
                      <ErrorMessage name="contact" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_email">Supplier Email</label>
                      <Field name="email" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="email" placeholder="Enter supplier email" />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_code">Supplier Code</label>
                      <div className="flex gap-2 items-center">
                        <Field name="code" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier code" />

                        <RiAiGenerate onClick={() => generateCode()} size={40} color="black" />
                      </div>
                      <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />

                      {values.code !== '' &&
                        <button type='button' onClick={() => {
                          //copy to clipboard
                          navigator.clipboard.writeText(values.code);
                          toast.success('Copied to clipboard');
                        }} className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2' >Copy</button>
                      }
                    </div>

                    <div className="flex items-center justify-start gap-1 mt-8">
                      <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                      </button>
                      <button onClick={() => setIsNewSupplierModel(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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


      <Modal show={isNewSupplierInvoiceModel} onClose={() => setIsNewSupplierInvoiceModel(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
              Create New Invoice
            </div>
          </div>

          <div className="px-10 mb-5">
            <Formik enableReinitialize initialValues={{
              supplier_code: "",
              invoice_no: "",
              invoice_date: "",
              due_date: "",
              total_payment: "",
              status: "",
              method: "",
              cheque_no: "",
              cheque_date: "",
              bank_name: "",
              bank_branch: "",
              bank_account: "",
              online_payment_link: "",
              payment_proof: "",
              note: "",
            }}
              validationSchema={Yup.object({
                supplier_code: Yup.string().required("Supplier Code is required"),
                invoice_no: Yup.string().required("Invoice No is required"),
                invoice_date: Yup.date().required("Invoice Date is required"),
                due_date: Yup.date().required("Due Date is required"),
                total_payment: Yup.number().required(
                  "Total Pending Payment is required"
                ),
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
                  router.get(route('product.create'), { invoicecode: true }, {
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
                      <Field name="supplier_code" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier code" />

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
                            Bank Name (optional)
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
                            Brank Brank (optional)
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
                            Bank Account No (optional)
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
                            Online payment link (optional)
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
                      <button onClick={() => setIsNewSupplierInvoiceModel(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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



      <Modal show={isCategoryModel} onClose={() => setIsCategoryModel(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
              Create Category
            </div>
          </div>

          <div className="px-10 mb-5">
            <CategoryForm categories={categories_object_model} cancelBtnAccToModel={true} cancelOnClick={() => setIsCategoryModel(false)} />
          </div>
        </div>
      </Modal>

      <Modal show={isBrandModel} onClose={() => setIsBrandModel(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <div className="flex justify-center p-10">
            <div className="text-2xl font-medium text-[#5d596c] ">
              Create Brand
            </div>
          </div>

          <div className="px-10 mb-5">
            <BrandForm cancelBtnAccToModel={true} cancelOnClick={() => setIsBrandModel(false)} />
          </div>
        </div>
      </Modal>



    </AuthenticatedLayout>
  );
}

