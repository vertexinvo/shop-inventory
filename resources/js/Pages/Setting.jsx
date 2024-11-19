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

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div class="font-sans antialiased bg-grey-lightest">


            <div class="w-[350px] bg-grey-lightest">
              <div class="container mx-auto py-3 px-5">
              


              <button class="w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-4">
              <div class="items-center">
                <div class="flex justify-center mt-2 md:justify-center">
                  <img class="w-16 h-16  rounded-full " src="images/role_setting.jpg" alt="Bonnie image" />
                </div>

          
                
              </div>

              <div class="flex flex-col items-center  pb-5">
                <div class="flex mt-4 md:mt-6">
                  <Link href={route('role.index')} class="py-2 px-4 ms-2 text-xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Roles
                  </Link>
                </div>
              </div>
            </button>


              </div>
            </div>


          </div>


        </div>
      </div>


    </AuthenticatedLayout>
  );
}

