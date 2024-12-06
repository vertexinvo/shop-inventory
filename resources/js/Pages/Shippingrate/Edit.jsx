import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function List(props) {
  const { auth ,shippingrate} = props;

  return (
    <AuthenticatedLayout
      tax={auth.tax}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Shipping Rate</h2>}
    >
      <Head title="Shipping Rate" />

      <div className="flex flex-col px-4 mt-10 mx-auto w-full">
        <div className="w-full">
          <div className="font-sans antialiased bg-grey-lightest">
            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <Formik
                    enableReinitialize
                    initialValues={{
                      area_name: shippingrate ? shippingrate.area_name : '',
                      postal_code: shippingrate ? shippingrate.postal_code : '',
                      city_name: 'Karachi',  
                      state_name: 'Sindh',   
                      country_name: 'Pakistan', 
                      fee: shippingrate ? shippingrate.fee : '',
                    }}
                    validationSchema={Yup.object({
                      area_name: Yup.string().required('Area name is required'),
                      city_name: Yup.string().required('City name is required'),
                      state_name: Yup.string().required('State name is required'),
                      country_name: Yup.string().required('Country name is required'),
                      fee: Yup.string().required('Fee is required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      router.put(route('shippingrate.update',shippingrate.id), values, { onSuccess: () => resetForm() });
                    }}
                  >
                    <Form>
                      <div className="py-4 px-8">
                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="area_name">Area Name</label>
                            <Field
                              name="area_name"
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="area_name"
                              type="text"
                              placeholder="Enter area name"
                            />
                            <ErrorMessage name="area_name" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                          <div className="w-1/2 ml-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Postal Code</label>
                            <Field
                              name="postal_code"
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="postal_code"
                              type="text"
                              placeholder="Enter postal code"
                            />
                            <ErrorMessage name="postal_code" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>

                        <div className="flex mb-4">
                          <div className="w-1/2 mr-1">
                            {/* Set default value to 'Karachi' and hide the field */}
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="city_name">
                              City Name
                            </label>
                            <Field
                              name="city_name"
                              // value="Karachi" // Set default value to Karachi
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="city_name"
                              type="text"
                              placeholder="Enter city name"
                              
                            />
                            <ErrorMessage
                              name="city_name"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          <div className="w-1/2 ml-1">
                            {/* Set default value to 'Sindh' and hide the field */}
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="state_name">
                              State Name
                            </label>
                            <Field
                              name="state_name"
                              // value="Sindh" // Set default value to Sindh
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="state_name"
                              type="text"
                              placeholder="Enter state name"
                              
                            />
                            <ErrorMessage
                              name="state_name"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        </div>

                        <div className="flex mb-4">
                        <div className="w-1/2 mr-1">
                            {/* Set default value to 'Pakistan' and hide the field */}
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="country_name">
                              Country Name
                            </label>
                            <Field
                              name="country_name"
                              // value="Pakistan" // Set default value to Pakistan
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="country_name"
                              type="text"
                              placeholder="Enter country name"
                            />
                            <ErrorMessage
                              name="country_name"
                              component="div"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>
                        <div className="w-1/2 ml-1">
                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="fee">Fee</label>
                            <Field
                              name="fee"
                              className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                              id="fee"
                              type="text"
                              placeholder="Enter fee"
                            />
                            <ErrorMessage name="fee" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        

                          
                        </div>

                        <div className="flex items-center justify-start gap-1 mt-8">
                          <button
                            className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg"
                            type="submit"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => router.get(route('shippingrate.index'))}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                            type="button"
                          >
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
