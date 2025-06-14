<?php

namespace App\Http\Controllers;

use App\Facades\StockService;
use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Stock;
use App\Models\Stocklog;
use App\Models\Supplier;
use App\Models\Supplierinvoice;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function scanProduct(Request $request)
    {
        return Inertia::render('Product/ScanProduct');
    }

    public function printqr(Request $request, string $id)
    {
        $ids = explode(',', $id);
        $products = Product::with('stock')->whereIn('id', $ids)->get();
        return Inertia::render('Product/PrintQR', compact('products'));
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Product::class);
        $search = $request->search ?? '';
        $status = $request->status ?? '';
        $brand = $request->brand ?? '';
        $category = $request->category ?? '';

        $startdate = $request->startdate ?? '';
        $enddate = $request->enddate ?? '';

        $supplierinvoiceno = $request->supplierinvoiceno ?? '';

        $invoicecode = $request->invoicecode ?? '';

        // $dateRange = match ($filter) {
        //     'day' => now()->subDay(),
        //     'week' => now()->subWeek(),
        //     'month' => now()->subMonth(),
        //     'year' => now()->subYear(),
        //     default => now()->subDay(),
        // };

        $products = Product::with('categories', 'stock', 'brands','stock.stockLogs')
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%")
                    ->orWhere('model', 'like', "%$search%")
                    ->orWhere('id', 'like', "%$search%")
                    ->orWhere('code', 'like', "%$search%")
                    ->orWhere('identity_value', 'like', "%$search%");
            })
            ->where(function ($query) use ($status) {
                if ($status !== '') {
                    $query->whereHas('stock', function ($query) use ($status) {
                        $query->where('status', $status);
                    });
                }
            })
            ->where(function ($query) use ($brand) {
                if ($brand !== '') {
                    $query->whereHas('brands', function ($query) use ($brand) {
                        $query->where('name', $brand);
                    });
                }
            })
            ->where(function ($query) use ($category) {
                if ($category !== '') {
                    $query->whereHas('categories', function ($query) use ($category) {
                        $query->where('name', $category);
                    });
                }
            })
            ->where(function ($query) use ($startdate, $enddate) {
                if ($startdate && $enddate) {
                    $query->whereBetween('created_at', [$startdate, $enddate]);
                }
            })
            ->where(function ($query) use ($supplierinvoiceno) {
                if ($supplierinvoiceno) {
                    $query->whereHas('supplierInvoice', function ($query) use ($supplierinvoiceno) {
                        $query->where('supplier_invoice_no', $supplierinvoiceno);
                    });
                }
            })
            ->where(function ($query) use ($invoicecode) {
                if ($invoicecode) {
                    $query->whereHas('supplierInvoice.supplier', function ($query) use ($invoicecode) {
                        $query->where('code', $invoicecode);
                    });
                }
            })

            ->latest();


        if ($status) {
            $products = $products->whereHas('stock', function ($query) use ($status) {
                $query->where('status', $status);
            });
        }

        $products = $products->paginate(50);

        $stock = Product::with('stock')->get();

        $totalstock = Product::with('stock')->whereHas('stock')->count();

        $totalstockavailable = Product::with('stock')->whereHas('stock', function ($query) {
            $query->where('status', true)->where('quantity', '>', 0);
        })->count();

        $totalstocknotavailable = Product::with('stock')->whereHas('stock', function ($query) {
            $query->where('status', false)->orWhere('quantity', 0);
        })->count();

        $totalStockValue = Product::with('stock')->whereHas('stock')->get()->sum(function ($product) {
            return $product->purchase_price * $product->stock->quantity;
        });

        $totaliteminstock = Product::with('stock')->whereHas('stock')->get()->sum('stock.quantity');

        $brands = Brand::latest()->get();
        $categories = Category::latest()->get();
     
        return Inertia::render('Product/List', compact('startdate', 'enddate', 'brands', 'categories', 'products', 'totaliteminstock', 'stock', 'search', 'totalstock', 'totalstockavailable', 'totalstocknotavailable', 'totalStockValue', ));
    }




    public function csvstore(Request $request)
    {

        $this->authorize('create', Product::class);

        $file = $request->file('file');

        if ($file) {
            // Store the file in storage/app/productscvs
            $path = $file->storeAs('productscvs', $file->getClientOriginalName(), 'public');

            if ($path) {
                // Construct the full path to the stored file
                $fullPath = storage_path('app/public/' . $path);

                // Check if the file exists before attempting to read
                if (file_exists($fullPath)) {
                    // Read the CSV data into an array
                    $data = array_map('str_getcsv', file($fullPath));

                    if (
                        $data[0] != ['name', 'model', 'specifications', 'description', 'purchase_price', 'selling_price', 'warranty_type', 'warranty_period', 'identity_type', 'identity_value', 'weight', 'quantity', 'categories', 'brands']
                    ) {
                        unlink($fullPath);
                        session()->flash('error', 'Invalid CSV/EXCEL file');
                        return redirect()->back();
                    }

                    array_shift($data);
                    foreach ($data as $row) {

                        $request->quantity = intval($row[11]) ? intval($row[11]) : 0;

                        $tempproduct = [
                            'name' => $row[0],
                            'model' => $row[1],
                            'specifications' => $row[2] ?: '',
                            'description' => $row[3] ?: '',
                            'purchase_price' => intval($row[4]) ? intval($row[4]) : 0,
                            'selling_price' => intval($row[5]) ? intval($row[5]) : 0,
                            'is_warranty' => $row[6] === 'days' || $row[6] === 'months' || $row[6] === 'years' ? true : false,
                            'warranty_type' => $row[6] ?: '',
                            'warranty_period' => intval($row[7]) ? intval($row[7]) : null,
                            'identity_type' => $row[8] ?: '',
                            'identity_value' => $row[9] ?: '',
                            'weight' => floatval($row[10]) ? floatval($row[10]) : 0,
                            // 'quantity' => intval($row[11]) ? intval($row[11]) : 0,
                        ];

                        // Create the product
                        try {
                            $product = Product::create($tempproduct);

                            // Handle categories (field index 12)
                            if (isset($row[12]) && !empty($row[12])) {
                                $categories = explode(',', $row[12]);
                                foreach ($categories as $category) {
                                    $category = trim($category);
                                    $cate = Category::firstOrCreate(['name' => $category]);
                                    $product->categories()->attach($cate);
                                }
                            }

                            // Handle brands (field index 13)
                            if (isset($row[13]) && !empty($row[13])) {
                                $brands = explode(',', $row[13]);
                                foreach ($brands as $brand) {
                                    $brand = trim($brand);
                                    $brandEntry = Brand::firstOrCreate(['name' => $brand]); // Assuming you have a Brand model
                                    $product->brands()->attach($brandEntry); // Assuming Product has a brands relationship
                                }
                            }
                        } catch (\Exception $e) {
                            unlink($fullPath);
                            session()->flash('error', $e->getMessage());
                            return redirect()->back();
                        }
                    }
                    unlink($fullPath);
                    session()->flash('message', 'Records created successfully!');
                    return redirect()->back();
                } else {
                    session()->flash('error', 'File could not be found after upload.');
                    return redirect()->back();
                }
            }
        } else {
            session()->flash('error', 'File not found.');
            return redirect()->back();
        }

    }



    public function csvExport(Request $request)
    {
        $this->authorize('viewAny', Product::class);
        // Fetch all products from the database with their attributes and categories
        $products = Product::with(['categories', 'stock'])->get();

        // Define the headers for the CSV file
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=products.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        // Define the columns for the CSV file
        $columns = [
            'Name',
            'Model',
            'Specifications',
            'Purchase Price',
            'Selling Price',
            'Warranty Period',
            'Is Borrow',
            'Shop Name',
            'Shop Address',
            'Shop Phone',
            'Shop Email',
            'Identity Type',
            'Identity Value',
            'Warranty Type',
            'Is Warranty',
            'Supplier Invoice No',
            'Description',
            'Weight',
            'Is Supplier',
            'Customfield',
            'Is Exchange',
            'Exchange Remarks',
            'Is Return',
            'Return Remarks',
            'Exchange Order Id',
            'quantity',
            'Categories',
            'Brands'
        ];

        // Create a callback to stream the CSV content
        $callback = function () use ($products, $columns) {
            $file = fopen('php://output', 'w');

            // Write the column headers
            fputcsv($file, $columns);

            // Write product data to the CSV
            foreach ($products as $product) {

                $categories = $product->categories->map(function ($category) {
                    return $category->name;
                });
                $categoriesString = implode('; ', $categories->toArray()); // Convert array to string

                fputcsv($file, [
                    $product->name,
                    $product->model,
                    $product->specifications,
                    $product->purchase_price,
                    $product->selling_price,
                    $product->warranty_period,
                    $product->is_borrow,
                    $product->shop_name,
                    $product->shop_address,
                    $product->shop_phone,
                    $product->shop_email,
                    $product->identity_type,
                    $product->identity_value,
                    $product->warranty_type,
                    $product->is_warranty,
                    $product->supplier_invoice_no,
                    $product->description,
                    $product->weight,
                    $product->is_supplier,
                    $product->customfield,
                    $product->is_exchange,
                    $product->exchange_remarks,
                    $product->is_return,
                    $product->return_remarks,
                    $product->exchange_order_id,
                    $product->stock->quantity,
                    $product->categories->count() ? $product->categories->pluck('name')->implode(', ') : '',
                    $product->brands->count() ? $product->brands->pluck('name')->implode(', ') : '',
                ]);
            }

            fclose($file);
        };

        // Return the streamed CSV file as a download
        return response()->stream($callback, 200, $headers);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Product::class);
        $categorydata = Category::all(['id', 'name']);

        $categories = $categorydata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $branddata = Brand::all(['id', 'name']);

        $brands = $branddata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $suppliers = Supplier::all();

        $supplierinvoices = [];
        if ($request->supplier_id) {
            $supplierinvoices = Supplierinvoice::where('supplier_id', $request->supplier_id)->get();
        }


        $code = '';
        if ($request->code) {
            $supplier = new SupplierController();
            $code = $supplier->generateCode();
        }
        $invoicecode = '';
        if ($request->invoicecode) {
            $supplierinvoice = new SupplierinvoiceController();
            $invoicecode = $supplierinvoice->generateInvoiceCode();
        }

        $categories_object_model = Category::all();


        return Inertia::render('Product/Add', compact('categories', 'brands', 'code', 'invoicecode', 'suppliers', 'supplierinvoices', 'categories_object_model'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $this->authorize('create', Product::class);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'categories' => 'nullable',
            'brands' => 'nullable',
            'specifications' => 'nullable|string|max:1000',
            'purchase_price' => 'required|numeric|max:1000000000',
            'selling_price' => 'required|numeric|max:1000000000',
            'warranty_period' => 'nullable|numeric|max:1000000000',
            'is_borrow' => 'required',
            'shop_name' => 'nullable|string|max:255',
            'shop_address' => 'nullable|string|max:255',
            'shop_phone' => 'nullable|max:255',
            'shop_email' => 'nullable|email|max:255',
            'identity_type' => 'nullable',
            'identity_value' => 'nullable|string|max:255',
            'warranty_type' => 'nullable',
            'is_warranty' => 'required',
            'quantity' => 'required|numeric|max:1000000000',
            'supplier_invoice_no' => 'nullable|exists:supplierinvoices,invoice_no',
            'description' => 'nullable|string|max:255',
            'weight' => 'nullable|numeric|max:1000000000',
            'is_supplier' => 'required',
            'customfield' => 'nullable',
            'type' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
      
      
        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        if ($request->is_borrow == 1) {
            if (empty($request->shop_name) && empty($request->shop_address) && empty($request->shop_phone) && empty($request->shop_email)) {
                session()->flash('error', 'At least one shop detail is required');
                return back();
            }
        }
        
        $data = $request->except(['categories', 'brands','image']);
        $data['customfield'] = json_encode($request->customfield);
        $product = Product::create($data);
        if ($request->categories) {
            $product->categories()->sync($request->categories);
        }
        if ($request->brands) {
            $product->brands()->sync($request->brands);
        }

        if ($request->hasFile('image')) {
            $product->addMediaFromRequest('image')->toMediaCollection('product');
        }
        
        session()->flash('message', 'Product created successfully');
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show($code)
    {
        $product = Product::with('stock')->where('code', $code)->first();

        if ($product === null) {
            $product = Product::where('id', $code)->firstOrFail();
        }

        $this->authorize('update', $product);
        $categorydata = Category::all(['id', 'name']);

        $categories = $categorydata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $selectedCategories = $product->categories->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $branddata = Brand::all(['id', 'name']);

        $brands = $branddata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $selectedBrands = $product->brands->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $categories_object_model = Category::all();

        return Inertia::render('Product/view', compact('product', 'categories', 'brands', 'selectedCategories', 'selectedBrands', 'categories_object_model'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, Request $request)
    {
        $product = Product::find($id);
        $this->authorize('update', $product);
        $categorydata = Category::all(['id', 'name']);

        $categories = $categorydata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $selectedCategories = $product->categories->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $branddata = Brand::all(['id', 'name']);

        $brands = $branddata->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });

        $selectedBrands = $product->brands->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        });


        $code = '';
        if ($request->code) {
            $supplier = new SupplierController();
            $code = $supplier->generateCode();
        }
        $invoicecode = '';
        if ($request->invoicecode) {
            $supplierinvoice = new SupplierinvoiceController();
            $invoicecode = $supplierinvoice->generateInvoiceCode();
        }

        $categories_object_model = Category::all();

        return Inertia::render('Product/Edit', compact('product', 'categories', 'brands', 'code', 'invoicecode', 'selectedCategories', 'selectedBrands', 'categories_object_model'));
    }

    public function status(Request $request, string $id)
    {
        $product = Product::with('stock')->find($id);
        $this->authorize('update', $product);
        $product->stock()->update(['status' => !$product->stock->status]);
        session()->flash('message', 'Product status updated successfully');
        return back();

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {

    
    }

    //updatewithimage
    public function updatewithimage(UpdateProductRequest $request, Product $product)
    {
   
        $this->authorize('update', $product);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'categories' => 'nullable',
            'brands' => 'nullable',
            'specifications' => 'nullable|string|max:1000',
            'purchase_price' => 'required|numeric|max:1000000000',
            'selling_price' => 'required|numeric|max:1000000000',
            'warranty_period' => 'nullable|numeric|max:1000000000',
            'is_borrow' => 'required',
            'shop_name' => 'nullable|string|max:255',
            'shop_address' => 'nullable|string|max:255',
            'shop_phone' => 'nullable|max:255',
            'shop_email' => 'nullable|email|max:255',
            'identity_type' => 'nullable',
            'identity_value' => 'nullable|string|max:255',
            'warranty_type' => 'nullable',
            'is_warranty' => 'required',
            // 'quantity' => 'required',
            'supplier_invoice_no' => 'nullable|exists:supplierinvoices,invoice_no',
            'description' => 'nullable|string|max:5000',
            'weight' => 'nullable|numeric|max:1000000000',
            'is_supplier' => 'required',
            'customfield' => 'nullable',
            'type' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_image' => 'nullable|boolean',
        ]);


        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        if ($request->is_borrow == 1) {
            if (empty($request->shop_name) && empty($request->shop_address) && empty($request->shop_phone) && empty($request->shop_email)) {
                session()->flash('error', 'At least one shop detail is required');
                return back();
            }
        }

        $data = $request->except(['categories', 'brands', 'quantity']);
        $data['customfield'] = json_encode($request->customfield);
        $product->update($data);

        if ($request->categories) {
            $product->categories()->sync($request->categories);
        }
        if ($request->categories == null) {

            $product->categories()->detach();
        }

        if ($request->brands) {
            $product->brands()->sync($request->brands);
        }
        if ($request->brands == null) {
            $product->brands()->detach();
        }
        //manage stock
        // $product->stock()->create([
        //     'quantity' => $request->quantity,
        //     'status' => 1
        // ]);


        // Handle image update
        if ($request->hasFile('image')) {
            $product->updateImage($request->file('image'));
        }
        // Handle image removal if checkbox is checked
        elseif ($request->remove_image) {
            $product->deleteImage();
        }

        session()->flash('message', 'Product updated successfully');
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        $product = Product::find($product->id);
        $product->delete();
        return redirect()->back()->with('message', 'Product deleted successfully');
    }


    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', Product::class);
        $ids = explode(',', $request->ids);
        Product::whereIn('id', $ids)->delete();
        session()->flash('message', 'Product deleted successfully');
        return back();
    }
}
