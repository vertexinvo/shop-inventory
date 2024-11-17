import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const Add = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        wallet: "",
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
        password_confirmation: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Password confirmation is required"),
        wallet: Yup.string().required("Wallet is required"),
      })}
      onSubmit={(values) => {
        console.log("Form Submitted", values);
      }}
    >
      {() => (
        <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Create User</h2>

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
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          {/* Password Field */}
          <div className="relative z-0 w-full mb-5 group">
            <Field
              type="password"
              name="password"
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
            <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          {/* Password Confirmation Field */}
          <div className="relative z-0 w-full mb-5 group">
            <Field
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password_confirmation"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Password
            </label>
            <ErrorMessage
              name="password_confirmation"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Wallet Field */}
          <div className="relative z-0 w-full mb-5 group">
            <Field
              type="text"
              name="wallet"
              id="wallet"
              inputMode="numeric"
              pattern="[0-9]*"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="wallet"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Wallet
            </label>
            <ErrorMessage name="wallet" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4"
            >
              Create User
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Add;
    