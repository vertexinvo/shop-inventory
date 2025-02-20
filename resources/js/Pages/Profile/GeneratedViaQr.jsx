import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, router } from '@inertiajs/react';
import { MdKeyboardBackspace } from "react-icons/md";
import { QRCode } from 'react-qrcode-logo';
import { usePage } from '@inertiajs/react';

export default function GeneratedViaQr({ auth,dataHash }) {
    const setting = usePage().props.setting;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                <MdKeyboardBackspace
                     size={20}
                     className="mr-2 cursor-pointer"
                     onClick={() => router.get(route('dashboard'))}
                     title="Back"
                 /><h2 className="font-semibold text-xl text-gray-800 leading-tight">Link Mobile App</h2>
                </>}
        >
            <Head title="Link Mobile App" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                         <QRCode  value={dataHash} size={150} logoImage={setting.site_favicon} logoOpacity={0.8} />
                    </div>

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
