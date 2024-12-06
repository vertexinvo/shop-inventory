import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
 
export default function List(props) {
  const { auth } = props
  return (
      <AuthenticatedLayout
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Customer</h2>}
      >
          <Head title="User" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div class="font-sans antialiased bg-grey-lightest">


  <div class="w-full bg-grey-lightest">
    <div class="container mx-auto py-3 px-5">
      <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ name: '', email: '', phone: '', address: '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            router.post(route('customer.store'), values, { onSuccess: () => resetForm() });
          }}
          >
            <Form>

          
            <div class="py-4 px-8">
                <div class="flex mb-4">
                    <div class="w-1/2 mr-1">
                        <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                        <Field name="name" class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="name" type="text" placeholder="Enter name"/>
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div class="w-1/2 ml-1">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Email Address</label>
                    <Field name="email"  class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="email" type="email" placeholder="Enter email address"/>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </div>

                
                <div class="flex mb-4">
                    <div class="w-1/2 mr-1">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="phone">Phone</label>
                    <Field name="phone"  class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="phone" type="text" placeholder="Enter phone number"/>
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div class="w-1/2 ml-1">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="address">Address</label>
                    <Field name="address"  class="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="address" type="text" placeholder="Enter address"/>
                    <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </div>
              
               
              
                <div class="flex items-center justify-start gap-1 mt-8">
                    <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                    </button>
                    <button  onClick={() => router.get(route('customer.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

