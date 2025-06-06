import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';


function SupplierinvoiceForm(props) {
    const { setIsNewSupplierInvoiceModel,codeRoute,id } = props
    return (
       <Formik enableReinitialize initialValues={{
              supplier_code: "",
              invoice_no: "",
              invoice_date: "",
              due_date: "",
              total_payment: "",
              status: "",
              method: "",
              cheque_no: "",
              cheque_date: "",
              bank_name: "",
              bank_branch: "",
              bank_account: "",
              online_payment_link: "",
              payment_proof: "",
              note: "",
            }}
              validationSchema={Yup.object({
                supplier_code: Yup.string().required("Supplier Code is required"),
                invoice_no: Yup.string().required("Invoice No is required"),
                invoice_date: Yup.date().required("Invoice Date is required"),
                due_date: Yup.date().required("Due Date is required"),
                total_payment: Yup.number().required(
                  "Total Pending Payment is required"
                ),
                status: Yup.string().required("Status is required"),
                method: Yup.string().required("Method is required"),
                cheque_no: Yup.string().when("method", {
                  is: "cheque",
                  then: (scheme) => scheme.required("Cheque No is required"),
                  otherwise: (scheme) => scheme.optional(),
                }),
                cheque_date: Yup.string().when("method", {
                  is: "cheque",
                  then: (scheme) => scheme.required("Cheque Date is required"),
                  otherwise: (scheme) => scheme.optional(),
                }),
                bank_name: Yup.string(),
                bank_branch: Yup.string(),
                bank_account: Yup.string(),
                online_payment_link: Yup.string().url("Must be a valid URL"),
                payment_proof: Yup.string(),
                note: Yup.string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                router.post(route('supplier-invoice.store'), values, {
                  onSuccess: () => {
                    setIsNewSupplierInvoiceModel(false);
                  },
                  preserveScroll: true,
                  preserveState: true,
                });

              }}
            >
              {({ isSubmitting, values, errors, setFieldValue, }) => {

                const generateInvoiceNo = () => {
                  router.get(route(codeRoute,id || ''), { invoicecode: true }, {
                    onSuccess: (response) => {
                      setFieldValue('invoice_no', response.props.invoicecode);
                    },
                    preserveScroll: true,
                    preserveState: true
                  });
                }

                return (
                  <Form>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm  mb-2">Supplier Code</label>
                      <Field name="supplier_code" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" type="text" placeholder="Enter supplier code" />

                      <ErrorMessage name="supplier_code" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Invoice No
                      </label>
                      <div className="flex gap-2 items-center">
                        <Field
                          name="invoice_no"
                          className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                          type="text"
                          placeholder="Enter invoice no"
                        />
                        <RiAiGenerate onClick={() => generateInvoiceNo()} size={40} color="black" />
                      </div>
                      <ErrorMessage
                        name="invoice_no"
                        component="div"
                        className="text-red-500 text-xs mt-1"

                      />
                      {values.invoice_no !== '' &&
                        <button type="button" onClick={() => {
                          //copy to clipboard
                          navigator.clipboard.writeText(values.invoice_no);
                          toast.success('Copied to clipboard');
                        }} className='bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2' >Copy</button>
                      }
                    </div>
                    {/* Invoice Date */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Invoice Date
                      </label>
                      <Field
                        name="invoice_date"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="date"
                      />
                      <ErrorMessage
                        name="invoice_date"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Due Date */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Due Date
                      </label>
                      <Field
                        name="due_date"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="date"
                      />
                      <ErrorMessage
                        name="due_date"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Total Pending Payment */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Total Payment
                      </label>
                      <Field
                        name="total_payment"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        type="number"
                        placeholder="Enter total payment"
                      />
                      <ErrorMessage
                        name="total_payment"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Payment Status
                      </label>
                      <Field
                        as="select"
                        name="status"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>

                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Payment Method
                      </label>
                      <Field
                        as="select"
                        name="method"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                      >
                        <option value="">Select method</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="bank">Bank</option>
                        <option value="online">Online</option>
                      </Field>
                      <ErrorMessage
                        name="method"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>




                    {values.method === "cheque" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Cheque No
                          </label>
                          <Field
                            name="cheque_no"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter cheque no"
                          />
                          <ErrorMessage
                            name="cheque_no"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>


                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Cheque Date
                          </label>
                          <Field
                            name="cheque_date"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="date"
                          />
                          <ErrorMessage
                            name="cheque_date"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    {values.method === "bank" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Bank Name (optional)
                          </label>
                          <Field
                            name="bank_name"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank name"
                          />
                          <ErrorMessage
                            name="bank_name"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>


                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Brank Brank (optional)
                          </label>
                          <Field
                            name="bank_branch"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank branch"
                          />
                          <ErrorMessage
                            name="bank_branch"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Bank Account No (optional)
                          </label>
                          <Field
                            name="bank_account"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="text"
                            placeholder="Enter bank account no"
                          />
                          <ErrorMessage
                            name="bank_account"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    {values.method === "online" && (
                      <>
                        <div className="mb-4">
                          <label className="block text-grey-darker text-sm mb-2">
                            Online payment link (optional)
                          </label>
                          <Field
                            name="online_payment_link"
                            className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                            type="url"
                            placeholder="Enter online payment link"
                          />
                          <ErrorMessage
                            name="online_payment_link"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                      </>
                    )}


                    <div className="mb-4">
                      <label className="block text-grey-darker text-sm mb-2">
                        Note (optional)
                      </label>
                      <Field
                        name="note"
                        className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                        as="textarea"
                        placeholder="Enter note"
                      ></Field>
                      <ErrorMessage
                        name="note"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>


                    <div className="flex items-center justify-start gap-1 mt-8">
                      <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="submit">
                        Submit
                      </button>
                      <button onClick={() => setIsNewSupplierInvoiceModel(false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                        Close
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
    )
}

export default SupplierinvoiceForm