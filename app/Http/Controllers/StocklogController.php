<?php

namespace App\Http\Controllers;

use App\Models\Stocklog;
use App\Http\Requests\StoreStocklogRequest;
use App\Http\Requests\UpdateStocklogRequest;
use Illuminate\Http\Request;

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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStocklogRequest $request)
    {
        //
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
    public function edit(Stocklog $stocklog)
    {
        //
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
