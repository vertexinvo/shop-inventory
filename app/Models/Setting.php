<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_name',
        'site_title',
        'site_description',
        'site_logo',
        'site_icon',
        'site_favicon',
        'site_email',
        'site_phone',
        'site_address',
        'site_currency',
        'site_currency_symbol',
        'site_currency_position',
        'site_timezone',
        'site_language',
        'site_status',
        'site_maintenance',
        'site_maintenance_message',
    ];

    public $timestamps = false;
}
