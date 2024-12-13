import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";


function View(props) {
    const { role, permissions, permissionsList } = props;





    const groupedPermissions = permissionsList.reduce((acc, permission) => {
        const [action, ...rest] = permission.split(' '); // Split into action and item
        const item = rest.join(' '); // Join the rest as the item name
        acc[item] = acc[item] || []; // Create an array for each item type if it doesn't exist
        acc[item].push({ action, permission }); // Push the action and permission into the respective item array
        return acc;
    }, {});





    // Initialize the state with the current permissions
    const [selectedPermissions, setSelectedPermissions] = useState(permissions);

    const handleCheckboxChange = (permission) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                return prev.filter((perm) => perm !== permission); // Uncheck
            } else {
                return [...prev, permission]; // Check
            }
        });
    };

    const handleSave = async () => {
        await router.put(route('role.updatePermission', role.id), selectedPermissions);
    };



    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={
                    <>
                        <MdKeyboardBackspace
                            size={20}
                            className="mr-2 cursor-pointer"
                            onClick={() => router.get(route('role.index'))}
                            title="Back"
                        />

                        <div className='flex flex-col px-4 '>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Permission Role: {role.name}</h2>
                        </div>
                    </>

                }

            >

                <Head title="Admin Dashboard" />

                <div className=" grid justify-center py-6 ">

                    <div className='bg-white rounded-lg shadow-md p-4 w-full '>
                        <div className="mt-4 ">
                            {/* Select all checkbox */}
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={permissionsList.length === selectedPermissions.length}
                                    onChange={(e) => {
                                        setSelectedPermissions(e.target.checked ? permissionsList : []);
                                    }}
                                />
                                <span className="ml-2">Select All</span>
                            </label>
                        </div>

                        <div className="mt-4">
                            <hr />

                            {/* Render each category in a separate card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(groupedPermissions).map(([item, actions]) => (
                                    <div key={item} className="my-4">
                                        <div className="bg-white rounded-lg shadow-md p-4">
                                            {/* Category Header */}
                                            <h4 className="font-semibold capitalize flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={actions.every(({ permission }) => selectedPermissions.includes(permission))}
                                                    onChange={() => {
                                                        const allPermissions = actions.map(({ permission }) => permission);
                                                        const allSelected = allPermissions.every((perm) => selectedPermissions.includes(perm));
                                                        setSelectedPermissions((prev) =>
                                                            allSelected
                                                                ? prev.filter((perm) => !allPermissions.includes(perm))
                                                                : [...prev, ...allPermissions]
                                                        );
                                                    }}
                                                />
                                                <span>{item}</span>
                                            </h4>

                                            {/* Permissions List */}
                                            {actions.map(({ action, permission }) => (
                                                <label className="flex items-center mt-2" key={permission}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.includes(permission)}
                                                        onChange={() => handleCheckboxChange(permission)}
                                                    />
                                                    <span className="ml-2">{action} {item}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => router.get(route('role.index'))}
                                className="px-4 py-2 bg-gray-500 ml-2 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>

                </div>




            </AuthenticatedLayout>
        </>
    );
}

export default View;
