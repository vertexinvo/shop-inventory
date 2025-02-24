<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Supplier;
use App\Models\Supplierinvoice;

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
        })->orderBy('created_at', 'desc')->paginate(50);

        return Inertia::render('Ledger/Sales', compact('sales'));
    }


    public function customerSalesLedger($code)
    {
        // Fetch the customer by code or ID
        $customer = User::where('code', $code)->first();
    
        if (!$customer) {
            $customer = User::findOrFail($code);
        }
    
        // Fetch all orders for the customer (excluding canceled orders)
        $orders = Order::where('user_id', $customer->id)
            ->where('status', '!=', 'cancel')
            ->with(['items', 'tax', 'shipping'])
            ->orderBy('order_date', 'asc') // Sort by order date
            ->get();
    
        // Initialize ledger variables
        $openingBalance = 0; // Assuming no opening balance initially
        $runningBalance = $openingBalance;
        $totalPayable = 0;
        $totalPaid = 0;
        $totalPending = 0;
        $totalAdjustments = 0; // Track adjustments for completed orders with pending amounts
    
        // Calculate totals for each order and update running balance
        $orders->each(function ($order) use (&$runningBalance, &$totalPayable, &$totalPaid, &$totalPending, &$totalAdjustments) {
            $order->pending_amount = $order->payable_amount - $order->paid_amount;
    
            // If status is "completed" but pending amount is not zero, adjust the ledger
            if ($order->status === 'completed' && $order->pending_amount > 0) {
                $totalAdjustments += $order->pending_amount; // Add to adjustments
                $order->pending_amount = 0; // Set pending amount to zero
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
            'totalAdjustments' => $totalAdjustments, // Pass adjustments to the frontend
        ]);
    }

    //supplierLedger
    public function supplierLedger($code)
    {
        // Fetch the supplier by code
        $supplier = Supplier::where('code', $code)->firstOrFail();
    
        // Fetch supplier invoices (excluding deleted ones)
        $invoices = Supplierinvoice::where('supplier_id', $supplier->id)
            ->with(['supplier'])
            ->orderBy('invoice_date', 'asc') // Sort by date
            ->get();
    
        // Initialize ledger variables
        $openingBalance = 0; // Fetch this from the supplier's record if applicable
        $runningBalance = $openingBalance;
        $totalPayable = 0;
        $totalPaid = 0;
        $totalPending = 0;
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
