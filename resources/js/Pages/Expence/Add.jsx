import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import { MdKeyboardBackspace } from "react-icons/md";
import BrandForm from '@/Partials/BrandForm';

export default function Add(props) {
    const { auth, expance,users} = props
    return (
        <AuthenticatedLayout
            header={
                <>
                    <MdKeyboardBackspace
                        size={20}
                        className="mr-2 cursor-pointer"
                        onClick={() => router.get(route('expense.index'))}
                        title="Back"
                    /><h2 className="font-semibold text-xl text-gray-800 leading-tight">{expance ? 'Edit' : 'Add'} Expense</h2>
                </>}
        >
            <Head title="Expense" />

            <div className="flex flex-col px-4  mt-10 mx-auto w-full">
                <div className="w-full ">

                    <div className="font-sans antialiased bg-grey-lightest">


                        <div className="w-full bg-grey-lightest">
                            <div className="container mx-auto py-3 px-5">
                                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                                              <Formik
                                    enableReinitialize
                                    initialValues={{
                                      name: expance?.name || '',
                                      type: expance?.type || '', // dynamically handled as dropdown
                                      datetime: expance?.datetime || '',
                                      description: expance?.description || '',
                                      amount: expance?.amount || '',
                                      status: expance?.status || 'paid',
                                      pending_amount: expance?.pending_amount || 0,
                                      uid: expance?.uid || '',
                                    }}
                                    validationSchema={Yup.object({
                                      name: Yup.string().required('Name is required'),
                                      type: Yup.string().required('Type is required'),
                                      datetime: Yup.date().nullable(),
                                      uid : Yup.string().nullable(),
                                      description: Yup.string().nullable(),
                                      amount: Yup.number()
                                        .nullable()
                                        .typeError('Amount must be a valid number'),
                                      status: Yup.string()
                                        .oneOf(['paid', 'unpaid'], 'Invalid status')
                                        .required('Status is required'),
                                      pending_amount: Yup.number()
                                        .nullable()
                                        .typeError('Pending amount must be a valid number'),
                                    })}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                     expance ? router.put(route('expense.update', expance.id), values, {
                                        onSuccess: () => resetForm(),
                                        preserveScroll: true,
                                        preserveState: false,
                                        replace: true,
                                     })
                                     : router.post(route('expense.store'), values, {
                                        onSuccess: () => resetForm(),
                                        preserveScroll: true,
                                        preserveState: false,
                                        replace: true,
                                     })
                                    }}
                                  >
                                    {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                                      <Form>
                                        <div className="py-4 px-8">
                                          {/* Name */}
                                          <div className="flex mb-4">
                                            <div className="w-1/2 mr-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="name">
                                                Name
                                              </label>
                                              <Field
                                                name="name"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="name"
                                                type="text"
                                                placeholder="Enter name"
                                              />
                                              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                  
                                            {/* Type dropdown */}
                                            <div className="w-1/2 ml-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="type">
                                                Type
                                              </label>
                                              <Field
                                                as="select"
                                                name="type"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="type"
                                              >
                                                <option value="">Select Type</option>
                                                <option value="rent">Rent</option>
                                                <option value="utilities">Utilities</option>
                                                <option value="salary">Salary</option>
                                                <option value="miscellaneous">Miscellaneous</option>
                                              </Field>
                                              <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                          </div>
                                  
                                          {/* DateTime and Description */}
                                          <div className="flex mb-4">
                                            <div className="w-1/2 mr-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="datetime">
                                                DateTime
                                              </label>
                                              <Field
                                                name="datetime"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="datetime"
                                                type="datetime-local"
                                                placeholder="Enter date and time"
                                              />
                                              <ErrorMessage name="datetime" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div className="w-1/2 ml-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="description">
                                                Description (Optional)
                                              </label>
                                              <Field
                                                name="description"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="description"
                                                type="text"
                                                placeholder="Enter description"
                                              />
                                              <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                          </div>
                                  
                                          {/* Amount and Pending Amount */}
                                          <div className="flex mb-4">
                                            <div className="w-1/2 mr-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="amount">
                                                Amount
                                              </label>
                                              <Field
                                                name="amount"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter amount"
                                              />
                                              <ErrorMessage name="amount" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div className="w-1/2 ml-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="pending_amount">
                                                Pending Amount (Optional)
                                              </label>
                                              <Field
                                                name="pending_amount"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="pending_amount"
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter pending amount"
                                              />
                                              <ErrorMessage name="pending_amount" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                          </div>
                                  
                                          {/* Status */}
                                          <div className="flex mb-4">
                                            <div className="w-1/2 mr-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="status">
                                                Status
                                              </label>
                                              <Field
                                                as="select"
                                                name="status"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="status"
                                              >
                                                <option value="paid">Paid</option>
                                                <option value="unpaid">Unpaid</option>
                                              </Field>
                                              <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div className="w-1/2 ml-1">
                                              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="uid">
                                                Select User (Optional)
                                              </label>
                                              <Field
                                                as="select"
                                                name="uid"
                                                className="appearance-none border rounded w-full py-2 px-3 focus:ring-black focus:border-black text-grey-darker"
                                                id="uid"
                                              >
                                                <option value="">Select User</option>
                                                {users.map((user) => (
                                                  <option key={user.id} value={user.id}> {user.code||user.id} - { user.name || 'N/A'} - {user.email|| 'N/A'} - {user.phone|| 'N/A'}</option>
                                                ))}
                                              </Field>
                                              <ErrorMessage name="uid" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                          </div>
                                  
                                          {/* Buttons */}
                                          <div className="flex items-center justify-start gap-1 mt-8">
                                            <button
                                              className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg"
                                              type="submit"
                                            >
                                              {isSubmitting ? 'Submitting...' : 'Submit'}
                                            </button>
                                            <button
                                              onClick={() => router.get(route('expense.index'))}
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


        </AuthenticatedLayout>
    );
}

