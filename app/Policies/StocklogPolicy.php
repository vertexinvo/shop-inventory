<?php

namespace App\Policies;

use App\Models\Stocklog;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StocklogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to view stocklogs.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Stocklog $stocklog)
    {
        return $user->hasPermissionTo('view Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to view this stocklog.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to create a stocklog.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Stocklog $stocklog)
    {
        return $user->hasPermissionTo('update Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to update this stocklog.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Stocklog $stocklog)
    {
        return $user->hasPermissionTo('delete Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this stocklog.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Stocklog')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Stocklog $stocklog): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Stocklog $stocklog): bool
    {
        //
    }
}
