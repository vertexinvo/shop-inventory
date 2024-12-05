<?php

namespace App\Http\Controllers;

use App\Models\ShippingRate;
use App\Http\Requests\StoreShippingRateRequest;
use App\Http\Requests\UpdateShippingRateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
class ShippingRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $shippingrates = ShippingRate::where('area_name', 'like', "%$search%")
            ->latest()
            ->paginate(10);
        return Inertia::render('Shippingrate/List' ,compact('shippingrates')); 
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Shippingrate/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $validator = Validator::make($request->all(), [
        'area_name' => 'required',
        'fee' => 'required',
       ]);

       if ($validator->fails()) {
        session()->flash('error', $validator->errors()->first());
        return redirect()->back();
       }
       $shippingrate = ShippingRate::create($request->all());
       return redirect()->back()->with('message', 'Shipping rate created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(String $id)
    {
        $shippingrate = ShippingRate::find($id);
        return Inertia::render('Shippingrate/Edit', compact('shippingrate'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'area_name' => 'required',
            'fee' => 'required|numeric',
           ]);

           if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
           }
        $shippingrate = ShippingRate::find($id);
        $shippingrate->update($request->all());
        return redirect()->back()->with('message', 'Shipping rate updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $shippingrate = ShippingRate::find($id);
        $shippingrate->delete();
        return redirect()->back()->with('message', 'Shipping rate deleted successfully');
    }
}
