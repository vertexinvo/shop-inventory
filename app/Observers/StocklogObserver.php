<?php

namespace App\Observers;

use App\Models\Stocklog;
use App\Models\Stock;

class StocklogObserver
{
    /**
     * Handle the Stocklog "created" event.
     */
    public function created(Stocklog $stocklog): void
    {
        $stock = Stock::find($stocklog->stock_id);
        if (!$stock) {
            return;
        }

        switch ($stocklog->type) {
            case 'addition':
                $stock->quantity += $stocklog->quantity;
                break;

            case 'removal':
                $stock->quantity -= $stocklog->quantity;
                // Prevent negative stock quantity
                if ($stock->quantity < 0) {
                    $stock->quantity = 0;
                }
                break;

            case 'adjustment':
                $stock->quantity = $stocklog->quantity;
                break;
        }

        // Update last_updated timestamp
        $stock->last_updated = $stocklog->datetime;
        $stock->save();
    }

    /**
     * Handle the Stocklog "updated" event.
     */
    public function updated(Stocklog $stocklog): void
    {
        //
    }

    /**
     * Handle the Stocklog "deleted" event.
     */
    public function deleted(Stocklog $stocklog): void
    {
        $stock = Stock::find($stocklog->stock_id);
        if (!$stock) {
            return;
        }
      

        switch ($stocklog->type) {
            case 'addition':
                // Reverse addition by subtracting the quantity
                $stock->quantity -= $stocklog->quantity;
                if ($stock->quantity < 0) {
                    $stock->quantity = 0;
                }
                break;

            case 'removal':
                // Reverse removal by adding the quantity
                $stock->quantity += $stocklog->quantity;
                break;

            case 'adjustment':
                // For adjustments, there is no "reverse" action.
                // You may decide how to handle this based on your business logic.
                break;
        }

        $stock->last_updated = now(); // Update the timestamp to the current time
        $stock->save();
    }

    /**
     * Handle the Stocklog "restored" event.
     */
    public function restored(Stocklog $stocklog): void
    {
        //
    }

    /**
     * Handle the Stocklog "force deleted" event.
     */
    public function forceDeleted(Stocklog $stocklog): void
    {
        //
    }
}
