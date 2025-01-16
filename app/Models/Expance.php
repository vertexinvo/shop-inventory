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
        'description',
        'amount',
        'status',
        'pending_amount',
        'uid',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'uid');
    }
}
