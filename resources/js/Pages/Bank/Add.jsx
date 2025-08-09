import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import { FaWallet, FaEdit, FaUniversity, FaCreditCard, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa'
import { MdDelete, MdKeyboardBackspace, MdAccountBalance, MdNumbers } from 'react-icons/md'
import { GiTwoCoins } from 'react-icons/gi'
import { BiHash } from 'react-icons/bi'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import * as Yup from 'yup'
import Select from 'react-select'
import BankForm from '@/Partials/BankForm'


export default function Add(props) {
  const { auth } = props

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <MdKeyboardBackspace
              size={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => window.history.back()}
              title="Back"
            />
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Bank Account</h2>
          </div>
        </div>
      }
    >
      <Head title="Add Bank Account" />

      <div className="flex flex-col px-4 mt-6 mx-auto max-w-6xl w-full">
        <div className="w-full">
          <div className="font-sans antialiased">
            <div className="w-full">
              <div className="container mx-auto py-3 px-5">
                <div className="w-full mx-auto">
                  <BankForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}