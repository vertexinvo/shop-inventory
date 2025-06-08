import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';


function CustomerForm(props) {
    const { user} = props
    return (
        <Formik enableReinitialize initialValues={{ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '' }}
                          validationSchema={Yup.object({
                            name: Yup.string().required('Name is required'),
      
                          })}
                          onSubmit={(values, { setSubmitting, resetForm }) => {
                       user ? router.put(route('customer.update', user.id), values, { onSuccess: () => resetForm(), preserveScroll: true, preserveState: false, replace: true })
                        :   router.post(route('customer.store'), values, { onSuccess: () => resetForm() });
                          }}

                        >
                          <Form>
      
      
                            <div class="py-4 px-8">
                              <div class="flex mb-4">
                                <div class="w-1/2 mr-1">
                                  <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                                  <Field name="name" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="name" type="text" placeholder="Enter name" />
                                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div class="w-1/2 ml-1">
                                  <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Email Address</label>
                                  <Field name="email" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="email" type="email" placeholder="Enter email address" />
                                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
                              {/* phone and address */}
                              <div class="flex mb-4">
                                <div class="w-1/2 mr-1">
                                  <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">Phone</label>
                                  <Field name="phone" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="phone" type="text" placeholder="Enter phone number" />
                                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div class="w-1/2 ml-1">
                                  <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Address</label>
                                  <Field name="address" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="address" type="text" placeholder="Enter address" />
                                  <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                              </div>
      
      
                              <div class="flex items-center justify-start gap-1 mt-8">
                                <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                                  {user ? 'Update' : 'Save'}
                                </button>
                             
                              </div>
                            </div>
                          </Form>
                        </Formik>
    )
}

export default CustomerForm