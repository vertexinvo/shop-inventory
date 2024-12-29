import React from 'react'
import { Head, Link, router } from '@inertiajs/react';
import { CiUser } from "react-icons/ci";
import Chart from "react-apexcharts";
import { useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LiaFileInvoiceSolid } from "react-icons/lia";

function SupplierBalance({suppliers}) {
  return (
    <div class="mt-4 mx-4 bg-white">
      <div className='flex justify-between items-center'>
          <p class="text-xl font-semibold leading-tight text-gray-800 mb-2">
              Supplier Balance
          </p>
          <Link href={route('supplier.index')} class="text-sm font-semibold text-black leading-tight underline mb-2">
              View All
          </Link>
      </div>  
    
                {suppliers.data.length > 0 ?
            <div className="overflow-x-auto">
            <div class="font-[sans-serif] overflow-x-auto">
            <table class="min-w-full bg-white">
        <thead class="whitespace-nowrap">
          <tr class="text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black">
          
            <th class="px-4 py-3">
              Supplier Info
            </th>
            <th class="px-4 py-3">
              Contact
            </th>
          
            <th class="px-4 py-3">
              Code
            </th>

           
            <th class="px-4 py-3">
              Total 
            </th>
            <th class="px-4 py-3">
              Paid
            </th>

            <th class="px-4 py-3">
              Pending
            </th>
       
           
          </tr>
        </thead>

        <tbody class="bg-white divide-y dark:divide-gray-700  ">

          {suppliers.data.length === 0 && (
            <tr>
              <td colSpan="12" className="p-4 text-center">
                No Supplier found.
              </td>
            </tr>
          )}
        {suppliers.data.map((item, index) => (
         
         <tr class="bg-gray-50   hover:bg-gray-100   text-gray-700  ">




            <td class=" text-sm">
              <div class="flex items-center cursor-pointer w-max">
                <div class="ml-4 ">
                  <p class="text-sm text-black ">Person Name : {item.person_name}</p>
                  {item.contact && <p class="text-xs text-gray-500 mt-0.5">Contact :{item.contact} </p>}
                </div>
              </div>
            </td>

            <td class="p-4 text-sm text-black">
              {item?.contact || 'N/A'}
            </td>

            <td class="p-4 text-sm text-black flex items-center">
              {item?.code || 'N/A'} <BiCopy size={20} onClick={() => {navigator.clipboard.writeText(item.code);toast.success('Copied!');}} className="ml-2 cursor-pointer" />
            </td>

           
            <td class="p-4 text-sm text-black">
              {item?.total_amount || 0}
            </td>
        
            {/* total_total_amount_paid */}
            <td class="p-4 text-sm text-black">
              {item?.total_amount_paid || 0}
            </td>
            <td class="p-4 text-sm text-black">
              {item?.total_amount_pending || 0}
            </td>

          

           
          </tr>
        ))}

        </tbody>
      </table>

    </div>
    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9    ">
              <span class="flex items-center col-span-3"> Showing {suppliers.from} - {suppliers.to} of {suppliers.total} </span>
              <span class="col-span-2"></span>
            
              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => suppliers.links[0].url ? router.get(suppliers.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
    let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
    const activeIndex = suppliers.links.findIndex((l) => l.active);

    return suppliers.links
        .slice(1, -1) // Exclude the first and last items
        .filter((link, index, array) => {
            const currentIndex = parseInt(link.label, 10); // Parse label as number
            if (isNaN(currentIndex)) return true; // Always include non-numeric items like "..."

            // Adjust range dynamically based on the active index
            const rangeStart = Math.max(0, activeIndex - 2); // Start range around active
            const rangeEnd = Math.min(array.length - 1, activeIndex + 2); // End range around active

            // Show links within the range or first/last few
            return (
                index < 3 || // First 3 pages
                index > array.length - 4 || // Last 3 pages
                (index >= rangeStart && index <= rangeEnd) // Pages close to the active page
            );
        })
        .map((link, index, array) => {
            const currentIndex = parseInt(link.label, 10); // Parse label as a number
            const isEllipsis =
                !isNaN(currentIndex) &&
                lastShownIndex !== -1 &&
                currentIndex - lastShownIndex > 1; // Check for gaps

            // Update lastShownIndex only for valid numeric labels
            if (!isNaN(currentIndex)) {
                lastShownIndex = currentIndex;
            }

            return (
                <li key={index}>
                    {isEllipsis ? (
                        <span className="px-3 py-1">...</span>
                    ) : link.active ? (
                        // Active page button
                        <button
                        className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-black dark:bg-gray-100 border border-r-0 border-black dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple"
                        aria-current="page"
                        >
                            {link.label}
                        </button>
                    ) : (
                        // Inactive link button
                        <button
                            onClick={() => link.url && window.location.assign(link.url)}
                            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                        >
                            {link.label}
                        </button>
                    )}
                </li>
            );
        });
})()}


                    <li>
                      <button onClick={() => suppliers.links[suppliers.links.length - 1].url && window.location.assign(suppliers.links[suppliers.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
                        <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </nav>
              </span>
            </div>
            </div>
    :
    <div className="flex justify-center items-center h-64">
    <p className="text-center text-gray-600 text-lg font-medium">
      No Supplier Balance
    </p>
    </div>
    }
    
    
    </div>

  )
}

export default SupplierBalance