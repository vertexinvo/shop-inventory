<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Validator;


class UserService{

    public function getAllUser($request, $role=null, $excludeRoles = ['superadmin']) {
        $search = $request->search ?? '';

        $cacheKey = $this->generateCacheKey($search, $role, $excludeRoles);

        // Attempt to fetch from cache
        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $role, $excludeRoles) {
    
        
            $query = User::with('roles')
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%")
                        ->orWhere('phone', 'like', "%$search%")
                        ->orWhere('code', 'like', "%$search%")
                        ->orWhere('id', 'like', "%$search%");
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
        });
    }

   // Forget cache by generating a consistent cache key
   public function forgetCache($search, $role = null, $excludeRoles = ['superadmin'])
   {
       $cacheKey = $this->generateCacheKey($search, $role, $excludeRoles);
       Cache::forget($cacheKey);
   }

   // Generate a consistent cache key
   private function generateCacheKey($search, $role, $excludeRoles)
   {
       return 'users_' . md5(json_encode(compact('search', 'role', 'excludeRoles')));
   }
}