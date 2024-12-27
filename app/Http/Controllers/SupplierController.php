<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplierinvoice;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Supplier::class);
        $totalSuppliers = Supplier::count();
        $search = $request->search ?? '';
        $status = $request->status ?? '';
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
    $perPage = 10;
    $offset = ($currentPage - 1) * $perPage;
    $suppliers = new LengthAwarePaginator(
        $suppliers->slice($offset, $perPage),
        $suppliers->count(),
        $perPage,
        $currentPage,
        ['path' => LengthAwarePaginator::resolveCurrentPath()]
    );
   
        $allsuppliers = Supplier::all();

                // $totalpending = Supplier::with('gettotalpendingamount');
        $totalPendingAmount = $allsuppliers->sum(function ($supplier) {
            return $supplier->total_amount_pending; // Use the accessor
        });

        $totalPaidAmount = $allsuppliers->sum(function ($supplier) {
            return $supplier->total_amount_paid; // Use the accessor
        });
      
       

        return Inertia::render('Supplier/List', compact('totalSuppliers','suppliers','totalPendingAmount','totalPaidAmount','status','search'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Supplier::class);
        // $code = session('code') ?? '';
        $code = '';
        if($request->code){
            $code = $this->generateCode(); 
        }
        return Inertia::render('Supplier/Add', compact('code'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $this->authorize('create', Supplier::class);
        $validator = Validator::make($request->all(), [
            'person_name' => 'required',
            'contact' => 'required',
            'address' => 'nullable',
            'email' => 'nullable',
            'code' => 'required|unique:suppliers,code',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
            $data = $request->all();
            Supplier::create($data);
            session()->flash('message', 'Supplier created successfully');
        
    }
    // public function invoices(Request $request,$id){
    //     $suppliers = Supplier::where('id' , $id)->first();
        
    //     $search = $request->search ?? '';
    //     $supplier = Supplierinvoice::where('supplier_id' , $id)->orWhere('invoice_no', 'like', "%$search%")->latest()->paginate(10);
   
    //     return Inertia::render('Supplier/Invoice', compact('supplier','suppliers'));
    // }
    public function invoices(Request $request, $id) {
        $this->authorize('viewAny', Supplierinvoice::class);
        $suppliers = Supplier::findOrFail($id);

        $search = $request->input('search', '');
    
        $supplier = Supplierinvoice::where('supplier_id', $id)
            ->when($search, function ($query, $search) {
                return $query->where('invoice_no', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10);

            $invoicecode =  '';
        if($request->invoicecode){
            $supplierinvoice = new SupplierinvoiceController();
            $invoicecode = $supplierinvoice->generateInvoiceCode();
        }
    
        return Inertia::render('Supplier/Invoice', compact('suppliers', 'supplier', 'search', 'invoicecode'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

   
    public function generateCode()
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';   
        do {
            $code = '';
            for ($i = 0; $i < 6; $i++) { 
                $randomIndex = mt_rand(0, strlen($characters) - 1);
                $code .= $characters[$randomIndex];
            }
            $exists = Supplier::where('code', $code)->exists();
        } while ($exists); 
        return $code;
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit( Request $request, Supplier $supplier)
    {
        $this->authorize('update', $supplier);
        // $code = session('code') ?? '';
        $code = '';
        if($request->code){
            $code = $this->generateCode(); 
        }
        return Inertia::render('Supplier/Edit', compact('supplier', 'code'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $this->authorize('update', $supplier);
        $validator = Validator::make($request->all(), [
            'person_name' => 'required',
            'contact' => 'required',
            'address' => 'nullable',
            'email' => 'nullable',
            'code' => 'required|unique:suppliers,code,' . $supplier->id,
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
            $data = $request->all();
            $supplier->update($data);
            session()->flash('message', 'Supplier updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $this->authorize('delete', $supplier);
        $supplier->delete();
        session()->flash('message', 'Supplier deleted successfully');
        return back();
    }

    
    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', Supplier::class);
        $ids = explode(',', $request->ids);
        Supplier::whereIn('id', $ids)->delete();
        session()->flash('message', 'Supplier deleted successfully');
        return back();
    }
}
