import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { RiAiGenerate } from "react-icons/ri";
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from "react-icons/md";

export default function Add(props) {
    const { auth,supplierinvoice, suppliers,product_id,stocklogs } = props;
    const [isNewSupplierModel, setIsNewSupplierModel] = useState(false);
    const [isNewSupplierInvoiceModel, setIsNewSupplierInvoiceModel] = useState(false);

    const [notremember, setNotRemember] = useState(false);

    const [supplierId, setSupplierId] = useState('');


    return (
        <AuthenticatedLayout
            tax={auth.tax}
            header={
                <>
                    <MdKeyboardBackspace
                        size={20}
                        className="mr-2 cursor-pointer"
                        onClick={() => router.get(route('stock.index'),{product_id:product_id})}
                        title="Back"
                    /><h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Stock Log</h2>
                </>}
        >
            <Head title="Edit Stocklog" />

            <div className="flex flex-col px-4 mt-10 mx-auto w-full">
                <div className="w-full">
                    <div className="font-sans antialiased bg-grey-lightest">
                        <div className="w-full bg-grey-lightest">
                            <div className="container mx-auto py-3 px-5">
                                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                                    <Formik
                                        enableReinitialize
                                        initialValues={{
                                            quantity: stocklogs.quantity || '',
                                            type: stocklogs.type,
                                            is_supplier: stocklogs.is_supplier || '',
                                            datetime: stocklogs.datetime || '',
                                            supplier_invoice_no: stocklogs.supplier_invoice_no || '',
                                            remarks: stocklogs.remarks || '',
                                            purchase_price:  stocklogs.purchase_price || '',
                                        }}
                                        validationSchema={Yup.object({
                                            quantity: Yup.number().min(1).required('Quantity is required'),
                                            type: Yup.string().required('Type is required'),
                                            is_supplier: Yup.string().required('Is supplier is required'),
                                            datetime: Yup.date().required('Date is required'),
                                            supplier_invoice_no: Yup.string().when('is_supplier', {
                                                is: '1',
                                                then: scheme => scheme.required(),
                                                otherwise: scheme => scheme.optional()
                                            }),
                                            purchase_price: Yup.number().when('type', {
                                                                            is: 'addition',
                                                                            then: scheme => scheme.required(),
                                                                            otherwise: scheme => scheme.optional()
                                                                }),
                                        })}
                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            router.post(route('stocklog.store'), values, { onSuccess: () => resetForm() });
                                        }}
                                    >
                                        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                                            <Form>
                                                <div className="py-4 px-8">
                                                    <div className="flex mb-4">
                                                        <div className="w-1/2 mr-1">
                                                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="area_name">Quantity</label>
                                                            <Field
                                                                name="quantity"
                                                                className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                                                                id="quantity"
                                                                type="number"
                                                                placeholder="Enter quantity"
                                                            />
                                                            <ErrorMessage name="quantity" component="div" className="text-red-500 text-xs mt-1" />
                                                        </div>
                                                        <div className="w-1/2 ml-1">
                                                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Type</label>
                                                            <Field name="type" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="type" as="select" >
                                                                <option value=''>Select Type</option>
                                                                <option value='addition'>Addition</option>
                                                                <option value="removal">Removal</option>
                                                                <option value="adjustment">Adjustment</option>
                                                            </Field>
                                                            <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                                                        </div>
                                                    </div>


                                                       {values.type === 'addition' && (
                                                        <div className="flex mb-4">
                                                            <div className="w-full mr-1">
                                                                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Purchase Price (Required)</label>
                                                                <Field
                                                                name="purchase_price"
                                                                className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                                                                id="purchase_price"
                                                                type="number" step="any"
                                                                placeholder="Enter Purchase Price"
                                                                />
                                                                <ErrorMessage name="purchase_price" component="div" className="text-red-500 text-xs mt-1" />
                                                            </div>
                                                        </div>
                                                        )}

                                                    <div className="flex mb-4">
                                                        <div className="w-1/2 mr-1">
                                                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="area_name">Date/Time</label>
                                                            <Field
                                                                name="datetime"
                                                                className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                                                                id="datetime"
                                                                type="datetime-local"
                                                                placeholder="Enter Date/Time"
                                                            />
                                                            <ErrorMessage name="datetime" component="div" className="text-red-500 text-xs mt-1" />
                                                        </div>
                                                        <div className="w-1/2 ml-1">
                                                            <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="postal_code">Remarks (Optional)</label>
                                                            <Field
                                                                name="remarks"
                                                                className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker"
                                                                id="remarks"
                                                                type="text"
                                                                placeholder="Enter Remarks"
                                                            />
                                                            <ErrorMessage name="remarks" component="div" className="text-red-500 text-xs mt-1" />
                                                        </div>
                                                    </div>


                                                    <div className="mb-4">
                                                        <label className="block text-grey-darker text-sm font-bold mb-2">Is Supplier</label>
                                                        <div className="flex items-center">
                                                            <label className="mr-4 ">
                                                                <Field name="is_supplier" type="radio" value="1" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> Yes
                                                            </label>
                                                            <label>
                                                                <Field name="is_supplier" type="radio" value="0" className="mr-2 checked:bg-black checked:hover:bg-gray-700 checked:active:bg-black checked:focus:bg-black focus:bg-black focus:outline-none focus:ring-1 focus:ring-black" /> No
                                                            </label>
                                                        </div>
                                                        <ErrorMessage name="is_supplier" component="div" className="text-red-500 text-xs mt-1" />
                                                    </div>


                                                    {values.is_supplier === '1' && (

                                                        <div className="mb-4">

                                                            <label className="block text-grey-darker text-sm  mb-2" for="shop_name">Supplier Invoice No (Existing) &nbsp;  <button type='button' onClick={() => {
                                                                setNotRemember(!notremember);
                                                                setFieldValue('supplier_invoice_no', '')
                                                            }} className='text-black text-sm underline hover:text-gray-700'>{!notremember ? 'Not remember?' : 'Remember!'}</button></label>
                                                            {!notremember ? (
                                                                <Field name="supplier_invoice_no" className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="supplier_invoice_no" type="text" placeholder="Enter supplier invoice no" />
                                                            ) : (
                                                                <>
                                                                    <select onChange={(e) => {
                                                                        setFieldValue('supplier_invoice_no', '')
                                                                        setSupplierId(e.target.value)
                                                                        router.get(route('stocklog.create'), { supplier_id: e.target.value, product_id: product_id }, { preserveState: true, preserveScroll: true }
                                                                        )
                                                                    }} className="appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="supplier_invoice_no">
                                                                        <option value="">Select supplier</option>
                                                                        {suppliers.map((supplier) => (
                                                                            <option key={supplier.id} value={supplier.id}>{supplier.person_name + ' - ' + supplier.code + ' - ' + supplier.contact}</option>
                                                                        ))}
                                                                    </select>
                                                                    {supplierinvoices.length > 0 && (
                                                                        <Field as="select" name="supplier_invoice_no" className="mt-2 appearance-none border rounded w-full py-2 px-3   focus:ring-black focus:border-black text-grey-darker" id="supplier_invoice_no">
                                                                            <option value="">Select supplier invoice no</option>
                                                                            {supplierinvoices.map((item) => (
                                                                                <option key={item.id} value={item.invoice_no}>{item.invoice_no}</option>
                                                                            ))}
                                                                        </Field>
                                                                    )}

                                                                </>


                                                            )}

                                                            <ErrorMessage name="supplier_invoice_no" component="div" className="text-red-500 text-xs mt-1" />
                                                            <div className="flex items-center justify-start gap-2 mt-2">

                                                                <button type='button' onClick={() => setIsNewSupplierInvoiceModel(true)} className='text-black text-sm underline hover:text-gray-700'>Create a new invoice</button>
                                                                <button type='button' onClick={() => setIsNewSupplierModel(true)} className='text-black text-sm underline hover:text-gray-700'>Create a new supplier</button>

                                                            </div>
                                                        </div>
                                                    )}




                                                    <div className="flex items-center justify-start gap-1 mt-8">
                                                        <button
                                                            className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg"
                                                            type="submit"
                                                        >
                                                            Update
                                                        </button>
                                                        {/* <button className="bg-black hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-lg" type="button">
                          Save & Close
                           </button> */}
                                                        <button
                                                             onClick={() => router.get(route('stock.index'),{product_id:product_id})}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                                                            type="button"
                                                        >
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


            <Modal show={isNewSupplierModel} onClose={() => setIsNewSupplierModel(false)}>
                <div className="overflow-y-auto max-h-[80vh]">
                    <div className="flex justify-center p-10">
                        <div className="text-2xl font-medium text-[#5d596c] ">
                            Create New Supplier
                        </div>
                    </div>

                    <div className="px-10 mb-5">
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
                                    router.get(route('stocklog.create'), { code: true, product_id: product_id }, {
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
                    </div>
                </div>
            </Modal>


            <Modal show={isNewSupplierInvoiceModel} onClose={() => setIsNewSupplierInvoiceModel(false)}>
                <div className="overflow-y-auto max-h-[80vh]">
                    <div className="flex justify-center p-10">
                        <div className="text-2xl font-medium text-[#5d596c] ">
                            Create New Invoice
                        </div>
                    </div>

                    <div className="px-10 mb-5">
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
                                    router.get(route('stocklog.create'), { invoicecode: true, product_id: product_id }, {
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
                                                        Cheque No (optional)
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
                                                        Cheque Date (optional)
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
                                            <button onClick={() => href=route('stock.index')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg" type="button">
                                                Close
                                            </button>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </Modal>



        </AuthenticatedLayout>
    );
}
