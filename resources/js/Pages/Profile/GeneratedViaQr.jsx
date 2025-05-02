import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";
import { QRCode } from 'react-qrcode-logo';
import { usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';
import { set } from 'date-fns';

export default function GeneratedViaQr({ auth,dataHash,linkeddevices }) {
    const setting = usePage().props.setting;
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(null);
    const [isLogoutAllModalOpen, setIsLogoutAllModalOpen] = useState(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                <div className="flex items-center justify-between py-2">
                          {/* Title */}
                          <div className="flex items-center space-x-3">
                            <MdKeyboardBackspace
                              size={20}
                              className="cursor-pointer text-gray-600 hover:text-gray-800"
                              onClick={() => router.get(route('dashboard'))}
                              title="Back"
                            />
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Linked Devices</h2>
                          </div>
                        </div>
                </>}
        >
            <Head title="Link Mobile App" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 flex flex-col items-center">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                         <QRCode  value={dataHash} size={150} logoImage={setting.site_favicon} logoOpacity={0.8} />
                    </div>

                    
                </div>

                {/* table */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                    <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Linked Devices</h3>
                            
                            <button type="button" onClick={() => setIsLogoutAllModalOpen(true)} className="text-red-600">Unlink All</button>
                        </div>
                        <div className="border-t border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Device
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            IP Address
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {linkeddevices.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">No linked devices found.</div>
                                            </td>
                                        </tr>
                                    )}
                                    {linkeddevices.map((device) => (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-left text-sm font-medium text-gray-900">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device Type:{device.device_type || "N/A"}</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device Name:{device.device_name || "N/A"}</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device OS:{device.device_os || "N/A"}</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device OS Version:{device.device_os_version || "N/A"}</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device Model:{device.device_model || "N/A"}</div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Device UID:{device.device_uid || "N/A"}</div>
                                                </div>
                                           
                                                
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {device.ip_address || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {device.status || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                            <button type="button" onClick={() => setIsLogoutModalOpen(device)} className="text-red-600">Logout</button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



            <ConfirmModal isOpen={isLogoutModalOpen !== null} onClose={() => setIsLogoutModalOpen(null)} title="Are you sure you want to logout device?" onConfirm={() => {

                router.delete(route('profile.unlinkdevice', isLogoutModalOpen.token), {
                preserveScroll: true,
                preserveState: true,
                })
                setIsLogoutModalOpen(null)
                }} />

            <ConfirmModal isOpen={isLogoutAllModalOpen} onClose={() => setIsLogoutAllModalOpen(false)} title="Are you sure you want to logout all device?" onConfirm={() => {

            router.delete(route('profile.removealldevice'), {
            preserveScroll: true,
            preserveState: true,
            })
            setIsLogoutAllModalOpen(false)
            }} />

        </AuthenticatedLayout>
    );
}
