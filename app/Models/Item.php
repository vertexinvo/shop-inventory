<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [ 
        'order_id',
        'product_id',
        'name',
        'category',
        'price',
        'purchase_price',
        'qty',
        'status',
        'code',
        'order_code',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class,);
    } 

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
