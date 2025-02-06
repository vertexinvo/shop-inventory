import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from '@inertiajs/react';
import { useState } from 'react';

const ScanProduct = () => {
    const [isScanning, setIsScanning] = useState(false);
    return (
        <>
            <AuthenticatedLayout

                header={
                    <>
                        <MdKeyboardBackspace
                            size={20}
                            className="mr-2 cursor-pointer"
                            onClick={() => router.get(route('order.index'))}
                            title="Back"
                        /><h2 className="font-semibold text-xl text-gray-800 leading-tight">Scan Product</h2>
                    </>}
            >
                <Head title="Scan Product" />



                <div className="flex justify-center items-center bg-gray-100">
                    <div className="p-4 sm:p-6 m-4 sm:m-8 w-full sm:w-2/3 md:w-2/3 lg:w-1/3 rounded-lg bg-white shadow-lg text-center relative">
                        <h2 className="text-xl sm:text-2xl font-semibold pb-4">Scan The QR</h2>
                        <div className="h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 mx-auto">
                            {!isScanning && (
                                <img src="/images/scanQR.jpg" className="animate-fadeIn w-full h-full" alt="QR Code" />
                            )}
                            {/* Show animation only when scanning */}
                            {isScanning && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-pulse">
                                        <img src="/images/scanQR.jpg" className="w-full h-full" alt="QR Code" />
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Buttons */}
                        <div className="grid gap-4 mt-6">
                            <button
                                onClick={() => setIsScanning(!isScanning)}
                                className="bg-black text-white py-2 rounded-md text-sm sm:text-base"
                            >
                                {isScanning ? "Stop Scanning..." : "Start Scanning"}
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-gray-500 text-white py-2 rounded-md text-sm sm:text-base"
                            >
                                Reload
                            </button>
                            <Link
                                href={route("product.index")}
                                className="bg-red-500 text-white py-2 rounded-md text-center text-sm sm:text-base"
                            >
                                Close
                            </Link>
                        </div>
                    </div>
                </div>


            </AuthenticatedLayout>
        </>
    )
}

export default ScanProduct