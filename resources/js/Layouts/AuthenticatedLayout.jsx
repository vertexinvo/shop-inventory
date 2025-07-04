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
import { MdFormatListBulleted, MdKeyboardBackspace, MdOutlinePhoneAndroid, MdOutlineQrCodeScanner } from "react-icons/md";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { TbInvoice } from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { GiExpense } from 'react-icons/gi';
import { IoMdMenu } from 'react-icons/io';
import LinkDeviceQrcode from '@/Components/LinkDeviceQrcode';
import { FaChevronDown, FaCog, FaEdit, FaExpeditedssl, FaPen, FaPlus, FaPlusCircle, FaRegEdit, FaShip, FaTractor, FaTruck, FaWarehouse } from 'react-icons/fa';
import { FaCircleArrowLeft, FaCircleArrowRight, FaHandHoldingDollar, FaLeftLong, FaRightLeft } from 'react-icons/fa6';
import Breadcrumb from '@/Components/Breadcrumb';
import { motion } from "framer-motion";
import BetaBadge from '@/Components/BetaBadge';

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

    const [isMinimizeSidebar, setIsMinimizeSidebar] = useState(false);

    const [isLinkDeviceModalOpen, setIsLinkDeviceModalOpen] = useState(false);
    const firstName = user.name?.split(" ")[0] || ""; // Safe way to get first name
    const firstInitial = firstName.charAt(0).toUpperCase();
    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-100 overflow-hidden">
                <nav className="fixed  top-0 z-50 w-full border border-b border-gray-100 bg-white no-print">
                    <div className="px-4 sm:px-6 lg:px-4">
                        <div className="flex h-16 justify-between">
                            <div className="flex shrink-0 items-center space-x-3">
                                <Link href="/">
                                    <motion.img
                                        src={setting.site_logo || "/images/logo2.png"}
                                        className="block h-12 w-auto object-contain"
                                        alt="Logo"
                                        whileHover={{
                                            scale: 1.02,

                                            transition: { duration: 0.3, ease: "easeOut" },
                                        }}
                                        initial={{ scale: 1 }}
                                    />
                                </Link>
                            </div>


                            <div className="flex justify-end items-center">
                                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                    {/* Add New Dropdown */}
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-full shadow" title="Add New">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out w-10 h-10 border border-gray-300"
                                                >
                                                    <FaPlus className="h-4 w-4" />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="rounded-xl shadow-lg bg-white border border-gray-100 divide-y divide-gray-200 min-w-[150px]">
                                            <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide font-semibold border-b border-gray-200">
                                                Add new
                                            </div>
                                            <div className="flex flex-col">
                                                <Dropdown.Link href={route('customer.create')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Customer
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('order.create')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Invoice
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('product.create')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Inventory
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('supplier.create')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Supplier
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('brand.create')} className=" border-t border-gray-200 px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Brand
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('category.create')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Category
                                                </Dropdown.Link>
                                            </div>
                                        </Dropdown.Content>
                                    </Dropdown>



                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-full shadow" title="Settings">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out w-10 h-10 border border-gray-300"
                                                >
                                                    <FaCog className="h-4 w-4" />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="rounded-xl shadow-lg bg-white border border-gray-100 divide-y divide-gray-200 min-w-[150px]">
                                            <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide font-semibold border-b border-gray-200">
                                                Settings
                                            </div>
                                            <div className="flex flex-col">
                                                <Dropdown.Link href={route('role.index')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Roles
                                                </Dropdown.Link>
                                                {/* <Dropdown.Link href={route('category.index')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Categories
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('brand.index')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Brands
                                                </Dropdown.Link> */}
                                                <Dropdown.Link href={route('user.index')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    User Management
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('setting.edit')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Site Settings
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('shippingrate.index')} className="px-4 py-2 hover:bg-gray-100 text-sm">
                                                    Shipping Charges
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('setting')}
                                                    className="px-4 py-2 text-sm  hover:bg-gray-100"
                                                >
                                                    <span className='underline text-gray-800 font-semibold'>View more</span>
                                                </Dropdown.Link>

                                            </div>
                                        </Dropdown.Content>
                                    </Dropdown>



                                    {/* User Dropdown */}
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-full shadow" title="Profile">
                                                <button
                                                    type="button"
                                                    className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold transition duration-150 ease-in-out hover:brightness-110 focus:outline-none"
                                                >
                                                    {firstInitial}
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide font-semibold border-b border-gray-200">
                                                User menu
                                            </div>
                                            <div className="flex flex-col">
                                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                            </div>

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
                                Inventory
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
                {!isMinimizeSidebar ? (
                    <aside
                        id="logo-sidebar"
                        className="no-print fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0"
                        aria-label="Sidebar"
                    >
                        <div className="h-full px-3 pb-4 overflow-y-auto bg-white flex flex-col">
                            <ul className="space-y-2 font-medium flex-grow">
                                <li>
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 21"
                                        >
                                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                        <span className="ml-3">Dashboard</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('customer.index')}
                                        active={route().current('customer.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 18"
                                        >
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2 a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="ml-3">Customers</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('product.index')}
                                        active={route().current('product.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <FaWarehouse className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors duration-200" />
                                        <span className="ml-3">Inventory</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('order.index')}
                                        active={route().current('order.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <HiMiniShoppingCart className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3">Sales</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('supplier.index')}
                                        active={route().current('supplier.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <FaTruck className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3">Suppliers</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('expense.index')}
                                        active={route().current('expense.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <FaHandHoldingDollar className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3">Expense</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('ledger.sales')}
                                        active={route().current('ledger.sales')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <MdFormatListBulleted className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3">Sales Ledger</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('product.scan')}
                                        active={route().current('product.scan')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <MdOutlineQrCodeScanner className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3">Scanner</span>
                                    </NavLink>
                                </li>
                                <li className="mt-1">
                                    <NavLink
                                        href={route('profile.generated-via-qr')}
                                        active={route().current('profile.generated-via-qr')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                                    >
                                        <MdOutlinePhoneAndroid className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                        <span className="ml-3 flex items-center gap-2">
                                            Link Mobile App
                                            <BetaBadge text="Beta" className="text-xs" />
                                        </span>
                                    </NavLink>
                                </li>
                            </ul>
                            <hr className="my-2 border-gray-200" />
                            <button
                                onClick={() => setIsMinimizeSidebar(!isMinimizeSidebar)}
                                className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200"
                            >
                                <FaCircleArrowLeft className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                <span className="ml-3">Collapse Menu</span>
                            </button>
                            <span className="block text-center text-xs text-gray-400 mt-2">Powered by SOLINVO(Beta) v1.0</span>
                        </div>
                    </aside>
                ) : (
                    <aside
                        id="logo-sidebar"
                        className="no-print fixed top-0 left-0 z-40 w-16 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0"
                        aria-label="Sidebar"
                    >
                        <div className="h-full px-3 pb-4 overflow-y-auto bg-white flex flex-col">
                            <ul className="space-y-2 font-medium flex-grow">
                                <li>
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 21"
                                        >
                                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                        </svg>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('customer.index')}
                                        active={route().current('customer.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 18"
                                        >
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('product.index')}
                                        active={route().current('product.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 18 20"
                                        >
                                            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                        </svg>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('order.index')}
                                        active={route().current('order.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <HiMiniShoppingCart className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('supplier.index')}
                                        active={route().current('supplier.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <TbInvoice className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('expense.index')}
                                        active={route().current('expense.index')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <GiExpense className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('ledger.sales')}
                                        active={route().current('ledger.sales')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <MdFormatListBulleted className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        href={route('product.scan')}
                                        active={route().current('product.scan')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <MdOutlineQrCodeScanner className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                                <li className="mt-1">
                                    <NavLink
                                        href={route('profile.generated-via-qr')}
                                        active={route().current('profile.generated-via-qr')}
                                        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                    >
                                        <MdOutlinePhoneAndroid className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                    </NavLink>
                                </li>
                            </ul>
                            <hr className="my-2 border-gray-200" />
                            <div className="mt-1">
                                <button
                                    onClick={() => setIsMinimizeSidebar(!isMinimizeSidebar)}
                                    className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-900 transition-colors duration-200 justify-center"
                                >
                                    <FaCircleArrowRight className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-900 transition-colors duration-200" />
                                </button>
                            </div>
                            <span className="block text-center text-xs text-gray-400 mt-2">solinvo</span>
                        </div>
                    </aside>
                )}

                <div class={isMinimizeSidebar ? "sm:ml-14" : "sm:ml-64"}>
                    <div className="mt-14">
                        {header && (
                            <header className="bg-white shadow no-print sticky top-0">
                                <div className="mx-auto px-4 py-5 pt-6 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-between">
                                        {/* Title */}
                                        <div className="flex items-center">
                                            {/* <MdKeyboardBackspace
                                                size={20}
                                                className="cursor-pointer text-gray-600 hover:text-gray-800"
                                                onClick={() => window.history.back()}
                                                title="Back"
                                            /> */}
                                            <h2 className="font-semibold text-xl text-gray-800 leading-tight"><Breadcrumb /></h2>
                                        </div>
                                        {header}
                                    </div>
                                </div>
                            </header>
                        )}
                        <main className="mx-auto overflow-auto px-3">
                            
                            {children}
                        </main>
                    </div>
                </div>
            </div >


            <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Are you sure you want to logout?" onConfirm={() => {
                router.post(route('logout'))
            }} />
        </>
    );
}
