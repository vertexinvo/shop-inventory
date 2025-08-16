<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Stock;

class LowStockNotification extends Notification
{
    // use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $stock;

    /**
     * Create a new notification instance.
     */
    public function __construct(Stock $stock)
    {
        $this->stock = $stock;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
       return (new MailMessage)
                    ->subject('Low Stock Alert - ' . $this->stock->product->name)
                    ->line('We have detected low stock levels for the following product:')
                    ->line('Product: ' . $this->stock->product->name)
                    ->line('Current Quantity: ' . $this->stock->quantity)
                    ->line('Reorder Level: ' . $this->stock->reorder_level)
                    ->action('View Stock Management', url('/admin/stocks'))
                    ->line('Please reorder this product as soon as possible to avoid stockouts.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'low_stock',
            'stock_id' => $this->stock->id,
            'product_id' => $this->stock->product_id,
            'product_name' => $this->stock->product->name,
            'current_quantity' => $this->stock->quantity,
            'reorder_level' => $this->stock->reorder_level,
            'message' => "Low stock alert for {$this->stock->product->name}. Current quantity: {$this->stock->quantity}, Reorder level: {$this->stock->reorder_level}",
            'created_at' => now(),
        ];
    }

    public function toDatabase(object $notifiable): array
    {
       return $this->toArray($notifiable);
    }
}
