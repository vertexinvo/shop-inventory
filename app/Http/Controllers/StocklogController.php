<?php

namespace App\Http\Controllers;

use App\Facades\StockService;
use App\Models\Stocklog;
use App\Http\Requests\StoreStocklogRequest;
use App\Http\Requests\UpdateStocklogRequest;
use App\Models\Stock;
use App\Models\Supplier;
use App\Models\Supplierinvoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class StocklogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $suppliers = Supplier::all();

        $supplierinvoices = [];
        if($request->supplier_id){
            $supplierinvoices = Supplierinvoice::where('supplier_id', $request->supplier_id)->get();
        }


        $code =  '';
        if($request->code){
            $supplier = new SupplierController();
            $code = $supplier->generateCode();
        }
        $invoicecode =  '';
        if($request->invoicecode){
            $supplierinvoice = new SupplierinvoiceController();
            $invoicecode = $supplierinvoice->generateInvoiceCode();
        }
        $product_id = $request->product_id;
        return Inertia::render('Stock/Add', compact('code', 'invoicecode','suppliers','supplierinvoices','product_id'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStocklogRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required',
            'type' => 'required|in:addition,removal,adjustment',
            'remarks' => 'nullable|max:1000',
            'supplier_invoice_no' => 'nullable|exists:supplierinvoices,invoice_no',
            'product_id' => 'required|exists:products,id',
            'datetime' => 'required',
           ]);
    
           if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
           }
           StockService::manageStockLog($request);
           session()->flash('message', 'Stock log created successfully');
           return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Stocklog $stocklog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */

public function edit($id)
{
    $stocklogs = Stocklog::findOrFail($id);
    $suppliers = Supplier::all();
    return Inertia::render('Stock/Edit', compact('stocklogs', 'suppliers'));
}
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStocklogRequest $request, Stocklog $stocklog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stocklog $stocklog)
    {
        $stocklog->delete();
        session()->flash('message', 'Stock log deleted successfully');
        return back();
    }

    public function bulkdestroy(Request $request)
    {
        $ids = explode(',', $request->ids);
        Stocklog::whereIn('id', $ids)->delete();
        session()->flash('message', 'Stock log deleted successfully');
        return back();
    }
}
