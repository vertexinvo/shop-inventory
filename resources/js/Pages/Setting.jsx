import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import * as Yup from 'yup';
import { MdKeyboardBackspace } from "react-icons/md";

export default function Setting(props) {
  const { auth, roles } = props
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={ <>
        <MdKeyboardBackspace
             size={20}
             className="mr-2 cursor-pointer"
             onClick={() => router.get(route('dashboard'))}
             title="Back"
         />
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting</h2>
      </>}
    >
      <Head title="Setting" />

      <div className="flex flex-col px-4 mt-10 mx-auto w-full">
  <div className="w-full scale-100">
    <div className="font-sans antialiased bg-grey-lightest">
      {/* Container with grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 container mx-auto py-3 px-5">
        
        {/* First column */}
        <div className="w-full scale-100">
          <Link href={route('role.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-16 h-16 rounded-full" src="images/role_setting.jpg" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Roles
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Second column */}
        <div className="w-full scale-100">
          <Link href={route('category.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-16 h-16 rounded-full" src="images/role_category.jpg" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Categories
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

        {/* Third column */}
        <div className="w-full scale-100">
          <Link href={route('brand.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-16 h-16 rounded-full" src="images/role_brands.jpg" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Brands
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 container mx-auto py-3 px-5">
      <div className="w-full scale-100">
          <Link href={route('user.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-16 h-16 rounded-full" src="images/user_managment.png" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    User Management
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

        <div className="w-full scale-100">
          <Link href={route('tax.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-16 h-16 rounded-full" src="images/tax.png" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Tax
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

        <div className="w-full scale-100">
          <Link href={route('shippingrate.index')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-auto h-16 rounded-full" src="images/shipping_charges.png" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Shipping Charges
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>
        <div className="w-full scale-100">
          <Link href={route('setting.edit')} className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-auto h-16 " src="images/settings.png" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Site Setting
                  </span>
                </div>
              </div>
            </button>
          </Link>
           
        </div>
        <div className="w-full scale-100">
          <a href={route('setting.db')}  className="w-full">
            <button className="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2 p-4">
              <div className="items-center">
                <div className="flex justify-center mt-2">
                  <img className="w-auto h-16 " src="images/exportdb.png" alt="Role Setting" />
                </div>
              </div>
              <div className="flex flex-col items-center pb-5">
                <div className="flex mt-4">
                  <span className="py-2 px-4 ms-2 text-xl font-medium text-gray-900 rounded-lg border border-gray-200 focus:ring-gray-100     dark:border-gray-600  ">
                    Backup Database
                  </span>
                </div>
              </div>
            </button>
          </a>
           
        </div>
      </div>
    </div>
  </div>
</div>




    </AuthenticatedLayout>
  );
}

