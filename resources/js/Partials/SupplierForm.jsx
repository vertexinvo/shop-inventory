import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';


function SupplierForm(props) {
    const { setIsNewSupplierModel, codeRoute ,id } = props
    return (
       <Formik enableReinitialize initialValues={{ person_name: '', email: '', contact: '', address: '', code: '' }}
                     validationSchema={Yup.object({
                       person_name: Yup.string().required('Name is required'),
                       email: Yup.string().email('Invalid email address'),
                       contact: Yup.string().required('Contact is required'),
                       address: Yup.string(),
                       code: Yup.string().required('Code is required'),
                     })}
                     onSubmit={(values, { setSubmitting }) => {
                       router.post(route('supplier.store'), values, {
                         onSuccess: () => {
                           setIsNewSupplierModel(false);
                         },
                         preserveScroll: true,
                         preserveState: true,
                       });
       
                     }}
                   >
                     {({ isSubmitting, values, errors, setFieldValue, }) => {
       
                       const generateCode = () => {
                         router.get(route(codeRoute , id || ''), { code: true }, {
                           onSuccess: (response) => {
                             setFieldValue('code', response.props.code);
                           },
                           preserveScroll: true,
                           preserveState: true
                         });
                       }
       
                       return (
                         <Form>
                           <div className="mb-4">
                             <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Supplier Name</label>
                             <Field name="person_name" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier name" />
                             <ErrorMessage name="person_name" component="div" className="text-red-500 text-xs mt-1" />
                           </div>
       
                           <div className="mb-4">
                             <label className="block text-grey-darker text-sm  mb-2" for="shop_address">Supplier Address</label>
                             <Field name="address" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier address" />
                             <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                           </div>
       
                           <div className="mb-4">
                             <label className="block text-grey-darker text-sm  mb-2" for="shop_contact">Supplier Contact</label>
                             <Field name="contact" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="number" placeholder="Enter supplier contact" />
                             <ErrorMessage name="contact" component="div" className="text-red-500 text-xs mt-1" />
                           </div>
       
                           <div className="mb-4">
                             <label className="block text-grey-darker text-sm  mb-2" for="shop_email">Supplier Email</label>
                             <Field name="email" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="email" placeholder="Enter supplier email" />
                             <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                           </div>
       
                           <div className="mb-4">
                             <label className="block text-grey-darker text-sm  mb-2" for="shop_code">Supplier Code</label>
                             <div className="flex gap-2 items-center">
                               <Field name="code" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier code" />
       
                               <RiAiGenerate onClick={() => generateCode()} size={40} color="black" />
                             </div>
                             <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
       
                             {values.code !== '' &&
                               <button type='button' onClick={() => {
                                 //copy to clipboard
                                 navigator.clipboard.writeText(values.code);
                                 toast.success('Copied to clipboard');
                               }} className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2' >Copy</button>
                             }
                           </div>
       
                           <div className="flex items-center justify-start gap-1 mt-8">
                             <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                               Submit
                             </button>
                             <button onClick={() => setIsNewSupplierModel(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                               Close
                             </button>
                           </div>
                         </Form>
                       )
                     }}
                   </Formik>
    )
}

export default SupplierForm