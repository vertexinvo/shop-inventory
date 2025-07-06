import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaWallet, FaEdit, FaTrash } from 'react-icons/fa'
import { MdClear, MdContentPaste, MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from '@/Components/Modal';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from "react-icons/md";
import './order.css'
import CustomerForm from '@/Partials/CustomerForm';


export default function Add(props) {
  const { auth, users, items, order_id, taxs, shippingrates, order, default_selected_shippingrate } = props

  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);

  const [selectedShippingrate, setSelectedShippingrate] = useState(default_selected_shippingrate || null);

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



  const [orderItems, setOrderItems] = useState(
    order?.items.map((item) => {
      // Update item?.product.selling_price by item.price
      if (item?.product) {
        item.product.selling_price = item.price; // Update selling_price
      }

      // Return the transformed object
      return {
        value: item.product_id,
        data: item?.product,
        quantity: item.qty,
        label: `${item?.product?.name} - ${item?.product?.model}`,
        price: item.price,
      };
    })
    || []);

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
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">{order ? 'Edit Sale' : 'Add Sale'}</h2>
          </div>
        </div>
      }
    >
      <Head title="Sale" />
      <Formik enableReinitialize initialValues={{
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
        status: order?.status || 'completed',
        bank_name: order?.bank_name || '',
        bank_branch: order?.bank_branch || '',
        bank_account: order?.bank_account || '',
        online_payment_link: order?.online_payment_link || '',
        extra_charges: parseFloat(order?.extra_charges) || 0,
        shipping_charges: parseFloat(order?.shipping_charges) || 0,
        discount: parseFloat(order?.discount) || 0,
        tax: order?.tax_fee || 0,
        is_installment: order?.is_installment === true && '1' || '0',
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
          bill_no: Yup.string(),
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address'),
          phone: Yup.string()
            .max(15, 'Phone number must be at most 15 digits')
            .min(10, 'Phone number must be at least 10 digits')
          ,
          address: Yup.string(),
          total: Yup.number().min(0, 'Total must be a positive number').required('Total is required'),
          payable_amount: Yup.number()
            .min(0, 'Payable amount must be a positive number')
            .required('Payable amount is required'),
          paid_amount: Yup.number()
            .min(0, 'Paid amount must be a positive number'),
          method: Yup.string().required('Payment method is required'),
          cheque_no: Yup.string().when('method', {
            is: 'cheque',
            then: scheme => scheme.required(),
            otherwise: scheme => scheme.optional()
          }),
          cheque_date: Yup.date().when('method', {
            is: 'cheque',
            then: scheme => scheme.required(),
            otherwise: scheme => scheme.optional()
          }),
          bank_name: Yup.string().when('method', {
            is: 'bank',
            then: scheme => scheme.required(),
            otherwise: scheme => scheme.optional()
          }),
          bank_branch: Yup.string().when('method', {
            is: 'bank',
            then: scheme => scheme.required(),
            otherwise: scheme => scheme.optional()
          }),
          bank_account: Yup.string().when('method', {
            is: 'bank',
            then: scheme => scheme.required(),
            otherwise: scheme => scheme.optional()
          }),
          online_payment_link: Yup.string().url('Invalid URL'),
          extra_charges: Yup.number().min(0, 'Extra charges must be a positive number'),
          discount: Yup.number().min(0, 'Discount must be a positive number'),
          // tax: Yup.number().min(0, 'Tax must be a positive number'),
          // status: Yup.string().oneOf(['pending', 'completed', 'cancelled'], 'Invalid status').required('Status is required'),
          // is_installment: Yup.boolean(),
          // installment_amount: Yup.number().when('is_installment', {
          //   is: true,
          //   then: scheme => scheme.min(0, 'Installment amount must be a positive number').required('Installment amount is required'),
          //   otherwise: scheme => scheme.optional()
          // }),


          // installment_period: Yup.string().when('is_installment', {
          //   is: true,
          //   then: scheme => scheme.required('Installment period is required'),
          //   otherwise: scheme => scheme.optional()
          // }),
          // installment_count: Yup.number().when('is_installment', {
          //   is: true,
          //   then: scheme => scheme
          //     .min(1, 'Installment count must be at least 1')
          //     .required('Installment count is required'),
          //   otherwise: scheme => scheme.optional()
          // }),
          // installment_start_date: Yup.date().when('is_installment', {
          //   is: true,
          //   then: scheme => scheme.required('Installment start date is required'),
          //   otherwise: scheme => scheme.optional()
          // }),
          // installment_end_date: Yup.date().when('is_installment', {
          //   is: true,
          //   then: scheme => scheme
          //     .min(Yup.ref('installment_start_date'), 'End date must be after start date')
          //     .required('Installment end date is required'),
          //   otherwise: scheme => scheme.optional()
          // }),
          items: Yup.array().min(1, 'At least one item is required'),
          order_date: Yup.date().required('Order date is required'),
          payment_note: Yup.string().when('method', {
            is: 'partial',
            then: scheme => scheme.required("Payment Note is required"),
            otherwise: scheme => scheme.optional()
          }),
          note: Yup.string(),
          // paid_amount: Yup.number()
          //   .min(0, 'Paid amount must be a positive number')
          //   .required('Paid amount is required'),

        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {

          order ?
            router.put(route('order.update', order.id), values, {
              preserveScroll: true,
              preserveState: true,
            })
            :
            router.post(route('order.store'), values, {
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
            setFieldValue('payable_amount', (totalAmount + parseFloat(values.extra_charges) + parseFloat(values.tax) + parseFloat(values.shipping_charges)) - (discount + parseFloat(values.exchange || 0)));
          }, [values.items, values.discount, setFieldValue, values.exchange, values.extra_charges, values.tax, values.shipping_charges]);



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
          // }, [values.payable_amount, values.tax_id, values.shipping_id]);



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
                                          Stock Quantity
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
                        <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">

                          <div className="mb-4">
                            <div className="w-full flex items-center justify-between">
                              <label className="block text-grey-darker text-lg font-bold mb-2" >Payment</label>


                            </div>



                          </div>

                          {/* <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2">Is Installment</label>
                            <div className="flex items-center">
                              <label className="mr-4">
                                <Field name="is_installment" type="radio" value="1" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> Yes
                              </label>
                              <label>
                                <Field name="is_installment" type="radio" value="0" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> No
                              </label>
                            </div>
                            <ErrorMessage name="is_installment" component="div" className="text-red-500 text-xs mt-1" />
                          </div> */}

                          {values.is_installment == '1' && (
                            <>
                              <div className="flex mb-4">

                                <div className="w-1/2 mr-1">
                                  <label className="block text-grey-darker text-sm  mb-2" >	Installment Amount</label>
                                  <Field name="installment_amount" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Installment Amount" />
                                  <ErrorMessage name="installment_amount" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="w-1/2 mr-1">
                                  <label className="block text-grey-darker text-sm  mb-2" >Installment Period</label>
                                  <Field name="installment_period" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter Installment Period" />
                                  <ErrorMessage name="installment_period" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                              </div>
                              <div className="flex mb-4">

                                <div className="w-1/2 mr-1">
                                  <label className="block text-grey-darker text-sm  mb-2" >	Installment Start Date</label>
                                  <Field name="installment_start_date" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="date" placeholder="Enter Installment Start Date" />
                                  <ErrorMessage name="installment_start_date" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div className="w-1/2 mr-1">
                                  <label className="block text-grey-darker text-sm  mb-2" >Installment End Date</label>
                                  <Field name="installment_end_date" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="date" placeholder="Enter Installment End Date" />
                                  <ErrorMessage name="installment_end_date" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                              </div>

                              <div className="mb-4">
                                <label className="block text-grey-darker text-sm  mb-2 " >Installment Count</label>
                                <Field name="installment_count" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="number" placeholder="Enter Installment Count" />
                                <ErrorMessage name="installment_count" component="div" className="text-red-500 text-xs mt-1" />
                              </div>
                            </>
                          )}



                          <div className="mb-4">
                            <label className="block text-grey-darker text-sm  mb-2 font-bold" >Select Payment Method</label>
                            <Field name="method" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" as="select">
                              <option value="">Select Payment Method</option>
                              <option value="cash">Cash</option>
                              <option value="bank">Bank Transfer</option>
                              <option value="cheque">Cheque</option>
                              <option value="online">Online</option>
                              <option value="partial">Partial</option>
                            </Field>
                            <ErrorMessage name="method" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {values.method === "partial" && (
                            <div className="mb-4">
                              <label className="block text-grey-darker text-sm  mb-2 font-bold" >Payment Note</label>
                              <Field as="textarea" rows="4" name="payment_note" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"></Field>
                              <ErrorMessage name="payment_note" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                          )}






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
                                  Bank Name
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
                                  Brank Brank
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
                                  Bank Account No
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
                                  Online payment link
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
                            <div className="flex gap-4 items-center mb-2">
                              <label className="block text-grey-darker text-sm   font-bold" >Select Tax</label>
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue('tax', '');
                                  setFieldValue('tax_id', '');
                                }}
                                className="text-sm font-semibold text-red-500   underline leading-tight"
                              >
                                Reset
                              </button>
                            </div>
                            <Field
                              name="tax_id"
                              as="select"
                              onChange={(e) => {
                                const selectedTax = taxs.find((tax) => tax.id == e.target.value);
                                console.log(selectedTax);
                                setFieldValue('tax', selectedTax ? selectedTax.cost : ''); // Default to an empty string if no match
                                setFieldValue('tax_id', e.target.value); // Ensure tax_id is updated as well
                              }}
                              className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            >
                              <option value="">Select Tax</option>
                              {taxs.map((tax) => (
                                <option key={tax.id} value={tax.id}>
                                  {tax.name} - {tax.cost}
                                </option>
                              ))}
                            </Field>

                            <ErrorMessage name="tax_id" component="div" className="text-red-500 text-xs mt-1" />
                          </div>


                          <div className="mb-4">
                            <div className="flex gap-4 items-center mb-2">
                              <label className="block  text-sm font-bold" >Select Shipping Cost</label>
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue('shipping_id', '');
                                  setFieldValue('shipping_charges', 0);
                                  setSelectedShippingrate(null);
                                }}
                                className="text-sm font-semibold text-red-500   underline leading-tight"
                              >
                                Reset
                              </button>
                            </div>
                            <Select
                              onChange={(e) => {

                                setSelectedShippingrate(e);
                                setFieldValue('shipping_id', e.value);
                                setFieldValue('shipping_charges', e.fee);

                              }}
                              // onInputChange={(e) => {
                              //   setLoading3(true); // Set loading to true before initiating the search
                              //   setTimeout(() => {
                              //     router.get(
                              //       order ? route('order.edit', order.id) : route('order.create'),
                              //       { searchshipping: e },
                              //       {
                              //         preserveScroll: true,
                              //         preserveState: true,
                              //       }
                              //     );
                              //     setLoading3(false); // Turn off loading after the search is triggered
                              //   }, 1000);
                              // }}
                              isSearchable={true}
                              isLoading={loading3} // Dynamically set the loading state
                              value={selectedShippingrate}
                              options={shippingrates}
                              className="basic-single"
                              classNamePrefix="select"
                              styles={customStyles}
                            />
                            <ErrorMessage name="shipping_id" component="div" className="text-red-500 text-xs mt-1" />
                          </div>


                          <div className="mb-4">
                            <label className="block text-grey-darker text-sm  mb-2 font-bold" >Note</label>
                            <Field as="textarea" rows="4" name="note" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"></Field>
                            <ErrorMessage name="note" component="div" className="text-red-500 text-xs mt-1" />
                          </div>



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
                                          type="text"
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
                                          type="text"
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

