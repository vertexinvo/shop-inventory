<?php

namespace App\Services;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleService
{
    public function getAllRoles()
    {
        return Role::whereNotIn('name', ['superadmin','customer'])->latest()->paginate(10);
    }
}