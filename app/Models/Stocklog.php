<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\StocklogObserver;


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
        'purchase_price',
        'product_id',
        'is_borrow',
        'shop_name',
        'shop_address',
        'shop_phone',
        'shop_email'
    ];

     protected $appends = ['supplier_name'];

    // supplier
    public function supplierInvoice()
    {
        return $this->belongsTo(Supplierinvoice::class, 'supplier_invoice_no', 'invoice_no');
    }

    public function getSupplierNameAttribute()
    {
        return $this->supplierInvoice ? $this->supplierInvoice->supplier->person_name . ' - ' . $this->supplierInvoice->supplier->code : '';
    }

}
