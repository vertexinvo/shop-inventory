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
import { GiMoneyStack } from 'react-icons/gi';
import { MdOutlinePendingActions } from 'react-icons/md';
import { GrMoney } from "react-icons/gr";

export default function Dashboard(props) {
  const { auth,todayProfit,weekProfit,monthProfit,yearProfit,latestOrder,todaysOrder, totalOrder, totalProductInStock, totalProductOutofStock, outOfStockProductrecord, supplierBalanceRecord, trend, period,totalStockValue,totaliteminstock,totalOrderAmountPending,totalSupplierPendingAmount } = props;

 
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

  const rolename = auth.user.roles.map((role) => role.name);

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
   
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">TODAY'S PROFIT</p>
                <p className="text-lg"> { rolename.includes('superadmin') ?   todayProfit : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <GrMoney  size={40} />
              </div>
            </div>
          </div>

          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">THIS WEEK PROFIT</p>
                <p className="text-lg"> { rolename.includes('superadmin') ?   weekProfit : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <GrMoney  size={40} />
              </div>
            </div>
          </div>

          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">THIS MONTH PROFIT</p>
                <p className="text-lg"> { rolename.includes('superadmin') ?   monthProfit : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <GrMoney  size={40} />
              </div>
            </div>
          </div>

          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">THIS YEAR PROFIT</p>
                <p className="text-lg"> { rolename.includes('superadmin') ?   yearProfit : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <GrMoney  size={40} />
              </div>
            </div>
          </div>
      
        <Link href={route('order.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">TOTAL (ORDERS)</p>
                <p className="text-lg"> { auth.permissions.includes('viewAny Order') ?   totalOrder : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <VscGraph size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('order.index')}>
          <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
            <div className="flex w-full h-full py-2 px-4 bg-white shadow-md rounded-lg justify-between">
              <div className="my-auto">
                <p className="font-bold">TODAY'S ORDERS</p>
                <p className="text-lg"> { auth.permissions.includes('viewAny Order') ?   todaysOrder : <p>No Access</p>}</p>
              </div>
              <div className="my-auto">
                <VscGraph size={40} />
              </div>
            </div>
          </div>
        </Link>
        <Link href={route('product.index', { status: 1 })}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL PRODUCT IN STOCK</p>
              <p className="text-lg">{  auth.permissions.includes('viewAny Product') ? totalProductInStock : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <FaBoxOpen size={40} />
            </div>
          </div>
        </div>
        </Link>
        <Link href={route('product.index', { status: 1 })}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL ITEMS IN STOCK</p>
              <p className="text-lg">{  auth.permissions.includes('viewAny Product') ? totaliteminstock : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <FaBoxOpen size={40} />
            </div>
          </div>
        </div>
        </Link>

        <Link href={route('product.index', { status: 0 })}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL PRODUCT OUT OF STOCK</p>
              <p className="text-lg">{ auth.permissions.includes('viewAny Product') ? totalProductOutofStock : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <HiMiniArchiveBoxXMark size={40} />
            </div>
          </div>
        </div>
        </Link>

        <Link href={route('product.index')}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">TOTAL STOCK VALUE</p>
              <p className="text-lg">{ auth.permissions.includes('viewAny Product') ? totalStockValue : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <GiMoneyStack size={40} />
            </div>
          </div>
        </div>
        </Link>


        <Link href={route('order.index')}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">CUSTOMER PENDING BALANCE</p>
              <p className="text-lg">{ auth.permissions.includes('viewAny Order') ? totalOrderAmountPending : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
              <MdOutlinePendingActions  size={40} />
            </div>
          </div>
        </div>
        </Link>

        
        <Link href={route('order.index')}>
        <div class="pl-1 w-full h-20 bg-black rounded-lg shadow-md">
          <div className="flex w-full h-full py-2 px-4 bg-white shadow-md  rounded-lg justify-between">
            <div className="my-auto">
              <p className="font-bold">SUPPLIER PENDING BALANCE</p>
              <p className="text-lg">{ auth.permissions.includes('viewAny Supplier') ? totalSupplierPendingAmount : <p>No Access</p>}</p>
            </div>
            <div className="my-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
                <title>Supplier Pending Balance</title>
                <desc>Monochrome icon showing factory building with pending currency indicator</desc>
                
            
                <path fill="#000" d="M8 52V24l24-16 24 16v28H8z"/>
                <path fill="#fff" d="M32 8l20 13.3V52H12V21.3L32 8z"/>
                <path fill="#000" d="M16 28h8v24h-8zM28 28h8v24h-8zM40 28h8v24h-8z"/>
                
               
                <circle cx="50" cy="14" r="10" fill="#000"/>
              
                <path fill="#fff" d="M50 14v-4M50 14l3 3">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 14"
                    to="360 50 14"
                    dur="2s"
                    repeatCount="indefinite"/>
                </path>
                
                <path fill="#fff" d="M52 12h-1v-2h-2v2h-2v2h2v4h-3v2h3v1h2v-1h1v-2h-1v-4h3v-2h-3v-2z"/>
              </svg>
            </div>
          </div>
        </div>
        </Link>
        
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        <div className="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
        {auth.permissions.includes('viewAny Order') ?  (<>
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
              className="bg-gray-50 w-full sm:w-[150px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ">
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
          </>)
          : <p>You don't have permission to view this area</p>
          }
        </div>

        <div className="mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
        {auth.permissions.includes('viewAny Order') ?  <RecentOrder recentOrder={latestOrder} /> :
        <p>You don't have permission to view this area</p>
        }
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className=" mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
         
        {auth.permissions.includes('viewAny Supplier') ? <SupplierBalance suppliers={supplierBalanceRecord} />
        : 
        <p>You don't have permission to view this area</p>
        }

        </div>
        <div className=" mt-4 mx-4 bg-white p-4 rounded-lg shadow-md">
          {auth.permissions.includes('viewAny Product') ? <OutofstockProduct outOfStockProductrecord={outOfStockProductrecord} /> : 
          <p>You don't have permission to view this area</p>
          }
          
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
