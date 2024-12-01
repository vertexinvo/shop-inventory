import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
 
export default function List(props) {
  const { auth ,tax} = props
  return (
      <AuthenticatedLayout
        tax={auth.tax}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Tax</h2>}
      >
          <Head title="Tax" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div class="font-sans antialiased bg-grey-lightest">


  <div class="w-full bg-grey-lightest">
    <div class="container mx-auto py-3 px-5">
      <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{name: tax?.name || '', cost: tax?.cost || ''}}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            cost: Yup.string().required('Cost is required'),           
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            router.put(route('tax.update',tax.id), values, { onSuccess: () => resetForm() });
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
                    <div class="w-1/2 mr-1">
                    <label class="block text-grey-darker text-sm font-bold mb-2" for="cost">Cost</label>
                    <Field name="cost"  step="0.01" class="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="cost" type="number" placeholder="Enter tax cost"/>
                    <ErrorMessage name="cost" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                </div>
              
                
                
                <div class="flex items-center justify-start gap-1 mt-8">
                    <button class="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Update
                    </button>
                    <button  onClick={() => router.get(route('tax.index'))} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

