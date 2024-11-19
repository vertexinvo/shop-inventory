<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('categories', 'stock', 'brands')->latest()->paginate(10);
        return Inertia::render('Product/List', compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categorydata = Category::all(['id', 'name'] );

        $categories = $categorydata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ,
            ];
        });

        $branddata = Brand::all(['id', 'name'] );

        $brands = $branddata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ,
            ];
        });

        return Inertia::render('Product/Add', compact('categories', 'brands'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'model' => 'nullable',
            'categories' => 'nullable',
            'brands' => 'nullable',
            'specifications' => 'nullable',

        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(String $id)
    {
        $product = Product::find($id); 
        return Inertia::render('Product/Edit',compact('product'));
    }

    public function status(Request $request, string $id)
    {
        // 
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
       $product = Product::find($product->id);
       $product->delete();
       return redirect()->back()->with('message', 'Product deleted successfully');
    }
}
