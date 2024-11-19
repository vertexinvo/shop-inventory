import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';

export default function Edit(props) {
  const { auth ,roles,product} = props
  return (
        <AuthenticatedLayout
            Product={auth.Product}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edot Product</h2>}
        >
          <Head title="Product" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ name: product?.name || '', model: product?.model || '',specifications: product?.specifications || '',purchase_price: product?.purchase_price || '',selling_price: product?.selling_price || '',warranty_period: product?.warranty_period || '',is_borrow: product?.is_borrow || '',shop_name: product?.shop_name || '',shop_address: product?.shop_address || '',shop_phone: product?.shop_phone || '',shop_email: product?.shop_email || ''}}
          validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                model: Yup.string().required('Model is required'),
                specifications: Yup.string().required('Specifications is required'),
                purchase_price: Yup.number().required('Purchase price is required'),
                selling_price: Yup.number().required('Selling price is required'),
                warranty_period: Yup.number().required('Warranty period is required'),
                is_borrow: Yup.boolean().required('Is borrow is required'),
                shop_name: Yup.string().required('Shop name is required'),
                shop_address: Yup.string().required('Shop address is required'),
                shop_phone: Yup.string().required('Shop phone is required'),
                shop_email: Yup.string().email('Shop email is invalid').required('Shop email is required'),
            })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            router.put(route('product.update', product.id), values, {  onSuccess: () => resetForm() , preserveScroll: true , preserveState: false ,replace: true });
          }}
          >
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
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="warranty_period">Warranty Period </label>
                          <Field name="warranty_period" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="warranty_period" type="number" step="1" placeholder="Enter warranty period" />
                          <ErrorMessage name="warranty_period" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

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

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="shop_name">Shop Name</label>
                          <Field name="shop_name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_name" type="text" placeholder="Enter shop name" />
                          <ErrorMessage name="shop_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="shop_address">Shop Address</label>
                          <Field as="textarea" name="shop_address" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_address" rows="3" placeholder="Enter shop address"></Field>
                          <ErrorMessage name="shop_address" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="shop_phone">Shop Phone</label>
                          <Field name="shop_phone" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_phone" type="number" placeholder="Enter purchase price" />
                          <ErrorMessage name="shop_phone" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm font-bold mb-2" for="shop_email">Shop Email</label>
                          <Field name="shop_email" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="shop_email" type="email" placeholder="Enter shop email" />
                          <ErrorMessage name="shop_email" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
    
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

