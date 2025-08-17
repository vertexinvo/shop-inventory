import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import { FaWallet, FaEdit, FaTrash, FaPlusCircle, FaCheckCircle } from 'react-icons/fa'
import { MdClear, MdContentPaste, MdDelete, MdKeyboardBackspace, MdExpandMore, MdExpandLess } from 'react-icons/md'
import { GiTwoCoins } from 'react-icons/gi'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import * as Yup from 'yup'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Modal from '@/Components/Modal'
import { RiAiGenerate } from 'react-icons/ri'
import { toast } from 'react-toastify'
import CustomerForm from '@/Partials/CustomerForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function Add(props) {
  const { auth, users, items, order_id, taxs, shippingrates, order, default_selected_shippingrate } = props

  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [selectedItems, setSelectedItems] = useState(null)
  const [selectedShippingrate, setSelectedShippingrate] = useState(default_selected_shippingrate || null)
  const [loading3, setLoading3] = useState(false)
  const [exchangeItems, setExchangeItems] = useState(null)
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [showCustomerSection, setShowCustomerSection] = useState(true)
  const [showItemsSection, setShowItemsSection] = useState(true)
  const [showPaymentSection, setShowPaymentSection] = useState(true)
  const [showExchangeSection, setShowExchangeSection] = useState(true)
  const formRef = useRef()

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
      borderRadius: '0.75rem',
      padding: '0.375rem',
      fontSize: '0.875rem',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.75rem',
      marginTop: '0.5rem',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
    }),
  }

  const [orderItems, setOrderItems] = useState(
    order?.items.map((item) => ({
      value: item.product_id,
      data: { ...item?.product, selling_price: item.price },
      quantity: item.qty,
      label: `${item?.product?.name} - ${item?.product?.model}`,
      price: item.price,
    })) || []
  )

  const handleAddItem = (values, setFieldValue) => {
    if (selectedItems?.quantity > selectedItems?.data?.stock?.quantity) {
      toast.error('Quantity exceeds available stock')
      return
    }
    if (values.items.find((item) => item.data.id === selectedItems?.data?.id)) {
      toast.error('This item is already in the cart')
      return
    }
    if (selectedItems?.quantity <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }
    setFieldValue('items', [...values.items, selectedItems])
    setSelectedItems(null)
    toast.success('Item added to cart')
  }

  const handleAddExchangeItem = (values, setFieldValue) => {
    if (
      exchangeItems?.name === '' ||
      exchangeItems?.purchase_price === '' ||
      exchangeItems?.quantity === '' ||
      exchangeItems?.total === ''
    ) {
      toast.error('Please fill in all required exchange item fields')
      return
    }
    setFieldValue('exchange_items', [...values.exchange_items, exchangeItems])
    setExchangeItems(null)
    toast.success('Exchange item added')
  }

  return (
    <AuthenticatedLayout
      header={
        <div>
        
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => formRef.current?.submitForm()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              type="button"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <FaCheckCircle size={16} />
              )}
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                formRef.current?.setFieldValue('close', true)
                formRef.current?.submitForm()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              type="button"
              disabled={loading}
            >
              Save & Close
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.visit(route('order.index'))}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              type="button"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      }
    >
      <Head title="Sale" />
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={{
          status: order?.status || 'pending',
          name: order?.name || '',
          email: order?.email || '',
          phone: order?.phone || '',
          address: order?.address || '',
          total: order?.total || 0,
          payable_amount: order?.payable_amount || 0,
          paid_amount: order?.paid_amount || 0,
          method: order?.method || 'cash',
          cheque_no: order?.cheque_no || '',
          cheque_date: order?.cheque_date || '',
          bank_name: order?.bank_name || '',
          bank_branch: order?.bank_branch || '',
          bank_account: order?.bank_account || '',
          online_payment_link: order?.online_payment_link || '',
          extra_charges: parseFloat(order?.extra_charges) || 0,
          shipping_charges: parseFloat(order?.shipping_charges) || 0,
          discount: parseFloat(order?.discount) || 0,
          tax: order?.tax_fee || 0,
          is_installment: order?.is_installment === true ? '1' : '0',
          installment_amount: order?.installment_amount || 0,
          installment_period: order?.installment_period || '',
          installment_count: order?.installment_count || 0,
          installment_start_date: order?.installment_start_date || '',
          installment_end_date: order?.installment_end_date || '',
          user_id: order?.user_id || '',
          items: orderItems || [],
          tax_id: order?.tax_id || '',
          shipping_id: order?.shipping_id || '',
          order_date: order?.order_date || new Date().toISOString().slice(0, 10),
          close: false,
          exchange_items: order?.exchange_items || [],
          exchange: order?.exchange || 0,
          payment_note: order?.payment_note || '',
          payment_details: order?.payment_details || {},
          note: order?.note || '',
          bill_no: order?.bill_no || '',
        }}
        validationSchema={Yup.object({
          user_id: Yup.string().required('Customer is required'),
          status: Yup.string().oneOf(['pending', 'completed', 'cancel'], 'Invalid status').required('Status is required'),
          bill_no: Yup.string().required('Bill number is required').max(255, 'Bill number cannot exceed 255 characters'),
          name: Yup.string().required('Customer name is required'),
          email: Yup.string().email('Invalid email address'),
          phone: Yup.string()
            .matches(/^\+?[\d\s-]{10,15}$/, 'Phone number must be 10-15 digits')
            .required('Phone number is required'),
          address: Yup.string(),
          total: Yup.number().min(0, 'Total must be a positive number').required('Total is required'),
          payable_amount: Yup.number().min(0, 'Payable amount must be a positive number').required('Payable amount is required'),
          paid_amount: Yup.number().min(0, 'Paid amount must be a positive number'),
          method: Yup.string().required('Payment method is required'),
          cheque_no: Yup.string().when('method', {
            is: 'cheque',
            then: (schema) => schema.required('Cheque number is required'),
            otherwise: (schema) => schema.optional(),
          }),
          cheque_date: Yup.date().when('method', {
            is: 'cheque',
            then: (schema) => schema.required('Cheque date is required'),
            otherwise: (schema) => schema.optional(),
          }),
          bank_name: Yup.string().when('method', {
            is: 'bank',
            then: (schema) => schema.required('Bank name is required'),
            otherwise: (schema) => schema.optional(),
          }),
          bank_branch: Yup.string().when('method', {
            is: 'bank',
            then: (schema) => schema.required('Bank branch is required'),
            otherwise: (schema) => schema.optional(),
          }),
          bank_account: Yup.string().when('method', {
            is: 'bank',
            then: (schema) => schema.required('Bank account number is required'),
            otherwise: (schema) => schema.optional(),
          }),
          online_payment_link: Yup.string().url('Invalid URL'),
          extra_charges: Yup.number().min(0, 'Extra charges must be a positive number'),
          discount: Yup.number().min(0, 'Discount must be a positive number'),
          items: Yup.array().min(1, 'At least one item is required'),
          order_date: Yup.date().required('Order date is required'),
          payment_note: Yup.string().when('method', {
            is: 'partial',
            then: (schema) => schema.required('Payment note is required'),
            otherwise: (schema) => schema.optional(),
          }),
          note: Yup.string(),
          is_installment: Yup.string().oneOf(['0', '1'], 'Invalid installment option'),
          installment_amount: Yup.number().when('is_installment', {
            is: '1',
            then: (schema) => schema.min(0, 'Installment amount must be a positive number').required('Installment amount is required'),
            otherwise: (schema) => schema.optional(),
          }),
          installment_period: Yup.string().when('is_installment', {
            is: '1',
            then: (schema) => schema.required('Installment period is required'),
            otherwise: (schema) => schema.optional(),
          }),
          installment_count: Yup.number().when('is_installment', {
            is: '1',
            then: (schema) => schema.min(1, 'Installment count must be at least 1').required('Installment count is required'),
            otherwise: (schema) => schema.optional(),
          }),
          installment_start_date: Yup.date().when('is_installment', {
            is: '1',
            then: (schema) => schema.required('Installment start date is required'),
            otherwise: (schema) => schema.optional(),
          }),
          installment_end_date: Yup.date().when('is_installment', {
            is: '1',
            then: (schema) => schema.min(Yup.ref('installment_start_date'), 'End date must be after start date').required('Installment end date is required'),
            otherwise: (schema) => schema.optional(),
          }),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true)
          const request = order
            ? router.put(route('order.update', order.id), values, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                  toast.success('Order updated successfully')
                },
                onError: () => {
                  toast.error('Failed to update order. Please try again.')
                },
                onFinish: () => {
                  setLoading(false)
                  setSubmitting(false)
                },
              })
            : router.post(route('order.store'), values, {
                onSuccess: () => {
                  resetForm()
                  toast.success('Order created successfully')
                },
                onError: () => {
                  toast.error('Failed to create order. Please try again.')
                },
                onFinish: () => {
                  setLoading(false)
                  setSubmitting(false)
                },
                preserveScroll: true,
                preserveState: true,
              })
        }}
      >
        {({ isSubmitting, values, errors, setFieldValue, handleSubmit }) => {
          useEffect(() => {
            const totalAmount = values.items.reduce(
              (total, item) => total + item.quantity * item.data.selling_price,
              0
            )
            const discount = parseFloat(values.discount || 0)
            setFieldValue('total', totalAmount)
            setFieldValue(
              'payable_amount',
              totalAmount +
                parseFloat(values.extra_charges || 0) +
                parseFloat(values.tax || 0) +
                parseFloat(values.shipping_charges || 0) -
                (discount + parseFloat(values.exchange || 0))
            )
          }, [values.items, values.discount, values.exchange, values.extra_charges, values.tax, values.shipping_charges])

          useEffect(() => {
            if (values.exchange_items.length > 0) {
              const totalAmount = values.exchange_items.reduce(
                (total, item) => total + item.quantity * item.purchase_price,
                0
              )
              setFieldValue('exchange', totalAmount)
            } else {
              setFieldValue('exchange', 0)
            }
          }, [values.exchange_items])

          return (
            <Form className="max-w-7xl mx-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form Section */}
                <div className={`bg-white rounded-xl shadow-sm p-6 ${values.items.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-300`}>
                  <div className="space-y-6">
                    {/* Order Details Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowCustomerSection(!showCustomerSection)}>
                        <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                        {showCustomerSection ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                      </div>
                      <AnimatePresence>
                        {showCustomerSection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date*</label>
                                <Field
                                  name="order_date"
                                  type="date"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  aria-label="Order Date"
                                />
                                <ErrorMessage name="order_date" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number*</label>
                                <Field
                                  name="bill_no"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="text"
                                  placeholder="Enter Bill Number"
                                  aria-label="Bill Number"
                                />
                                <ErrorMessage name="bill_no" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status*</label>
                              <Field
                                as="select"
                                name="status"
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                aria-label="Order Status"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancel">Cancelled</option>
                              </Field>
                              <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Customer Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowCustomerSection(!showCustomerSection)}>
                        <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                        {showCustomerSection ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                      </div>
                      <AnimatePresence>
                        {showCustomerSection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">Select Customer*</label>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                                onClick={() => setAddCustomerModal(true)}
                                aria-label="Add New Customer"
                              >
                                Add New Customer
                              </motion.button>
                            </div>
                            <Select
                              onChange={(e) => {
                                setFieldValue('user_id', e.value)
                                setFieldValue('name', e.name)
                                setFieldValue('email', e.email)
                                setFieldValue('phone', e.phone)
                                setFieldValue('address', e.address)
                              }}
                              isSearchable={true}
                              isLoading={loading}
                              value={users.find((option) => option.value === values.user_id)}
                              options={users}
                              styles={customStyles}
                              classNamePrefix="select"
                              placeholder="Search for a customer..."
                              aria-label="Select Customer"
                            />
                            <ErrorMessage name="user_id" component="div" className="text-red-500 text-xs mt-1" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name*</label>
                                <Field
                                  name="name"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="text"
                                  placeholder="Enter Customer Name"
                                  aria-label="Customer Name"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                                <Field
                                  name="email"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="email"
                                  placeholder="Enter Customer Email"
                                  aria-label="Customer Email"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone*</label>
                                <Field
                                  name="phone"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="tel"
                                  placeholder="Enter Customer Phone"
                                  aria-label="Customer Phone"
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
                                <Field
                                  name="address"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="text"
                                  placeholder="Enter Customer Address"
                                  aria-label="Customer Address"
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Items Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowItemsSection(!showItemsSection)}>
                        <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                        {showItemsSection ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                      </div>
                      <AnimatePresence>
                        {showItemsSection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">Select Items*</label>
                              <div className="flex items-center gap-3">
                                <a
                                  href={route('product.create')}
                                  className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                                  target="_blank"
                                  aria-label="Add New Item"
                                >
                                  Add New Item
                                </a>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                                  onClick={() => {
                                    setLoading2(true)
                                    router.reload({ only: ['items'], onFinish: () => setLoading2(false) })
                                  }}
                                  aria-label="Refresh Items"
                                >
                                  Refresh
                                </motion.button>
                              </div>
                            </div>
                            <Select
                              onChange={(e) => setSelectedItems({ ...e, quantity: 1 })}
                              isSearchable={true}
                              isLoading={loading2}
                              value={items.find((option) => option.value === selectedItems?.value)}
                              options={items}
                              styles={customStyles}
                              classNamePrefix="select"
                              placeholder="Search for an item..."
                              aria-label="Select Item"
                            />
                            <ErrorMessage name="items" component="div" className="text-red-500 text-xs mt-1" />
                            {selectedItems && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                              >
                                <div>
                                  <input
                                    type="number"
                                    value={selectedItems?.quantity}
                                    onChange={(e) => setSelectedItems({ ...selectedItems, quantity: e.target.value })}
                                    placeholder="Enter Quantity"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    min="1"
                                    aria-label="Item Quantity"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Available: {selectedItems?.data?.stock?.quantity || 0}
                                  </p>
                                </div>
                                <div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddItem(values, setFieldValue)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    type="button"
                                    aria-label="Add Item to Cart"
                                  >
                                    <FaPlusCircle size={16} />
                                    Add Item
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                            {selectedItems && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 bg-gray-50 rounded-lg p-4"
                              >
                                <h4 className="text-base font-medium text-gray-900 mb-4">Item Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium text-gray-700">Product Info</p>
                                    <p className="text-gray-900">{selectedItems?.data?.name}</p>
                                    {selectedItems?.data?.model && <p className="text-xs text-gray-500">Model: {selectedItems?.data?.model}</p>}
                                    {selectedItems?.data?.identity_type !== 'none' && (
                                      <p className="text-xs text-gray-500">{selectedItems?.data?.identity_type}: {selectedItems?.data?.identity_value}</p>
                                    )}
                                    <a
                                      href={route('product.show', selectedItems?.data?.code || selectedItems?.data?.id)}
                                      target="_blank"
                                      className="text-blue-600 hover:text-blue-800"
                                      aria-label="View Item Details"
                                    >
                                      View Item
                                    </a>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Purchase ID</p>
                                    <p className="text-gray-900">{selectedItems?.data?.code || selectedItems?.data?.id}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Purchase Price</p>
                                    <p className="text-gray-900">{selectedItems?.data?.purchase_price || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Selling Price</p>
                                    <p className="text-gray-900">{selectedItems?.data?.selling_price || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Supplier</p>
                                    <p className="text-gray-900">{selectedItems?.data?.supplier_name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Brands</p>
                                    <p className="text-gray-900">{selectedItems?.data?.brands?.map((brand) => brand.name).join(', ') || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Categories</p>
                                    <p className="text-gray-900">{selectedItems?.data?.categories?.map((category) => category.name).join(', ') || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Warranty Period</p>
                                    <p className="text-gray-900">
                                      {selectedItems?.data?.is_warranty == '0' ? 'No' : `${selectedItems?.data?.warranty_period} - ${selectedItems?.data?.warranty_type}`}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Is Borrow</p>
                                    <p className="text-gray-900">
                                      {selectedItems?.data?.is_borrow == '0' ? 'No' : (
                                        <ul className="list-disc pl-4 text-xs">
                                          {selectedItems?.data?.shop_name && <li>Name: {selectedItems?.data?.shop_name}</li>}
                                          {selectedItems?.data?.shop_address && <li>Address: {selectedItems?.data?.shop_address}</li>}
                                          {selectedItems?.data?.shop_phone && <li>Phone: {selectedItems?.data?.shop_phone}</li>}
                                          {selectedItems?.data?.shop_email && <li>Email: {selectedItems?.data?.shop_email}</li>}
                                        </ul>
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Stock Quantity</p>
                                    <p className={`text-sm ${selectedItems?.data?.stock?.quantity == 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                      {selectedItems?.data?.stock?.quantity || 0}
                                      <a
                                        href={route('stock.index', { product_id: selectedItems?.data?.id })}
                                        target="_blank"
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                        aria-label="Manage Stock"
                                      >
                                        Manage Stock
                                      </a>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Stock Status</p>
                                    <p className="text-gray-900">{selectedItems?.data?.stock?.status ? 'Available' : 'Not Available'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Supplier Invoice</p>
                                    <p className="text-gray-900">{selectedItems?.data?.is_supplier == '0' ? 'No' : selectedItems?.data?.supplier_invoice_no}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Payment Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowPaymentSection(!showPaymentSection)}>
                        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                        {showPaymentSection ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                      </div>
                      <AnimatePresence>
                        {showPaymentSection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Is Installment</label>
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                  <Field
                                    name="is_installment"
                                    type="radio"
                                    value="1"
                                    className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    aria-label="Installment Yes"
                                  />
                                  Yes
                                </label>
                                <label className="flex items-center gap-2">
                                  <Field
                                    name="is_installment"
                                    type="radio"
                                    value="0"
                                    className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    aria-label="Installment No"
                                  />
                                  No
                                </label>
                              </div>
                              <ErrorMessage name="is_installment" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {values.is_installment === '1' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment Amount*</label>
                                    <Field
                                      name="installment_amount"
                                      type="number"
                                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                      placeholder="Enter Installment Amount"
                                      aria-label="Installment Amount"
                                    />
                                    <ErrorMessage name="installment_amount" component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment Period*</label>
                                    <Field
                                      name="installment_period"
                                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                      type="text"
                                      placeholder="Enter Installment Period"
                                      aria-label="Installment Period"
                                    />
                                    <ErrorMessage name="installment_period" component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment Start Date*</label>
                                    <Field
                                      name="installment_start_date"
                                      type="date"
                                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                      aria-label="Installment Start Date"
                                    />
                                    <ErrorMessage name="installment_start_date" component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment End Date*</label>
                                    <Field
                                      name="installment_end_date"
                                      type="date"
                                      className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                      aria-label="Installment End Date"
                                    />
                                    <ErrorMessage name="installment_end_date" component="div" className="text-red-500 text-xs mt-1" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Installment Count*</label>
                                  <Field
                                    name="installment_count"
                                    type="number"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    placeholder="Enter Installment Count"
                                    min="1"
                                    aria-label="Installment Count"
                                  />
                                  <ErrorMessage name="installment_count" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
                              <Field
                                name="method"
                                as="select"
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                aria-label="Payment Method"
                              >
                                <option value="">Select Payment Method</option>
                                <option value="cash">Cash</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="online">Online</option>
                                <option value="partial">Partial</option>
                              </Field>
                              <ErrorMessage name="method" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {values.method === 'partial' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Note*</label>
                                <Field
                                  as="textarea"
                                  rows="4"
                                  name="payment_note"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  aria-label="Payment Note"
                                />
                                <ErrorMessage name="payment_note" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            )}
                            {values.method === 'cheque' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number*</label>
                                  <Field
                                    name="cheque_no"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    type="text"
                                    placeholder="Enter Cheque Number"
                                    aria-label="Cheque Number"
                                  />
                                  <ErrorMessage name="cheque_no" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date*</label>
                                  <Field
                                    name="cheque_date"
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    aria-label="Cheque Date"
                                  />
                                  <ErrorMessage name="cheque_date" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
                            )}
                            {values.method === 'bank' && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name*</label>
                                  <Field
                                    name="bank_name"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    type="text"
                                    placeholder="Enter Bank Name"
                                    aria-label="Bank Name"
                                  />
                                  <ErrorMessage name="bank_name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Branch*</label>
                                  <Field
                                    name="bank_branch"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    type="text"
                                    placeholder="Enter Bank Branch"
                                    aria-label="Bank Branch"
                                  />
                                  <ErrorMessage name="bank_branch" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number*</label>
                                  <Field
                                    name="bank_account"
                                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                    type="text"
                                    placeholder="Enter Bank Account Number"
                                    aria-label="Bank Account Number"
                                  />
                                  <ErrorMessage name="bank_account" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
                            )}
                            {values.method === 'online' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Online Payment Link</label>
                                <Field
                                  name="online_payment_link"
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  type="url"
                                  placeholder="Enter Online Payment Link"
                                  aria-label="Online Payment Link"
                                />
                                <ErrorMessage name="online_payment_link" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Select Tax</label>
                              <div className="flex items-center gap-2 mb-2">
                                <Field
                                  name="tax_id"
                                  as="select"
                                  onChange={(e) => {
                                    const selectedTax = taxs.find((tax) => tax.id == e.target.value)
                                    setFieldValue('tax', selectedTax ? selectedTax.cost : '')
                                    setFieldValue('tax_id', e.target.value)
                                  }}
                                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                  aria-label="Select Tax"
                                >
                                  <option value="">Select Tax</option>
                                  {taxs.map((tax) => (
                                    <option key={tax.id} value={tax.id}>
                                      {tax.name} - {tax.cost}
                                    </option>
                                  ))}
                                </Field>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => {
                                    setFieldValue('tax', '')
                                    setFieldValue('tax_id', '')
                                  }}
                                  className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                                  aria-label="Reset Tax"
                                >
                                  Reset
                                </motion.button>
                              </div>
                              <ErrorMessage name="tax_id" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Select Shipping Cost</label>
                              <div className="flex items-center gap-2 mb-2">
                                <Select
                                  onChange={(e) => {
                                    setSelectedShippingrate(e)
                                    setFieldValue('shipping_id', e.value)
                                    setFieldValue('shipping_charges', e.fee)
                                  }}
                                  isSearchable={true}
                                  isLoading={loading3}
                                  value={selectedShippingrate}
                                  options={shippingrates}
                                  styles={customStyles}
                                  classNamePrefix="select"
                                  placeholder="Select Shipping Rate"
                                  aria-label="Select Shipping Rate"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => {
                                    setFieldValue('shipping_id', '')
                                    setFieldValue('shipping_charges', 0)
                                    setSelectedShippingrate(null)
                                  }}
                                  className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                                  aria-label="Reset Shipping"
                                >
                                  Reset
                                </motion.button>
                              </div>
                              <ErrorMessage name="shipping_id" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                              <Field
                                as="textarea"
                                rows="4"
                                name="note"
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 text-sm transition-colors"
                                aria-label="Order Note"
                              />
                              <ErrorMessage name="note" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Exchange Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowExchangeSection(!showExchangeSection)}>
                        <h3 className="text-lg font-semibold text-gray-900">Exchange Items</h3>
                        {showExchangeSection ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                      </div>
                      <AnimatePresence>
                        {showExchangeSection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            {values.exchange_items.length > 0 && exchangeItems === null && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => {
                                  setExchangeItems({
                                    name: '',
                                    model: '',
                                    identity_type: 'none',
                                    identity_value: '',
                                    purchase_price: '',
                                    quantity: '1',
                                    total: '',
                                  })
                                }}
                                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                                aria-label="Add Exchange Item"
                              >
                                Add Exchange Item
                              </motion.button>
                            )}
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                              <table className="min-w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Name*</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Identity*</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Price*</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Qty*</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.exchange_items.length === 0 && exchangeItems === null && (
                                    <tr className="hover:bg-gray-50">
                                      <td colSpan="7" className="p-4 text-center text-sm text-gray-800">
                                        No Exchange Items &nbsp;
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          type="button"
                                          onClick={() => {
                                            setExchangeItems({
                                              name: '',
                                              model: '',
                                              identity_type: 'none',
                                              identity_value: '',
                                              purchase_price: '',
                                              quantity: '1',
                                              total: '',
                                            })
                                          }}
                                          className="text-blue-600 text-sm font-medium hover:text-blue-800"
                                          aria-label="Add Exchange Item"
                                        >
                                          Add Item
                                        </motion.button>
                                      </td>
                                    </tr>
                                  )}
                                  {exchangeItems && (
                                    <motion.tr
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="p-4">
                                        <input
                                          type="text"
                                          value={exchangeItems.name}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, name: e.target.value })}
                                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                          placeholder="Enter Item Name"
                                          aria-label="Exchange Item Name"
                                        />
                                      </td>
                                      <td className="p-4">
                                        <input
                                          type="text"
                                          value={exchangeItems.model}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, model: e.target.value })}
                                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                          placeholder="Enter Model"
                                          aria-label="Exchange Item Model"
                                        />
                                      </td>
                                      <td className="p-4 flex flex-col sm:flex-row gap-2">
                                        <select
                                          value={exchangeItems.identity_type}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, identity_type: e.target.value })}
                                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                          aria-label="Exchange Item Identity Type"
                                        >
                                          <option value="none">None</option>
                                          <option value="imei">IMEI</option>
                                          <option value="serial">Serial</option>
                                          <option value="sku">SKU</option>
                                        </select>
                                        {exchangeItems.identity_type !== 'none' && (
                                          <input
                                            type="text"
                                            value={exchangeItems.identity_value}
                                            onChange={(e) => setExchangeItems({ ...exchangeItems, identity_value: e.target.value })}
                                            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                            placeholder={`Enter ${exchangeItems.identity_type}`}
                                            aria-label={`Exchange Item ${exchangeItems.identity_type}`}
                                          />
                                        )}
                                      </td>
                                      <td className="p-4">
                                        <input
                                          type="number"
                                          value={exchangeItems.purchase_price}
                                          onChange={(e) => {
                                            const newPurchasePrice = e.target.value
                                            setExchangeItems({
                                              ...exchangeItems,
                                              purchase_price: newPurchasePrice,
                                              total: newPurchasePrice * exchangeItems.quantity,
                                            })
                                          }}
                                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                          placeholder="Enter Price"
                                          min="0"
                                          step="0.01"
                                          aria-label="Exchange Item Price"
                                        />
                                      </td>
                                      <td className="p-4">
                                        <input
                                          type="number"
                                          value={exchangeItems.quantity}
                                          onChange={(e) => {
                                            const newQuantity = e.target.value
                                            setExchangeItems({
                                              ...exchangeItems,
                                              quantity: newQuantity,
                                              total: newQuantity * exchangeItems.purchase_price,
                                            })
                                          }}
                                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                          placeholder="Enter Quantity"
                                          min="1"
                                          aria-label="Exchange Item Quantity"
                                        />
                                      </td>
                                      <td className="p-4">
                                        <input
                                          type="number"
                                          disabled
                                          value={exchangeItems.total}
                                          className="w-full rounded-lg border-gray-200 bg-gray-100 p-2 text-sm"
                                          aria-label="Exchange Item Total"
                                        />
                                      </td>
                                      <td className="p-4 flex items-center gap-2">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          type="button"
                                          onClick={() => handleAddExchangeItem(values, setFieldValue)}
                                          className="text-blue-600 text-sm font-medium hover:text-blue-800"
                                          aria-label="Add Exchange Item"
                                        >
                                          Add
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          type="button"
                                          onClick={() => setExchangeItems(null)}
                                          className="text-gray-600 text-sm font-medium hover:text-gray-800"
                                          aria-label="Cancel Exchange Item"
                                        >
                                          Cancel
                                        </motion.button>
                                      </td>
                                    </motion.tr>
                                  )}
                                  {values.exchange_items.map((exchange_item, index) => (
                                    <motion.tr
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="hover:bg-gray-50"
                                      key={index}
                                    >
                                      <td className="p-4 text-sm text-gray-900">{exchange_item.name}</td>
                                      <td className="p-4 text-sm text-gray-900">{exchange_item.model || <span className="text-red-500">N/A</span>}</td>
                                      <td className="p-4 text-sm text-gray-900">
                                        {exchange_item.identity_type}
                                        {exchange_item.identity_value !== '' && ` : ${exchange_item.identity_value}`}
                                      </td>
                                      <td className="p-4 text-sm text-gray-900">{exchange_item.purchase_price}</td>
                                      <td className="p-4 text-sm text-gray-900">{exchange_item.quantity}</td>
                                      <td className="p-4 text-sm text-gray-900">{exchange_item.total}</td>
                                      <td className="p-4">
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <FaTrash
                                            size={16}
                                            color="red"
                                            className="cursor-pointer"
                                            onClick={() => {
                                              const updatedExchangeItems = values.exchange_items.filter((_, i) => i !== index)
                                              setFieldValue('exchange_items', updatedExchangeItems)
                                              const totalAmount = updatedExchangeItems.reduce((total, item) => total + item.quantity * item.purchase_price, 0)
                                              setFieldValue('exchange', totalAmount)
                                              toast.success('Exchange item removed')
                                            }}
                                            aria-label="Remove Exchange Item"
                                          />
                                        </motion.div>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Cart and Calculation Section */}
                {values.items.length > 0 && (
                  <div className="lg:col-span-1 space-y-6">
                    {/* Cart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Cart ({values.items.length})</h3>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <MdClear
                            size={20}
                            className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => {
                              setFieldValue('items', [])
                              toast.success('Cart cleared')
                            }}
                            aria-label="Clear Cart"
                          />
                        </motion.div>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Product Info</th>
                              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.items.map((record, index) => (
                              <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="hover:bg-gray-50"
                                key={record.data.id}
                              >
                                <td className="p-4 text-sm">
                                  <div className="flex items-center">
                                    <div>
                                      <p className="text-sm text-gray-900">{record?.data?.name}</p>
                                      {record?.data?.model && <p className="text-xs text-gray-500">Model: {record?.data?.model}</p>}
                                      {record?.data?.identity_type !== 'none' && (
                                        <p className="text-xs text-gray-500">{record?.data?.identity_type}: {record?.data?.identity_value}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <input
                                    type="number"
                                    name="selling_price"
                                    value={record?.data?.selling_price}
                                    className="w-24 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => {
                                      setFieldValue(`items.${index}.data.selling_price`, e.target.value || 0)
                                    }}
                                    aria-label={`Selling Price for ${record?.data?.name}`}
                                  />
                                </td>
                                <td className="p-4">
                                  <input
                                    type="number"
                                    name="quantity"
                                    value={record?.quantity}
                                    className="w-16 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                                    max={record?.data?.stock?.quantity || 0}
                                    min="1"
                                    onChange={(e) => {
                                      const value = Number(e.target.value)
                                      if (value > record?.data?.stock?.quantity) {
                                        toast.error('Quantity exceeds available stock')
                                        return
                                      }
                                      if (value <= 0) {
                                        toast.error('Quantity must be greater than 0')
                                        return
                                      }
                                      setFieldValue(`items.${index}.quantity`, Math.min(value, record?.data?.stock?.quantity || 0))
                                    }}
                                    aria-label={`Quantity for ${record?.data?.name}`}
                                  />
                                </td>
                                <td className="p-4 text-sm text-gray-900">{(record?.quantity * record?.data?.selling_price || 0).toFixed(2)}</td>
                                <td className="p-4">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <FaTrash
                                      color="red"
                                      className="cursor-pointer"
                                      onClick={() => {
                                        setFieldValue('items', values.items.filter((item) => item.data.id !== record.data.id))
                                        toast.success('Item removed from cart')
                                      }}
                                      aria-label={`Remove ${record?.data?.name} from cart`}
                                    />
                                  </motion.div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Calculation */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Subtotal</span>
                          <input
                            type="number"
                            value={values.items.reduce((total, item) => total + item.quantity * item.data.selling_price, 0).toFixed(2)}
                            className="w-32 rounded-lg border-gray-200 bg-gray-100 p-2 text-sm"
                            disabled
                            aria-label="Subtotal"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Extra Charges</span>
                          <Field
                            type="number"
                            name="extra_charges"
                            className="w-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                            min="0"
                            step="0.01"
                            aria-label="Extra Charges"
                          />
                        </div>
                        <ErrorMessage name="extra_charges" component="div" className="text-red-500 text-xs" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Discount</span>
                          <Field
                            type="number"
                            name="discount"
                            className="w-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                            min="0"
                            step="0.01"
                            aria-label="Discount"
                          />
                        </div>
                        <ErrorMessage name="discount" component="div" className="text-red-500 text-xs" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Exchange Credit</span>
                          <Field
                            type="number"
                            disabled
                            name="exchange"
                            className="w-32 rounded-lg border-gray-200 bg-gray-100 p-2 text-sm"
                            aria-label="Exchange Credit"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Tax</span>
                          <input
                            type="number"
                            value={(values.tax || 0).toFixed(2)}
                            className="w-32 rounded-lg border-gray-200 bg-gray-100 p-2 text-sm"
                            disabled
                            aria-label="Tax"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Shipping Cost</span>
                          <input
                            type="number"
                            value={parseFloat(values.shipping_charges || 0).toFixed(2)}
                            className="w-32 rounded-lg border-gray-200 bg-gray-100 p-2 text-sm"
                            disabled
                            aria-label="Shipping Cost"
                          />
                        </div>
                        <div className="flex items-center justify-between font-semibold text-gray-900">
                          <span className="text-sm">Grand Total</span>
                          <input
                            type="number"
                            value={(
                              values.items.reduce((total, item) => total + item.quantity * item.data.selling_price, 0) +
                              parseFloat(values.extra_charges || 0) +
                              parseFloat(values.tax || 0) +
                              parseFloat(values.shipping_charges || 0) -
                              (parseFloat(values.exchange || 0) + parseFloat(values.discount || 0))
                            ).toFixed(2)}
                            className="w-32 rounded-lg border-gray-200 bg-gray-100 p-2 text-sm font-semibold"
                            disabled
                            aria-label="Grand Total"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Paid Amount</span>
                          <Field
                            type="number"
                            name="paid_amount"
                            step="0.01"
                            min="0"
                            className="w-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm transition-colors"
                            aria-label="Paid Amount"
                          />
                        </div>
                        <ErrorMessage name="paid_amount" component="div" className="text-red-500 text-xs" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {addCustomerModal && (
                  <Modal show={addCustomerModal} onClose={() => setAddCustomerModal(false)}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Customer</h2>
                      <CustomerForm
                        onSuccess={() => {
                          setAddCustomerModal(false)
                          toast.success('Customer created successfully')
                        }}
                      />
                    </motion.div>
                  </Modal>
                )}
              </AnimatePresence>
            </Form>
          )
        }}
      </Formik>
    </AuthenticatedLayout>
  )
}