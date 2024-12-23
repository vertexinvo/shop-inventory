<?php

namespace App\Policies;

use App\Models\Brand;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BrandPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to view brands.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Brand $brand)
    {
        return $user->hasPermissionTo('view Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to view this brand.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to create a brand.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Brand $brand)
    {
        return $user->hasPermissionTo('update Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to update this brand.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Brand $brand)
    {
        return $user->hasPermissionTo('delete Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this brand.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('bulkdelete Brand')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Brand $brand): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Brand $brand): bool
    {
        //
    }
}
