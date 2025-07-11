import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { MdKeyboardBackspace } from 'react-icons/md';

export default function SupplierLedger(props) {
    const {
        auth,
        supplier,
        invoices = [],
        openingBalance = 0,
        totalPayable = 0,
        totalPaid = 0,
        totalPending = 0,
        totalAdjustments = 0,
        filters
    } = props;

    const setting = usePage().props.setting;
    let runningBalance = Number(openingBalance);

    // State for date filters
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    // Function to apply date filter
    const applyDateFilter = () => {
        const params = new URLSearchParams();
        
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        
        const queryString = params.toString();
        const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        
        router.visit(url);
    };

    // Function to clear date filter
    const clearDateFilter = () => {
        setStartDate('');
        setEndDate('');
        router.visit(window.location.pathname);
    };

    // Function to get date range text for print
    const getDateRangeText = () => {
        if (startDate && endDate) {
            return `Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
        } else if (startDate) {
            return `From: ${new Date(startDate).toLocaleDateString()}`;
        } else if (endDate) {
            return `Until: ${new Date(endDate).toLocaleDateString()}`;
        }
        return 'All Time';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                        <MdKeyboardBackspace
                            size={20}
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                            onClick={() => window.history.back()}
                            title="Back"
                        />
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Supplier Ledger</h2>
                    </div>
                </div>
            }
        >
            <Head title="Supplier Ledger" />

            <style>
                {`
                    @media print {
                        .no-print, nav, aside, .fixed, .toastify-container, .ConfirmModal {
                            display: none !important;
                        }
                        .sm\\:ml-64 {
                            margin-left: 0 !important;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                    }
                `}
            </style>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Date Range Filter */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 no-print">
                    <h3 className="text-lg font-semibold mb-4">Filter by Date Range</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={applyDateFilter}
                                className="bg-black text-white px-4 py-2 rounded hover:bg-black transition duration-300"
                            >
                                Apply Filter
                            </button>
                            <button
                                onClick={clearDateFilter}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mb-4 no-print">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition duration-300"
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

                {/* Supplier Ledger Content */}
                <div className="max-w-10xl mx-auto p-6 bg-white rounded shadow-sm my-6">
                    {/* Header */}
                    <div className="grid grid-cols-2 items-center">
                        <div>
                            <img
                                src={setting.site_logo || "/images/logo2.png"}
                                alt="Company Logo"
                                className="h-16"
                            />
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-semibold">Supplier Ledger</h2>
                            <p className="text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                            <p className="text-gray-500">{getDateRangeText()}</p>
                        </div>
                    </div>

                    {/* Supplier Details */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Supplier Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p><strong>Name:</strong> {supplier.person_name || 'N/A'}</p>
                                <p><strong>Email:</strong> {supplier.email || 'N/A'}</p>
                                <p><strong>Code:</strong> {supplier.code || 'N/A'}</p>
                            </div>
                            <div>
                                <p><strong>Phone:</strong> {supplier.contact || 'N/A'}</p>
                                <p><strong>Address:</strong> {supplier.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Opening Balance */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Opening Balance</h3>
                        <p>Rs. {Number(openingBalance).toFixed(2)}</p>
                    </div>

                    {/* Transactions Table */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Transactions</h3>
                        {invoices.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b text-left">Date</th>
                                        <th className="py-2 px-4 border-b text-left">Invoice #</th>
                                        <th className="py-2 px-4 border-b text-left">Debit (Dr)</th>
                                        <th className="py-2 px-4 border-b text-left">Credit (Cr)</th>
                                        <th className="py-2 px-4 border-b text-left">Dr or Cr</th>
                                        <th className="py-2 px-4 border-b text-left">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice, index) => {
                                        const debit = Number(invoice.total_payment || 0);
                                        const credit = Number(invoice.paid_amount || 0);
                                        runningBalance += debit - credit;
                                        const balanceType = runningBalance >= 0 ? 'Dr' : 'Cr';

                                        return (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-4">{invoice.invoice_date || 'N/A'}</td>
                                                <td className="py-2 px-4">{invoice.invoice_no || 'N/A'}</td>
                                                <td className="py-2 px-4">Rs. {debit.toFixed(2)}</td>
                                                <td className="py-2 px-4">Rs. {credit.toFixed(2)}</td>
                                                <td className="py-2 px-4">{balanceType}</td>
                                                <td className="py-2 px-4">Rs. {Math.abs(runningBalance).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No transactions found for the selected date range.</p>
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Summary</h3>
                        <table className="min-w-full bg-white border border-gray-300">
                            <tbody>
                                {[
                                    { label: 'Total Payable', value: totalPayable },
                                    { label: 'Total Paid', value: totalPaid },
                                    { label: 'Total Pending', value: totalPending },
                                    { label: 'Total Adjustments', value: totalAdjustments },
                                    { label: 'Closing Balance', value: runningBalance }
                                ].map((item, index) => (
                                    <tr key={index}>
                                        <th className="py-2 px-4 border-b text-left">{item.label}</th>
                                        <td className="py-2 px-4 border-b text-right">Rs. {Number(item.value).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                        Developed by <strong>Solinvo</strong>
                        <span className="mx-1">&bull;</span>
                        <a href="https://solinvo.com" target="_blank" className="hover:underline">Powered by VertexInvo</a>
                        <br />
                        <p><strong>Printed on:</strong> {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}