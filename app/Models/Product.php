<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'model',
        'specifications',
        'purchase_price',
        'selling_price',
        'warranty_period',
        'is_borrow',
        'shop_name',
        'shop_address',
        'shop_phone',
        'shop_email',
        'identity_type',
        'identity_value',
        'warranty_type',
        'is_warranty',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }
    


    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'brand_product', 'product_id', 'brand_id');
    }
}
