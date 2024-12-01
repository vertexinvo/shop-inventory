<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    use HasFactory;
    protected $fillable = [
        'rate_id',
        'zone_id',
        'weight_status',
        'merchant_id',
        'country_id',
        'country_name',
        'state_id',
        'state_name',
        'city_id',
        'city_name',
        'postal_code',
        'area_id',
        'branch_id',
        'area_name',
        'latitude',
        'longitude',
        'fee',
        'minimum',
        'min_for_free_delivery',
        'delivery_estimation',
        'sequence',
        'date_created',
        'date_modified',
        'ip_address',
        'weight_charges',
        'additional_weight_charges',
        'end_weight_range'
    ];
}
