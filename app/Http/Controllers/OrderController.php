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


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
        $search = $request->search ?? '';
        $orders = Order::where('name', 'like', "%$search%")->latest()->paginate(10);

        return Inertia::render('Order/List', compact('orders'));
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

        $itemrec = Product::with('stock')->where('name', 'like', "%$searchitem%")->limit(2)->get();
        $items = $itemrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name . ( $item->model ?  ' - ' .$item->model : '') ?? '',
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
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
