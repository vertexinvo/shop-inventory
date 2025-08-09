import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit, FaUniversity, FaCreditCard, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa'
import { MdDelete, MdKeyboardBackspace, MdAccountBalance, MdNumbers } from 'react-icons/md'
import { GiTwoCoins } from 'react-icons/gi'
import { BiHash } from 'react-icons/bi'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import * as Yup from 'yup'
import Select from 'react-select'

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Bank name is required')
    .min(2, 'Bank name must be at least 2 characters'),
  account_number: Yup.string()
    .required('Account number is required'),
  account_type: Yup.string()
    .required('Account type is required'),
  current_balance: Yup.number()
    .min(0, 'Balance cannot be negative')
    .required('Current balance is required'),
  iban: Yup.string().nullable()
    .matches(/^[A-Z]{2}\d{2}[A-Z0-9]+$/, 'Invalid IBAN format'),
  swift_code: Yup.string().nullable()
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'Invalid SWIFT code format'),
  routing_number: Yup.string().nullable(),
  bank_phone: Yup.string().nullable()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  bank_email: Yup.string().nullable()
    .email('Invalid email format'),
  bank_website: Yup.string().nullable()
    .url('Invalid website URL'),
})

// Account type options
const accountTypeOptions = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'business', label: 'Business Account' },
  { value: 'credit', label: 'Credit Account' },
  { value: 'investment', label: 'Investment Account' },
]

// Status options
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },

]

// Custom form field component
const FormField = ({ 
  icon: Icon, 
  label, 
  name, 
  type = "text", 
  placeholder, 
  required = false,
  isTextarea = false,
  rows = 3,
  ...props 
}) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Icon className="text-gray-500 text-lg" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {isTextarea ? (
        <Field
          as="textarea"
          name={name}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 resize-none bg-gray-50 focus:bg-white"
          {...props}
        />
      ) : (
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-gray-50 focus:bg-white"
          {...props}
        />
      )}
    </div>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 ml-1" />
  </div>
)

// Custom select field component
const SelectField = ({ icon: Icon, label, name, options, required = false }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Icon className="text-gray-500 text-lg" />
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <Field name={name}>
      {({ field, form }) => (
        <Select
          options={options}
          value={options.find(option => option.value === field.value)}
          onChange={(option) => form.setFieldValue(name, option.value)}
          placeholder={`Select ${label.toLowerCase()}...`}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (provided, state) => ({
              ...provided,
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '6px 8px',
              backgroundColor: '#f9fafb',
              borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
              boxShadow: 'none',
              '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
              },
            }),
            placeholder: (provided) => ({
              ...provided,
              color: '#9ca3af',
            }),
          }}
        />
      )}
    </Field>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1 ml-1" />
  </div>
)

// Bank form component
const BankForm = (props) => {
    const { bank } = props
  const initialValues = {
    name: bank ? bank.name : '',
    account_number: bank ? bank.account_number : '',
    account_type: bank ? bank.account_type : '',
    current_balance:  bank ? bank.current_balance : 0,
    iban: bank ? bank.iban : '',
    swift_code: bank ? bank.swift_code : '',
    routing_number: bank ? bank.routing_number : '',
    bank_address: bank ? bank.bank_address : '',
    bank_phone: bank ? bank.bank_phone : '',
    bank_email: bank ? bank.bank_email : '',
    bank_website: bank ? bank.bank_website : '',
    notes: bank ? bank.notes : '',
    status: bank ? bank.status : 'active',
  }

  const handleSubmit = (values, { setSubmitting }) => {
   bank ? router.put(route('bank.update', bank.id), values) : router.post(route('bank.store'), values, {
      onFinish: () => setSubmitting(false),
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FaUniversity className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{bank ? 'Edit Bank Account' : 'Add New Bank Account'}</h3>
            <p className="text-blue-100 mt-1">Manage your bank accounts</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FaUniversity className="text-blue-600 text-xl" />
                <h4 className="text-xl font-semibold text-gray-800">Basic Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={FaUniversity}
                  label="Bank Name"
                  name="name"
                  placeholder="Enter bank name"
                  required
                />
                
                <FormField
                  icon={GiTwoCoins}
                  label="Current Balance"
                  name="current_balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FaCreditCard className="text-green-600 text-xl" />
                <h4 className="text-xl font-semibold text-gray-800">Account Details</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={MdAccountBalance}
                  label="Account Number"
                  name="account_number"
                  placeholder="Enter account number"
                  required
                />
                
                <SelectField
                  icon={FaCreditCard}
                  label="Account Type"
                  name="account_type"
                  options={accountTypeOptions}
                  required
                />
                
                <FormField
                  icon={BiHash}
                  label="IBAN"
                  name="iban"
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                />
                
                <FormField
                  icon={MdNumbers}
                  label="SWIFT Code"
                  name="swift_code"
                  placeholder="NWBKGB2L"
                />
                
                <FormField
                  icon={MdNumbers}
                  label="Routing Number"
                  name="routing_number"
                  placeholder="Enter routing number"
                />
                
                <SelectField
                  icon={FaEdit}
                  label="Status"
                  name="status"
                  options={statusOptions}
                />
              </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FaMapMarkerAlt className="text-red-600 text-xl" />
                <h4 className="text-xl font-semibold text-gray-800">Bank Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  icon={FaMapMarkerAlt}
                  label="Bank Address"
                  name="bank_address"
                  placeholder="Enter bank address"
                  isTextarea
                  rows={3}
                />
                
                <div className="space-y-6">
                  <FormField
                    icon={FaPhone}
                    label="Bank Phone"
                    name="bank_phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                  
                  <FormField
                    icon={FaEnvelope}
                    label="Bank Email"
                    name="bank_email"
                    type="email"
                    placeholder="contact@bank.com"
                  />
                  
                  <FormField
                    icon={FaGlobe}
                    label="Bank Website"
                    name="bank_website"
                    type="url"
                    placeholder="https://www.bank.com"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <FaFileAlt className="text-purple-600 text-xl" />
                <h4 className="text-xl font-semibold text-gray-800">Additional Information</h4>
              </div>
              
              <FormField
                icon={FaFileAlt}
                label="Notes"
                name="notes"
                placeholder="Enter any additional notes or comments..."
                isTextarea
                rows={4}
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {bank ? 'Updating' : 'Creating'}...
                  </>
                ) : (
                  <>
                    <FaUniversity className="text-lg" />
                  {bank ? 'Update' : 'Create'}  Bank Account
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MdKeyboardBackspace className="text-lg" />
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BankForm