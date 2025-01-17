<?php

namespace App\Http\Controllers;

use App\Models\Supplierinvoice;
use App\Http\Requests\StoreSupplierinvoiceRequest;
use App\Http\Requests\UpdateSupplierinvoiceRequest;
use App\Models\Supplier;
use Inertia\Inertia;
use Illuminate\Http\Request;
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
    public function changestatus(Request $request, $id){
        $supplierinvoice = Supplierinvoice::findOrFail($id);
        $this->authorize('update', $supplierinvoice);
        $supplierinvoice->status = $request->status;
        $supplierinvoice->save();
        session()->flash('message', 'Status updated successfully');
        return back();
    }

    public function amountupdate(Request $request, $id){
        $supplierinvoice = Supplierinvoice::findOrFail($id);
        $this->authorize('update', $supplierinvoice);
        $supplierinvoice->paid_amount = $request->paid_amount;
        if($supplierinvoice->paid_amount >= $supplierinvoice->total_payment){
            $supplierinvoice->status = 'paid';
        }
        else{
            $supplierinvoice->status = 'pending';
        }

        $supplierinvoice->save();
        session()->flash('message', 'Amount updated successfully');
        return back();
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

        return $invoiceCode;
    }
    
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierinvoiceRequest $request)
    {
        $this->authorize('create', Supplierinvoice::class);
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
            'total_payment' => 'required|numeric|max:1000000000',
            'status' => 'required|in:pending,paid',
            'method' => 'required',
            'cheque_no' => 'nullable|string|max:255',
            'cheque_date' => 'nullable',
            'bank_name' => 'nullable|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
            'bank_account' => 'nullable|string|max:255',
            'online_payment_link' => 'nullable|url',
            'payment_proof' => 'nullable',
            'note' => 'nullable|string|max:5000',
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
                // get the supplier id and display the invoice from supplierinvoice table

    public function show(Supplierinvoice $supplierinvoice)
    {
      
 
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
    public function destroy($id)
    {
        $supplierinvoice = Supplierinvoice::findOrFail($id);
        $supplierinvoice->delete();
        session()->flash('message', 'Supplier invoice deleted successfully');
    }
}
