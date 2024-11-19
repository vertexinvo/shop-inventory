import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';

export default function Edit(props) {
  const { auth ,roles,user} = props
  return (
      <AuthenticatedLayout
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User</h2>}
      >
          <Head title="User" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div class="font-sans antialiased bg-grey-lightest">

 
  <div class="w-full bg-grey-lightest">
    <div class="container mx-auto py-3 px-5">
      <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ name: user?.name || '', email: user?.email || '', role: user?.roles[0]?.name || '' }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Email is invalid').required('Email is required'),
           
            role: Yup.string().required('Role is required'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            router.put(route('user.update', user.id), values, {  onSuccess: () => resetForm() , preserveScroll: true , preserveState: false ,replace: true });
          }}
          >
            <Form>

          
            <div class="py-4 px-8">
                <div class="flex mb-4">
                    <div class="w-1/2 mr-1">
                        <label class="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                        <Field name="name" class="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="name" type="text" placeholder="Enter name"/>
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div class="w-1/2 ml-1">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="email">Email Address</label>
                    <Field name="email"  class="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="email" placeholder="Enter email address"/>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                </div>
              
                <div class="mb-4">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="password">Role</label>
                    <Field as="select" name="role" class="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="select">
                        <option value="">Select Role</option>
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
                        Submit
                    </button>
                    <button  onClick={() => router.get(route('user.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

