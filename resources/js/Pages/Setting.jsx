import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Yup from 'yup';

export default function Setting(props) {
  const { auth ,roles} = props
  return (
      <AuthenticatedLayout
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting</h2>}
      >
          <Head title="Setting" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            
          <div class="font-sans antialiased bg-grey-lightest">


  <div class="w-full bg-grey-lightest">
    <div class="container mx-auto py-3 px-5">
      <div class="w-full lg:w-full mx-auto bg-white rounded shadow">
          
        </div>
      
    </div>
  </div>

  
</div>

           
          </div>
        </div>

         
      </AuthenticatedLayout>
  );
}

