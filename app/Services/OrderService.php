<?php 

namespace App\Services;

use App\Models\Order;
use App\Models\Item;
use App\Models\Expance;
use Carbon\Carbon;

class OrderService
{
    public function getNetProfit($startDate, $endDate)
    {
        // Ensure Carbon instances
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        // Total Sales Revenue (Payable amount from orders)
        $totalSales = Order::whereBetween('order_date', [$startDate, $endDate])->sum('payable_amount');

        // Total Cost (Sum of purchase_price * qty for items in the given date range)
        $totalCost = Item::whereHas('order', function ($query) use ($startDate, $endDate) {
            $query->whereBetween('order_date', [$startDate, $endDate]);
        })->selectRaw('SUM(purchase_price * qty) as cost')->value('cost') ?? 0;

        // Total Expenses (Filtering expenses correctly based on timestamp)
        $totalExpenses = Expance::whereBetween('datetime', [$startDate, $endDate])->sum('amount') ?? 0;

        // Net Profit Calculation
        return $totalSales - $totalCost - $totalExpenses;
    }

    public function getTodayNetProfit()
    {
        $today = Carbon::today();
        return $this->getNetProfit($today, $today);
    }

    public function getThisWeekNetProfit()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        return $this->getNetProfit($startOfWeek, $endOfWeek);
    }

    public function getThisMonthNetProfit()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        return $this->getNetProfit($startOfMonth, $endOfMonth);
    }

    public function getThisYearNetProfit()
    {
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();
        return $this->getNetProfit($startOfYear, $endOfYear);
    }

    public function getCustomDateNetProfit($startDate, $endDate)
    {
        return $this->getNetProfit($startDate, $endDate);
    }
}
