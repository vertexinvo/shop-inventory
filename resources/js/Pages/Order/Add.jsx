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
  const { auth  } = props




  return (
      <AuthenticatedLayout
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Order</h2>}
      >
          <Head title="Order" />
 
          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div className="font-sans antialiased bg-grey-lightest">


  <div className="w-full bg-grey-lightest">
    <div className="container mx-auto py-3 px-5">
      <div className="w-full lg:w-full mx-auto bg-white rounded shadow p-10">
      <Formik enableReinitialize initialValues={{
              name: '',
              email: '',
              phone: '',
              address: '',
              total: 0,
              payable_amount: 0,
              paid_amount: 0,
              method: '',
              cheque_no: '',
              cheque_date: '',
              status : 'pending',
              bank_name: '',
              bank_branch: '',
              bank_account: '',
              online_payment_link: '',
              extra_charges: 0,
              shipping_charges: 0,
              discount: 0,
              tax: 0,
              is_installment: false,
              installment_amount: 0,
              installment_period: '',
              installment_count: 0,
              installment_start_date: '',
              installment_end_date: '',
      }}
            validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                email: Yup.string().email('Invalid email address').required('Email is required'),
                phone: Yup.string()
                  .matches(/^\d{10}$/, 'Phone must be a 10-digit number')
                  .required('Phone is required'),
                address: Yup.string().required('Address is required'),
                total: Yup.number().min(0, 'Total must be a positive number').required('Total is required'),
                payable_amount: Yup.number()
                  .min(0, 'Payable amount must be a positive number')
                  .required('Payable amount is required'),
                paid_amount: Yup.number()
                  .min(0, 'Paid amount must be a positive number')
                  .required('Paid amount is required'),
                method: Yup.string().required('Payment method is required'),
                cheque_no: Yup.string().when('method', {
                    is: 'cheque',
                    then: scheme => scheme.required(),
                    otherwise: scheme => scheme.optional()
                  }),
                cheque_date: Yup.date().when('method', {
                    is: 'cheque',
                    then: scheme => scheme.required(),
                    otherwise: scheme => scheme.optional()
                  }),
                bank_name: Yup.string().when('method', {
                    is: 'bank',
                    then: scheme => scheme.required(),
                    otherwise: scheme => scheme.optional()
                  }),
                bank_branch: Yup.string().when('method', {
                    is: 'bank',
                    then: scheme => scheme.required(),
                    otherwise: scheme => scheme.optional()
                  }),
                bank_account: Yup.string().when('method', {
                    is: 'bank',
                    then: scheme => scheme.required(),
                    otherwise: scheme => scheme.optional()
                  }),
                online_payment_link: Yup.string().url('Invalid URL'),
                extra_charges: Yup.number().min(0, 'Extra charges must be a positive number'),
                shipping_charges: Yup.number().min(0, 'Shipping charges must be a positive number'),
                discount: Yup.number().min(0, 'Discount must be a positive number'),
                tax: Yup.number().min(0, 'Tax must be a positive number'),
                status: Yup.string().oneOf(['pending', 'completed', 'cancelled'], 'Invalid status').required('Status is required'),
                is_installment: Yup.boolean(),
                installment_amount: Yup.number().when('is_installment', {
                    is: true,
                    then: scheme => scheme.number().min(0, 'Installment amount must be a positive number').required('Installment amount is required'),
                    otherwise: scheme => scheme.optional()
                  }),
                
                installment_period: Yup.string().when('is_installment', {
                  is: true,
                  then: scheme => scheme.string().required('Installment period is required'),
                    otherwise: scheme => scheme.optional()
                }),
                installment_count: Yup.number().when('is_installment', {
                  is: true,
                    then: scheme => scheme.number()
                    .min(1, 'Installment count must be at least 1')
                    .required('Installment count is required'),
                    otherwise: scheme => scheme.optional()
                }),
                installment_start_date: Yup.date().when('is_installment', {
                  is: true,
                  then: scheme => scheme.date().required('Installment start date is required'),
                  otherwise: scheme => scheme.optional()
                }),
                installment_end_date: Yup.date().when('is_installment', {
                  is: true,
                    then: scheme => scheme.date()
                    .min(Yup.ref('installment_start_date'), 'End date must be after start date')
                    .required('Installment end date is required'),
                    otherwise: scheme => scheme.optional()
                }),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              router.post(route('supplier.store'), values, {
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
                        
                          <Field name="code"  className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" type="text" placeholder="Enter supplier code" />
                         
                          
                          <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />

                        
                      </div>

                      <div className="flex items-center justify-start gap-1 mt-8">
                    <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                    </button>
                    <button  onClick={() => router.visit(route('order.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
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

