import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import { MdKeyboardBackspace } from "react-icons/md";


export default function List(props) {
  const { auth, roles } = props
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('user.index'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add User</h2>
        </>}
    >
      <Head title="User" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div class="font-sans antialiased bg-grey-lightest">


            <div class="w-full bg-grey-lightest">
              <div class="container mx-auto py-3 px-5">
                <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <Formik enableReinitialize initialValues={{ name: '', email: '', password: '', password_confirmation: '', role: '' }}
                    validationSchema={Yup.object({
                      name: Yup.string().required('Name is required'),
                      email: Yup.string().email('Email is invalid').required('Email is required'),
                      password: Yup.string().required('Password is required'),
                      password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
                      role: Yup.string().required('Role is required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      router.post(route('user.store'), values, { onSuccess: () => resetForm() });
                    }}
                  >
                    <Form>


                      <div class="py-4 px-8">
                        <div class="flex mb-4">
                          <div class="w-1/2 mr-1">
                            <label class="block  text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                            <Field name="name" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="name" type="text" placeholder="Enter name" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div class="w-1/2 ml-1">
                            <label class="block focus:ring-black focus:border-black text-grey-darker text-sm font-bold mb-2" for="email">Email Address</label>
                            <Field name="email" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="email" type="email" placeholder="Enter email address" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>

                        <div class="mb-4">
                          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Password</label>
                          <Field name="password" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="password" type="password" placeholder="Enter secure password" />
                          <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div class="mb-4">
                          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Confirm Password</label>
                          <Field name="password_confirmation" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="password" type="password" placeholder="Enter secure password" />
                          <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div class="mb-4">
                          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Role</label>
                          <Field as="select" name="role" class="appearance-none border  rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="select">
                            <option value=""  >Select Role</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.name}>
                                {role.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-1" />

                        </div>
                        <div class="flex items-center justify-start gap-1 mt-8">
                          <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                            Save
                          </button>
                          {/* <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="button">
                            Save & Close
                          </button> */}
                          <button onClick={() => router.get(route('user.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

