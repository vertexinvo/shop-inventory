<?php

namespace App\Http\Controllers;

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
        $brands = Brand::latest()->paginate(10);
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:brands,name',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        $brand = Brand::create($data);
        return redirect()->back()->with('message', 'Brand created successfully');
        
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
        $brand = Brand::find($brand->id);
        return Inertia::render('Brand/Edit', compact('brand'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:brands,name'.$brand->id,
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return redirect()->back();
        }
        $data = $request->all();
        $brand = Brand::find($brand->id)->update($data);
        return redirect()->back()->with('message', 'Brand updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand = Brand::find($brand->id);
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
