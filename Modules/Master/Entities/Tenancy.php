<?php

namespace Modules\Master\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenancy extends Model
{
    use HasFactory;

    //set connection to master
    protected $connection = 'master';

    protected $fillable = [];
    
    protected static function newFactory()
    {
        return \Modules\Master\Database\factories\TenancyFactory::new();
    }
}
