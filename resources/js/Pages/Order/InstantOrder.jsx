import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaWallet, FaEdit, FaTrash, FaPlusCircle, FaCheck, FaCheckCircle } from 'react-icons/fa'
import { MdClear, MdContentPaste, MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { use } from 'react';
import './order.css'
import { MdKeyboardBackspace } from "react-icons/md";
import Modal from '@/Components/Modal';
import CustomerForm from '@/Partials/CustomerForm';


export default function InstantOrder(props) {
  const { auth, users, order_id, items, user } = props

  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);

  const [selectedShippingrate, setSelectedShippingrate] = useState(null);

  const [loading3, setLoading3] = useState(false);

  const [exchangeItems, setExchangeItems] = useState(null);

  const [addCustmerModal, setAddCustomerModal] = useState(false);

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



  return (
    <AuthenticatedLayout
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
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Instant Sale</h2>
          </div>
        </div>
      }
    >
      <Head title="Instant Sale" />
      <Formik enableReinitialize initialValues={{
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
        exchange: 0
      }}
        validationSchema={Yup.object({
          user_id: Yup.string().required('Customer is required'),
          bill_no: Yup.string(),
          status: Yup.string().required('Status is required'),
          name: Yup.string().required('Name is required'),
          email: Yup.string(),
          phone: Yup.string().required('Phone number is required'),
          address: Yup.string(),
          items: Yup.array().min(1, 'At least one item is required'),
          order_date: Yup.date().required('Order date is required'),
          // paid_amount: Yup.number()
          //   .when('payable_amount', {
          //     is: (payable_amount) => payable_amount !== undefined, // Check if payable_amount exists
          //     then: (scheme) =>
          //       scheme
          //         .max(Yup.ref('payable_amount'), 'Paid amount cannot exceed payable amount')
          //         .required('Paid amount is required'),
          //     otherwise: (scheme) => scheme.optional(),
          //   }),

        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // show paid_amount error if paid_amount is less than payable_amount

          router.post(route('order.instantorderstore'), values, {
            onSuccess: () => {
              resetForm();
            },
            preserveScroll: true,
            preserveState: true,
          });

        }}
      >
        {({ isSubmitting, values, errors, setFieldValue, handleSubmit }) => {

          useEffect(() => {
            const totalAmount = values.items.reduce(
              (total, item) => total + item.quantity * item.data.selling_price,
              0
            );
            const discount = parseFloat(values.discount || 0);
            setFieldValue('total', totalAmount);
            setFieldValue('payable_amount', (totalAmount + parseFloat(values.extra_charges || 0)) - (discount + parseFloat(values.exchange || 0)));
          }, [values.items, values.discount, setFieldValue, values.exchange, values.extra_charges, values.exchange_items]);



          const saveAndClose = () => {
            setFieldValue('close', true);
            handleSubmit();
          };

          const save = () => {
            setFieldValue('close', false);
            handleSubmit();
          };

          // useEffect(() => {
          //   if (values.paid_amount === 0 || values.paid_amount < values.payable_amount) {
          //     setFieldValue('paid_amount', values.payable_amount);
          //   }
          // }, [values.payable_amount, values]);

          useEffect(() => {
            if (values.exchange_items.length > 0) {
              const totalAmount = values.exchange_items.reduce(
                (total, item) => total + item.quantity * item.purchase_price,
                0
              );
              setFieldValue('exchange', totalAmount);
            }
          }, [values.exchange_items]);


          return (
            <Form>


              <div className='grid grid-cols-3 gap-1'>

                {/* col 1 */}

                <div className={`w-full ${values.items.length > 0 ? 'col-span-2' : 'col-span-3'}`}>

                  <div className="font-sans antialiased bg-grey-lightest">


                    <div className="w-full bg-grey-lightest">
                      <div className="container mx-auto py-3 px-5">
                        <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">

                          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-5">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                              <label className="block text-grey-darker text-lg font-bold">Order&nbsp;Date</label>
                              <Field
                                name="order_date"
                                type="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-start gap-2 w-full sm:w-auto">
                              <button
                                onClick={save}
                                className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
                                type="button"
                                 disabled={isSubmitting}
                              >
                                Save
                              </button>
                              <button
                                onClick={saveAndClose}
                                className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
                                type="button"
                                 disabled={isSubmitting}
                              >
                                Save & Close
                              </button>
                              <button
                                onClick={() => router.visit(route("order.index"))}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
                                type="button"
                              >
                                Close
                              </button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-grey-darker text-sm  mb-2" >Bill No</label>
                            <Field name="bill_no" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Bill No" />
                            <ErrorMessage name="bill_no" component="div" className="text-red-500 text-xs mt-1" />
                          </div>


                          <div className="mb-4">



                            <div className="flex items-center justify-between mb-2">
                            <label className="block text-grey-darker text-sm " for="shop_name">Select Customer (Existing)</label>
                            <button type="button" className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline" onClick={() => setAddCustomerModal(true)}>Add Customer</button>
                            </div>
                            <Select
                              onChange={(e) => {
                                setFieldValue('user_id', e.value);
                                setFieldValue('name', e.name);
                                setFieldValue('email', e.email);
                                setFieldValue('phone', e.phone);
                                setFieldValue('address', e.address);
                              }}
                              // onInputChange={(e) => {
                              //   setLoading(true); // Set loading to true before initiating the search
                              //   setTimeout(() => {
                              //     router.get(
                              //       route('order.instantorder'),
                              //       { searchuser: e },
                              //       {
                              //         preserveScroll: true,
                              //         preserveState: true,
                              //       }
                              //     );
                              //     setLoading(false); // Turn off loading after the search is triggered
                              //   }, 1000);
                              // }}
                              isSearchable={true}
                              isLoading={loading} // Dynamically set the loading state
                              value={users.find((option) => option.value === values.user_id)}
                              options={users}
                              className="basic-single "
                              classNamePrefix="select "
                              styles={customStyles}
                            />
                            <ErrorMessage name="user_id" component="div" className="text-red-500 text-xs mt-1" />

                          </div>

                          <div className="flex mb-4">

                            <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm  mb-2" >Customer Name</label>
                              <Field name="name" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Customer name" />
                              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm  mb-2" >Customer Email</label>
                              <Field name="email" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Customer email" />
                              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>
                          <div className="flex mb-4">

                            <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm  mb-2" >Customer Phone</label>
                              <Field name="phone" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Customer phone" />
                              <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm  mb-2" >Customer Address</label>
                              <Field name="address" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Customer address" />
                              <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Status</label>
                            <Field as="select" name="status" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker">

                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancel">Cancelled</option>
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                                        <label className="block text-grey-darker text-sm" for="shop_name">Select Items</label>
                                                        <div className="flex items-center gap-2">
                                                           <a 
                                                              href={route('product.create')}
                                                              className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                                              target="_blank"
                                                            >
                                                              Add New Item
                                                            </a>
                                                         <button 
                                                              type="button" 
                                                              className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline"
                                                              onClick={() => {
                                                                router.reload({
                                                                  only: ['items'], // specify which props to refresh
                                                                })
                                                              }}
                                                            >
                                                              Refresh
                                                            </button>
                                                        </div>
                                                        
                                                      </div>
                            <Select
                              onChange={(e) => {
                                setSelectedItems(e);
                              }}
                              // onInputChange={(e) => {
                              //   setLoading2(true); // Set loading to true before initiating the search
                              //   setTimeout(() => {
                              //     router.get(
                              //       route('order.instantorder'),
                              //       { searchitem: e, searchid: user?.id || '' },
                              //       {
                              //         preserveScroll: true,
                              //         preserveState: true,
                              //       }
                              //     );
                              //     setLoading2(false); // Turn off loading after the search is triggered
                              //   }, 1000);
                              // }}
                              isSearchable={true}
                              isLoading={loading2} // Dynamically set the loading state
                              value={items.find((option) => option.value === selectedItems?.value)}
                              options={items}
                              className="basic-single"
                              classNamePrefix="select"
                              styles={customStyles}
                            />
                            <ErrorMessage name="items" component="div" className="text-red-500 text-xs mt-1" />
                          </div>


                          {selectedItems && (
                            <div className="flex  ">
                              <div className="w-1/2 mr-1">
                                <input type="number" value={selectedItems?.quantity} onChange={(e) => setSelectedItems({ ...selectedItems, quantity: e.target.value })} placeholder='Enter Quantity' className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" />
                              </div>
                              <div className="w-1/2 mr-1">
                                <button onClick={() => {

                                  if (selectedItems?.quantity > selectedItems?.data?.stock?.quantity) {
                                    toast.error('Quantity exceeds stock quantity');
                                    return
                                  }

                                  //check if already added check by product id
                                  if (values.items.find(item => item.data.id === selectedItems?.data?.id)) {
                                    toast.error('Item already added');
                                    return
                                  }

                                  if (selectedItems?.quantity <= 0) {
                                    toast.error('Quantity must be greater than 0');
                                    return;
                                  }

                                  setSelectedItems(null)
                                  setFieldValue('items', [...values.items, selectedItems]);
                                  console.log(values.items);
                                }} className="bg-black text-sm hover:bg-blue-dark text-white font-bold py-[11px] px-4  rounded-lg" type="button">
                                  Add Item
                                </button>
                              </div>
                            </div>
                          )}

                          {selectedItems && (
                            <div className='my-5'>


                              <div className="">
                                <div class="font-[sans-serif] ">
                                  <table class="min-w-full bg-white">

                                    <thead className={`${selectedItems?.data?.stock?.quantity == 0 ? 'bg-red-100 border border-red-200' : ''} "whitespace-nowrap  "`}>
                                      <tr class="odd:bg-gray-50">

                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Product Info
                                        </th>
                                        <td class=" text-sm">
                                          <div class="flex items-center cursor-pointer w-max">
                                            {/* <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" /> */}
                                            <div class="ml-4 ">
                                              <p class="text-sm text-black ">Name : {selectedItems?.data?.name}</p>
                                              {selectedItems?.data?.model && <p class="text-xs text-gray-500 mt-0.5">Model :{selectedItems?.data?.model} </p>}
                                              {selectedItems?.data?.identity_type !== 'none' && <p class="text-xs text-gray-500 mt-0.5">{selectedItems?.data?.identity_type}:{selectedItems?.data?.identity_value} </p>}
                                              <a  href={route("product.show", selectedItems?.data?.code || selectedItems?.data?.id)} target='_blank' className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline" >View Item</a>
                                     
                                            </div>
                                          </div>
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Purchase ID
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.code || selectedItems?.data?.id}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Purchase price
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.purchase_price || 'N/A'}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Selling price
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.selling_price || 'N/A'}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Supplier
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.supplier_name || 'N/A'}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Brands
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.brands.map((brand) => brand.name).join(', ') || 'N/A'}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Categories
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.categories.map((category) => category.name).join(', ') || 'N/A'}
                                        </td>
                                      </tr>


                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Warranty period
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.is_warranty == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                                          {selectedItems?.data?.is_warranty == '1' && (<p class="text-xs text-gray-500 mt-0.5">{selectedItems?.data?.warranty_period} - {selectedItems?.data?.warranty_type} </p>)}
                                        </td>
                                      </tr>
                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Is Borrow
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.is_borrow == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                                          {selectedItems?.data?.is_borrow == '1' && (<p class="text-xs text-gray-500 mt-0.5">
                                            <ul class="list-disc">
                                              {selectedItems?.data?.shop_name && <li>Name: {selectedItems?.data?.shop_name}</li>}
                                              {selectedItems?.data?.shop_address && <li>Address: {selectedItems?.data?.shop_address}</li>}
                                              {selectedItems?.data?.shop_phone && <li>Phone: {selectedItems?.data?.shop_phone}</li>}
                                              {selectedItems?.data?.shop_email && <li>Email: {selectedItems?.data?.shop_email}</li>}
                                            </ul>
                                          </p>)}
                                        </td>
                                      </tr>

                                      <tr className={`${selectedItems?.data?.stock?.quantity == 0 ? 'bg-red-100' : ''}`}>

                                        {/* <tr class="odd:bg-gray-50"> */}
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Stock  Quantity
                                        </th>
                                        <td class="p-4 text-sm text-black flex items-center justify-between">
                                         <span> {selectedItems?.data?.stock?.quantity || 0} </span>   
                                         <a  href={route('stock.index',{ product_id: selectedItems?.data?.id})} target='_blank' className="text-cyan-600 text-sm font-medium hover:text-cyan-800 transition underline" >Manage Stock</a>
                          
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Stock Status
                                        </th>
                                        <td class="p-4">
                                          {selectedItems?.data?.stock?.status ? <p class="text-xs text-gray-500 mt-0.5">Available</p> : <p class="text-xs text-gray-500 mt-0.5">Not Available</p>}
                                        </td>
                                      </tr>

                                      <tr class="odd:bg-gray-50">
                                        <th class="p-4 text-left text-sm font-semibold text-black">
                                          Supplier Invoice
                                        </th>
                                        <td class="p-4 text-sm text-black">
                                          {selectedItems?.data?.is_supplier == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                                          {selectedItems?.data?.is_supplier == '1' && (<p class="text-xs text-gray-500 mt-0.5">{selectedItems?.data?.supplier_invoice_no}</p>)}
                                        </td>

                                      </tr>
                                    </thead>


                                  </table>

                                </div>

                              </div>


                            </div>

                          )}




                        </div>

                      </div>
                    </div>
                  </div>






                  <div className="font-sans antialiased bg-grey-lightest">


                    <div className="w-full bg-grey-lightest">
                      <div className="container mx-auto py-3 px-5">
                        <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-4 sm:p-6 lg:p-10">
                          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <label className="block text-grey-darker text-base sm:text-lg font-bold mb-2 sm:mb-0">Exchange</label>
                            {values.exchange_items.length > 0 && exchangeItems === null && (
                              <button
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
                                  });
                                }}
                                className="text-sm font-semibold text-black   underline leading-tight"
                              >
                                Add Item
                              </button>
                            )}
                          </div>

                          <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-left table-auto">
                                <thead>
                                  <tr>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Name</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Model</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Identity*</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Purchase Price*</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Quantity*</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50">
                                      <p className="text-xs sm:text-sm font-normal text-slate-500">Total</p>
                                    </th>
                                    <th className="p-2 sm:p-4 border-b border-slate-300 bg-slate-50"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {values.exchange_items.length === 0 && exchangeItems === null && (
                                    <tr className="hover:bg-slate-50">
                                      <td colSpan="7" className="p-4 border-b border-slate-200 text-center">
                                        <p className="text-sm text-slate-800">
                                          No Exchange Item! &nbsp;
                                          <button
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
                                              });
                                            }}
                                            className="text-sm font-semibold text-black   underline"
                                          >
                                            Add Item
                                          </button>
                                        </p>
                                      </td>
                                    </tr>
                                  )}

                                  {exchangeItems && (
                                    <tr className="hover:bg-slate-50">
                                      {/* Fields */}
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <input
                                          type="text"
                                          value={exchangeItems.name}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, name: e.target.value })}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        />
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <input
                                          type="text"
                                          value={exchangeItems.model}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, model: e.target.value })}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        />
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                                        <select
                                          value={exchangeItems.identity_type}
                                          onChange={(e) => setExchangeItems({ ...exchangeItems, identity_type: e.target.value })}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full sm:w-auto p-2.5"
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                          />
                                        )}
                                      </td>
                                      {/* Purchase Price */}
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <input
                                          type="number"
                                          value={exchangeItems.purchase_price}
                                          onChange={(e) => {
                                            const newPurchasePrice = e.target.value;
                                            setExchangeItems({
                                              ...exchangeItems,
                                              purchase_price: newPurchasePrice,
                                              total: newPurchasePrice * exchangeItems.quantity,
                                            });
                                          }}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        />
                                      </td>
                                      {/* Quantity */}
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <input
                                          type="number"
                                          value={exchangeItems.quantity}
                                          onChange={(e) => {
                                            const newQuantity = e.target.value;
                                            setExchangeItems({
                                              ...exchangeItems,
                                              quantity: newQuantity,
                                              total: newQuantity * exchangeItems.purchase_price,
                                            });
                                          }}
                                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        />
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <input
                                          type="number"
                                          disabled
                                          value={exchangeItems.total}
                                          className="bg-gray-200 border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                                        />
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200 flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              exchangeItems.name !== '' &&
                                              exchangeItems.purchase_price !== '' &&
                                              exchangeItems.identity_type !== '' &&
                                              exchangeItems.quantity !== '' &&
                                              exchangeItems.total !== ''
                                            ) {
                                              setFieldValue('exchange_items', [...values.exchange_items, exchangeItems]);
                                              setExchangeItems(null);
                                            } else {
                                              toast.error('Please fill in all required fields');
                                            }
                                          }}
                                          className="text-xs sm:text-sm font-semibold text-black   underline"
                                        >
                                          Add
                                        </button>
                                        &nbsp;
                                        <button
                                          type="button"
                                          onClick={() => setExchangeItems(null)}
                                          className="text-xs sm:text-sm font-semibold text-black   underline"
                                        >
                                          Cancel
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                  {/* Render Existing Items */}
                                  {values.exchange_items.map((exchange_item) => (
                                    <tr className="hover:bg-slate-50">
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">{exchange_item.name}</p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">{exchange_item.model || <span className="text-red-500">N/A</span>}</p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">
                                          {exchange_item.identity_type}
                                          {exchange_item.identity_value !== '' && ` : ${exchange_item.identity_value}`}
                                        </p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">{exchange_item.purchase_price}</p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">{exchange_item.quantity}</p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <p className="text-xs sm:text-sm text-slate-800">{exchange_item.total}</p>
                                      </td>
                                      <td className="p-2 sm:p-4 border-b border-slate-200">
                                        <FaTrash
                                          size={20}
                                          color="red"
                                          className="cursor-pointer"
                                          onClick={() => {
                                            const updatedExchangeItems = values.exchange_items.filter((item) => item !== exchange_item);
                                            setFieldValue('exchange_items', updatedExchangeItems);

                                            const totalAmount = updatedExchangeItems.reduce((total, item) => total + item.quantity * item.purchase_price, 0);
                                            setFieldValue('exchange', totalAmount);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>



                </div>

                {values.items.length > 0 && (


                  <div className="w-full col-span-1">

                    <div className="font-sans antialiased bg-grey-lightest">


                      <div className="w-full bg-grey-lightest">
                        <div className="container mx-auto py-3 px-5">
                          <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">
                            {values.items.length > 0 && (
                              <div className='mb-2'>

                                <div className='w-full flex items-center justify-between mb-2'>
                                  <label className="block text-grey-darker text-lg font-bold " >Cart</label>
                                  <MdClear size={25} onClick={() => setFieldValue('items', [])} />
                                </div>

                                <div className="overflow-x-auto">
                                  <div class="font-[sans-serif] overflow-x-auto">
                                    <table class="min-w-full bg-white">
                                      <thead class="whitespace-nowrap">
                                        <tr>

                                          <th class="p-4 text-left text-sm font-semibold text-black">
                                            Product Info
                                          </th>


                                          <th class="p-4 text-left text-sm font-semibold text-black">
                                            price
                                          </th>

                                          <th class="p-4 text-left text-sm font-semibold text-black">
                                            Qty
                                          </th>

                                          <th class="p-4 text-left text-sm font-semibold text-black">
                                            Total
                                          </th>
                                          <th class="p-4 text-left text-sm font-semibold text-black">

                                          </th>

                                        </tr>
                                      </thead>

                                      <tbody class="whitespace-nowrap">

                                        {values.items.map((record, index) => (



                                          <tr class="odd:bg-gray-50">

                                            <td class=" text-sm">
                                              <div class="flex items-center cursor-pointer w-max">
                                                {/* <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" /> */}
                                                <div class="ml-4 ">
                                                  <p class="text-sm text-black ">Name : {record?.data?.name}</p>
                                                  {record?.data?.model && <p class="text-xs text-gray-500 mt-0.5">Model :{record?.data?.model} </p>}
                                                  {record?.data?.identity_type !== 'none' && <p class="text-xs text-gray-500 mt-0.5">{record?.data?.identity_type}:{record?.data?.identity_value} </p>}
                                                </div>
                                              </div>
                                            </td>


                                            <td class="p-4 text-sm text-black">
                                              <input type="number" name="selling_price" value={record?.data?.selling_price} className="appearance-none border rounded w-[100px] py-2 px-3 text-grey-darker"
                                                min={0}
                                                onChange={(e) => {
                                                  setFieldValue(`items.${index}.data.selling_price`, e.target.value || 0);
                                                }}
                                              />
                                            </td>


                                            <td class="p-4 text-sm text-black">
                                              <input type="number" name="quantity" value={record?.quantity} className="appearance-none border rounded w-[60px] py-2 px-3 text-grey-darker"
                                                max={record?.data?.stock?.quantity || 0}
                                                onChange={(e) => {
                                                  const value = Number(e.target.value);
                                                  if (value > record?.data?.stock?.quantity) {
                                                    toast.error('Quantity exceeds stock quantity');
                                                    return;
                                                  }
                                                  if (value <= 0) {
                                                    toast.error('Quantity must be greater than 0');
                                                    return;
                                                  }
                                                  setFieldValue(`items.${index}.quantity`, Math.min(value, record?.data?.stock?.quantity || 0));
                                                }}
                                              />
                                            </td>

                                            <td class="p-4 text-sm text-black">
                                              {record?.quantity * record?.data?.selling_price || 0}
                                            </td>
                                            <td class="p-4 text-sm text-black">
                                              <FaTrash color='red' className='cursor-pointer hover:scale-110' onClick={() => {

                                                setFieldValue('items', values.items.filter((item) => item.data.id !== record.data.id));
                                              }} />
                                            </td>



                                          </tr>

                                        ))}

                                      </tbody>
                                    </table>

                                  </div>

                                </div>


                              </div>

                            )}
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="font-sans antialiased bg-grey-lightest">


                      <div className="w-full bg-grey-lightest">
                        <div className="container mx-auto py-3 px-5">
                          <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">
                            {values.items.length > 0 && (
                              <div className='mb-2'>

                                <div className='w-full flex items-center justify-between mb-2'>
                                  <label className="block text-grey-darker text-lg font-bold " >Calculation</label>

                                </div>

                                <ul className='mt-5'>
                                  <li className='w-full flex items-center justify-between mb-2'><div>Total Amount:</div><div><input type="number" value={values.items.reduce((total, item) => total + item.quantity * item.data.selling_price, 0)} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
                                  <li className='w-full flex items-center justify-between'><div>Extra Charges:</div><div> <Field type="number" name="extra_charges" value={values.extra_charges} className="appearance-none border rounded 	 py-2 px-3 text-grey-darker" /></div></li>
                                  <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="extra_charges" component="div" className="text-red-600 text-xs mt-1" /></li>
                                  <li className='w-full flex items-center justify-between'><div>Discount:</div><div> <Field type="number" name="discount" value={values.discount} className="appearance-none border rounded 	 py-2 px-3 text-grey-darker" /></div></li>
                                  <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="discount" component="div" className="text-red-600 text-xs mt-1" /></li>
                                  <li className='w-full flex items-center justify-between mb-2'><div>Exchange:</div><div> <Field type="number" disabled name="exchange" value={values.exchange} className="appearance-none border rounded disabled:bg-gray-200	 py-2 px-3 text-grey-darker" /></div></li>

                                  <li className='w-full flex items-center justify-between mb-2'><div>Tax:</div><div><input type="number" value={values.tax} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
                                  <li className='w-full flex items-center justify-between mb-2'><div>Shipping Cost:</div><div><input type="number" value={parseFloat(values.shipping_charges || 0).toFixed(2)} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
                                  <li className="w-full flex items-center justify-between mb-2">
                                    <div className="font-bold">Grand Total:</div>
                                    <div>
                                      <input
                                        type="number"
                                        value={
                                          (values.items.reduce(
                                            (total, item) => total + item.quantity * item.data.selling_price,
                                            0
                                          ) +
                                            (parseFloat(values.extra_charges || 0) +
                                              parseFloat(values.tax || 0) +
                                              parseFloat(values.shipping_charges || 0))) -
                                          (parseFloat(values.exchange || 0) + parseFloat(values.discount || 0))
                                        }
                                        className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200 py-2 px-3 text-grey-darker"
                                        disabled
                                      />
                                    </div>
                                  </li>
                                  <li className="w-full flex items-center justify-between">
                                    <div>Paid Amount:</div>
                                    <div>
                                      <Field
                                        type="number"
                                        name="paid_amount"
                                        step="0.01"
                                        className="appearance-none border rounded py-2 px-3 text-grey-darker"
                                      />
                                    </div>
                                  </li>
                                  <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="paid_amount" component="div" className="text-red-600 text-xs mt-1" /></li>



                                </ul>



                              </div>

                            )}
                          </div>

                        </div>
                      </div>
                    </div>


                  </div>

                )}


              </div>


            </Form>
          )
        }}
      </Formik>


          <Modal show={addCustmerModal} onClose={() => setAddCustomerModal(false)}>
              <div className="overflow-y-auto max-h-[80vh]">
                <div className="flex justify-center p-10">
                  <div className="text-2xl font-medium text-[#5d596c] ">
                    Create Customer
                  </div>
                </div>
      
                <div className="px-10 mb-5">
                          <CustomerForm  />
                </div>
              </div>
            </Modal>

    </AuthenticatedLayout>
  );
}

