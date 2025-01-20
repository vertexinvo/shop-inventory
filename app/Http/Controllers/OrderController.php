<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Product;
use App\Models\ShippingRate;
use App\Models\Stock;
use App\Models\Stocklog;
use App\Models\tax;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);
        $search = $request->search ?? '';
        $status = $request->status ?? ''; 
        $searchuserid = $request->searchuserid ?? '';
        $orders = Order::where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                    ->orWhere('code', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                  ->orWhere('id', 'like', "%$search%");
        })->latest();
        if($status !== ''){
            $orders = $orders->where('status', $status);
        }
        if($searchuserid !== ''){
            $orders = $orders->where('user_id', $searchuserid);
        }
        $orders = $orders->paginate(10);
        $total = Order::where('status','!=', 'cancel')->count();
        $pendingCount = Order::where('status', 'pending')->count();
        $completedCount = Order::where('status', 'completed')->count();
        $totalPaidAmount = Order::where('status', 'completed')->sum('paid_amount');
        $totalPendingAmount = Order::where('status', 'pending')->get()->sum(function ($order) {
            return $order->payable_amount - $order->paid_amount;
        });
        $monthlyTotalPaidAmount = Order::where('status', 'completed')
        ->whereMonth('order_date', now()->month)->sum('paid_amount');

        $monthlyTotalPendingAmount = Order::where('status', 'pending')
        ->whereMonth('order_date', now()->month)->get()
        ->sum(function ($order) {
        return $order->payable_amount - $order->paid_amount;
        });

        $yearlyTotalPaidAmount = Order::where('status', 'completed')
        ->whereYear('order_date', now()->year)->sum('paid_amount');

        $yearlyTotalPendingAmount = Order::where('status', 'pending')
        ->whereYear('order_date', now()->year)->get()
        ->sum(function ($order) {
        return $order->payable_amount - $order->paid_amount;
        });
    return Inertia::render('Order/List', compact('orders','pendingCount','completedCount','total','status','searchuserid','search','totalPaidAmount','totalPendingAmount','monthlyTotalPaidAmount','monthlyTotalPendingAmount','yearlyTotalPaidAmount','yearlyTotalPendingAmount'));
    }


    public function csvExport(Request $request)
{
    $this->authorize('viewAny', Order::class);
    $orders = Order::all();
    $headers = [
        "Content-type"        => "text/csv",
        "Content-Disposition" => "attachment; filename=orders.csv",
        "Pragma"              => "no-cache",
        "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
        "Expires"             => "0"
    ];
    $columns = [
        'Name',
        'Email',
        'Phone',
        'Address',
        'User Id',
        'Total',
        'Payable Amount',
        'Paid Amount',
        'Method',
        'Cheque No',
        'Cheque Date',
        'Bank Name',
        'Bank Branch',
        'Bank Account',
        'Online Payment Link',
        'Extra Charges',
        'Shipping Charges',
        'Discount',
        'Tax',
        'Status',
        'Is Installment',
        'Installment Amount',
        'Installment Period',
        'Installment Count',
        'Installment Start Date',
        'Installment End Date',
        'Tax Id',
        'Shipping Id',
        'Order Date',
        'Exchange'
    ];
    $callback = function() use ($orders, $columns) {
        $file = fopen('php://output', 'w');
        fputcsv($file, $columns);
        foreach ($orders as $order) {
            fputcsv($file, [
                $order->name,
                $order->email,
                $order->phone,
                $order->address,
                $order->user_id,
                $order->total,
                $order->payable_amount,
                $order->paid_amount,
                $order->method,
                $order->cheque_no,
                $order->cheque_date,
                $order->bank_name,
                $order->bank_branch,
                $order->bank_account,
                $order->online_payment_link,
                $order->extra_charges,
                $order->shipping_charges, 
                $order->discount,
                $order->tax,
                $order->status,
                $order->is_installment,
                $order->installment_amount,
                $order->installment_period,
                $order->installment_count,
                $order->installment_start_date,
                $order->installment_end_date,
                $order->tax_id,
                $order->shipping_id,
                $order->order_date,
                $order->exchange
            ]);
        }
        fclose($file);
    };
    return response()->stream($callback, 200, $headers);
}
    public function changestatus(Request $request, $id){

        $order = Order::findOrFail($id);
        $this->authorize('update', $order);
        $order->status = $request->status;
        $order->save();

        if($request->status == 'cancel'){
            foreach ($order->items as $item) {
                $product_id = $item->product_id;
                $stock = Stock::where('product_id', $product_id)->first();
                
                if ($stock) {
                    $newqty = $stock->quantity + $item->qty;
                    $stock->update([
                        'quantity' => $newqty
                    ]);
                }
            }
        }

        session()->flash('message', 'Status updated successfully');
        return back();
    }

    public function amountupdate(Request $request, $id){
        $order = Order::findOrFail($id);
        $this->authorize('update', $order);
        $order->paid_amount = $request->paid_amount;
        if($order->paid_amount >= $order->payable_amount){
            $order->status = 'completed';
        }
        else{
            $order->status = 'pending';
        }
        $order->save();
        session()->flash('message', 'Amount updated successfully');
        return back();
    }
    

    public function instantorder(Request $request)
    {
        $this->authorize('create', Order::class);
        $searchuser = $request->searchuser ?? '';
       
        // $userrec = User::role('customer')->where('status',true)->where(function ($query) use ($searchuser) {
        //     $query->where('name', 'like', "%$searchuser%")
        //           ->orWhere('phone', 'like', "%$searchuser%");
        // })->limit(6)->get();
        $userrec = User::role('customer')->where('status',true)->get();
        
        $users = $userrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . '-' . $item->phone ?? '',
                'email' => $item->email ?? '',
                'phone' => $item->phone ?? '',
                'address' => $item->address ?? '',
                'name' => $item->name ?? '',
            ];
        });

        $searchitem = $request->searchitem ?? '';

        // $itemrec = Product::with('stock', 'categories')->where(function ($query) use ($searchitem) {
        //     $query->where('name', 'like', "%$searchitem%")
        //           ->orWhere('identity_value', 'like', "%$searchitem%");
        // })->limit(2)->get();
        $itemrec = Product::with('stock', 'categories','brands')->get();


        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '' ) . ( $item->identity_value ?  ' - ' .$item->identity_value : '' ) . ( $item->supplier_name ?  ' - ' .$item->supplier_name : '' ) ?? '',
                'data' => $item,
                'quantity' => 1
            ];
        });

      

        //get order id latest
        $order = Order::latest()->first();
        if ($order) {
            $order_id = $order->id + 1;
        } else {
            $order_id = 1;
        }

        $searchid = $request->searchid ?? '';
        $user = null;
        if($searchid !== ''){
            $user =  User::find($searchid);
        }

        return Inertia::render('Order/InstantOrder', compact('users', 'items', 'order_id','user'));
    }

    public function instantorderstore(Request $request)
    {
        $this->authorize('create', Order::class);
   
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|regex:/^\+?[0-9\s\-]{8,15}$/',
            'address' => 'nullable|string|max:500',
            'total' => 'required|numeric|max:1000000000',
            'payable_amount' => 'required|numeric|max:1000000000',
            'paid_amount' => 'required|numeric|max:1000000000',
            'discount' => 'nullable|numeric|max:1000000000',
            'items' => 'required|array',
            'exchange_items' => 'nullable|array',
            'exchange' => 'nullable|numeric|max:1000000000',
            'extra_charges' => 'nullable|numeric|max:1000000000',
            'order_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->only([
            'name',
            'email',
            'phone',
            'address',
            'total',
            'payable_amount',
            'paid_amount',
            'discount', 
            'user_id',
            'order_date',
            'exchange',
            'extra_charges'
        ]);
       
   
        $order = Order::create($data);

        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item["data"]['id'],
                'name' => $item["data"]['name'],
                'price' => $item["data"]['selling_price'],
                'qty' => $item['quantity'],
                'category' => $item["data"]['categories'] ? $item["data"]['categories'][0]['name'] : '',
                'status'=> 'active',
                'code' => $item["data"]['code']
            ]);
        }

        foreach ($request->exchange_items as $item) {

            $data = $item;

            $item["is_exchange"] = true;
            $item["selling_price"] = $item["purchase_price"];
            $item["exchange_order_id"] = $order->id;
            unset($item['total']);
            $item['type'] = 'used';
            $product =  Product::create($item);

            $data["product_id"] = $product->id;
            $data["code"] = $product->code;
            $order->exchange_items()->create($data);

            $product->stock()->update([
                'quantity' => $item['quantity'],
            ]);
            $stock = Stock::where('product_id', $product->id)->first();
            Stocklog::where('stock_id', $stock->id)->update([
                'quantity' => $item['quantity'],
            ]);
        }

        // //update product stock quantity
        foreach ($request->items as $item) {
            $product = Product::find($item["data"]['id']);
            $product->stock()->update([
                'quantity' => $product->stock->quantity - $item['quantity'],
            ]);
        }



    
        session()->flash('message', 'Order created successfully.');
        if($request->close){
            return redirect()->route('order.index');
        }
        return back();

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Order::class);
        $searchuser = $request->searchuser ?? '';
        // $userrec = User::role('customer')->where('status',true)->where(function ($query) use ($searchuser) {
        //     $query->where('name', 'like', "%$searchuser%")
        //           ->orWhere('phone', 'like', "%$searchuser%");
        // })->limit(6)->get();
        $userrec = User::role('customer')->where('status',true)->get();

        $users = $userrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . '-' . $item->phone ?? '',
                'email' => $item->email ?? '',
                'phone' => $item->phone ?? '',
                'address' => $item->address ?? '',
                'name' => $item->name ?? '',
            ];
        });

        $searchitem = $request->searchitem ?? '';

        // $itemrec = Product::with('stock', 'categories')->where(function ($query) use ($searchitem) {
        //     $query->where('name', 'like', "%$searchitem%")
        //           ->orWhere('identity_value', 'like', "%$searchitem%");
        // })->limit(2)->get();
        $itemrec = Product::with('stock', 'categories', 'categories','brands')->get();

        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '' ) . ( $item->identity_value ?  ' - ' .$item->identity_value : '' ) . ( $item->supplier_name ?  ' - ' .$item->supplier_name : '' ) ?? '',
                'data' => $item,
                'quantity' => 1
            ];
        });

        $searchshipping = $request->searchshipping ?? '';

        // $shippingrec = ShippingRate::where('area_name', 'like', "%$searchshipping%")->limit(5)->get();
        $shippingrec = ShippingRate::get();

        $shippingrates = $shippingrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name .' - '. $item->city_name ?? '',
                'fee' => $item->fee
            ];
        });

        //get order id latest
        $order = Order::latest()->first();
        if ($order) {
            $order_id = $order->id + 1;
        } else {
            $order_id = 1;
        }

        $taxs = tax::latest()->get();
        
        return Inertia::render('Order/Add', compact('users', 'items', 'order_id', 'taxs', 'shippingrates'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $this->authorize('create', Order::class);
      
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|regex:/^\+?[0-9\s\-]{8,15}$/',
            'address' => 'nullable|string|max:500',
            'total' => 'required|numeric|max:1000000000',
            'payable_amount' => 'required|numeric|max:1000000000',
            'paid_amount' => 'required|numeric|max:1000000000',
            'discount' => 'nullable|numeric|max:1000000000',
            'items' => 'required|array',
            'exchange_items' => 'nullable|array',
            'exchange' => 'nullable|numeric|max:1000000000',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->only([
            'name',
            'email',
            'phone',
            'address',
            'user_id',
            'total',
            'payable_amount',
            'paid_amount',
            'method',
            'cheque_no',
            'cheque_date',
            'bank_name',
            'bank_branch',
            'bank_account',
            'online_payment_link',
            'extra_charges',
            'shipping_charges',
            'discount',
            'tax',
            'status',
            'is_installment',
            'installment_amount',
            'installment_period',
            'installment_count',
            'installment_start_date',
            'installment_end_date',
            'tax_id',
            'shipping_id',
            'order_date',
            'exchange',
        ]);

        $order = Order::create($data);

        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item["data"]['id'],
                'name' => $item["data"]['name'],
                'price' => $item["data"]['selling_price'],
                'qty' => $item['quantity'],
                'category' => $item["data"]['categories'] ? $item["data"]['categories'][0]['name'] : '',
                'status'=> 'active',
                'code' => $item["data"]['code']
            ]);
        }

        foreach ($request->exchange_items as $item) {
            $data = $item;
            $item["is_exchange"] = true;
            $item["selling_price"] = $item["purchase_price"];
            $item["exchange_order_id"] = $order->id;
            unset($item['total']);
            $item['type'] = 'used';
            $product = Product::create($item);

            $data["product_id"] = $product->id;
            $data["code"] = $product->code;
            $order->exchange_items()->create($data);

            $product->stock()->update([
                'quantity' => $item['quantity'],
            ]);
            $stock = Stock::where('product_id', $product->id)->first();
            Stocklog::where('stock_id', $stock->id)->update([
                'quantity' => $item['quantity'],
            ]);
        }

        // //update product stock quantity
        foreach ($request->items as $item) {
            $product = Product::find($item["data"]['id']);
            $product->stock()->update([
                'quantity' => $product->stock->quantity - $item['quantity'],
            ]);
        }

    
        session()->flash('message', 'Order created successfully.');
        if($request->close){
            return redirect()->route('order.index');
        }
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show($code)
    {
        $order = Order::where('code', $code)->first();

        if ($order === null) {
            $order = Order::where('id', $code)->firstOrFail();
        }
        
        $this->authorize('view', $order);
        $order->load('items','user','tax','shipping','items.product','exchangeproduct','exchange_items');
        return Inertia::render('Order/View', compact('order'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order, Request $request)
    {
        $this->authorize('update', $order);
        if($order->status === 'cancel'){
            return abort(403);
        }

      $order->load('items','user','tax','shipping','items.product','items.product.stock','exchange_items','items.product.stock','items.product.categories');
        
        
        $searchuser = $request->searchuser ?? '';
        $userrec = User::role('customer')->where('status',true)->where(function ($query) use ($searchuser) {
            $query->where('name', 'like', "%$searchuser%")
                  ->orWhere('phone', 'like', "%$searchuser%");
        })->limit(6)->get();
        $users = $userrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . '-' . $item->phone ?? '',
                'email' => $item->email ?? '',
                'phone' => $item->phone ?? '',
                'address' => $item->address ?? '',
                'name' => $item->name ?? '',
            ];
        });

        $searchitem = $request->searchitem ?? '';

        $itemrec = Product::with('stock', 'categories', 'categories','brands')->where(function ($query) use ($searchitem) {
            $query->where('name', 'like', "%$searchitem%")
                  ->orWhere('identity_value', 'like', "%$searchitem%");
        })->get();
        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '' ) . ( $item->identity_value ?  ' - ' .$item->identity_value : '' ) . ( $item->supplier_name ?  ' - ' .$item->supplier_name : '' )  ?? '',
                'data' => $item,
                'quantity' => 1
            ];
        });

        $searchshipping = $request->searchshipping ?? '';

        $shippingrec = ShippingRate::where('area_name', 'like', "%$searchshipping%")->limit(5)->get();
        $shippingrates = $shippingrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name .' - '. $item->city_name ?? '',
                'fee' => $item->fee
            ];
        });

        //get order id latest
        
        $order_id = $order->id;
        

        $taxs = tax::latest()->get();

        
        $default_selected_shippingrate =   $order->shipping ? ['value' => $order->shipping->id, 'label' => $order->shipping->area_name .' - '. $order->shipping->city_name] : [];
         
        return Inertia::render('Order/Add', compact('users', 'items', 'order_id', 'taxs', 'shippingrates','order','default_selected_shippingrate'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|regex:/^\+?[0-9\s\-]{8,15}$/',
            'address' => 'nullable|string|max:500',
            'total' => 'required|numeric|max:1000000000',
            'payable_amount' => 'required|numeric|max:1000000000',
            'paid_amount' => 'required|numeric|max:1000000000',
            'discount' => 'nullable|numeric|max:1000000000',
            'items' => 'required|array',
            'exchange_items' => 'nullable|array',
            'exchange' => 'nullable|numeric|max:1000000000',
        ]);

        if ($validator->fails()) {
            session()->flash('error', $validator->errors()->first());
            return back();
        }
        $data = $request->only([
            'name',
            'email',
            'phone',
            'address',
            'user_id',
            'total',
            'payable_amount',
            'paid_amount',
            'method',
            'cheque_no',
            'cheque_date',
            'bank_name',
            'bank_branch',
            'bank_account',
            'online_payment_link',
            'extra_charges',
            'shipping_charges',
            'discount',
            'tax',
            'status',
            'is_installment',
            'installment_amount',
            'installment_period',
            'installment_count',
            'installment_start_date',
            'installment_end_date',
            'tax_id',
            'shipping_id',
            'order_date',
            'exchange',
        ]);
        $order->update($data);


        
        foreach ($order->items as $item) {
            $product_id = $item->product_id;
            $stock = Stock::where('product_id', $product_id)->first();
            
            if ($stock) {
                $newqty = $stock->quantity + $item->qty;
                $stock->update([
                    'quantity' => $newqty
                ]);
            }
        }

        $order->items()->delete();
        
        foreach ($request->items as $item) {
            $order->items()->create([
                'product_id' => $item["data"]['id'],
                'name' => $item["data"]['name'],
                'price' => $item["data"]['selling_price'],
                'qty' => $item['quantity'],
                'category' => $item["data"]['categories'] ? $item["data"]['categories'][0]['name'] : '',
                'status'=> 'active'
            ]);
        }

        foreach ($request->items as $item) {
            $product = Product::find($item["data"]['id']);
            $product->stock()->update([
                'quantity' => $product->stock->quantity - $item['quantity'],
            ]);
        }
        

        $exchangeItemsIds = [];

        if ($request->exchange_items) {
            foreach ($request->exchange_items as $item) {
                if(!isset($item["id"])){                  
                    $data = $item;
                    $item["is_exchange"] = true;
                    $item["selling_price"] = $item["purchase_price"];
                    $item["exchange_order_id"] = $order->id;
                    unset($item['total']);
                    $product = Product::create($item);

                    $data["product_id"] = $product->id;
                    $order->exchange_items()->create($data);

                    $product->stock()->update([
                        'quantity' => $item['quantity'],
                    ]);
                    $stock = Stock::where('product_id', $product->id)->first();
                    Stocklog::where('stock_id', $stock->id)->update([
                        'quantity' => $item['quantity'],
                    ]);
                    //push items in exchangeItemsIds 
                    $exchangeItemsIds[] = $product->id;
                }else{
                    $exchangeItemsIds[] = $item["product_id"];
                }          
            }
        }
        //delete all exchange items of this order where not in exchangeItemsIds
        $order->exchange_items()->whereNotIn('product_id', $exchangeItemsIds)->delete();
        Product::whereNotIn('id', $exchangeItemsIds)->where('exchange_order_id', $order->id)->delete();

        session()->flash('message', 'Order updated successfully.');
        if($request->close){
            return redirect()->route('order.index');
        }
        else{
            return back();
        }
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();
        session()->flash('message', 'Order deleted successfully.');
        return redirect()->route('order.index');
    }

    public function bulkdestroy(Request $request)
    {
        $this->authorize('bulkdelete', Order::class);
        $ids = explode(',', $request->ids);
        Order::whereIn('id', $ids)->delete();
        session()->flash('message', 'Order deleted successfully');
        return back();
    }
}
