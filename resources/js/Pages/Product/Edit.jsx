import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useState } from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
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
import BrandForm from '@/Partials/BrandForm';
import CategoryForm from '@/Partials/CategoryForm';
import SupplierForm from '@/Partials/SupplierForm';
import SupplierinvoiceForm from '@/Partials/SupplierinvoiceForm';
 
export default function Edit(props) {
  const { auth , categories , brands,code,invoicecode,product,selectedCategories,selectedBrands,categories_object_model } = props
  const [isNewSupplierModel, setIsNewSupplierModel] = useState(false);
  const [isNewSupplierInvoiceModel, setIsNewSupplierInvoiceModel] = useState(false);
  const [isCategoryModel, setIsCategoryModel] = useState(false);
  const [isBrandModel, setIsBrandModel] = useState(false);
  
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
          Product={auth.Product}
          header={
            <>
            <MdKeyboardBackspace
                 size={20}
                 className="mr-2 cursor-pointer"
                //  router back
                 onClick={() => window.history.back()}
                 title="Back"
             />
       <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Purchase</h2>
            </>}
      >
          <Head title="Purchase" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ 
            name: product?.name || '', 
            model: product?.model || '', 
            specifications: product?.specifications || '' ,
            purchase_price: product?.purchase_price || '', 
            selling_price: product?.selling_price || '', 
            warranty_period: product?.warranty_period || '', 
            is_borrow: product?.is_borrow ? '1' : '0', 
            shop_name: product?.shop_name || '', 
            shop_address: product?.shop_address || '', 
            shop_phone: product?.shop_phone || '', 
            shop_email: product?.shop_email || '',
            identity_type : product?.identity_type || 'none',
            identity_value : product?.identity_value || '',
            warranty_type: product?.warranty_type || 'none',
            is_warranty : product?.is_warranty ? '1' : '0',
            categories: selectedCategories || [],
            brands: selectedBrands || [],
            // quantity: product?.quantity || 1,
            description: product?.description || '',
            supplier_invoice_no: product?.supplier_invoice_no || '', 
            weight: product?.weight || '',
            is_supplier: product?.is_supplier ? '1' : '0',
            customfield: JSON.parse(product?.customfield) || [],
            type: product?.type || 'new',
            image: null,
            remove_image: false,
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            model: Yup.string(),
            specifications: Yup.string(),
            purchase_price: Yup.number().required('Purchase price is required'),
            selling_price: Yup.number().required('Selling price is required'),
            type: Yup.string().required('Type is required'),
            // quantity: Yup.number().when('identity_type', {
            //     is: 'imei',
            //     then: scheme=>scheme.required().max(1, 'Quantity must be less than or equal to 1').min(1, 'Quantity must be greater than or equal to 1') ,
            //     otherwise: scheme=>scheme.optional()
            // }),
            weight: Yup.number(),
            is_supplier: Yup.string().required('Is supplier is required'),
            
            supplier_invoice_no: Yup.string().when('is_supplier', {
                is: '1',
                then: scheme=>scheme.required() ,
                otherwise: scheme=>scheme.optional()
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
                then: scheme=>scheme.optional() ,
                otherwise: scheme=>scheme.required()
            }),
            is_warranty: Yup.string().required('Is warranty is required'),
            //check warranty_type not equal to none if is_warranty is 1
            warranty_type: Yup.string().when('is_warranty', {
                is: '1',
                then: scheme=>scheme.required().notOneOf(['none'], 'Warranty type cannot be "none"') ,
                otherwise: scheme=>scheme.optional()
            }),
            warranty_period: Yup.number().when('is_warranty', {
                is: '1',
                then: scheme=>scheme.required() ,
                otherwise: scheme=>scheme.optional()
            }),
           
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {

            //if values.brands array contain objects so only get value and set direclty in array
            const extractAndValidateValues = (array) =>
              Array.isArray(array) && array.length > 0
                ? array
                    .map((item) => (typeof item === 'object' && item.value ? item.value : item)) // Extract 'value' if object
                    .filter((value) => value !== null && value !== undefined && value !== '') // Remove invalid values
                : [];
            
            // Update brands and categories
            values.brands = extractAndValidateValues(values.brands);
            values.categories = extractAndValidateValues(values.categories);


            const formData = new FormData();
  
            // Append all regular fields
            Object.keys(values).forEach(key => {
              if (key !== 'image' && key !== 'remove_image') {
                formData.append(key, values[key]);
              }
            });
            
            // Handle image removal
            if (values.remove_image) {
              formData.append('remove_image', '1');
            }
            
            // Append image file if exists
            if (values.image) {
              formData.append('image', values.image);
            }
            
            router.post(route('product.updatewithimage', product), formData, {forceFormData: true, onSuccess: ({props}) => { if(!props.flash.error){  resetForm();  }} ,preserveScroll: true });
          }}
          >

            {({values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
                  <div className="py-4 px-8">
                      <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                              <Field name="name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="name" type="text" placeholder="Enter name"/>
                              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                          </div> 
                          <div className="w-1/2 mr-1">
                              <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Model  (optional)</label>
                              <Field name="model" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="model" type="text" placeholder="Enter model"/>
                              <ErrorMessage name="model" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="specifications">Specifications  (optional)</label>
                          <ReactQuill theme="snow"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  value={values.specifications} onChange={(e) => setFieldValue('specifications', e)} />

                          <ErrorMessage name="specifications" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="specifications">Description  (optional)</label>
                          <ReactQuill theme="snow"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  value={values.description} onChange={(e) => setFieldValue('description', e)} />
                          <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                       {values.identity_type === 'imei' && (
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="purchase_price">Purchase Price</label>
                          <Field name="purchase_price" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="purchase_price" type="number" step="0.01" placeholder="Enter purchase price" />
                          <ErrorMessage name="purchase_price" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      )}

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Selling Price</label>
                          <Field name="selling_price" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="selling_price" type="number" step="0.01" placeholder="Enter selling price" />
                          <ErrorMessage name="selling_price" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      {/* <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Quantity</label>
                          <Field name="quantity" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="quantity" type="number" min="1" placeholder="Enter quantity" />
                          <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                      </div> */}
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Weight - (kg) (optional)</label>
                          <Field name="weight" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="weight" type="number" step="0.01" placeholder="Enter weight" />
                          <ErrorMessage name="weight" component="div" className="text-red-500 text-xs mt-1" />
                      </div>



                      <div className="mb-4">
                      <div className="flex items-center justify-start gap-2 mt-2 mb-2">
                            <label className="block   text-grey-darker text-sm font-bold " for="categories">Select Category (optional)</label>
                              <button type='button' onClick={() => setIsCategoryModel(true)} className='text-black text-sm underline hover:text-gray-700'>Create a new category</button>
                            </div>
                          <Select
                                            onChange={(e) => {
                                                setFieldValue("categories", e.map((item) => item.value));
                                            }}
                                            isMulti
                                            name="categories"
                                            options={categories}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            defaultValue={values.categories}
                                            styles={customStyles}
                                        />
                          <ErrorMessage name="categories" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="mb-4">
                      <div className="flex items-center justify-start gap-2 mt-2 mb-2">
                              <label className="block text-grey-darker text-sm font-bold " for="brands">Select Brand  (optional)</label>
                              <button type='button' onClick={() => setIsBrandModel(true)} className='text-black text-sm underline hover:text-gray-700'>Create a new brand</button>
                            
                            </div>
                          <Select
                                            onChange={(e) => {
                                              
                                                setFieldValue("brands", e.map((item) => item.value));
                                            }}
                                            isMulti
                                            name="brands"
                                            options={brands}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            defaultValue={values.brands}
                                            styles={customStyles}
                                        />
                          <ErrorMessage name="brands" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                        <div className="mb-4">
                                                     
                                                     <label className="block text-grey-darker text-sm  mb-2" for="type">Type </label>
                                                     <Field name="type" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="type" as="select" >
                                                       <option value='new'>New</option>
                                                       <option value="used">Used</option>
                                                     </Field>
                                                     <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                                                  
                      
                                                 </div>


                      <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2">
                            Identity Type
                        </label>
                        <div className="grid grid-cols-4 gap-2 w-1/2">
                            {/* Option 1: None */}
                            <div>
                                <Field
                                    className="hidden"
                                    id="radio_1"
                                    value="none"
                                    type="radio"
                                    name="identity_type"
                                />
                                <label
                                     className={`flex flex-col p-4 border-2 cursor-pointer ${
                                        values.identity_type === "none" ? "border-blue-500" : "border-gray-400"
                                    }`}
                                    htmlFor="radio_1"
                                >
                                    <span className="text-xs font-semibold uppercase">None</span>
                                </label>
                            </div>

                            {/* Option 2: Emi */}
                            <div>
                                <Field
                                    className="hidden"
                                    id="radio_2"
                                    value="imei"
                                    type="radio"
                                    name="identity_type"
                                />
                                <label
                                    className={`flex flex-col p-4 border-2 cursor-pointer ${
                                        values.identity_type === "imei" ? "border-black" : "border-gray-400"
                                    }`}
                                    htmlFor="radio_2"
                                >
                                    <span className="text-xs font-semibold uppercase">Imei</span>
                                </label>
                            </div>

                            {/* Option 3: Sku */}
                            <div>
                                <Field
                                    className="hidden"
                                    id="radio_3"
                                    value="sku"
                                    type="radio"
                                    name="identity_type"
                                />
                                <label
                                   className={`flex flex-col p-4 border-2 cursor-pointer ${
                                    values.identity_type === "sku" ? "border-black" : "border-gray-400"
                                }`}
                                    htmlFor="radio_3"
                                >
                                    <span className="text-xs font-semibold uppercase">Sku</span>
                                </label>
                            </div>
                              {/* Option 4: Serial */}
                              <div>
                                <Field
                                    className="hidden"
                                    id="radio_4"
                                    value="serial"
                                    type="radio"
                                    name="identity_type"
                                />
                                <label
                                   className={`flex flex-col p-4 border-2 cursor-pointer ${
                                    values.identity_type === "serial" ? "border-black" : "border-gray-400"
                                }`}
                                  htmlFor="radio_4"
                                >
                                    <span className="text-xs font-semibold uppercase">Serial</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {values.identity_type !== 'none' && (
                         <div className=" mr-1 mb-4 ">
                         <label className="block text-grey-darker text-sm  mb-2" for="warranty_period">{values.identity_type.charAt(0).toUpperCase() + values.identity_type.slice(1)} </label>
                         <Field name="identity_value" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder={"Enter " + values.identity_type.charAt(0).toUpperCase() + values.identity_type.slice(1)} />
                         <ErrorMessage name="identity_value" component="div" className="text-red-500 text-xs mt-1" />
                         </div> 
                      )}


                 

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2">Is Warranty</label>
                          <div className="flex items-center">
                              <label className="mr-4">
                                  <Field name="is_warranty" type="radio" value="1" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> Yes
                              </label>
                              <label>
                                  <Field name="is_warranty" type="radio" value="0" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> No
                              </label>
                          </div>
                          <ErrorMessage name="is_warranty" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                 


                     
                    




                      {values.is_warranty === '1' && (
                        <>
                         <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" for="warranty_period">Warranty Type </label>
                          <Field name="warranty_type" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="warranty_type" as="select" >
                            <option value=''>Select Warranty Type</option>
                            <option value='years'>Year</option>
                            <option value="months">Month</option>
                            <option value="days">Day</option>
                        </Field>
                          <ErrorMessage name="warranty_type" component="div" className="text-red-500 text-xs mt-1" />
                          </div> 
                          <div className="w-1/2 mr-1">
                          <label className="block text-grey-darker text-sm  mb-2" for="warranty_period">Warranty Period </label>
                          <Field name="warranty_period" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="warranty_period" type="number" step="1" placeholder="Enter warranty period" />
                          <ErrorMessage name="warranty_period" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        
                      </div>
                     
                      </>
                      )}

                      

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2">Is Borrow</label>
                          <div className="flex items-center">
                              <label className="mr-4">
                                  <Field name="is_borrow" type="radio" value="1" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> Yes
                              </label>
                              <label>
                                  <Field name="is_borrow" type="radio" value="0" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> No
                              </label>
                          </div>
                          <ErrorMessage name="is_borrow" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {values.is_borrow === '1' && (
                          <>
                          <label className="block text-grey-darker text-sm my-2 text-red-500" for="shop_name" >Fill atleast one</label>
                            <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Shop Name</label>
                          <Field name="shop_name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_name" type="text" placeholder="Enter shop name" />
                          <ErrorMessage name="shop_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_address">Shop Address</label>
                          <Field as="textarea" name="shop_address" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_address" rows="3" placeholder="Enter shop address"></Field>
                          <ErrorMessage name="shop_address" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_phone">Shop Phone</label>
                          <Field name="shop_phone" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_phone" type="number" placeholder="Enter purchase price" />
                          <ErrorMessage name="shop_phone" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_email">Shop Email</label>
                          <Field name="shop_email" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_email" type="email" placeholder="Enter shop email" />
                          <ErrorMessage name="shop_email" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                          </>
                      )}

                      {values.identity_type === 'imei' && (<>
                <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2">Is Supplier</label>
                          <div className="flex items-center">
                              <label className="mr-4">
                                  <Field name="is_supplier" type="radio" value="1" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> Yes
                              </label>
                              <label>
                                  <Field name="is_supplier" type="radio" value="0" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> No
                              </label>
                          </div>
                          <ErrorMessage name="is_supplier" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      
                      { values.is_supplier === '1' && (

                            <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Supplier Invoice No (Existing)</label>
                          <Field name="supplier_invoice_no" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="supplier_invoice_no" type="text" placeholder="Enter supplier invoice no" />
                          <ErrorMessage name="supplier_invoice_no" component="div" className="text-red-500 text-xs mt-1" />
                            <div className="flex items-center justify-start gap-2 mt-2">
                         <button type='button' onClick={() => setIsNewSupplierInvoiceModel(true)} className='text-blue-500 text-sm underline hover:text-blue-700'>Create a new invoice</button>
                         <button type='button' onClick={() => setIsNewSupplierModel(true)} className='text-blue-500 text-sm underline hover:text-blue-700'>Create a new supplier</button>
                     
                          </div>
                      </div>

                      )}

                  </>)}


                  <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Other Details (optional)</label>
                          <FieldArray name="customfield">
                            {({ push, remove }) => (
                              <div>
                                {values.customfield && values.customfield.length > 0 ? (
                                  values.customfield.map((field, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                      <div className="flex flex-col gap-2">
                                        <Field
                                          name={`customfield.${index}.name`}
                                          className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                          type="text"
                                          placeholder="Enter field name"
                                        />
                                        <ErrorMessage
                                          name={`customfield.${index}.name`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div className="flex flex-col gap-2">
                                        <Field
                                          name={`customfield.${index}.value`}
                                          className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                          type="text"
                                          placeholder="Enter field value"
                                        />
                                        <ErrorMessage
                                          name={`customfield.${index}.value`}
                                          component="div"
                                          className="text-red-500 text-xs mt-1"
                                        />
                                      </div>

                                      <div className="flex items-center justify-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className="text-red-500 text-sm underline hover:text-red-700"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-sm">No custom fields added.</p>
                                )}

                                <button
                                  type="button"
                                  onClick={() => push({ name: '', value: '' })}
                                  className="mt-2 text-black text-sm underline hover:text-gray-700"
                                >
                                  Add Field
                                </button>
                              </div>
                            )}
                          </FieldArray>

                          
                          <ErrorMessage name="customfield" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                    
                      <div className="mb-4">
                      <label className="block text-grey-darker text-sm font-bold mb-2">
                        Product Image
                      </label>
                      
                      {/* Current image preview */}
                      {product.image_url && !values.remove_image && (
                        <div className="mb-3">
                          <img 
                            src={product.image_url} 
                            alt="Current product image" 
                            className="h-32 w-32 object-cover rounded"
                          />
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <Field
                                type="checkbox"
                                name="remove_image"
                                className="form-checkbox"
                              />
                              <span className="ml-2">Remove current image</span>
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {/* Image upload field */}
                      <input
                        type="file"
                        name="image"
                        onChange={(event) => {
                          setFieldValue("image", event.currentTarget.files[0]);
                        }}
                        className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                      />
                      <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

    
                      <div className="flex items-center justify-start gap-1 mt-8">
                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                    Update
                    </button>
                    <button  onClick={() => router.get(route('product.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

          {/* 'product.edit', product.id */}
          <SupplierForm codeRoute={'product.edit'} id={product.id} setIsNewSupplierModel={setIsNewSupplierModel} />
          
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
            <SupplierinvoiceForm codeRoute="product.edit" id={product.id} setIsNewSupplierInvoiceModel={setIsNewSupplierInvoiceModel} />
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

