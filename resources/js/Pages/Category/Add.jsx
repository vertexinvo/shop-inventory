import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';
import Select from 'react-select';
import { MdKeyboardBackspace } from "react-icons/md";
import CategoryForm from '@/Partials/CategoryForm';

export default function Add(props) {
  const { auth, categories } = props

  return (
    <AuthenticatedLayout
      category={auth.category}
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
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Category</h2>
        </div>
      </div>
      }
    >
      <Head title="Category" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div className="font-sans antialiased bg-grey-lightest">


            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <CategoryForm categories={categories} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>


    </AuthenticatedLayout>
  );
}

