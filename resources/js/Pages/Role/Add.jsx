import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';

export default function List(props) {
    const { auth, roles } = props
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Role</h2>}
        >
            <Head title="Role" />

            <div className="flex flex-col px-4  mt-10 mx-auto w-full">
                <div className="w-full ">

                    <div class="font-sans antialiased bg-grey-lightest">


                        <div class="w-full bg-grey-lightest">
                            <div class="container mx-auto py-3 px-5">
                                <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            guard_name: '',
                                        }}
                                        validationSchema={Yup.object({
                                            name: Yup.string().required('Required'),
                                            guard_name: Yup.string().required('Required'),

                                        })}
                                        onSubmit={async (values, { setSubmitting, resetForm, isSubmitting }) => {
                                            router.post(route('role.store'), values, { onSuccess: () => resetForm() });
                                        }}
                                    // onSubmit={async (values, { setSubmitting, resetForm, isSubmitting }) => {

                                    //     const formData = new FormData();

                                    //     formData.append('name', values.name);
                                    //     formData.append('guard_name', values.guard_name);

                                    //     await router.post(route('role.store'), formData, {
                                    //         preserveScroll: true,
                                    //         preserveState: true,
                                    //         onSuccess: () => {
                                    //             resetForm();

                                    //         },
                                    //     });

                                    // }}
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
                                                        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Role</label>
                                                        <Field as="select" name="guard_name" id="guard_name" class="appearance-none border  rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="select">
                                                            <option value="">Select Guard</option>
                                                            <option value="web">Web</option>
                                                            <option value="api">Api</option>
                                                        </Field>
                                                        <ErrorMessage name="guard_name" component="div" className="text-red-500 text-xs mt-1" />
                                                    </div>
                                                </div>


                                                <div class="flex items-center justify-start gap-1 mt-8">
                                                    <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                                                        Save
                                                    </button>
                                                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="button">
                                                        Save & Close
                                                    </button>
                                                    <button onClick={() => router.get(route('role.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

