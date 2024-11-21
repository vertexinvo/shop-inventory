import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
 
export default function Add(props) {
  const { auth , brand } = props
  return (
      <AuthenticatedLayout
          brand={auth.brand}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Brand</h2>}
      >
          <Head title="Brand" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
          <Formik  enableReinitialize initialValues={{ name: brand?.name || '', description: brand?.description || ''}}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            description: Yup.string()
            .required('Description is required')
            .test('word-limit', 'Description cannot exceed 50 words', (value) => {
              if (!value) return true;
              const wordCount = value.trim().split(/\s+/).length;
              return wordCount <= 50;
            }),
           
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            router.put(route('brand.update', brand.id), values, { onSuccess: () => resetForm() , preserveState: false ,replace: true });
          }}
          >
            {({values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
                  <div className="py-4 px-8">
                      <div className="flex mb-4">
                          <div className="w-full mr-1">
                              <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                              <Field name="name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="name" type="text" placeholder="Enter name"/>
                              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                          </div> 
                          
    
                      </div>
                      <div className="mb-4">
                              <label  className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Description</label>
                              <Field as="textarea" rows="4" name="description" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="description" type="text" placeholder="Enter description"/>
                              <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
    
                      <div className="flex items-center justify-start gap-1 mt-8">
                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Update
                    </button>
                    <button  onClick={() => router.get(route('brand.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

