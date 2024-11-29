<?php

namespace App\Http\Controllers;

use App\Models\tax;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoretaxRequest;
use App\Http\Requests\UpdatetaxRequest;

class TaxController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    $search = $request->input('search', '');

    $taxs = Tax::where('name', 'like', "%$search%")
        ->latest()
        ->paginate(10);
    return Inertia::render('Tax/List' ,compact('taxs')); 
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tax/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'cost' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $tax = tax::create($request->all());
        return redirect()->back()->with('message', 'Tax created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(tax $tax)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $tax = tax::find($id);  
        return Inertia::render('Tax/Edit',compact('tax'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, tax $tax)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'cost' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $tax->update($request->all());
        return redirect()->back()->with('message', 'Tax updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(tax $tax)
    {
        $tax = tax::find($tax->id);
        $tax->delete();
        return redirect()->back()->with('message', 'Tax deleted successfully');
    }
}
