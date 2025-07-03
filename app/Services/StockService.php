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
       $data = is_array($request) ? $request : $request->only(['quantity', 'type', 'remarks','is_supplier', 'supplier_invoice_no', 'datetime','purchase_price', 'is_borrow', 'shop_name', 'shop_address', 'shop_phone', 'shop_email']);
       $data['user_id'] = auth()->user()->id;
       $data['stock_id'] = $stock->id;
       $data['is_supplier'] = $data['is_supplier'] ?? 0;
       $data['is_borrow'] = $data['is_borrow'] ?? 0;
       $stocklog =  Stocklog::create($data);
       return $stocklog;
    }

    //updatedStockLog
    public function updatedStockLog($request){

        $pid = is_array($request) ? $request['product_id'] : $request->product_id ;
        $stock = Stock::where('product_id', $pid)->first();
        $data = is_array($request) ? $request : $request->only(['quantity', 'type', 'remarks','is_supplier', 'supplier_invoice_no', 'datetime','purchase_price', 'is_borrow', 'shop_name', 'shop_address', 'shop_phone', 'shop_email']);
        $data['user_id'] = auth()->user()->id;
        $data['stock_id'] = $stock->id;
        $data['is_supplier'] = $data['is_supplier'] ?? 0;
        $data['is_borrow'] = $data['is_borrow'] ?? 0;
        // Update the stocklog record first one only
        $firstStockLog = Stocklog::where('stock_id', $stock->id)->first();

        if ($firstStockLog) {
            $firstStockLog->update($data);
        }
        return $firstStockLog;
    }
}