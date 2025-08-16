<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LowStockNotification;
use App\Models\User;

class Stock extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'quantity',
        'reorder_level',
        'status',
        'last_updated',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    //stock log
    public function stockLogs()
    {
        return $this->hasMany(Stocklog::class, 'stock_id', 'id');
    }


    
    /**
     * Check if stock is low based on reorder level
     */
    public function isLowStock(): bool
    {
        return $this->quantity <= $this->reorder_level;
    }

    /**
     * Send low stock notification to administrators
     */
    public function sendLowStockNotification(): void
    {
       
        if ($this->isLowStock()) {
            // Get users who should receive stock notifications (admins, managers, etc.)
            $nonCustomers = User::whereDoesntHave('roles', function($query) {
                $query->where('name', 'customer');
            })->get();

            Notification::send($nonCustomers, new LowStockNotification($this));
        }
    }

    /**
     * Update stock quantity and check for low stock
     */
    public function updateQuantity(int $newQuantity, string $reason = null): void
    {
        $oldQuantity = $this->quantity;
        
        $this->update([
            'quantity' => $newQuantity,
            'last_updated' => now(),
            'status' => $newQuantity <= $this->reorder_level ? 'low_stock' : 'in_stock'
        ]);

        // Log the stock change
        $this->stockLogs()->create([
            'previous_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity,
            'change_reason' => $reason ?? 'Manual update',
            'created_at' => now(),
        ]);

        // Send notification if stock is now low
        $this->sendLowStockNotification();
    }

    /**
     * Reduce stock (for sales, usage, etc.)
     */
    public function reduceStock(int $amount, string $reason = 'Sale'): bool
    {
        if ($this->quantity < $amount) {
            return false; // Insufficient stock
        }

        $this->updateQuantity($this->quantity - $amount, $reason);
        return true;
    }

    /**
     * Increase stock (for purchases, returns, etc.)
     */
    public function increaseStock(int $amount, string $reason = 'Purchase'): void
    {
        $this->updateQuantity($this->quantity + $amount, $reason);
    }

    /**
     * Scope to get low stock items
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('quantity <= reorder_level');
    }

    /**
     * Scope to get out of stock items
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', '<=', 0);
    }
}
