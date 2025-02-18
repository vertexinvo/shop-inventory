import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiLogOut } from "react-icons/bi";
import ConfirmModal from '@/Components/ConfirmModal';
import { MdFormatListBulleted, MdOutlinePhoneAndroid, MdOutlineQrCodeScanner } from "react-icons/md";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { TbInvoice } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { GiExpense } from 'react-icons/gi';
import { IoMdMenu } from 'react-icons/io';
import LinkDeviceQrcode from '@/Components/LinkDeviceQrcode';
import { QRCode } from 'react-qrcode-logo';

export default function AuthenticatedLayout({ header, headerTitle, children }) {




    const user = usePage().props.auth.user;

    const setting = usePage().props.setting;



    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
            console.log(flash.message);
        }
        if (flash.error) {
            toast.error(flash.error);
            console.log(flash.error);
        }
    }, [flash]);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [isMinimizeSidebar , setIsMinimizeSidebar] = useState(false);

    const [isLinkDeviceModalOpen, setIsLinkDeviceModalOpen] = useState(false);

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-100">
                <nav className="fixed  top-0 z-50 w-full border border-b border-gray-100 bg-white no-print">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center gap-2">
                                    <IoMdMenu size={30} className='cursor-pointer' onClick={() => setIsMinimizeSidebar(!isMinimizeSidebar)} />
                                    <Link href="/">
                                        <img src={ setting.site_logo || "/images/logo2.png"} className="block h-10 w-30 fill-current text-gray-800" />
                                    </Link>

                                </div>

                                {/* <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div> */}
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {/* <img class="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" /> */}

                                                    {user.name}

                                                    <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? 'block' : 'hidden') +
                            ' sm:hidden'
                        }>
                        <div className="space-y-1">
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>
                        <div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('customer.index')}
                                active={route().current('customer.index')}>
                                Customer
                            </ResponsiveNavLink>
                        </div>
                        <div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('order.index')}
                                active={route().current('order.index')}>
                                Sales
                            </ResponsiveNavLink>
                        </div>
                        <div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('product.index')}
                                active={route().current('product.index')}>
                                Purchases
                            </ResponsiveNavLink>
                        </div>
                        < div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('supplier.index')}
                                active={route().current('supplier.index')}>
                                Supplier
                            </ResponsiveNavLink>
                        </div>
                        < div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('expense.index')}
                                active={route().current('expense.index')}>
                                Expense
                            </ResponsiveNavLink>
                        </div>
                        < div className='space-y-1 '>
                            <ResponsiveNavLink
                                href={route('expense.index')}
                                active={route().current('expense.index')}>
                                Scanner
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink>
                                
                                <ResponsiveNavLink href={route('setting')}>
                                    Setting
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>




                {!isMinimizeSidebar ? 
                    <aside id="logo-sidebar" class="no-print fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0    " aria-label="Sidebar">
                        <div class="h-full px-3 pb-4 overflow-y-auto bg-white   flex flex-col">
                            <ul class="space-y-2 font-medium flex-grow">
                                <li>
                                    <NavLink href={route('dashboard')} active={route().current('dashboard')} className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group">
                                        <svg class="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                        <span class="ms-3">Dashboard</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink href={route('customer.index')} active={route().current('customer.index')} className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group">
                                        <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span class="ms-3">Customers</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink href={route('product.index')} active={route().current('product.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-gray-900  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                        </svg>
                                        <span class="ms-3">Purchases</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href={route('order.index')} active={route().current('order.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <HiMiniShoppingCart className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Sales</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href={route('supplier.index')} active={route().current('supplier.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <TbInvoice className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Suppliers</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href={route('expense.index')} active={route().current('expense.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <GiExpense  className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Expense</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href={route('ledger.sales')} active={route().current('ledger.sales')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <MdFormatListBulleted   className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Ledger</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink href={route('product.scan')} active={route().current('product.scan')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <MdOutlineQrCodeScanner    className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Scanner</span>
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink href={route('product.index')} active={route().current('product.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                        <GoGraph className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                        <span class="ms-3">Sales</span>
                                    </NavLink>
                                </li> */}
                            </ul>

                            <hr />
                            <div className='mt-1'>
                                
                                <button onClick={() => setIsLinkDeviceModalOpen(true)} className="mt-1 w-full flex items-center p-2 text-black rounded-lg   hover:bg-gray-100   group " fill="currentColor" viewBox="0 0 18 20">
                                <MdOutlinePhoneAndroid  className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-800 transition duration-75   group-hover:text-black  ' />
                                <span class="ms-3">Link Mobile App</span>
                                </button>

                            </div> 
                            <div className='mt-1'>
                                <NavLink href={route('setting')} active={route().current('setting')} className="flex items-center p-2 text-black rounded-lg   hover:bg-gray-100   group" fill="currentColor" viewBox="0 0 18 20">
                                    <CiSettings className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-800 transition duration-75   group-hover:text-black  ' />
                                    <span class="ms-3">Settings</span>
                                </NavLink>

                            </div>
                            <div>
                                <button onClick={() => setIsLogoutModalOpen(true)} className="mt-1 w-full flex items-center p-2 text-black rounded-lg   hover:bg-gray-100   group " fill="currentColor" viewBox="0 0 18 20">
                                    <BiLogOut className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-800 transition duration-75   group-hover:text-black  ' />
                                    <span class="ms-3">Log Out</span>
                                </button>

                            </div>
                        </div>
                    </aside>
                    :
                    <aside id="logo-sidebar" class="no-print fixed top-0 left-0 z-40 w-15 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0    " aria-label="Sidebar">
                    <div class="h-full px-3 pb-4 overflow-y-auto bg-white   flex flex-col">
                        <ul class="space-y-2 font-medium flex-grow">
                            <li>
                                <NavLink href={route('dashboard')} active={route().current('dashboard')} className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group">
                                    <svg class="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    
                                </NavLink>
                            </li>

                            <li>
                                <NavLink href={route('customer.index')} active={route().current('customer.index')} className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group">
                                    <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                 
                                </NavLink>
                            </li>

                            <li>
                                <NavLink href={route('product.index')} active={route().current('product.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                    <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-gray-900  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                        <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                    </svg>
                                  
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href={route('order.index')} active={route().current('order.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                    <HiMiniShoppingCart className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                    
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href={route('supplier.index')} active={route().current('supplier.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                    <TbInvoice className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                   
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href={route('expense.index')} active={route().current('expense.index')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                    <GiExpense  className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                               
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href={route('ledger.sales')} active={route().current('ledger.sales')} className="flex items-center p-2 text-gray-900 rounded-lg   hover:bg-gray-100   group">
                                    <MdFormatListBulleted   className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75   group-hover:text-black  ' />
                                   
                                </NavLink>
                            </li>
                            
                        </ul>

                        <hr />
                        <div className='mt-1'>
                            <NavLink href={route('setting')} active={route().current('setting')} className="flex items-center p-2 text-black rounded-lg   hover:bg-gray-100   group" fill="currentColor" viewBox="0 0 18 20">
                                <CiSettings className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-800 transition duration-75   group-hover:text-black  ' />
                              
                            </NavLink>

                        </div>
                        <div>
                            <button onClick={() => setIsLogoutModalOpen(true)} className="mt-1 w-full flex items-center p-2 text-black rounded-lg   hover:bg-gray-100   group " fill="currentColor" viewBox="0 0 18 20">
                                <BiLogOut className='w-5 h-5 flex-shrink-0 w-5 h-5 text-gray-800 transition duration-75   group-hover:text-black  ' />
                             
                            </button>

                        </div>
                    </div>
                </aside>
                }



                <div class={isMinimizeSidebar ? "sm:ml-14" : "sm:ml-64"}>
                    <div class="    mt-14">

                        {header && (
                            <header className="bg-white shadow no-print">
                                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center">
                                    
                                    {header}
                                </div>
                            </header>
                        )}

                        <main >{children}

                        </main>


                    </div>
                </div>

            </div>


            <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Are you sure you want to logout?" onConfirm={() => {
                router.post(route('logout'))
            }} />


            <LinkDeviceQrcode isOpen={isLinkDeviceModalOpen} onClose={() => setIsLinkDeviceModalOpen(false)}  />

        </>
    );
}
