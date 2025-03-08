<?php

namespace Modules\Mobileapp\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Facades\OrderService;
use App\Http\Middleware\DomainDatabaseSwitcher;
use Carbon\Carbon;
use App\Models\Supplier;
class MobileappController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Renderable
     */

     //constructor
        public function __construct()
        {
            $this->middleware(DomainDatabaseSwitcher::class);
        }

     public function productsList(Request $request){
        $products = Product::with('categories', 'stock', 'brands')->latest()->get();
        return response()->json($products, 200);
     }

    public function productsSearch(Request $request, $search){
        $products = Product::with('categories', 'stock', 'brands')->where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                ->orWhere('model', 'like', "%$search%")
                ->orWhere('id', 'like', "%$search%")
                ->orWhere('code', 'like', "%$search%")
                ->orWhere('identity_value', 'like', "%$search%");
        })->latest()->get();
        return response()->json($products, 200);
    }

    public function productDetail(Request $request, $code){
        $product = Product::with('stock','categories','brands')->where('code', $code)->first();

        if ($product === null) {
            $product = Product::where('id', $code)->firstOrFail();
        }  
        return response()->json($product, 200);
    }

    public function ordersSearch(Request $request, $search){
        $orders = Order::where(function ($query) use ($search) {
            $query->where('name', 'like', "%$search%")
                    ->orWhere('code', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                  ->orWhere('id', 'like', "%$search%")
                  ->orWhere('bill_no', 'like', "%$search%");
        })->orderBy('order_date', 'desc')->get();
        return response()->json($orders, 200);
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


     public function counts(Request $request){
        $totalOrder = Order::whereNotIn('status', ['cancel'])->count();
        $totalProductInStock = Product::whereHas('stock', function ($query) {
            $query->where('quantity', '>', 0)->orWhere('status', true);
        })->count();
    
        $totalProductOutofStock = Product::whereHas('stock', function ($query) {
            $query->where('quantity', 0)->orWhere('status', false);
        })->count();

        $totalStockValue = Product::with('stock')->whereHas('stock')->get()->sum(function ($product) {
            return $product->purchase_price * $product->stock->quantity;
        });
    
        $totaliteminstock = Product::with('stock')->whereHas('stock')->get()->sum('stock.quantity');
    
        $totalOrderAmountPending = Order::where('status', 'pending')->get()->sum(function ($order) {
            return $order->payable_amount - $order->paid_amount;
        });

        $allsuppliers = Supplier::all();

        $totalSupplierPendingAmount = $allsuppliers->sum(function ($supplier) {
            return $supplier->total_amount_pending; // Use the accessor
        });
    
        $todaysOrder = Order::where('status', '!=', 'cancel')->whereDate('order_date', Carbon::today())->count();
    
        $todayProfit = OrderService::getTodayNetProfit();
        $weekProfit = OrderService::getThisWeekNetProfit();
        $monthProfit = OrderService::getThisMonthNetProfit();
        $yearProfit = OrderService::getThisYearNetProfit();
    
        $todaysPendingOrderAmount = Order::todaysPendingAmount();
        
        return response()->json([
            'totalOrder' => $totalOrder,
            'totalProductInStock' => $totalProductInStock,
            'totalProductOutofStock' => $totalProductOutofStock,
            'totalStockValue' => $totalStockValue,
            'totaliteminstock' => $totaliteminstock,
            'totalOrderAmountPending' => $totalOrderAmountPending,
            'totalSupplierPendingAmount' => $totalSupplierPendingAmount,
            'todaysOrder' => $todaysOrder,
            'todayProfit' => $todayProfit,
            'weekProfit' => $weekProfit,
            'monthProfit' => $monthProfit,
            'yearProfit' => $yearProfit,
            'todaysPendingOrderAmount' => $todaysPendingOrderAmount,
        ], 200);

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
