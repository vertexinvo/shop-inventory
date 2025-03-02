<?php

namespace Modules\Mobileapp\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class MobileappController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */

     public function productsList(Request $request){
        $products = Product::with('categories', 'stock', 'brands')->latest()->get();
        return response()->json($products, 200);
     }

     public function ordersList(Request $request){
        $orders = Order::orderBy('order_date', 'desc')->get();
        return response()->json($orders, 200);
     }

     public function todayOrders(Request $request){
        $orders = Order::whereDate('order_date', now())->get();
        return response()->json($orders, 200);
     }

     //viewOrder
     public function viewOrder(Request $request, $code){
        $order = Order::where('code', $code)->first();
        if ($order === null) {
            $order = Order::where('id', $code)->firstOrFail();
        }   
        $order->load('items','user','tax','shipping','items.product','exchangeproduct','exchange_items');
        return response()->json($order, 200);
     }
     
    public function index()
    {
        return view('mobileapp::index');
    }

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('mobileapp::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show($id)
    {
        return view('mobileapp::show');
    }

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('mobileapp::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy($id)
    {
        //
    }
}
