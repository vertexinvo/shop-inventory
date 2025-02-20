<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $appends = [
        'total_products',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'brand_product', 'brand_id', 'product_id');
    }

    public function getTotalProductsAttribute()
    {
        return $this->products()->count();
    }


}
