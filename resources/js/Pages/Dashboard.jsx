import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Chart from "react-apexcharts";
import { useState } from 'react';
import OutofstockProduct from '@/Components/OutofstockProduct';
import SupplierBalance from '@/Components/SupplierBalance';
import { VscGraph } from "react-icons/vsc";
import { FaBoxOpen } from "react-icons/fa6";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { BsGraphUp } from "react-icons/bs";
import RecentOrder from '@/Components/RecentOrder';


export default function Dashboard(props) {
  const { auth, latestOrder, totalOrder, totalProductInStock, totalProductOutofStock, outOfStockProductrecord, supplierBalanceRecord } = props
  // console.log(latestOrder)

  const [chartdata, setChartData] = useState(
    {
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    }
  )

  return (
    <AuthenticatedLayout
      headerTitle="Dashboard"
      header={
        
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Dashboard
          </h2>
        
      }
    >
      <Head title="Dashboard" />


      <div class="p-5 mx-4 grid grid-cols-3 gap-4 ">
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL (ORDERS)</p>
              <p class="text-lg">{totalOrder}</p>
            </div>
            <div class="my-auto">
              <VscGraph size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL PRODUCT IN STOCK</p>
              <p class="text-lg">{totalProductInStock}</p>
            </div>
            <div class="my-auto">
              <FaBoxOpen size={40} />
            </div>
          </div>
        </div>

        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div class="flex w-full h-full py-2 px-4 bg-white rounded-lg justify-between">
            <div class="my-auto">
              <p class="font-bold">TOTAL PRODUCT OUT OF STOCK</p>
              <p class="text-lg">{totalProductOutofStock}</p>
            </div>
            <div class="my-auto">
              <HiMiniArchiveBoxXMark size={40} />
            </div>
          </div>
        </div>



      </div>

      <div class="p-5 grid grid-cols-2 gap-1 w-full">

        <div class=" mt-4 mx-4  bg-white p-4 rounded-lg shadow-md">
          <div className=' flex justify-between items-center my-4'>
            <p class="text-xl font-semibold leading-tight text-gray-800 ">
              Sales
            </p>
            <select id="countries" class="bg-gray-50 w-[150px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="today">TODAY</option>
              <option value="week">WEEK</option>
              <option value="month">MONTH</option>
              <option value="year">YEAR</option>
            </select>
          </div>

          <div id="chart">
            <Chart options={chartdata.options} series={chartdata.series} type="line" height={350} />
          </div>
          <div id="html-dist"></div>
        </div>
        <div class="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
          <RecentOrder recentOrder={latestOrder} />
        </div>
      </div>


      <div class="p-5 grid grid-cols-2 gap-2 ">



        <SupplierBalance suppliers={supplierBalanceRecord} />


        <OutofstockProduct outOfStockProductrecord={outOfStockProductrecord} />
      </div>



    </AuthenticatedLayout>
  );
}
