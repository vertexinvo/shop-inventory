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
        $this->authorize('viewAny', ShippingRate::class);
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
        $this->authorize('create', ShippingRate::class);
        return Inertia::render('Shippingrate/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', ShippingRate::class);
        // dd($request->all());
       $validator = Validator::make($request->all(), [
        'area_name' => 'required|string|max:255',
        'fee' => 'required|numeric|max:1000000000',
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
        $this->authorize('update', $shippingrate);
        return Inertia::render('Shippingrate/Edit', compact('shippingrate'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       
        $validator = Validator::make($request->all(), [
            'area_name' => 'required|string|max:255',
            'fee' => 'required|numeric|max:1000000000',
           ]);

           if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
           }
        $shippingrate = ShippingRate::find($id);
        $this->authorize('update', $shippingrate);
        $shippingrate->update($request->all());
        return redirect()->back()->with('message', 'Shipping rate updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $shippingrate = ShippingRate::find($id);
        $this->authorize('delete', $shippingrate);
        $shippingrate->delete();
        return redirect()->back()->with('message', 'Shipping rate deleted successfully');
    }
    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', ShippingRate::class);
        $ids = explode(',', $request->ids);
        ShippingRate::whereIn('id', $ids)->delete();
        session()->flash('message', 'Shipping rate deleted successfully');
        return back();
    }
}
