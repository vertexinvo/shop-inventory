<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Validator;


class UserService{

    public function getAllUser($request, $role=null, $excludeRoles = ['superadmin']) {
        $search = $request->search ?? '';

        // Start the query for users
        $query = User::with('roles')
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%$search%")
                      ->orWhere('email', 'like', "%$search%");
            });

        // Exclude users with specified roles
        foreach ($excludeRoles as $excludeRole) {
            $query->whereDoesntHave('roles', function ($query) use ($excludeRole) {
                $query->where('name', $excludeRole);
            });
        }

        if($role){
            $query->whereHas('roles', function ($query) use ($role) {
                $query->where('name', $role);
            });
        }

        // Return the paginated results
        return $query->latest()->paginate(10);
    }
}