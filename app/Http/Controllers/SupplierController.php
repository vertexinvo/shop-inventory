<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Http\Request;


class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $suppliers = Supplier::where('person_name', 'like', "%$search%")->orWhere('code', 'like', "%$search%")
        ->orWhere('contact', 'like', "%$search%")->latest()->paginate(10);

   
        return Inertia::render('Supplier/List', compact('suppliers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
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
        $supplier->delete();
        session()->flash('message', 'Supplier deleted successfully');
        return back();
    }

    
    public function bulkdestroy(Request $request)
    {
        $ids = explode(',', $request->ids);
        Supplier::whereIn('id', $ids)->delete();
        session()->flash('message', 'Supplier deleted successfully');
        return back();
    }
}
