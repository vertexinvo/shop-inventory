import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import { MdKeyboardBackspace } from "react-icons/md";
import CustomerForm from '@/Partials/CustomerForm';

export default function Edit(props) {
  const { auth, roles, user } = props
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between py-2">
        {/* Title */}
        <div className="flex items-center space-x-3">
          <MdKeyboardBackspace
            size={20}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => window.history.back()}
            title="Back"
          />
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit customer</h2>
        </div>
      </div>
      }
    >
      <Head title="User" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div class="font-sans antialiased bg-grey-lightest">
            <div class="w-full bg-grey-lightest">
              <div class="container mx-auto py-3 px-5">
                <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <CustomerForm user={user} />
                </div>

              </div>
            </div>


          </div>


        </div>
      </div>


    </AuthenticatedLayout>
  );
}

