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
    public function index( Request $request)
    {
        $search = $request->search ?? '';
        $products = Product::with('categories', 'stock', 'brands')->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('model', 'like', "%$search%")
                  ->orWhere('identity_value', 'like', "%$search%");
        })->latest()->paginate(10);

    

        return Inertia::render('Product/List', compact('products' ));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
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


        $code = session('code') ?? '';
        $invoicecode = session('invoiceCode') ?? '';

        return Inertia::render('Product/Add', compact('categories', 'brands', 'code', 'invoicecode'));
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
            'purchase_price' => 'required',
            'selling_price' => 'required',
            'warranty_period' => 'nullable',
            'is_borrow' => 'required',
            'shop_name' => 'nullable',
            'shop_address' => 'nullable',
            'shop_phone' => 'nullable',
            'shop_email' => 'nullable',
            'identity_type' => 'nullable',
            'identity_value' => 'nullable',
            'warranty_type' => 'nullable',
            'is_warranty' => 'required',
            'quantity' => 'required',
            'supplier_invoice_no' => 'nullable|exists:supplierinvoices,invoice_no',
            'description' => 'nullable',
            'weight' => 'nullable',
            'is_supplier' => 'required',
            'customfield' => 'nullable',
        ]);
      

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        if($request->is_borrow == 1){
            if(empty($request->shop_name) && empty($request->shop_address) && empty($request->shop_phone) && empty($request->shop_email)) {
                session()->flash('error', 'At least one shop detail is required');
                return back();
            }
        }
        
        $data = $request->except(['categories', 'brands']);
        $data['customfield'] = json_encode($request->customfield);
        $product = Product::create($data);
        if ($request->categories) {
            $product->categories()->sync($request->categories);
        }
        if ($request->brands) {
            $product->brands()->sync($request->brands);
        }
        //manage stock
        $product->stock()->create([
            'quantity' => $request->quantity,
            'status' => 1
        ]);

        session()->flash('message', 'Product created successfully');
        return back();
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
        $categorydata = Category::all(['id', 'name'] );

        $categories = $categorydata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ,
            ];
        });

        $selectedCategories = $product->categories->map(function ($item) {
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

        $selectedBrands = $product->brands->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ,
            ];
        });

        $code = session('code') ?? '';
        $invoicecode = session('invoiceCode') ?? '';

        return Inertia::render('Product/Edit',compact('product','categories', 'brands', 'code', 'invoicecode', 'selectedCategories', 'selectedBrands'));
    }

    public function status(Request $request, string $id)
    {
        $product = Product::with('stock')->find($id);
        $product->stock()->update(['status' => !$product->stock->status]);
        session()->flash('message', 'Product status updated successfully');
        return back();
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'model' => 'nullable',
            'categories' => 'nullable',
            'brands' => 'nullable',
            'specifications' => 'nullable',
            'purchase_price' => 'required',
            'selling_price' => 'required',
            'warranty_period' => 'nullable',
            'is_borrow' => 'required',
            'shop_name' => 'nullable',
            'shop_address' => 'nullable',
            'shop_phone' => 'nullable',
            'shop_email' => 'nullable',
            'identity_type' => 'nullable',
            'identity_value' => 'nullable',
            'warranty_type' => 'nullable',
            'is_warranty' => 'required',
            'quantity' => 'required',
            'supplier_invoice_no' => 'nullable|exists:supplierinvoices,invoice_no',
            'description' => 'nullable',
            'weight' => 'nullable',
            'is_supplier' => 'required',
            'customfield' => 'nullable',
        ]);
      

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        if($request->is_borrow == 1){
            if(empty($request->shop_name) && empty($request->shop_address) && empty($request->shop_phone) && empty($request->shop_email)) {
                session()->flash('error', 'At least one shop detail is required');
                return back();
            }
        }
        
        $data = $request->except(['categories', 'brands']);
        $data['customfield'] = json_encode($request->customfield);
        $product->update($data);
        if ($request->categories) {
            $product->categories()->sync($request->categories);
        }
        if($request->categories == null){
            
            $product->categories()->detach();
        }
     
        if ($request->brands) {
            $product->brands()->sync($request->brands);
        }
        if($request->brands == null){
            $product->brands()->detach();
        }
        //manage stock
        $product->stock()->create([
            'quantity' => $request->quantity,
            'status' => 1
        ]);

        session()->flash('message', 'Product updated successfully');
        return back();
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


    public function bulkdestroy(Request $request)
    {
        $ids = explode(',', $request->ids);
        Product::whereIn('id', $ids)->delete();
        session()->flash('message', 'Product deleted successfully');
        return back();
    }
}
