import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from "react-icons/md";
import SupplierForm from '@/Partials/SupplierForm';
import SupplierinvoiceForm from '@/Partials/SupplierinvoiceForm';

export default function Add(props) {
  const { auth,suppliers,supplierinvoices ,product_id, } = props;

  const [isNewSupplierModel, setIsNewSupplierModel] = useState(false);
  const [isNewSupplierInvoiceModel, setIsNewSupplierInvoiceModel] = useState(false);

  const [notremember, setNotRemember] = useState(false);

  const [supplierId, setSupplierId] = useState('');


  return (
    <AuthenticatedLayout
      tax={auth.tax}
      header
    >
      <Head title="Add Stocklog" />

      <div className="flex flex-col px-4 mt-10 mx-auto w-full">
        <div className="w-full">
          <div className="font-sans antialiased bg-grey-lightest">
            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <Formik
                    enableReinitialize
                    initialValues={{
                        quantity: '',
                        type: '',
                        is_supplier: '0',
                        supplier_invoice_no: '',
                        remarks: '',
                        datetime: '',
                        supplier_invoice_no: '',
                        product_id: product_id,
                        purchase_price: '',
                        is_borrow: '0', shop_name: '', shop_address: '', shop_phone: '', shop_email: ''
                    }}
                    validationSchema={Yup.object({
                        quantity: Yup.number().min(1).required('Quantity is required'),
                        type: Yup.string().required('Type is required'),
                        is_supplier: Yup.string().required('Is supplier is required'),
                        datetime: Yup.date().required('Date is required'),
                        purchase_price: Yup.number().when('type', {
                                    is: 'removal',
                                    then: scheme => scheme.optional(),
                                    otherwise: scheme => scheme.required(),

                         is_borrow: Yup.string().required('Borrow status is required'),
                          shop_name: Yup.string(),
                          shop_address: Yup.string(),
                          shop_phone: Yup.string().matches(/^[0-9]*$/, 'Must be only digits'),
                          shop_email: Yup.string().email('Invalid email address'),
                        }),
                        
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      router.post(route('stocklog.store'), values, { onSuccess: () => resetForm() });
                    }}
                  >
                       {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form>
                      <div className="py-4 px-8">
                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="area_name">Quantity</label>
                            <Field
                              name="quantity"
                              className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                              id="quantity"
                              type="number"
                              placeholder="Enter quantity"
                            />
                            <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div className="w-1/2 ml-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Type</label>
                            <Field name="type" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="type" as="select" >
                                    <option value=''>Select Type</option>
                                    <option value='addition'>Addition</option>
                                    <option value="removal">Removal</option>
                                    <option value="adjustment">Adjustment</option>
                                  </Field>
                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                      {values.type !== 'removal' && values.type !== '' && (
                        <div className="flex mb-4">
                          <div className="w-full mr-1">
                                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Purchase Price (Required)</label>
                              <Field
                                name="purchase_price"
                                className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                                id="purchase_price"
                                type="number" step="any"
                                placeholder="Enter Purchase Price"
                              />
                              <ErrorMessage name="purchase_price" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                        )}

                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="area_name">Date/Time</label>
                            <Field
                              name="datetime"
                              className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                              id="datetime"
                              type="datetime-local"
                              placeholder="Enter Date/Time"
                            />
                            <ErrorMessage name="datetime" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div className="w-1/2 ml-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Remarks (Optional)</label>
                            <Field
                              name="remarks"
                              className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                              id="remarks"
                              type="text"
                              placeholder="Enter Remarks"
                            />
                            <ErrorMessage name="remarks" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>

                         {values.type === 'addition'  && (
                          <div className="mb-8">
                                          
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
                                                               router.get(route('stocklog.create', { product_id: product_id}) , { supplier_id: e.target.value }, { preserveState: true, preserveScroll: true });
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

                       

                        <div className="flex items-center justify-start gap-1 mt-8">
                          <button
                            className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg"
                            type="submit"
                          >
                            Save
                          </button>
                          {/* <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="button">
                          Save & Close
                           </button> */}
                          <button
                            onClick={() => router.get(route('stock.index'),{product_id:product_id})}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                            type="button"
                          >
                            Close
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
                        <SupplierForm codeRoute={"stocklog.create"} id={{"product_id" : product_id}} setIsNewSupplierModel={setIsNewSupplierModel} />
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
                        <SupplierinvoiceForm codeRoute={"stocklog.create"} id={{"product_id" : product_id}} setIsNewSupplierInvoiceModel={setIsNewSupplierInvoiceModel} />
              </div>
            </div>
          </Modal>


    </AuthenticatedLayout>
  );
}
