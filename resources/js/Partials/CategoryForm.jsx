import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';


function BrandForm(props) {
    const { categories, category } = props
    return (
        <Formik enableReinitialize initialValues={{ name: category?.name || '', description: category?.description || '', parent_id: category?.parent_id || '' }}
            validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                description: Yup.string()
                    .test('word-limit', 'Description cannot exceed 50 words', (value) => {
                        if (!value) return true;
                        const wordCount = value.trim().split(/\s+/).length;
                        return wordCount <= 50;
                    }),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                category ?
                 router.put(route('category.update', category.id), values, { onSuccess: () => resetForm(), preserveState: false, replace: true }) 
                 :
                 router.post(route('category.store'), values, { onSuccess: () => resetForm(), preserveState: false, replace: true });
            }}
        >

            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                    <div className="py-4 px-8">
                        <div className="flex mb-4">
                            <div className="w-full mr-1">
                                <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Name</label>
                                <Field name="name" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="name" type="text" placeholder="Enter name" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                            </div>


                        </div>
                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Description</label>
                            <Field as="textarea" rows="4" name="description" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="description" type="text" placeholder="Enter description" />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
                        </div>


                        <div className="mb-4">
                            <label className="block text-grey-darker text-sm font-bold mb-2" for="first_name">Parent Category</label>
                            <Field name="parent_id" className="appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="description" as="select">
                                <option value="">Select Parent Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="parent_id" component="div" className="text-red-500 text-xs mt-1" />
                        </div>








                        <div className="flex items-center justify-start gap-1 mt-8">
                            <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                                Save
                            </button>
                            {/* <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="button">
              Save & Close
              </button> */}
                            <button onClick={() => router.get(route('category.index'))} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                                Close
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default BrandForm