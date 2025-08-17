import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import { FaWallet, FaEdit, FaTrash, FaPlusCircle, FaCheckCircle } from 'react-icons/fa'
import { MdClear, MdKeyboardBackspace, MdExpandMore, MdExpandLess } from 'react-icons/md'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import * as Yup from 'yup'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Modal from '@/Components/Modal'
import CustomerForm from '@/Partials/CustomerForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstantOrder(props) {
  const { auth, users, order_id, items, user } = props

  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [selectedItems, setSelectedItems] = useState(null)
  const [exchangeItems, setExchangeItems] = useState(null)
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [showCustomerSection, setShowCustomerSection] = useState(true)
  const [showItemsSection, setShowItemsSection] = useState(true)
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

  const handleAddItem = (values, setFieldValue) => {
    if (selectedItems?.quantity > selectedItems?.data?.stock?.quantity) {
      toast.error('Quantity exceeds available stock')
      return
    }
    if (values.items.find(item => item.data.id === selectedItems?.data?.id)) {
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
              onClick={() => router.visit(route("order.index"))}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              type="button"
            >
              Cancel
            </motion.button>
          </div>
        
      }
    >
      <Head title="Instant Sale" />
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={{
          bill_no: '',
          status: 'pending',
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || '',
          total: 0,
          payable_amount: 0,
          paid_amount: 0,
          user_id: user?.id || '',
          discount: 0,
          items: [],
          order_date: new Date().toISOString().slice(0, 10),
          close: false,
          exchange_items: [],
          exchange: 0,
          extra_charges: 0,
          tax: 0,
          shipping_charges: 0
        }}
        validationSchema={Yup.object({
          user_id: Yup.string().required('Please select a customer'),
          bill_no: Yup.string().required('Bill number is required').max(255, 'Bill number must be 255 characters or less'),
          status: Yup.string().required('Status is required'),
          name: Yup.string().required('Customer name is required'),
          email: Yup.string().email('Invalid email format'),
          phone: Yup.string().required('Phone number is required').matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
          address: Yup.string(),
          items: Yup.array().min(1, 'At least one item is required'),
          order_date: Yup.date().required('Order date is required'),
          paid_amount: Yup.number().min(0, 'Paid amount cannot be negative'),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true)
          router.post(route('order.instantorderstore'), values, {
            onSuccess: () => {
              resetForm()
              toast.success('Order saved successfully')
            },
            onError: () => {
              toast.error('Failed to save order. Please try again.')
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
            setFieldValue('payable_amount', (totalAmount + parseFloat(values.extra_charges || 0)) - (discount + parseFloat(values.exchange || 0)))
          }, [values.items, values.discount, values.extra_charges, values.exchange])

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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
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
                                      href={route("product.show", selectedItems?.data?.code || selectedItems?.data?.id)}
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
                                    <p className="text-gray-900">{selectedItems?.data?.brands.map((brand) => brand.name).join(', ') || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-700">Categories</p>
                                    <p className="text-gray-900">{selectedItems?.data?.categories.map((category) => category.name).join(', ') || 'N/A'}</p>
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
                            value={
                              ((values.items.reduce(
                                (total, item) => total + item.quantity * item.data.selling_price,
                                0
                              ) +
                                parseFloat(values.extra_charges || 0) +
                                parseFloat(values.tax || 0) +
                                parseFloat(values.shipping_charges || 0)) -
                                (parseFloat(values.exchange || 0) + parseFloat(values.discount || 0))).toFixed(2)
                            }
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
                      <CustomerForm onSuccess={() => {
                        setAddCustomerModal(false)
                        toast.success('Customer created successfully')
                      }} />
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