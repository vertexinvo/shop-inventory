<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Stock;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if($order->status == 'cancel'){
            // softdelete the product where 	exchange_order_id  or exchange_order_code is equal to $order->id or $order->code
            $order->exchangeproduct()->where('exchange_order_id', $order->id)->orWhere('exchange_order_code', $order->code)->delete();
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        foreach ($order->items as $item) {
            $stock = Stock::where('product_id', $item->product_id)->first();

            if ($stock) {
                $stock->increment('quantity', $item->qty);
            }
        }

        $order->exchangeproduct()->delete();
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
