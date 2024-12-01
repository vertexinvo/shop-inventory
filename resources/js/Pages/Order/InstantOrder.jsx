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


 
export default function InstantOrder(props) {
  const { auth ,users,order_id,items} = props

  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null); 
  
  const [selectedShippingrate, setSelectedShippingrate] = useState(null);

  const [loading3, setLoading3] = useState(false);


  return (
      <AuthenticatedLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Instant Order</h2>}
      >
          <Head title="Instant Order" />
          <Formik enableReinitialize initialValues={{
                name: '',
                email: '',
                phone: '',
                address: '',
                total: 0,
                payable_amount: 0,
                paid_amount: 0,
                identity_value: '',
                discount: 0,
                items: [],
            }}
              validationSchema={Yup.object({
                  identity_value: Yup.string().required('Identity value is required'),
                  name: Yup.string().required('Name is required'),
                  email: Yup.string(),
                  phone: Yup.string(),
                  address: Yup.string(),
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
                                    route('order.instantorder'),
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
                      <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Select Items</label>
                      <Select
                              onChange={(e) => {
                                setSelectedItems(e);
                              }}
                              onInputChange={(e) => {
                                setLoading2(true); // Set loading to true before initiating the search
                                setTimeout(() => {
                                  router.get(
                                    route('order.instantorder'),
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
           <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="extra_charges" component="div" className="text-red-600 text-xs mt-1" /></li>
            <li className='w-full flex items-center justify-between'><div>Discount:</div><div> <Field type="number" name="discount" value={values.discount} className="appearance-none border rounded 	 py-2 px-3 text-grey-darker"/></div></li>
            <li className='w-full flex items-center justify-between mb-2'><ErrorMessage name="discount" component="div" className="text-red-600 text-xs mt-1" /></li>
             <li className="w-full flex items-center justify-between mb-2">
              <div className="font-bold">Grand Total:</div>
              <div>
                <input
                  type="number"
                  value={
                    values.items.reduce(
                      (total, item) => total + item.quantity * item.data.selling_price,
                      0
                    ) -
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

