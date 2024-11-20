import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import * as Yup from 'yup';

export default function Setting(props) {
  const { auth, roles } = props
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting</h2>}
    >
      <Head title="Setting" />

      <div className="flex flex-col px-4 mt-10 mx-auto w-full">
  <div className="w-full scale-100">
    <div class="font-sans antialiased bg-grey-lightest">
      <div class="flex justify-between space-x-4 container mx-auto py-3 px-5">
        <div class="w-full scale-100">
          <Link href={route('role.index')} class="w-full">
            <button class="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2  p-4">
              <div class="items-center">
                <div class="flex justify-center mt-2">
                  <img class="w-16 h-16 rounded-full" src="images/role_setting.jpg" alt="Role Setting" />
                </div>
              </div>
              <div class="flex flex-col items-center pb-5">
                <div class="flex mt-4">
                  <span class="py-2 px-4 ms-2 text-xl font-medium text-gray-900  rounded-lg border border-gray-200  focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
                    Roles
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>
                
        <div class="w-full scale-100">
          <Link href={route('category.index')} class="w-full">
            <button class="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2  p-4">
         
              <div class="items-center">
                <div class="flex justify-center mt-2">
                  <img class="w-16 h-16 rounded-full" src="images/role_category.jpg" alt="Role Setting" />
                </div>
              </div>
              <div class="flex flex-col items-center pb-5">
                <div class="flex mt-4">
                  <span class="py-2 px-4 ms-2 text-xl font-medium text-gray-900  rounded-lg border border-gray-200  focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
                    Categories
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

        <div class="w-full scale-100">
          <Link href={route('brand.index')} class="w-full">
            <button class="w-full bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 focus:ring-gray-400 focus:ring-2  p-4">
              <div class="items-center">
                <div class="flex justify-center mt-2">
                  <img class="w-16 h-16 rounded-full" src="images/role_brands.jpg" alt="Role Setting" />
                </div>
              </div>
              <div class="flex flex-col items-center pb-5">
                <div class="flex mt-4">
                  <span class="py-2 px-4 ms-2 text-xl font-medium text-gray-900  rounded-lg border border-gray-200  focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
                    Brands
                  </span>
                </div>
              </div>
            </button>
          </Link>
        </div>

      </div>
    </div>
  </div>
</div>



    </AuthenticatedLayout>
  );
}

