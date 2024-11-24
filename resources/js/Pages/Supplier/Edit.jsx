import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import React, { useState } from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdContentPaste, MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from '@/Components/Modal';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';

 
export default function Add(props) {
  const { auth ,code,supplier } = props




  return (
      <AuthenticatedLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Supplier</h2>}
      >
          <Head title="Supplier" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">
      <Formik enableReinitialize initialValues={{ person_name: supplier.person_name || '',email: supplier.email || '', contact: supplier.contact || '', address: supplier.address || '',code: supplier.code || '' }}
            validationSchema={Yup.object({
              person_name: Yup.string().required('Name is required'),
              email: Yup.string().email('Invalid email address'),
              contact: Yup.string().required('Contact is required'),
              address: Yup.string(),
              code: Yup.string().required('Code is required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              router.put(route('supplier.update', supplier.id), values, {
                onSuccess: () => {
                    resetForm();
                },
                preserveScroll: true,
                preserveState: true,
              });

            } }
            >
                {({ isSubmitting, values, errors,setFieldValue, }) => { 
                    
                    const generateCode =  () => {
                        router.post(route('supplier.generatecode'),{}, {
                           onSuccess: (response) => {
                               setFieldValue('code', code);
                           },
                           preserveScroll: true,
                           preserveState: true
                       });
                    }
                    
                    return (
                <Form>
                    <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Supplier Name</label>
                          <Field name="person_name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"  type="text" placeholder="Enter supplier name" />
                          <ErrorMessage name="person_name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_address">Supplier Address</label>
                          <Field name="address" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" type="text" placeholder="Enter supplier address" />
                          <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_contact">Supplier Contact</label>
                          <Field name="contact" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" type="number" placeholder="Enter supplier contact" />
                          <ErrorMessage name="contact" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_email">Supplier Email</label>
                          <Field name="email" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" type="email" placeholder="Enter supplier email" />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      <div className="mb-4">
                          <label className="block text-grey-darker text-sm  mb-2" for="shop_code">Supplier Code</label>
                          <div className="flex gap-2 items-center">
                          <Field name="code"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" type="text" placeholder="Enter supplier code" />
                         
                          <RiAiGenerate onClick={() => generateCode()} size={40} color="blue" />
                          </div>
                          <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />

                          {values.code !== '' &&
                            <button  type='button' onClick={()=>{
                              //copy to clipboard
                              navigator.clipboard.writeText(values.code);
                              toast.success('Copied to clipboard');
                            }} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2' >Copy</button>
                          }
                      </div>

                      <div className="flex items-center justify-start gap-1 mt-8">
                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                    </button>
                    <button  onClick={() => router.visit(route('supplier.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                        Close
                    </button>
                </div>
                </Form>
                )}}
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

