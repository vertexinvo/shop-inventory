<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Supplier;
use App\Models\Supplierinvoice;
use Illuminate\Pagination\LengthAwarePaginator;

class LedgerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Ledger/Index');
    }
    public function sales(Request $request)
    {
        $search = $request->search ?? '';
        $sales = User::role('customer')->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('phone', 'like', "%$search%")
                ->orWhere('code', 'like', "%$search%")
                ->orWhere('id', 'like', "%$search%");
        })->orderBy('created_at', 'desc')->paginate(50);

        return Inertia::render('Ledger/Sales', compact('sales'));
    }

    public function supplier(Request $request)
    {
            $this->authorize('viewAny', Supplier::class);
           
            $search = $request->search ?? '';
            $status = $request->status ?? '';
            $per_page = $request->input('per_page', 10);
            // total_amount_pending > 0
            $suppliersQuery = Supplier::where('person_name', 'like', "%$search%")
            ->orWhere('code', 'like', "%$search%")
            ->orWhere('contact', 'like', "%$search%")
            ->latest();
        
            // Retrieve suppliers and make the appended attribute visible
            $suppliers = $suppliersQuery->get()->makeVisible('total_amount_pending');
            
            // Filter the suppliers based on the status
            if ($status !== '') {
                $suppliers = $suppliers->filter(function ($supplier) use ($status) {
                    if ($status === 'pending') {
                        return $supplier->total_amount_pending > 0;
                    }
                    if ($status === 'paid') {
                        return $supplier->total_amount_pending <= 0;
                    }
                    return true;
                })->values(); // Reset collection indices with ->values()
            }


            

        // Manually paginate the filtered collection
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
    
        $offset = ($currentPage - 1) * $per_page;
        $suppliers = new LengthAwarePaginator(
            $suppliers->slice($offset, $per_page),
            $suppliers->count(),
            $per_page,
            $currentPage,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );
    
            $allsuppliers = Supplier::all();

            return Inertia::render('Ledger/Supplier', compact('suppliers','status','search'));
        }


    public function customerSalesLedger(Request $request, $code)
    {
        // Fetch the customer by code or ID
        $customer = User::where('code', $code)->first();

        if (!$customer) {
            $customer = User::findOrFail($code);
        }

        // Get date range from request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Build the query for orders
        $ordersQuery = Order::where('user_id', $customer->id)
            ->where('status', '!=', 'cancel')
            ->with(['items', 'tax', 'shipping']);

        // Apply date filter if provided
        if ($startDate) {
            $ordersQuery->whereDate('order_date', '>=', $startDate);
        }
        if ($endDate) {
            $ordersQuery->whereDate('order_date', '<=', $endDate);
        }

        // Fetch orders
        $orders = $ordersQuery->orderBy('order_date', 'asc')->get();

        // Calculate opening balance (orders before the start date if date filter is applied)
        $openingBalance = 0;
        if ($startDate) {
            $previousOrders = Order::where('user_id', $customer->id)
                ->where('status', '!=', 'cancel')
                ->whereDate('order_date', '<', $startDate)
                ->get();
            
            foreach ($previousOrders as $order) {
                $pendingAmount = $order->payable_amount - $order->paid_amount;
                if ($order->status === 'completed' && $pendingAmount > 0) {
                    $pendingAmount = 0; // Adjust for completed orders
                }
                $openingBalance += $pendingAmount;
            }
        }

        // Initialize ledger variables
        $runningBalance = $openingBalance;
        $totalPayable = 0;
        $totalPaid = 0;
        $totalPending = 0;
        $totalAdjustments = 0;

        // Calculate totals for each order and update running balance
        $orders->each(function ($order) use (&$runningBalance, &$totalPayable, &$totalPaid, &$totalPending, &$totalAdjustments) {
            $order->pending_amount = $order->payable_amount - $order->paid_amount;

            // If status is "completed" but pending amount is not zero, adjust the ledger
            if ($order->status === 'completed' && $order->pending_amount > 0) {
                $totalAdjustments += $order->pending_amount;
                $order->pending_amount = 0;
            }

            // Update running balance
            $runningBalance += $order->payable_amount - $order->paid_amount;

            // Update totals
            $totalPayable += $order->payable_amount;
            $totalPaid += $order->paid_amount;
            $totalPending += $order->pending_amount;
        });

        // Pass data to the React component
        return Inertia::render('Ledger/CustomerSalesLedger', [
            'customer' => $customer,
            'orders' => $orders,
            'openingBalance' => $openingBalance,
            'runningBalance' => $runningBalance,
            'totalPayable' => $totalPayable,
            'totalPaid' => $totalPaid,
            'totalPending' => $totalPending,
            'totalAdjustments' => $totalAdjustments,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    //supplierLedger
    public function supplierLedger(Request $request, $code)
    {
        // Fetch the supplier by code
        $supplier = Supplier::where('code', $code)->firstOrFail();

        // Get date range from request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Build the query for supplier invoices
        $invoicesQuery = Supplierinvoice::where('supplier_id', $supplier->id)
            ->with(['supplier']);

        // Apply date filter if provided
        if ($startDate) {
            $invoicesQuery->whereDate('invoice_date', '>=', $startDate);
        }
        if ($endDate) {
            $invoicesQuery->whereDate('invoice_date', '<=', $endDate);
        }

        // Fetch invoices
        $invoices = $invoicesQuery->orderBy('invoice_date', 'asc')->get();

        // Calculate opening balance (invoices before the start date if date filter is applied)
        $openingBalance = 0;
        if ($startDate) {
            $previousInvoices = Supplierinvoice::where('supplier_id', $supplier->id)
                ->whereDate('invoice_date', '<', $startDate)
                ->get();
            
            foreach ($previousInvoices as $invoice) {
                $pendingAmount = $invoice->total_payment - $invoice->paid_amount;
                $openingBalance += $pendingAmount;
            }
        }

        // Initialize ledger variables
        $runningBalance = $openingBalance;
        $totalPayable = 0;
        $totalPaid = 0;
        $totalPending = 0;
        $totalAdjustments = 0;
        $ledgerEntries = [];

        // Process each invoice transaction
        foreach ($invoices as $invoice) {
            $debit = $invoice->total_payment; // Amount to be paid
            $credit = $invoice->paid_amount; // Amount paid
            $pendingAmount = $debit - $credit; // Remaining balance

            // Update running balance
            $runningBalance += $pendingAmount;

            // Store formatted transaction data
            $ledgerEntries[] = [
                'invoice_date' => $invoice->invoice_date,
                'invoice_no' => $invoice->invoice_no,
                'total_payment' => $debit,
                'paid_amount' => $credit,
                'pending_amount' => $pendingAmount,
                'running_balance' => $runningBalance,
                'balance_type' => $runningBalance >= 0 ? 'Dr' : 'Cr',
            ];

            // Update totals
            $totalPayable += $debit;
            $totalPaid += $credit;
            $totalPending += $pendingAmount;
        }

        // Pass data to the React component
        return Inertia::render('Ledger/SupplierLedger', [
            'supplier' => $supplier,
            'invoices' => $ledgerEntries,
            'openingBalance' => $openingBalance,
            'runningBalance' => $runningBalance,
            'totalPayable' => $totalPayable,
            'totalPaid' => $totalPaid,
            'totalPending' => $totalPending,
            'totalAdjustments' => $totalAdjustments,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
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
