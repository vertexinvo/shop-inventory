<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stocklog extends Model
{
    use HasFactory;

    protected $fillable = [
        'stock_id',
        'quantity',
        'type',
        'is_supplier',
        'supplier_invoice_no',
        'user_id',
        'remarks',
        'datetime',
    ];
}
