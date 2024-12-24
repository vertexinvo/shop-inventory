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
  const { auth, category, categories } = props
  return (
    <AuthenticatedLayout
      category={auth.category}
      header={
        <>
          <MdKeyboardBackspace
            size={20}
            className="mr-2 cursor-pointer"
            onClick={() => router.get(route('category.index'))}
            title="Back"
          />

          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Category</h2>
        </>}
    >
      <Head title="Category" />

      <div className="flex flex-col px-4  mt-10 mx-auto w-full">
        <div className="w-full ">

          <div className="font-sans antialiased bg-grey-lightest">
            <div className="w-full bg-grey-lightest">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full lg:w-full mx-auto bg-white rounded shadow">
                  <CategoryForm category={category} categories={categories} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>


    </AuthenticatedLayout>
  );
}

