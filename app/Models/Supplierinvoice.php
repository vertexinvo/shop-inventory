<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplierinvoice extends Model
{
    use HasFactory;


    protected $fillable = [
        'supplier_id',
        'invoice_no',
        'invoice_date',
        'due_date',
        'total_payment',
        'paid_amount',
        'status',
        'method',
        'cheque_no',
        'cheque_date',
        'bank_name',
        'bank_branch',
        'bank_account',
        'online_payment_link',
        'payment_proof',
        'note',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
