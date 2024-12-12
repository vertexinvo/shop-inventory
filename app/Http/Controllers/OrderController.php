<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Product;
use App\Models\ShippingRate;
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
    public function index()
    {
       
        $search = $request->search ?? '';
        $orders = Order::where('name', 'like', "%$search%")->latest()->paginate(10);
        $total = Order::count();
        $pendingCount = Order::where('status', 'pending')->count();
        $completedCount = Order::where('status', 'completed')->count();
        
        return Inertia::render('Order/List', compact('orders','pendingCount','completedCount','total'));
    }

    public function changestatus(Request $request, $id){
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();
        session()->flash('message', 'Status updated successfully');
        return back();
    }

    public function amountupdate(Request $request, $id){
        $order = Order::findOrFail($id);
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
        $searchuser = $request->searchuser ?? '';
        $userrec = User::role('customer')->where(function ($query) use ($searchuser) {
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

        $itemrec = Product::with('stock', 'categories')->where(function ($query) use ($searchitem) {
            $query->where('name', 'like', "%$searchitem%")
                  ->orWhere('identity_value', 'like', "%$searchitem%");
        })->limit(2)->get();
        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '' ) . ( $item->identity_value ?  ' - ' .$item->identity_value : '' ) ?? '',
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

        
        return Inertia::render('Order/InstantOrder', compact('users', 'items', 'order_id',));
    }

    public function instantorderstore(Request $request)
    {
      
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|max:255',
            'address' => 'nullable|max:500',
            'total' => 'required|numeric',
            'payable_amount' => 'required|numeric',
            'paid_amount' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'items' => 'required|array',
            'exchange_items' => 'nullable|array',
            'exchange' => 'nullable|numeric',
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
        ]);
        $order = Order::create($data);

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

        foreach ($request->exchange_items as $item) {
            $item["is_exchange"] = true;
            $item["selling_price"] = $item["purchase_price"];
            $item["exchange_order_id"] = $order->id;
            unset($item['total']);
          $product =  Product::create($item);
          $product->stock()->create([
            'quantity' => $item['quantity'],
            'status' => true,
          ]);
        }

        // //update product stock quantity
        // foreach ($request->items as $item) {
        //     $product = Product::find($item['id']);
        //     $product->stock()->update([
        //         'quantity' => $product->stock->quantity - $item['quantity'],
        //     ]);
        // }

    
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
        $searchuser = $request->searchuser ?? '';
        $userrec = User::role('customer')->where(function ($query) use ($searchuser) {
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

        $itemrec = Product::with('stock', 'categories')->where(function ($query) use ($searchitem) {
            $query->where('name', 'like', "%$searchitem%")
                  ->orWhere('identity_value', 'like', "%$searchitem%");
        })->limit(2)->get();
        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '' ) . ( $item->identity_value ?  ' - ' .$item->identity_value : '' ) ?? '',
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
      
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|max:255',
            'address' => 'nullable|max:500',
            'total' => 'required|numeric',
            'payable_amount' => 'required|numeric',
            'paid_amount' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'items' => 'required|array',
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

        ]);
        $order = Order::create($data);

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

        // //update product stock quantity
        // foreach ($request->items as $item) {
        //     $product = Product::find($item['id']);
        //     $product->stock()->update([
        //         'quantity' => $product->stock->quantity - $item['quantity'],
        //     ]);
        // }

    
        session()->flash('message', 'Order created successfully.');
        if($request->close){
            return redirect()->route('order.index');
        }
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load('items','user','tax','shipping','items.product','exchangeproduct');
        return Inertia::render('Order/View', compact('order'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
