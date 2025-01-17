<?php

namespace App\Policies;

use App\Models\Expance;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExpancePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Expance')
        ? Response::allow()
        : Response::deny('You do not have permission to view expense.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Expance $expance)
    {
        return $user->hasPermissionTo('view Expance')
        ? Response::allow()
        : Response::deny('You do not have permission to view this expense.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Expance')
        ? Response::allow()
        : Response::deny('You do not have permission to create a expense.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Expance $expance)
    {
        return $user->hasPermissionTo('update Expance')
        ? Response::allow()
        : Response::deny('You do not have permission to update this expense.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Expance $expance)
    {
        return $user->hasPermissionTo('delete Expance')
        ? Response::allow()
        : Response::deny('You do not have permission to delete this expense.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Expance')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Expance $expance)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Expance $expance)
    {
        //
    }
}
