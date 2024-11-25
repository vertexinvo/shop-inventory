import React from 'react'
import { Head, router } from '@inertiajs/react';
import { CiUser } from "react-icons/ci";
import Chart from "react-apexcharts";
import { useState } from 'react';

function OutofstockProduct({outOfStockProductrecord}) {
  return (
    <div class="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
    <p class="text-xl font-semibold leading-tight text-gray-800 mb-2">
                    Out of Stock Products
                </p>
             
    
                {outOfStockProductrecord.data.length > 0 ?
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th class="px-4 py-3">Product Info</th>
              <th class="px-4 py-3">Purchase Price</th>
              <th class="px-4 py-3">Selling Price</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
        
    
            {outOfStockProductrecord.data.map((product) => (
               <tr class="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                <td class=" text-sm">
                  <div class="flex items-center cursor-pointer w-max">
                  {/* <img src='https://readymadeui.com/profile_4.webp' class="w-9 h-9 rounded-full shrink-0" /> */}
                    <div class="ml-4 ">
                      <p class="text-sm text-black ">Name : {product.name}</p>
                      {product.model && <p class="text-xs text-gray-500 mt-0.5">Model :{product.model} </p>}
                      {product.identity_type !== 'none' && <p class="text-xs text-gray-500 mt-0.5">{product.identity_type}:{product.identity_value} </p>}
                    </div>
                  </div>
                </td>
               
                <td class="p-4 text-sm text-black">
                  {product.purchase_price || 'N/A'}
                </td>
                <td class="p-4 text-sm text-black">
                  {product.selling_price || 'N/A'}
                </td>
    
                <td class="p-4">
                  <label class="relative cursor-pointer">
                  <input type="checkbox" onClick={() => router.put(route('product.status', product.id),{},{preserveScroll: true})} class="sr-only peer" checked={product?.stock?.status || false} />
                  <div
                      class="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]">
                    </div>
                  </label>
                </td>
             </tr>
    
            ))}
    
           
    
    
    
           
          </tbody>
        </table>
      </div>
      <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                  <span class="flex items-center col-span-3"> Showing {outOfStockProductrecord.from} - {outOfStockProductrecord.to} of {outOfStockProductrecord.total} </span>
                  <span class="col-span-2"></span>
                
                  <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                    <nav aria-label="Table navigation">
                      <ul class="inline-flex items-center">
    
                        <li>
                          <button onClick={() => outOfStockProductrecord.links[0].url ? router.get(outOfStockProductrecord.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                            <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        </li>
                        {(() => {
        let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
        const activeIndex = outOfStockProductrecord.links.findIndex((l) => l.active);
    
        return outOfStockProductrecord.links
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
                                className="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-blue-600 dark:bg-gray-100 border border-r-0 border-blue-600 dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple"
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
                          <button onClick={() => outOfStockProductrecord.links[outOfStockProductrecord.links.length - 1].url && window.location.assign(outOfStockProductrecord.links[outOfStockProductrecord.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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
      No Out of Stock Products
    </p>
    </div>
    }
    
    
    </div>
  )
}

export default OutofstockProduct