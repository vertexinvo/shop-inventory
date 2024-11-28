import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useState } from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
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
  const { auth ,users,items,order_id } = props

  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null); 

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
                is_installment: false,
                installment_amount: 0,
                installment_period: '',
                installment_count: 0,
                installment_start_date: '',
                installment_end_date: '',
                user_id :'',
                items: [],
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
                  shipping_charges: Yup.number().min(0, 'Shipping charges must be a positive number'),
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
                      
                      const generateCode =  () => {
                          router.post(route('supplier.generatecode'),{}, {
                            onSuccess: (response) => {
                                setFieldValue('code', code);
                            },
                            preserveScroll: true,
                            preserveState: true
                        });
                      }
                      
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
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Payment Method</label>
                      <Field name="method"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" as="select">
                          <option value="">Select Payment Method</option>
                          <option value="cash">Cash</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="online">Online</option>
                      </Field>
                      <ErrorMessage name="method" component="div" className="text-red-500 text-xs mt-1" />
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
                Purchase price
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                Selling price
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                Warranty period
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                Is Borrow
                </th>
  
                <th class="p-4 text-left text-sm font-semibold text-black">
                Stock  Quantity
                </th>
              
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Stock Status
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Supplier Invoice
                </th>
                          
                        </tr>
                      </thead>
              
                      <tbody class="whitespace-nowrap">
              
              {values.items.map((record) => (
                
        
                
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
                  {record?.data?.purchase_price || 'N/A'}
                </td>
                <td class="p-4 text-sm text-black">
                  {record?.data?.selling_price || 'N/A'}
                </td>
                <td class="p-4 text-sm text-black">
                  {record?.data?.is_warranty == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                  {record?.data?.is_warranty == '1' && (<p class="text-xs text-gray-500 mt-0.5">{record?.data?.warranty_period} - {record?.data?.warranty_type} </p>)}
                </td>
                <td class="p-4 text-sm text-black">
                {record?.data?.is_borrow == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                {record?.data?.is_borrow == '1' && (<p class="text-xs text-gray-500 mt-0.5">
                  <ul class="list-disc">
                    {record?.data?.shop_name && <li>Name: {record?.data?.shop_name}</li>}
                    {record?.data?.shop_address && <li>Address: {record?.data?.shop_address}</li>}
                    {record?.data?.shop_phone && <li>Phone: {record?.data?.shop_phone}</li>}
                    {record?.data?.shop_email && <li>Email: {record?.data?.shop_email}</li>}
                  </ul>
                </p>)}
                </td>
                <td class="p-4 text-sm text-black">
                  {record?.data?.stock?.quantity || 0}
                </td>
              
                <td class="p-4">
                  {record?.data?.stock?.status ? <p class="text-xs text-gray-500 mt-0.5">Available</p> : <p class="text-xs text-gray-500 mt-0.5">Not Available</p>}
                </td>
  
                <td class="p-4 text-sm text-black">
                  {record?.data?.is_supplier == '0' && <p class="text-xs text-gray-500 mt-0.5">No</p>}
                  {record?.data?.is_supplier == '1' && (<p class="text-xs text-gray-500 mt-0.5">{record?.data?.supplier_invoice_no}</p>)}
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
  
              
              </div>
)}


  </div>

  
  </Form>
                  )}}
              </Formik>
         
      </AuthenticatedLayout>
  );
}

