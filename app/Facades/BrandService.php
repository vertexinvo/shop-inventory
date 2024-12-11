<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class BrandService extends Facade{
    protected static function getFacadeAccessor()
    {
        return 'brandService';
    }
}

