import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { MdKeyboardBackspace } from "react-icons/md";
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaUserCheck, FaUserLock, FaUsers } from 'react-icons/fa6';
import { SiMicrosoftexcel } from "react-icons/si";


export default function List(props) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
    const { auth, expences } = props
    console.log(expences)
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [selectId, setSelectId] = useState([]);

    return (
        <AuthenticatedLayout
            user={auth.Expence}
            header={
                <>
                    <MdKeyboardBackspace
                        size={20}
                        className="mr-2 cursor-pointer"
                        onClick={() => router.get(route('dashboard'))}
                        title="Back"
                    />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Expence</h2>
                </>}
        >
            <Head title="Expence" />
            <div class="px-5 mx-4  py-5">
                <div className="overflow-x-auto">
                    <div class="font-[sans-serif] overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead class="whitespace-nowrap">
                                <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
                                    <th class="pl-4 w-8">
                                        {/* <input id="checkbox" type="checkbox" class="hidden peer"
                                            onChange={(e) => setSelectId(e.target.checked ? users.data.map((user) => user.id) : [])}
                                            checked={selectId.length === users.data.length}
                                        /> */}
                                        <label for="checkbox"
                                            class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-full fill-white" viewBox="0 0 520 520">
                                                <path
                                                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                                                    data-name="7-Check" data-original="#000000" />
                                            </svg>
                                        </label>
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Name
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Type
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        DateTime
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Description
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Amount
                                    </th>

                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Status
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Pending Amount
                                    </th>
                                    <th class="p-4 text-left text-sm font-semibold ">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="whitespace-nowrap">

                                {expences.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center">
                                            No data available
                                        </td>
                                    </tr>
                                ) : null}

                                {expences.map((user, index) => (
                                    <tr key={user.id} class="odd:bg-gray-50 border-b border-gray-300">
                                        <td className="pl-4 w-8">
                                            <input
                                                id={`checkbox-${user.id}`} // Unique id for each checkbox
                                                type="checkbox"
                                                className="hidden peer"
                                                value={user.id}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectId((prev) => [...prev, user.id]); // Add user ID to state
                                                    } else {
                                                        setSelectId((prev) => prev.filter((id) => id !== user.id)); // Remove user ID from state
                                                    }
                                                }}
                                                checked={selectId.includes(user.id)} // Bind state to checkbox
                                            />
                                            <label
                                                htmlFor={`checkbox-${user.id}`} // Match label with checkbox id
                                                className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-full fill-white"
                                                    viewBox="0 0 520 520"
                                                >
                                                    <path
                                                        d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                                                    />
                                                </svg>
                                            </label>
                                        </td>
                                        <td class="p-4 text-sm">{user.name || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.type || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.date_time || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.description || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.amount || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.status || 'N/A'}</td>
                                        <td class="p-4 text-sm">{user.pending_amount || 'N/A'}</td>

                                        <td class="p-4 flex items-center gap-2">
                                            <button
                                                onClick={() => router.get(route('expence.edit', user.id))}
                                                title="Edit"
                                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 rounded text-white px-3 py-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-black" viewBox="0 0 348.882 348.882">
                                                    <path
                                                        d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                                                    />
                                                    <path
                                                        d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                                                    />
                                                </svg>
                                                <span className="text-white hover:text-black">Edit</span>
                                            </button>

                                            <button
                                                onClick={() => setIsDeleteModalOpen(user)}
                                                title="Delete"
                                                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 rounded text-white px-3 py-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 fill-black" viewBox="0 0 24 24">
                                                    <path
                                                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                    />
                                                    <path
                                                        d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                    />
                                                </svg>
                                                <span className="text-white hover:text-black">Delete</span>
                                            </button>

                                           

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>

                    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
                        <span class="flex items-center col-span-3"> Showing {expences.from} - {expences.to} of {expences.total} </span>
                        <span class="col-span-2"></span>
                    </div>
                </div>
            </div>



        </AuthenticatedLayout>
    );
}

