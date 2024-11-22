<?php

namespace App\Http\Controllers;

use App\Models\Supplierinvoice;
use App\Http\Requests\StoreSupplierinvoiceRequest;
use App\Http\Requests\UpdateSupplierinvoiceRequest;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;

class SupplierinvoiceController extends Controller
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
    public function create()
    {
        //
    }

    public function generateInvoiceCode()
    {
        // Define a prefix for invoice codes
        $prefix = 'INV';
    
        // Add a date component for context (e.g., YYYYMMDD)
        $date = now()->format('Ymd');
    
        // Generate a random 5-digit numeric sequence
        $randomNumber = mt_rand(10000, 99999);
    
        // Combine to create the invoice code
        $invoiceCode = $prefix . '-' . $date . '-' . $randomNumber;
    
        // Ensure the invoice code is unique in the database
        while (Supplierinvoice::where('invoice_no', $invoiceCode)->exists()) {
            $randomNumber = mt_rand(10000, 99999);
            $invoiceCode = $prefix . '-' . $date . '-' . $randomNumber;
        }
    
        // Return the generated invoice code
        session(['invoiceCode' => $invoiceCode]);
    }
    
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierinvoiceRequest $request)
    {
        // supplier_code : "",
        //          invoice_no: "",
        //          invoice_date: "",
        //          due_date: "",
        //          total_pending_payment: "",
        //          status: "",
        //          method: "",
        //          cheque_no: "",
        //          cheque_date: "",
        //          bank_name: "",
        //          bank_branch: "",
        //          bank_account: "",
        //          online_payment_link: "",
        //          payment_proof: "",
        //          note: "",
        $validator = Validator::make($request->all(), [
            'supplier_code' => 'required|exists:suppliers,code',
            'invoice_no' => 'required|unique:supplierinvoices,invoice_no',
            'invoice_date' => 'required',
            'due_date' => 'required',
            'total_payment' => 'required',
            'status' => 'required|in:pending,paid',
            'method' => 'required',
            'cheque_no' => 'nullable',
            'cheque_date' => 'nullable',
            'bank_name' => 'nullable',
            'bank_branch' => 'nullable',
            'bank_account' => 'nullable',
            'online_payment_link' => 'nullable',
            'payment_proof' => 'nullable',
            'note' => 'nullable',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        
        //check supplier_code and get id
        $supplier = Supplier::where('code', $data['supplier_code'])->first();
        $data['supplier_id'] = $supplier->id; 

        Supplierinvoice::create($data);
        session()->flash('message', 'Supplier invoice created successfully');

    }

    /**
     * Display the specified resource.
     */
    public function show(Supplierinvoice $supplierinvoice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplierinvoice $supplierinvoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierinvoiceRequest $request, Supplierinvoice $supplierinvoice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplierinvoice $supplierinvoice)
    {
        //
    }
}
