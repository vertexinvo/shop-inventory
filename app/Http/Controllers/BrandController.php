<?php

namespace App\Http\Controllers;

use App\Facades\BrandService;
use App\Models\Brand;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Brand::class);
        $brands = BrandService::getAllBrands();
        return Inertia::render('Brand/List', compact('brands'));
    }
 
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Brand::class);
        return Inertia::render('Brand/Add');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Brand::class);
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
        $this->authorize('update', $brand);
        return Inertia::render('Brand/Edit', compact('brand'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,Brand $brand)
    {
        $this->authorize('update', $brand);
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
        $this->authorize('delete', $brand);
        $brand->delete();
        Cache::forget('all_brands');
        return redirect()->back()->with('message', 'Brand deleted successfully');
    }

    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', Brand::class);
        $bulkdestroy = Brand::whereIn('id', explode(',', $request->ids))->delete();
        session()->flash('message', 'Brand deleted successfully');
        Cache::forget('all_brands');
        return back();
    }
}
