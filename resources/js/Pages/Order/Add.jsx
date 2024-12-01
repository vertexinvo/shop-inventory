import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaWallet , FaEdit, FaTrash} from 'react-icons/fa'
import { MdClear, MdContentPaste, MdDelete } from 'react-icons/md';
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


 
export default function Add(props) {
  const { auth ,users,items,order_id,taxs ,shippingrates} = props

  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null); 
  
  const [selectedShippingrate, setSelectedShippingrate] = useState(null);

  const [loading3, setLoading3] = useState(false);


  return (
      <AuthenticatedLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Order</h2>}
      >
          <Head title="Order" />
          <Formik enableReinitialize initialValues={{
                name: '',
                email: '',
                phone: '',
                address: '',
                total: 0,
                payable_amount: 0,
                paid_amount: 0,
                method: '',
                cheque_no: '',
                cheque_date: '',
                status : 'completed',
                bank_name: '',
                bank_branch: '',
                bank_account: '',
                online_payment_link: '',
                extra_charges: 0,
                shipping_charges: 0,
                discount: 0,
                tax: 0,
                is_installment: '0',
                installment_amount: 0,
                installment_period: '',
                installment_count: 0,
                installment_start_date: '',
                installment_end_date: '',
                user_id :'',
                items: [],
                tax_id: '',
                shipping_id: '',
        }}
              validationSchema={Yup.object({
                  name: Yup.string().required('Name is required'),
                  email: Yup.string().email('Invalid email address').required('Email is required'),
                  phone: Yup.string()
                    .max(15, 'Phone number must be at most 15 digits')
                    .min(10, 'Phone number must be at least 10 digits')
                    .required('Phone is required'),
                  address: Yup.string().required('Address is required'),
                  total: Yup.number().min(0, 'Total must be a positive number').required('Total is required'),
                  payable_amount: Yup.number()
                    .min(0, 'Payable amount must be a positive number')
                    .required('Payable amount is required'),
                  paid_amount: Yup.number()
                    .min(0, 'Paid amount must be a positive number')
                    .required('Paid amount is required'),
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
                  tax: Yup.number().min(0, 'Tax must be a positive number'),
                  status: Yup.string().oneOf(['pending', 'completed', 'cancelled'], 'Invalid status').required('Status is required'),
                  is_installment: Yup.boolean(),
                  installment_amount: Yup.number().when('is_installment', {
                      is: true,
                      then: scheme => scheme.number().min(0, 'Installment amount must be a positive number').required('Installment amount is required'),
                      otherwise: scheme => scheme.optional()
                    }),
                  
                  installment_period: Yup.string().when('is_installment', {
                    is: true,
                    then: scheme => scheme.string().required('Installment period is required'),
                      otherwise: scheme => scheme.optional()
                  }),
                  installment_count: Yup.number().when('is_installment', {
                    is: true,
                      then: scheme => scheme.number()
                      .min(1, 'Installment count must be at least 1')
                      .required('Installment count is required'),
                      otherwise: scheme => scheme.optional()
                  }),
                  installment_start_date: Yup.date().when('is_installment', {
                    is: true,
                    then: scheme => scheme.date().required('Installment start date is required'),
                    otherwise: scheme => scheme.optional()
                  }),
                  installment_end_date: Yup.date().when('is_installment', {
                    is: true,
                      then: scheme => scheme.date()
                      .min(Yup.ref('installment_start_date'), 'End date must be after start date')
                      .required('Installment end date is required'),
                      otherwise: scheme => scheme.optional()
                  }),
                  items: Yup.array().min(1, 'At least one item is required'),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                router.post(route('supplier.store'), values, {
                  onSuccess: () => {
                      resetForm();
                  },
                  preserveScroll: true,
                  preserveState: true,
                });

              } }
              >
                  {({ isSubmitting, values, errors,setFieldValue, }) => { 
                      
                    
useEffect(() => {
  const totalAmount = values.items.reduce(
    (total, item) => total + item.quantity * item.data.selling_price,
    0
  );
  const discount = parseFloat(values.discount || 0);
  setFieldValue('total', totalAmount);
  // Set the payable amount, factoring in the discount
  setFieldValue('payable_amount', totalAmount - discount);
}, [values.items, values.discount, setFieldValue]);



                      
                      return (
                  <Form>


 <div className='grid grid-cols-3 gap-1'>
        
        {/* col 1 */}
    
            <div className={`w-full ${values.items.length > 0 ? 'col-span-2' : 'col-span-3'}`}>
              
            <div className="font-sans antialiased bg-grey-lightest">


    <div className="w-full bg-grey-lightest">
      <div className="container mx-auto py-3 px-5">
        <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">
       
                      <div className="mb-4">
                      <div className="w-full flex items-center justify-between">
                      <label className="block text-grey-darker text-lg font-bold mb-2" >Order #{order_id}</label>

                      <div className="flex items-center justify-start gap-1 ">
                      <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                          Submit
                      </button>
                      <button  onClick={() => router.visit(route('order.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                          Close
                      </button>
                  </div>
                  </div>


                            <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Customer (Existing)</label>
                            <Select
                              onChange={(e) => {
                                setFieldValue('user_id', e.value);
                                setFieldValue('name', e.name);
                                setFieldValue('email', e.email);
                                setFieldValue('phone', e.phone);
                                setFieldValue('address', e.address);
                              }}
                              onInputChange={(e) => {
                                setLoading(true); // Set loading to true before initiating the search
                                setTimeout(() => {
                                  router.get(
                                    route('order.create'),
                                    { searchuser: e },
                                    {
                                      preserveScroll: true,
                                      preserveState: true,
                                    }
                                  );
                                  setLoading(false); // Turn off loading after the search is triggered
                                }, 1000);
                              }}
                              isSearchable={true}
                              isLoading={loading} // Dynamically set the loading state
                              value={users.find((option) => option.value === values.user_id)}
                              options={users}
                              className="basic-single"
                              classNamePrefix="select"
                            />
    
                        </div>

                        <div className="flex mb-4">
                      
                        <div className="w-1/2 mr-1">
                            <label className="block text-grey-darker text-sm  mb-2" >Customer Name</label>
                            <Field name="name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Customer name" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div className="w-1/2 mr-1">
                            <label className="block text-grey-darker text-sm  mb-2" >Customer Email</label>
                            <Field name="email" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Customer email" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        </div>
                        <div className="flex mb-4">
                      
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >Customer Phone</label>
                          <Field name="phone" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Customer phone" />
                          <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >Customer Address</label>
                          <Field name="address" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Customer address" />
                          <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      </div>

                      
                      <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Status</label>
                      <Field name="status"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" as="select">
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                      </Field>
                      <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Items</label>
                      <Select
                              onChange={(e) => {
                                setSelectedItems(e);
                              }}
                              onInputChange={(e) => {
                                setLoading2(true); // Set loading to true before initiating the search
                                setTimeout(() => {
                                  router.get(
                                    route('order.create'),
                                    { searchitem: e },
                                    {
                                      preserveScroll: true,
                                      preserveState: true,
                                    }
                                  );
                                  setLoading2(false); // Turn off loading after the search is triggered
                                }, 1000);
                              }}
                              isSearchable={true}
                              isLoading={loading2} // Dynamically set the loading state
                              value={items.find((option) => option.value === selectedItems?.value)}
                              options={items}
                              className="basic-single"
                              classNamePrefix="select"
                            />
                        <ErrorMessage name="items" component="div" className="text-red-500 text-xs mt-1" />
                      </div>


                      {selectedItems && (
                        <div className="flex  ">
                        <div className="w-1/2 mr-1">
                            <input type="number" value={selectedItems?.quantity} onChange={(e) => setSelectedItems({ ...selectedItems, quantity: e.target.value })}  placeholder='Enter Quantity' className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" />
                            </div>
                            <div className="w-1/2 mr-1">
                            <button onClick={() =>{
                        
                              if(selectedItems?.quantity > selectedItems?.data?.stock?.quantity){
                                toast.error('Quantity exceeds stock quantity');
                                return
                              }

                              //check if already added check by product id
                              if(values.items.find(item => item.data.id === selectedItems?.data?.id)){
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
                    <thead class="whitespace-nowrap">
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
                  </div>
                </div>
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
            
              <tr class="odd:bg-gray-50">
              <th class="p-4 text-left text-sm font-semibold text-black">
              Stock  Quantity
              </th>
              <td class="p-4 text-sm text-black">
                {selectedItems?.data?.stock?.quantity || 0}
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

                    <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2">Is Installment</label>
                            <div className="flex items-center">
                              <label className="mr-4">
                                <Field name="is_installment" type="radio" value="1" className="mr-2" /> Yes
                              </label>
                              <label>
                                <Field name="is_installment" type="radio" value="0" className="mr-2" /> No
                              </label>
                            </div>
                            <ErrorMessage name="is_installment" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {values.is_installment == '1' && (
                    <>
                        <div className="flex mb-4">
                      
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >	Installment Amount</label>
                          <Field name="installment_amount" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Installment Amount" />
                          <ErrorMessage name="installment_amount" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >Installment Period</label>
                          <Field name="installment_period" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter Installment Period" />
                          <ErrorMessage name="installment_period" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      
                      </div>
                      <div className="flex mb-4">
                      
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >	Installment Start Date</label>
                          <Field name="installment_start_date" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="date" placeholder="Enter Installment Start Date" />
                          <ErrorMessage name="installment_start_date" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" >Installment End Date</label>
                          <Field name="installment_end_date" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="date" placeholder="Enter Installment End Date" />
                          <ErrorMessage name="installment_end_date" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      
                      </div>

                      <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2 " >Installment Count</label>
                          <Field name="installment_count" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="number" placeholder="Enter Installment Count" />
                          <ErrorMessage name="installment_count" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                    </>
                  )}



                  <div className="mb-4">
                  <label className="block text-grey-darker text-sm  mb-2 font-bold" >Select Payment Method</label>
                  <Field name="method"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" as="select">
                      <option value="">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                  </Field>
                  <ErrorMessage name="method" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
             
              
                



                  {values.method === "cheque" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Cheque No (optional)
                          </label>
                          <Field
                            name="cheque_no"
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                            Cheque Date (optional)
                          </label>
                          <Field
                            name="cheque_date"
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                            className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                  <label className="block text-grey-darker text-sm  mb-2 font-bold" >Select Tax</label>
                  <Field
                      name="tax_id"
                      as="select"
                      onChange={(e) => {
                        const selectedTax = taxs.find((tax) => tax.id == e.target.value);
                        console.log(selectedTax);
                        setFieldValue('tax', selectedTax ? selectedTax.cost : ''); // Default to an empty string if no match
                        setFieldValue('tax_id', e.target.value); // Ensure tax_id is updated as well
                      }}
                      className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
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
                  <label className="block text-grey-darker text-sm  mb-2 font-bold" >Select Shipping Cost</label>
                  <Select
                              onChange={(e) => {
                               console.log(e);
                               setSelectedShippingrate(e);
                                setFieldValue('shipping_id', e.value);
                                setFieldValue('shipping_charges', e.fee);
                             
                              }}
                              onInputChange={(e) => {
                                setLoading3(true); // Set loading to true before initiating the search
                                setTimeout(() => {
                                  router.get(
                                    route('order.create'),
                                    { searchshipping: e },
                                    {
                                      preserveScroll: true,
                                      preserveState: true,
                                    }
                                  );
                                  setLoading3(false); // Turn off loading after the search is triggered
                                }, 1000);
                              }}
                              isSearchable={true}
                              isLoading={loading3} // Dynamically set the loading state
                              value={selectedShippingrate }
                              options={shippingrates}
                              className="basic-single"
                              classNamePrefix="select"
                            />
                  <ErrorMessage name="shipping_id" component="div" className="text-red-500 text-xs mt-1" />
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
              
              {values.items.map((record,index) => (
                
        
                
                        <tr   class="odd:bg-gray-50">
              
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
                  {record?.data?.selling_price || 'N/A'}
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
            <li className='w-full flex items-center justify-between mb-2'><div>Total Amount:</div><div><input type="number"  value={values.items.reduce((total, item) => total + item.quantity * item.data.selling_price, 0)} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
            <li className='w-full flex items-center justify-between'><div>Extra Charges:</div><div> <Field type="number" name="extra_charges" value={values.extra_charges} className="appearance-none border rounded 	 py-2 px-3 text-grey-darker"/></div></li>
            <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="extra_charges" component="div" className="text-red-600 text-xs mt-1" /></li>
            <li className='w-full flex items-center justify-between'><div>Discount:</div><div> <Field type="number" name="discount" value={values.discount} className="appearance-none border rounded 	 py-2 px-3 text-grey-darker"/></div></li>
            <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="discount" component="div" className="text-red-600 text-xs mt-1" /></li>
            <li className='w-full flex items-center justify-between mb-2'><div>Tax:</div><div><input type="number" value={values.tax} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
            <li className='w-full flex items-center justify-between mb-2'><div>Shipping Cost:</div><div><input type="number" value={parseFloat(values.shipping_charges || 0).toFixed(2)} className="appearance-none border rounded disabled:bg-gray-200 disabled:hover:bg-gray-200	 py-2 px-3 text-grey-darker" disabled /></div></li>
             <li className="w-full flex items-center justify-between mb-2">
              <div className="font-bold">Grand Total:</div>
              <div>
                <input
                  type="number"
                  value={
                    values.items.reduce(
                      (total, item) => total + item.quantity * item.data.selling_price,
                      0
                    ) +
                    parseFloat(values.extra_charges || 0) +
                    parseFloat(values.tax || 0) +
                    parseFloat(values.shipping_charges || 0) -
                    parseFloat(values.discount || 0)
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
                    value={values.paid_amount || values.payable_amount || 0} // Default to payable_amount if paid_amount is empty
                    onChange={(e) => setFieldValue('paid_amount', e.target.value)} // Update paid_amount when changed
                    className="appearance-none border rounded py-2 px-3 text-grey-darker"
                    />
                </div>
                </li>

        
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
                  )}}
              </Formik>
         
      </AuthenticatedLayout>
  );
}

