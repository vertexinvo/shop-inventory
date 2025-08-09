<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    protected $table = 'banks';

    protected $fillable = [
        'name',
        'current_balance',
        'account_number',
        'iban',
        'account_type',
        'swift_code',
        'routing_number',
        'bank_address',
        'bank_phone',
        'bank_email',
        'bank_website',
        'notes',
        'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'current_balance' => 'decimal:2',
        'status' => 'string',
    ];
}
