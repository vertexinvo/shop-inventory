<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class RoleService extends Facade
{

    protected static function getFacadeAccessor()
    {
        return 'roleService';
    }
}
