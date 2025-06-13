import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Chart from "react-apexcharts";
import { useState } from 'react';
import OutofstockProduct from '@/Components/OutofstockProduct';
import SupplierBalance from '@/Components/SupplierBalance';
import { VscGraph } from "react-icons/vsc";
import { FaBoxOpen, FaTruckField } from "react-icons/fa6";
import { HiMiniArchiveBoxXMark } from "react-icons/hi2";
import { BsGraphUp } from "react-icons/bs";
import RecentOrder from '@/Components/RecentOrder';
import { GiMoneyStack } from 'react-icons/gi';
import { MdOutlinePendingActions } from 'react-icons/md';
import { GrMoney } from "react-icons/gr";
import Clock from 'react-simple-clock'
import LiveClockUpdate from '@/Components/LiveClockUpdate';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CiTimer } from 'react-icons/ci';
import Card from '@/Components/Cards';

export default function Dashboard(props) {
  const { auth, todaysPendingOrderAmount, todayProfit, weekProfit, monthProfit, yearProfit, latestOrder, todaysOrder, totalOrder, totalProductInStock, totalProductOutofStock, outOfStockProductrecord, supplierBalanceRecord, trend, period, totalStockValue, totaliteminstock, totalOrderAmountPending, totalSupplierPendingAmount } = props;


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
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7');
  const formatProfit = (profit) => {
    if (profit < 0) {
      return <span className="text-red-500">Loss: {Math.abs(profit)}</span>;
    }
    return <span>{profit}</span>;
  };

  return (
    <AuthenticatedLayout
      auth={auth}
      errors={props.errors}
      header={
        <div className="flex items-baseline justify-between">
          {/* Title */}
          <div className="flex items-center space-x-3">

            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">

            {/* create custom dashboard button modal */}

          </div>
        </div>
      }

    >

      <Head title="Dashboard" />
      <div className="mx-4">
        <div className="p-4 bg-white shadow-sm rounded-2xl mt-10">
          {/* Header with Profit & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between w-full gap-4 mb-6">
            <h1 className="font-semibold text-xl text-gray-800">
              Profit: {rolename.includes('superadmin') ? formatProfit(todayProfit) : 'No Access'}
            </h1>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 w-full sm:w-56 rounded-lg text-sm border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            >
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 1 Month</option>
              <option value="180">Last 6 Months</option>
              <option value="365">Last 1 Year</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Card
              title="Orders"
              value={auth.permissions.includes('viewAny Order') ? totalOrder : 'No Access'}
              icon={<VscGraph size={32} />}
              link={route('order.index')}
            />
            <Card
              title="Product In Stock"
              value={auth.permissions.includes('viewAny Product') ? totalProductInStock : 'No Access'}
              icon={<FaBoxOpen size={32} />}
              link={route('product.index', { status: 1 })}
            />
            <Card
              title="Out of Stock"
              value={auth.permissions.includes('viewAny Product') ? totalProductOutofStock : 'No Access'}
              icon={<HiMiniArchiveBoxXMark size={32} />}
              link={route('product.index', { status: 0 })}
            />
            <Card
              title="Stock Value"
              value={auth.permissions.includes('viewAny Product') ? totalStockValue : 'No Access'}
              icon={<GiMoneyStack size={32} />}
              link={route('product.index')}
            />
            <Card
              title="Pending Balance"
              value={auth.permissions.includes('viewAny Supplier') ? totalSupplierPendingAmount : 'No Access'}
              icon={<FaTruckField size={32} />}
              link={route('order.index')}
            />
          </div>
        </div>



        {/* <div className="p-5 mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card
          title="Today's Profit"
          value={rolename.includes('superadmin') ? formatProfit(todayProfit) : 'No Access'}
          icon={<GrMoney size={32} />}
        />
        <Card
          title="Today's Pending Amount"
          value={rolename.includes('superadmin') ? formatProfit(todaysPendingOrderAmount) : 'No Access'}
          icon={<CiTimer size={32} />}
        />
        <Card
          title="This Week Profit"
          value={rolename.includes('superadmin') ? formatProfit(weekProfit) : 'No Access'}
          icon={<GrMoney size={32} />}
        />
        <Card
          title="This Month Profit"
          value={rolename.includes('superadmin') ? formatProfit(monthProfit) : 'No Access'}
          icon={<GrMoney size={32} />}
        />
        <Card
          title="This Year Profit"
          value={rolename.includes('superadmin') ? formatProfit(yearProfit) : 'No Access'}
          icon={<GrMoney size={32} />}
        />
        <Card
          title="Total Orders"
          value={auth.permissions.includes('viewAny Order') ? totalOrder : 'No Access'}
          icon={<VscGraph size={32} />}
          link={route('order.index')}
        />
        <Card
          title="Today's Orders"
          value={auth.permissions.includes('viewAny Order') ? todaysOrder : 'No Access'}
          icon={<VscGraph size={32} />}
          link={route('order.index')}
        />
        <Card
          title="Total Product In Stock"
          value={auth.permissions.includes('viewAny Product') ? totalProductInStock : 'No Access'}
          icon={<FaBoxOpen size={32} />}
          link={route('product.index', { status: 1 })}
        />
        <Card
          title="Total Items In Stock"
          value={auth.permissions.includes('viewAny Product') ? totaliteminstock : 'No Access'}
          icon={<FaBoxOpen size={32} />}
          link={route('product.index', { status: 1 })}
        />
        <Card
          title="Total Product Out of Stock"
          value={auth.permissions.includes('viewAny Product') ? totalProductOutofStock : 'No Access'}
          icon={<HiMiniArchiveBoxXMark size={32} />}
          link={route('product.index', { status: 0 })}
        />
        <Card
          title="Total Stock Value"
          value={auth.permissions.includes('viewAny Product') ? totalStockValue : 'No Access'}
          icon={<GiMoneyStack size={32} />}
          link={route('product.index')}
        />
        <Card
          title="Customer Pending Balance"
          value={auth.permissions.includes('viewAny Order') ? totalOrderAmountPending : 'No Access'}
          icon={<MdOutlinePendingActions size={32} />}
          link={route('order.index')}
        />
        <Card
          title="Supplier Pending Balance"
          value={auth.permissions.includes('viewAny Supplier') ? totalSupplierPendingAmount : 'No Access'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32">
              <path fill="#000" d="M8 52V24l24-16 24 16v28H8z" />
              <path fill="#fff" d="M32 8l20 13.3V52H12V21.3L32 8z" />
              <path fill="#000" d="M16 28h8v24h-8zM28 28h8v24h-8zM40 28h8v24h-8z" />
              <circle cx="50" cy="14" r="10" fill="#000" />
              <path fill="#fff" d="M52 12h-1v-2h-2v2h-2v2h2v4h-3v2h3v1h2v-1h1v-2h-1v-4h3v-2h-3v-2z" />
            </svg>
          }
          link={route('order.index')}
        />
      </div> */}




        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            {auth.permissions.includes('viewAny Order') ? (<>
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

          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            {auth.permissions.includes('viewAny Order') ? <RecentOrder recentOrder={latestOrder} /> :
              <p>You don't have permission to view this area</p>
            }
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className=" mt-4 bg-white p-4 rounded-lg shadow-md">

            {auth.permissions.includes('viewAny Supplier') ? <SupplierBalance suppliers={supplierBalanceRecord} />
              :
              <p>You don't have permission to view this area</p>
            }

          </div>
          <div className=" mt-4 bg-white p-4 rounded-lg shadow-md">
            {auth.permissions.includes('viewAny Product') ? <OutofstockProduct outOfStockProductrecord={outOfStockProductrecord} /> :
              <p>You don't have permission to view this area</p>
            }

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}