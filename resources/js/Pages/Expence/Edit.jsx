import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import { MdKeyboardBackspace } from "react-icons/md";

export default function Edit(props) {
  const { auth, roles, expance } = props
  return (
    <AuthenticatedLayout
      user={auth.expance}
      header={ <>
        <MdKeyboardBackspace
             size={20}
             className="mr-2 cursor-pointer"
             onClick={() => router.get(route('expence.index'))}
             title="Back"
         /><h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Expence</h2>
        </>}
    >
      <Head title="User" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div class="font-sans antialiased bg-grey-lightest">
            <div class="w-full bg-grey-lightest">
              <div class="container mx-auto py-3 px-5">
                <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <Formik enableReinitialize initialValues={{ name: expance?.name || '', type: expance?.type || '' , phone: expance?.phone || '', address: expance?.address || '' }}
                    validationSchema={Yup.object({
                      name: Yup.string().required('Name is required'),

                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      router.put(route('expence.update', user.id), values, { onSuccess: () => resetForm(), preserveScroll: true, preserveState: false, replace: true });
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
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="type">Type</label>
                            <Field name="type" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="email" type="email" placeholder="Enter email address" />
                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                        {/* phone and address */}
                        <div class="flex mb-4">
                          <div class="w-1/2 mr-1">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">DateTime</label>
                            <Field name="datetime" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="datetime" type="text" placeholder="Enter datetime number" />
                            <ErrorMessage name="datetime" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div class="w-1/2 ml-1">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="description">Description</label>
                            <Field name="description" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="address" type="text" placeholder="Enter address" />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                        {/* amount status */}
                        <div class="flex mb-4">
                          <div class="w-1/2 mr-1">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">Amount</label>
                            <Field name="amount" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="phone" type="text" placeholder="Enter phone number" />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div class="w-1/2 ml-1">
                            <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Status</label>
                            <Field name="address" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="address" type="text" placeholder="Enter address" />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>


                        <div class="flex items-center justify-start gap-1 mt-8">
                          <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                          Update
                          </button>
                          <button onClick={() => router.get(route('expence.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

