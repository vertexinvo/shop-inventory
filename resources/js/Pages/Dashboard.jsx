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
  const { auth, latestOrder, totalOrder, totalProductInStock, totalProductOutofStock, outOfStockProductrecord, supplierBalanceRecord, trend, period } = props;

  const [chartdata, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: trend.labels,
      },
    },
    series: [
      {
        name: "series-1",
        data: trend.data,
      },
    ],
  });

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="p-5 mx-4 grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-3 gap-4">
        
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL (ORDERS)</p>
              <p className="text-lg">{totalOrder}</p>
            </div>
            <div className="my-auto">
              <VscGraph size={40} />
            </div>
          </div>

          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL PRODUCT IN STOCK</p>
              <p className="text-lg">{totalProductInStock}</p>
            </div>
            <div className="my-auto">
              <FaBoxOpen size={40} />
            </div>
          </div>
        

          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL PRODUCT OUT OF STOCK</p>
              <p className="text-lg">{totalProductOutofStock}</p>
            </div>
            <div className="my-auto">
              <HiMiniArchiveBoxXMark size={40} />
            </div>
          </div>
        </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        <div className="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
          <div className='flex justify-between items-center my-4'>
            <p className="text-xl font-semibold leading-tight text-gray-800 ">
              Sales
            </p>
            <select
              onChange={(e) => {
                router.get(route('dashboard'), { period: e.target.value }, { preserveScroll: true });
              }}
              value={period}
              id="period"
              className="bg-gray-50 w-full sm:w-[150px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="day">TODAY</option>
              <option value="week">WEEK</option>
              <option value="month">MONTH</option>
              <option value="year">YEAR</option>
              <option value="last_week">LAST WEEK</option>
              <option value="last_month">LAST MONTH</option>
              <option value="last_year">LAST YEAR</option>
              <option value="quater_year">QUARTER YEAR</option>
              <option value="half_year">HALF YEAR</option>
            </select>
          </div>

          <div id="chart">
            <Chart options={chartdata.options} series={chartdata.series} type="line" height={350} />
          </div>
        </div>

        <div className="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
          <RecentOrder recentOrder={latestOrder} />
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className=" bg-white p-4 rounded-lg shadow-md">
        <SupplierBalance suppliers={supplierBalanceRecord} />
        
        </div>
        <div className=" bg-white p-4 rounded-lg shadow-md">
        <OutofstockProduct outOfStockProductrecord={outOfStockProductrecord} />
      </div>
    </div>
    </AuthenticatedLayout>
  );
}
