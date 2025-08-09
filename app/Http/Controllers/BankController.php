<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Http\Requests\StoreBankRequest;
use App\Http\Requests\UpdateBankRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Bank::class);
        $banks = Bank::where('status', 'active')->paginate(10);
  
        return Inertia::render('Bank/List', compact('banks'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Bank::class);
        return Inertia::render('Bank/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Bank::class);
        $response = Bank::create($request->all());
        if($response){
            session()->flash('message', 'Bank created successfully');
        }
        return redirect()->route('bank.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Bank $bank)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bank $bank)
    {
        $this->authorize('update', $bank);
        return Inertia::render('Bank/Edit', compact('bank'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bank $bank)
    {
        $this->authorize('update', $bank);
        $response = $bank->update($request->all());
        if($response){
            session()->flash('message', 'Bank updated successfully');
        }
        return redirect()->route('bank.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank)
    {
        $this->authorize('delete', $bank);
        $bank->delete();
        session()->flash('message', 'Bank deleted successfully');
        return back();
    }

    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete',Bank::class);
        $bulkdestroy = Bank::whereIn('id', explode(',', $request->ids))->delete();
        session()->flash('message', 'Bank deleted successfully');
        return back();
    }
}
