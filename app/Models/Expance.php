<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expance extends Model
{
    use HasFactory;

   public $fillable = [
        'name',
        'type',
        'datetime',
        'discription',
        'amount',
        'status',
        'pending_amount'
    ];
}
