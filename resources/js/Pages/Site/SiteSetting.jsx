import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MdKeyboardBackspace } from "react-icons/md";

export default function SiteSetting(props) {
  const { auth,setting ,currencies} = props;

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


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
                      site_logo: setting?.site_logo || null,
                      site_icon: setting?.site_icon || null,
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
                    validationSchema={Yup.object({
                      site_name: Yup.string().required('Site name is required'),
                      site_title: Yup.string().required('Site title is required'),
                      site_icon: Yup.string().required('Site icon is required'),
                      site_phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
                      site_email: Yup.string().email('Invalid email address').required('Email is required'),
                      site_currency: Yup.string().required('Currency is required'),
                      site_currency_symbol: Yup.string().required('Currency symbol is required'),
                      site_currency_position: Yup.string().required('Currency name is required'),
                    })}
                   
                    onSubmit={(values, { setSubmitting, resetForm  }) => {
                      router.post(route('setting.update'), values);
                    }}
                  >
                    {({ isSubmitting, resetForm, setSubmitting,values,setFieldValue }) => (
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
                            <label htmlFor="site_icon">Site Icon URL</label>
                            <Field
                              name="site_icon"
                              className="block w-full border rounded-md p-2 mt-1"
                            />
                            <ErrorMessage name="site_icon" component="div" className="text-red-500 text-sm" />
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
                            <ErrorMessage name="site_phone" component="div" className="text-red-500 text-sm" />
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
                            as="select"
                              name="site_currency"
                              className="block w-full border rounded-md p-2 mt-1"
                              onChange={(e) => {
                              
                                const selectedCurrency = currencies.find((currency) => currency.cc === e.target.value);
                                if (selectedCurrency) {
                                  setFieldValue('site_currency', selectedCurrency.cc);
                                  setFieldValue('site_currency_symbol', selectedCurrency.symbol);
                                  setFieldValue('site_currency_position', selectedCurrency.name);
                                }
                              }}
                            >
                              {currencies.map((currency) => (
                                <option key={currency} value={currency.cc}>{currency.cc} - {currency.symbol} - {currency.name}</option>
                              ))}
                              
                            
                            </Field>
                            <ErrorMessage name="site_currency" component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <label htmlFor="site_currency_symbol">Currency Symbol</label>
                            <Field
                            disabled
                              name="site_currency_symbol"
                              className="block w-full border rounded-md p-2 mt-1 disabled:bg-gray-200"
                            />
                          </div>
                          <div>
                            <label htmlFor="site_currency_position">Currency Name</label>
                            <Field
                              disabled
                              name="site_currency_position"
                              className="block w-full border rounded-md p-2 mt-1 disabled:bg-gray-200"
                            />
                          </div>
                        
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

                        <div className='mt-4'>
                          <img src={setting?.site_logo || '/images/logo.png'} alt="site logo" className="mb-2 w-20 h-20 rounded-full border border-black" />
                          <label htmlFor="site_logo" >Upload Site Logo</label>
                          <input
                            type="file"
                            name="site_logo"
                            onChange={(event) => setFieldValue('site_logo', event.currentTarget.files[0])}
                            className="block w-full border rounded-md p-2 mt-1"
                          />
                        </div>

                        <div className='mt-4'>
                        <img src={setting?.site_favicon || '/images/logo.png' } alt="site favicon logo" className="mb-2 w-20 h-20 rounded-full border border-black" />
                          <label htmlFor="site_favicon" >Upload Site Favicon</label>
                          <input
                            type="file"
                            name="site_favicon"
                            onChange={(event) => setFieldValue('site_favicon', event.currentTarget.files[0])}
                            className="block w-full border rounded-md p-2 mt-1"
                          />
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
