import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

import { CiSettings } from "react-icons/ci";
function List(props) {
    const { roles } = props;
console.log(roles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };
    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role List</h2>}
            >
                <Head title="Admin Dashboard" />
                <div className="flex flex-col px-4 max-w-7xl mt-10 mx-auto w-full">
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 px-4 sm:px-8">
                            <div className="flex space-x-2 mt-2 md:mt-0">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    
                                    className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
                                >
                                    Create
                                </button>
                            </div>
                        </div>

                        <div className='overflow-x-auto'>
                            <table className="min-w-full bg-white rounded-lg shadow-lg">
                                <thead>
                                    <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold ">ID</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold ">Name</th>

                                        <th className="py-3 px-4 border-b-2 border-gray-200 text-right font-semibold ">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.length === 0 ? (

                                        <tr>
                                            <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">No roles found</td>
                                        </tr>
                                    ) : (
                                        <>
                                            {roles.data.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-gray-100">
                                                    {/* <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{index + 1}</td> */}
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{(roles.current_page - 1) * roles.per_page + index + 1}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{item.name}</td>

                                                    <td className="py-2 px-4 border-b border-gray-200 text-right">
                                                        <div className="text-right space-x-2">
                                                            <button 
                                                                onClick={() => openEditModal(item)}

                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="
                                                                w-5 fill-black hover:fill-gray-600"
                  viewBox="0 0 348.882 348.882">
                  <path
                    d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                    data-original="#000000" />
                  <path
                    d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                    data-original="#000000" />
                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProduct(item);
                                                                    setIsDeleteModalOpen(true);
                                                                }}
                                                            >
                                                                               <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                                                                                <path
                                                                                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                                                    data-original="#000000" />
                                                                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                                                    data-original="#000000" />
                                                                                </svg>
                                                            </button>

                                                            <button

                                                            >
                                                                <Link href={route('role.show', item.id)}>
                                                                    <CiSettings
                                                                        className="w-5 h-5 cursor-pointer"/>
                                                                </Link>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                        </>
                                    )
                                    }



                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col items-center md:items-end mt-4 mb-4">
                            <div className="flex justify-center md:justify-end mt-4 space-x-1">
                                {roles.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1 mt-1 border rounded-md text-sm ${link.active ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                            {/* Show total pages if applicable */}
                            <div className="text-sm mt-2">
                                {roles.links.length > 0 && (
                                    <span>
                                        Page {roles.current_page} of {roles.last_page}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Create Product Modal */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
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

                            const formData = new FormData();

                            formData.append('name', values.name);
                            formData.append('guard_name', values.guard_name);

                            await router.post(route('role.store'), formData, {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                            });

                        }}
                    >

                        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Create Role</h2>
                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        name="name"
                                        type="text"
                                        id="name"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="name"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Name
                                    </label>
                                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        name="guard_name"
                                        as="select"
                                        id="guard_name"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                        placeholder=" "
                                    >
                                        <option value="">Select Guard</option>
                                        <option value="web">Web</option>
                                        <option value="api">Api</option>
                                    </Field>

                                    <ErrorMessage name="guard_name" component="div" className="text-red-600 text-sm mt-1" />
                                </div>


                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-black hover:bg-gray-600 dark:bg-white dark:hover:bg-gray-700 dark:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>


                {/* Edit Product Modal */}
                <Modal
                    show={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: selectedProduct ? selectedProduct.name : '',
                            guard_name: selectedProduct ? selectedProduct.guard_name : '',


                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            guard_name: Yup.string().required('Required'),


                        })}
                        onSubmit={(values, { resetForm }) => {

                            router.put(route('role.update', selectedProduct.id), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsEditModalOpen(false);
                                },
                            });
                        }}

                    >
                        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Edit Role </h2>

                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        name="name"
                                        type="text"
                                        id="name"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="name"
                                        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Name
                                    </label>
                                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <Field
                                        name="guard_name"
                                        as="select"
                                        id="guard_name"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                                        placeholder=" "
                                    >
                                        <option value="">Select Guard</option>
                                        <option value="web">Web</option>
                                        <option value="api">Api</option>
                                    </Field>

                                    <ErrorMessage name="guard_name" component="div" className="text-red-600 text-sm mt-1" />
                                </div>






                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="submit"
                                        className="text-white bg-black hover:bg-gray-600 dark:bg-white dark:hover:bg-gray-700 dark:text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Modal>



                {/* Delete Confirmation Modal */}
                <Modal
                    show={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    maxWidth="sm"
                >
                    <Formik
                        initialValues={{ confirmation: '' }}
                        validationSchema={Yup.object({
                            confirmation: Yup.string().required('Type "DELETE" to confirm').oneOf(['DELETE'], 'Type "DELETE" to confirm'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.delete(route('role.destroy', selectedProduct.id), {
                                onSuccess: () => {
                                    resetForm();
                                    setIsDeleteModalOpen(false);
                                    toast.success('Role deleted successfully');
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this role?</p>
                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="confirmation"
                                    type="text"
                                    id="delete_confirmation"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
                                    placeholder="Type DELETE to confirm"
                                />
                                <ErrorMessage name="confirmation" component="div" className="text-red-600 text-sm mt-1" />
                            </div>



                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal>

            </AuthenticatedLayout>
        </>
    )
}

export default List
