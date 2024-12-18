<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Eliseekn\LaravelMetrics\HasMetrics;
use Illuminate\Database\Eloquent\SoftDeletes;


class Order extends Model
{
    use HasFactory, HasMetrics, SoftDeletes;

    protected $fillable = [ 
        
        'name',
        'email',
        'phone',
        'address',
        'user_id',
        'total',
        'payable_amount',
        'paid_amount',
        'method',
        'cheque_no',
        'cheque_date',
        'bank_name',
        'bank_branch',
        'bank_account',
        'online_payment_link',
        'extra_charges',
        'shipping_charges',
        'discount',
        'tax',
        'status',
        'is_installment',
        'installment_amount',
        'installment_period',
        'installment_count',
        'installment_start_date',
        'installment_end_date',
        'tax_id',
        'shipping_id',
        'order_date',
        'exchange'
    ];

    protected $appends = ['tax_fee']; 
   


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exchangeproduct(){
        return $this->hasMany(Product::class, 'exchange_order_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function exchange_items()
    {
        return $this->hasMany(Exchangeitem::class);
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class);
    }

    public function shipping()
    {
        return $this->belongsTo(ShippingRate::class);
    }

    //get tax into tax_fee
    public function getTaxFeeAttribute()
    {
        return  $this->tax;
    }
}
