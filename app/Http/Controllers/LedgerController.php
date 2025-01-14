<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class LedgerController extends Controller
{
    public function sales(Request $request)
    {
        $search = $request->search ?? '';
        $sales = User::role('customer')->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('phone', 'like', "%$search%")
                ->orWhere('code', 'like', "%$search%")
                ->orWhere('id', 'like', "%$search%");
        })->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Ledger/Sales', compact('sales'));
    }

    public function csvExport(Request $request)
    {
            $customers = User::role('customer')->get();
            $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=sales_ledger" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        $columns = [
            'id',
            'code',
            'name',
            'email',
            'phone',
            'address',
            'total_orders',
            'total_orders_amount',
            'total_orders_amount_paid',
            'total_order_amount_pending',
        ];
        $callback = function() use ($customers, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($customers as $customer) {
                fputcsv($file, [
                    $customer->id,
                    $customer->code,
                    $customer->name,
                    $customer->email,
                    $customer->phone,
                    $customer->address,
                    $customer->total_orders,
                    $customer->total_orders_amount,
                    $customer->total_orders_amount_paid,
                    $customer->total_order_amount_pending
                ]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
