<?php

namespace App\Policies;

use App\Models\User;
use App\Models\tax;
use Illuminate\Auth\Access\Response;

class TaxPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny tax')
            ? Response::allow()
            : Response::deny('You do not have permission to view taxes.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, tax $tax)
    {
        return $user->hasPermissionTo('view tax')
            ? Response::allow()
            : Response::deny('You do not have permission to view this tax.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create tax')
            ? Response::allow()
            : Response::deny('You do not have permission to create a tax.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, tax $tax)
    {
        return $user->hasPermissionTo('update tax')
            ? Response::allow()
            : Response::deny('You do not have permission to update this tax.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, tax $tax)
    {
        return $user->hasPermissionTo('delete tax')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this tax.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete tax')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, tax $tax)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, tax $tax)
    {
        //
    }
}
