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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShippingRateRequest $request)
    {
        //
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
    public function edit(ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShippingRateRequest $request, ShippingRate $shippingRate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingRate $shippingRate)
    {
        //
    }
}
