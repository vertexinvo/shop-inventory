<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
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
        $userrec = User::role('customer')->where('name', 'like', "%$searchuser%")->limit(3)->get();
        $users = $userrec->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->name ?? '',
                'email' => $item->email ?? '',
                'phone' => $item->phone ?? '',
                'address' => $item->address ?? '',
            ];
        });

     
        
        return Inertia::render('Order/Add', compact('users'));
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
