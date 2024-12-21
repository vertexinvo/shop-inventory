import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MdKeyboardBackspace } from "react-icons/md";

export default function SiteSetting(props) {
  const { auth,setting } = props;

  console

  return (
    <AuthenticatedLayout
      tax={auth.tax}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('setting'))}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Site Setting</h2>
        </>
      }
    >
      <Head title="Site Setting" />

      <div className="flex flex-col px-4 mt-10 mx-auto w-full">
        <div className="w-full">
          <div className="font-sans antialiased bg-grey-lightest">
            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <Formik
                    enableReinitialize
                    initialValues={{
                      site_name: setting?.site_name || '',
                      site_title: setting?.site_title || '',
                      site_description: setting?.site_description || '',
                      site_logo: setting?.site_logo || '',
                      site_icon: setting?.site_icon || '',
                      site_favicon: setting?.site_favicon || '',
                      site_email: setting?.site_email || '',
                      site_phone: setting?.site_phone || '',
                      site_address: setting?.site_address || '',
                      site_currency: setting?.site_currency || '',
                      site_currency_symbol: setting?.site_currency_symbol || '',
                      site_currency_position: setting?.site_currency_position || '',
                      site_timezone: setting?.site_timezone || '',
                      site_language: setting?.site_language || '',
                      site_status: setting?.site_status || '',
                      site_maintenance: setting?.site_maintenance === "1" && true || false,
                      site_maintenance_message: setting?.site_maintenance_message || '',
                    }}
                   
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      router.post(route('setting.update'), values);
                    }}
                  >
                    {({ isSubmitting, resetForm, setSubmitting,values }) => (
                    <Form>
                      <div className="py-4 px-8">
                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="site_name">Site Name</label>
                            <Field
                              name="site_name"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_name" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_title">Site Title</label>
                            <Field
                              name="site_title"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_title" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_description">Site Description</label>
                            <Field
                              name="site_description"
                              as="textarea"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_logo">Site Logo URL</label>
                            <Field
                              name="site_logo"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_logo" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_icon">Site Icon URL</label>
                            <Field
                              name="site_icon"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_icon" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_favicon">Upload Site Favicon</label>
                            <Field
                              name="site_favicon"
                              type="file"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_favicon" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_email">Site Email</label>
                            <Field
                              name="site_email"
                              type="email"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_email" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_phone">Site Phone</label>
                            <Field
                              name="site_phone"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_address">Site Address</label>
                            <Field
                              name="site_address"
                              as="textarea"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_currency">Currency</label>
                            <Field
                              name="site_currency"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_currency" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_currency_symbol">Currency Symbol</label>
                            <Field
                              name="site_currency_symbol"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_currency_position">Currency Position</label>
                            <Field
                              name="site_currency_position"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_timezone">Timezone</label>
                            <Field
                              name="site_timezone"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_language">Language</label>
                            <Field
                              name="site_language"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div>
                          {/* <div>
                            <label htmlFor="site_status">Site Status</label>
                            <Field
                              name="site_status"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                          </div> */}
                          <div>
                            <label htmlFor="site_maintenance">
                              Maintenance Mode
                            </label>
                            <Field
                              checked={values.site_maintenance == "1" ? true : false}
                              name="site_maintenance"
                              type="checkbox"
                              className="ml-2"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_maintenance_message">
                              Maintenance Message
                            </label>
                            <Field
                              name="site_maintenance_message"
                              as="textarea"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage
                              name="site_maintenance_message"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-start gap-1 mt-8">
                          <button
                            className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg"
                            type="submit"
                          >
                            Save
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
