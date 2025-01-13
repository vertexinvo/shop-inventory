<?php

namespace App\Http\Controllers;

use App\Models\Expance;
use App\Http\Requests\StoreExpanceRequest;
use App\Http\Requests\UpdateExpanceRequest;
use Inertia\Inertia;

class ExpanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        abort(403, 'You are not authorized to access this page.');
        $expences = Expance::latest()->paginate(10);
        return Inertia::render('Expence/List', compact('expences'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort(403, 'You are not authorized to access this page.');
        return Inertia::render('Expence/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExpanceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Expance $expance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expance $expance)
    {
        abort(403, 'You are not authorized to access this page.');
        return Inertia::render('Expence/Edit', compact('expance'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExpanceRequest $request, Expance $expance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expance $expance)
    {
        //
    }
}
