<?php

namespace App\Observers;

use App\Facades\StockService;
use App\Models\Product;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        $request = request();

        $product->stock()->create([
            'quantity' => 0,
            'status' => 1
        ]);

        $stocklogrec = [
            'product_id' => $product->id,
            'quantity' => (int) $request->quantity,
            'type' => 'addition',
            'is_supplier' => $request->is_supplier,
            'supplier_invoice_no' => $request->supplier_invoice_no,
            'purchase_price' => $request->purchase_price,
            'datetime' => date('Y-m-d H:i:s'),
        ];


        StockService::manageStockLog($stocklogrec);
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        //
    }
}
