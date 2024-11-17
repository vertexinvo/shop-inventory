import React, { useState } from 'react'
import { ErrorMessage,Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Edit = () => {
    const [selectedUser,setSelectedUser]=useState(null)

   
  return (
   <>
   <Formik
    initialValues={{
        name: selectedUser?.name || '',
        email: selectedUser?.email || '',

    }}
   
    validationSchema={Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required')
      })}
    onSubmit={(values) => {
        console.log("edited values", values);
    }}
    >
    {({ errors, touched }) => (
        <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>

        {/* Name Field */}
        <div className="relative z-0 w-full mb-5 group">
            <Field
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            />
            <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
            Name
            </label>
            <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
        </div>

        {/* Email Field */}
        <div className="relative z-0 w-full mb-5 group">
            <Field
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder=" "
            // readOnly
            // disabled
            />
            <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
            Email
            </label>
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
        </div>


       

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
        >
            Update
        </button>
        </Form>
    )}
    </Formik>
   </>
  )
}

export default Edit