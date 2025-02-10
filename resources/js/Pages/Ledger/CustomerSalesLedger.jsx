import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { MdKeyboardBackspace } from 'react-icons/md';

export default function CustomerSalesLedger(props) {
    const {
        auth,
        customer,
        orders,
        openingBalance,
        runningBalance,
        totalPayable,
        totalPaid,
        totalPending,
        totalAdjustments,
    } = props;

       const setting = usePage().props.setting;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                    <MdKeyboardBackspace
                        size={20}
                        className="mr-2 cursor-pointer"
                        onClick={() => router.get(route('ledger.sales'))}
                        title="Back"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Customer Sales Ledger</h2>
                </>
            }
        >
            <Head title="Customer Sales Ledger" />

            <style>
                {`
                    @media print {
                        .no-print {
                            display: none;
                        }
                        .print-gap {
                            margin-top: 100px;
                        }
                        /* Hide unnecessary elements */
                        .no-print,
                        nav,
                        aside,
                        .fixed,
                        .toastify-container,
                        .ConfirmModal {
                            display: none !important;
                        }
                        /* Adjust main content for full width */
                        .sm\\:ml-64 {
                            margin-left: 0 !important;
                        }
                        .print-w-full {
                            width: 100%;
                        }
                        /* Ensure a gap before content begins */
                        .print-gap {
                            margin-top: 100px;
                        }
                        /* Handle page breaks for large content */
                        .page-break {
                            page-break-before: always;
                        }
                    }
                `}
            </style>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Action Buttons */}
                <div className="flex justify-end mb-4 no-print">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="ml-2 bg-black text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition duration-300"
                    >
                        Print PDF
                    </button>
                </div>

                {/* Sales Ledger Content */}
                <div className="max-w-10xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
                    {/* Header */}
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            <img
                                src={  setting.site_logo ||  "/images/logo2.png"}  // Replace with your logo
                                alt="Company Logo"
                                className="h-16"
                            />
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold">Customer Sales Ledger</h2>
                            <p className="text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Name:</strong> {customer.name || 'N/A'}</p>
                                <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
                                <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Opening Balance */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Opening Balance</h3>
                        <p>Rs. {openingBalance.toFixed(2)}</p>
                    </div>

                    {/* Orders Table */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Transactions</h3>
                        {/* <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">Order ID</th>
                                    <th className="py-2 px-4 border-b text-left">Order Date</th>
                                    <th className="py-2 px-4 border-b text-left">Total Payable</th>
                                    <th className="py-2 px-4 border-b text-left">Paid Amount</th>
                                    <th className="py-2 px-4 border-b text-left">Pending Amount</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Running Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const runningBalance = openingBalance + totalPayable - totalPaid;
                                    return (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{order.code || order.id || 'N/A'}</td>
                                            <td className="py-2 px-4">{order.order_date || 'N/A'}</td>
                                            <td className="py-2 px-4">Rs. {order.payable_amount || 0}</td>
                                            <td className="py-2 px-4">Rs. {order.paid_amount || 0}</td>
                                            <td className="py-2 px-4">Rs. {order.pending_amount.toFixed(2) || 0}</td>
                                            <td className="py-2 px-4">{order.status || 'N/A'}</td>
                                            <td className="py-2 px-4">Rs. {runningBalance.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table> */}
                        <table className="min-w-full bg-white border border-gray-300">
    <thead>
        <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Particulars</th>
            <th className="py-2 px-4 border-b text-left">Folio</th>
            <th className="py-2 px-4 border-b text-left">Debit (Dr)</th>
            <th className="py-2 px-4 border-b text-left">Credit (Cr)</th>
            <th className="py-2 px-4 border-b text-left">Dr or Cr</th>
            <th className="py-2 px-4 border-b text-left">Balance</th>
        </tr>
    </thead>
    <tbody>
        {orders.map((order, index) => {
            const debit = Number(order.payable_amount) || 0; // Ensure it's a number
            const credit = Number(order.paid_amount) || 0;   // Ensure it's a number
            const balanceType = runningBalance >= 0 ? 'Dr' : 'Cr';

            return (
                <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{order.order_date || 'N/A'}</td>
                    <td className="py-2 px-4">{`Order #${order.code || order.id}`}</td>
                    <td className="py-2 px-4">{order.code || 'N/A'}</td>
                    <td className="py-2 px-4">Rs. {debit.toFixed(2)}</td>
                    <td className="py-2 px-4">Rs. {credit.toFixed(2)}</td>
                    <td className="py-2 px-4">{balanceType}</td>
                    <td className="py-2 px-4">Rs. {runningBalance.toFixed(2)}</td>
                </tr>
            );
        })}
    </tbody>
</table>

                    </div>

                    {/* Summary Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Summary</h3>
                        <table className="min-w-full bg-white border border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Total Payable</th>
                                    <td className="py-2 px-4 border-b text-right">Rs. {totalPayable.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Total Paid</th>
                                    <td className="py-2 px-4 border-b text-right">Rs. {totalPaid.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Total Pending</th>
                                    <td className="py-2 px-4 border-b text-right">Rs. {totalPending.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Total Adjustments</th>
                                    <td className="py-2 px-4 border-b text-right">Rs. {totalAdjustments.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">Closing Balance</th>
                                    <td className="py-2 px-4 border-b text-right">Rs. {runningBalance.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                        Developed by <strong>Solinvo</strong>
                        <span className="mx-1">&bull;</span>
                        <a href="https://solinvo.com" target="_blank" className="hover:underline">Powered by Vertexinvo</a>
                        <br />
                        <br />
                        <p className="text-xs text-gray-500">
                            <strong>Printed on:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}