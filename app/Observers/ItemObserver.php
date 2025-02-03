<?php

namespace App\Observers;

use App\Models\Item;

class ItemObserver
{
    /**
     * Handle the Item "created" event.
     */
    public function created(Item $item): void
    {

    }

    /**
     * Handle the Item "updated" event.
     */
    public function updated(Item $item): void
    {
    }

    /**
     * Handle the Item "deleted" event.
     */
    public function deleted(Item $item): void
    {
        //
    }

    /**
     * Handle the Item "restored" event.
     */
    public function restored(Item $item): void
    {
        //
    }

    /**
     * Handle the Item "force deleted" event.
     */
    public function forceDeleted(Item $item): void
    {
        //
    }
}
