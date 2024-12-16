<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\Stocklog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;


class StockService
{

    public function manageStockLog($request){

        $pid = is_array($request) ? $request['product_id'] : $request->product_id ;
       $stock = Stock::where('product_id', $pid)->first();
       $data = is_array($request) ? $request : $request->only(['quantity', 'type', 'remarks','is_supplier', 'supplier_invoice_no', 'datetime']);
       $data['user_id'] = auth()->user()->id;
       $data['stock_id'] = $stock->id;
       $stocklog =  Stocklog::create($data);
       return $stocklog;
    }
}