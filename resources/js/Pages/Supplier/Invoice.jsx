import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LiaFileInvoiceSolid } from "react-icons/lia";

export default function List(props) {
  const {auth ,  suppliers } = props

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);

  return (
      <AuthenticatedLayout
          Product={auth.Product}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Supplier</h2>}
      >
          <Head title="Product" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
           

            <div className="overflow-x-auto">
            <div class="font-[sans-serif] overflow-x-auto">
          

    </div>
    
            </div>

           
          </div>
        </div>

 




         
      </AuthenticatedLayout>
  );
}

