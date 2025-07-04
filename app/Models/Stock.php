<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
