import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
 
export default function Add(props) {
  const { auth , categories , brands } = props
  return (
      <AuthenticatedLayout
          Product={auth.Product}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Product</h2>}
      >
          <Head title="Product" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ name: '', model: '', specifications: '' , purchase_price: '', selling_price: '', warranty_period: '', is_borrow: '0', shop_name: '', shop_address: '', shop_phone: '', shop_email: ''
            ,identity_type : 'none',identity_value : '',warranty_type: 'none',is_warranty : '0',
            categories: [],
            brands: [],quantity:1
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            model: Yup.string(),
            specifications: Yup.string(),
            purchase_price: Yup.number().required('Purchase price is required'),
            selling_price: Yup.number().required('Selling price is required'),
            quantity: Yup.number().required('Quantity is required'),
            

            is_borrow: Yup.string().required('Is borrow is required'),
            shop_name: Yup.string(),
            shop_address: Yup.string(),
            shop_phone: Yup.string(),
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
            
            router.post(route('product.store'), values, { onSuccess: ({props}) => { if(!props.flash.error){  resetForm();  }} ,preserveScroll: true });
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
                              <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Model</label>
                              <Field name="model" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="model" type="text" placeholder="Enter model"/>
                              <ErrorMessage name="model" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="specifications">Specifications</label>
                          <Field name="specifications" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="specifications" type="text" placeholder="Enter specifications" />
                          <ErrorMessage name="specifications" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="purchase_price">Purchase Price</label>
                          <Field name="purchase_price" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="purchase_price" type="number" step="0.01" placeholder="Enter purchase price" />
                          <ErrorMessage name="purchase_price" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Selling Price</label>
                          <Field name="selling_price" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="selling_price" type="number" step="0.01" placeholder="Enter selling price" />
                          <ErrorMessage name="selling_price" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="selling_price">Quantity</label>
                          <Field name="quantity" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="quantity" type="number" min="1" placeholder="Enter quantity" />
                          <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="categories">Select Category</label>
                          <Select
                                            onChange={(e) => {
                                                setFieldValue("categories", e.map((item) => item.value));
                                            }}
                                            isMulti
                                            name="categories"
                                            options={categories}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                          <ErrorMessage name="categories" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="brands">Select Brand</label>
                          <Select
                                            onChange={(e) => {
                                                setFieldValue("brands", e.map((item) => item.value));
                                            }}
                                            isMulti
                                            name="brands"
                                            options={brands}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                          <ErrorMessage name="brands" component="div" className="text-red-500 text-xs mt-1" />
                      </div>


                      <div className="mb-4">
                        <label className="block text-grey-darker text-sm font-bold mb-2">
                            Identity Type
                        </label>
                        <div className="grid grid-cols-3 gap-2 w-1/2">
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
                                    value="emi"
                                    type="radio"
                                    name="identity_type"
                                />
                                <label
                                    className={`flex flex-col p-4 border-2 cursor-pointer ${
                                        values.identity_type === "emi" ? "border-blue-500" : "border-gray-400"
                                    }`}
                                    htmlFor="radio_2"
                                >
                                    <span className="text-xs font-semibold uppercase">Emi</span>
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
                                    values.identity_type === "sku" ? "border-blue-500" : "border-gray-400"
                                }`}
                                    htmlFor="radio_3"
                                >
                                    <span className="text-xs font-semibold uppercase">Sku</span>
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
                                  <Field name="is_warranty" type="radio" value="1" className="mr-2" /> Yes
                              </label>
                              <label>
                                  <Field name="is_warranty" type="radio" value="0" className="mr-2" /> No
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
                                  <Field name="is_borrow" type="radio" value="1" className="mr-2" /> Yes
                              </label>
                              <label>
                                  <Field name="is_borrow" type="radio" value="0" className="mr-2" /> No
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

                    
    
                      <div className="flex items-center justify-start gap-1 mt-8">
                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
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

         
      </AuthenticatedLayout>
  );
}

