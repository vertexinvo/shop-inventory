<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exchangeitem extends Model
{
    use HasFactory;

  
    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'model',
        'identity_type',
        'identity_value',
        'purchase_price',
        'quantity',
        'total',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
