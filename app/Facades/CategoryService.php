<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class CategoryService extends Facade{

    protected static function getFacadeAccessor(){
        return 'categoryService';
    }
}