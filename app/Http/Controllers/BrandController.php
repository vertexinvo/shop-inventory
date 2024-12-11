<?php

namespace App\Http\Controllers;

use App\Facades\BrandService;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = BrandService::getAllBrands();
        return Inertia::render('Brand/List', compact('brands'));
    }
 
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Brand/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $response = BrandService::createBrand($request);
        if($response){
            session()->flash('message', 'Brand created successfully');
        }
        return back();
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        return Inertia::render('Brand/Edit', compact('brand'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,Brand $brand)
    {
        $response = BrandService::updateBrand($request, $brand);
        if($response){
            session()->flash('message', 'Brand updated successfully');
        }
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->back()->with('message', 'Brand deleted successfully');
    }

    public function bulkdestroy(Request $request)
    {
        $bulkdestroy = Brand::whereIn('id', explode(',', $request->ids))->delete();
        session()->flash('message', 'Brand deleted successfully');
        return back();
    }
}
