<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_name',
        'contact',
        'email',
        'address',
        'code',
    ];

    //new attribute
    protected $appends = [
        'total_supplierinvoices',
        'total_amount_paid',
        'total_amount_pending',
        'total_amount'
    ];

    public function supplierswhospendinginvoices()
    {
        return $this->hasMany(Supplierinvoice::class)->where('status', 'pending');
    }

    // Define a scope for suppliers with pending invoices and non-null pending amounts
    public function scopeWithPendingAmount($query)
    {
        return $query->whereHas('supplierinvoices', function ($query) {
            $query->where('status', 'pending');
        });
    }

    public function supplierinvoices()
    {
        return $this->hasMany(Supplierinvoice::class, 'supplier_id');
    }


   

    //get total supplierinvoices
    public function getTotalSupplierInvoicesAttribute()
    {
        // Count related supplier invoices
        return $this->supplierinvoices()->count();
    }

    public function getTotalAmountPaidAttribute(){

        //check by status paid
        return $this->supplierinvoices()->where('status', 'paid')->sum('total_payment');

    }

    public function getTotalAmountPendingAttribute(){

        //check by status pending
        return $this->supplierinvoices()->where('status', 'pending')->sum('total_payment');

    }

    public function getTotalAmountAttribute(){

        //check by status pending
        return $this->supplierinvoices()->sum('total_payment');

    }

    
}
