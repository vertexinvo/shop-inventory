import { Formik, Form, Field } from 'formik'
import React, { useState } from 'react'
import { FaWallet , FaEdit} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md';
import { GiTwoCoins } from 'react-icons/gi';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function List(props) {
  const {auth ,brands } = props

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectId, setSelectId] = useState([]);

  return (
      <AuthenticatedLayout
          Brand={auth.Brand}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Brand</h2>}
      >
          <Head title="Brand" />

          <div className="flex flex-col px-4  mt-10 mx-auto w-full">
          <div className="w-full ">
            <div className="flex flex-col md:flex-row justify-end items-center mt-2 mb-4">
            
              <div className="flex flex-col md:flex-row space-x-0 md:space-x-2">

              {selectId.length > 0 &&
                    <button
                        onClick={() => setIsBulkDeleteModalOpen(true)}
                        className="text-white py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        Bulk Delete
                    </button>
                }
                <button
                  onClick={() => router.get(route('brand.create'))}
                  className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
                >
                  Create
                </button>

                <Formik
                  enableReinitialize
                  initialValues={{ search: '' }}
                
                >
                  <Form className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
                    <div>
                      <Field
                        name="search"
                        type="text"
                        placeholder="Search..."
                        className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                     
                     />
                      
                    </div>

                    <button
                      type="submit"
                      className="text-white py-2 px-4 rounded-lg bg-black hover:bg-gray-600"
                    >
                      Search
                    </button>

                  </Form>
                </Formik>
              </div>
            </div>

            <div className="overflow-x-auto">
            <div class="font-[sans-serif] overflow-x-auto">
            <table class="min-w-full bg-white">
        <thead class="whitespace-nowrap">
          <tr className='text-xs font-semibold tracking-wide text-left text-white uppercase border-b bg-black'>
            <th class="pl-4 w-8">
              <input id="checkbox" type="checkbox" class="hidden peer" 
               onChange={(e) => setSelectId(e.target.checked ? brands.data.map((brand) => brand.id) : [])}
               checked={selectId.length === brands.data.length}
              />
              <label for="checkbox"
                class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-full fill-white" viewBox="0 0 520 520">
                  <path
                    d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
                    data-name="7-Check" data-original="#000000" />
                </svg>
              </label>
            </th>
            <th class="p-4 text-left text-sm font-semibold ">
              Name
            </th>
            <th class="p-4 text-left text-sm font-semibold ">
              Description
            </th>
            <th class="p-4 text-left text-sm font-semibold ">
              Action
            </th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">

          {brands.data.length === 0 && (
            <tr>
              <td colSpan="12" className="p-4 text-center">
                No brands found.
              </td>
            </tr>
          )}
        {brands.data.map((brand, index) => (
         
          <tr   class="odd:bg-gray-50">
           <td key={brand.id} className="pl-4 w-8">
        <input
          id={`checkbox-${brand.id}`}
          type="checkbox"
          className="hidden peer"
          value={brand.id}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectId((prev) => [...prev, brand.id]); // Add user ID to state
            } else {
              setSelectId((prev) => prev.filter((id) => id !== brand.id)); // Remove user ID from state
            }
          }}
          checked={selectId.includes(brand.id)}
          
           // Bind state to checkbox
        />
        <label
          htmlFor={`checkbox-${brand.id}`} // Match label with checkbox id
          className="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer bg-black border border-gray-400 rounded overflow-hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full fill-white"
            viewBox="0 0 520 520"
          >
            <path
              d="M79.423 240.755a47.529 47.529 0 0 0-36.737 77.522l120.73 147.894a43.136 43.136 0 0 0 36.066 16.009c14.654-.787 27.884-8.626 36.319-21.515L486.588 56.773a6.13 6.13 0 0 1 .128-.2c2.353-3.613 1.59-10.773-3.267-15.271a13.321 13.321 0 0 0-19.362 1.343q-.135.166-.278.327L210.887 328.736a10.961 10.961 0 0 1-15.585.843l-83.94-76.386a47.319 47.319 0 0 0-31.939-12.438z"
            />
          </svg>
        </label>
      </td>
            <td class=" text-sm">
              <div class="flex items-center cursor-pointer w-max">
                <div class="ml-4 ">
                  <p class="text-sm text-black ">{brand.name}</p>
                </div>
              </div>
            </td>
            <td class="py-2 px-4 border-b text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
              {brand.description}
            </td>
            
           
            <td class="p-4">
              <button onClick={() => router.get(route('brand.edit', brand.id))}  class="mr-4" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-black hover:fill-gray-700"
                  viewBox="0 0 348.882 348.882">
                  <path
                    d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                    data-original="#000000" />
                  <path
                    d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                    data-original="#000000" />
                </svg>
              </button>
              <button onClick={() => setIsDeleteModalOpen(brand)}  title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000" />
                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000" />
                </svg>
              </button>
            </td>
          </tr>
        ))}

        </tbody>
      </table>

    </div>
    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
              <span class="flex items-center col-span-3"> Showing {brands.from} - {brands.to} of {brands.total} </span>
              <span class="col-span-2"></span>
            
              <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul class="inline-flex items-center">

                    <li>
                      <button onClick={() => brands.links[0].url ? router.get(brands.links[0].url) : null} class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" aria-label="Previous">
                        <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
                        </svg>
                      </button>
                    </li>
                    {(() => {
    let lastShownIndex = -1; // Tracks the last index shown to handle ellipses
    const activeIndex = brands.links.findIndex((l) => l.active);

    return brands.links
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
                      <button onClick={() => brands.links[brands.links.length - 1].url && window.location.assign(brands.links[brands.links.length - 1].url)} class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple" aria-label="Next">
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

           
          </div>
        </div>

        <ConfirmModal   isOpen={isDeleteModalOpen !== null} onClose={() => setIsDeleteModalOpen(null)} title="Are you sure you want to delete?" onConfirm={()=>{
 
 router.delete(route('brand.destroy',isDeleteModalOpen.id),{
    preserveScroll: true,
        preserveState: true,
})
setIsDeleteModalOpen(null)
}}/>




<ConfirmModal   isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} title="Are you sure you want to delete these users?" onConfirm={()=>{
 
 router.post(route('brand.bulkdestroy'), { ids: selectId.join(',') }, {
  onSuccess: () => {
      setIsBulkDeleteModalOpen(false);
      setSelectId([]);
  },
});

}}/>
         
      </AuthenticatedLayout>
  );
}

