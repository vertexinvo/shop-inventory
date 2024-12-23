<?php

namespace App\Policies;

use App\Models\Exchangeitem;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExchangeitemPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Exchangeitem')
            ? Response::allow()
            : Response::deny('You do not have permission to view exchangeitems.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Exchangeitem $exchangeitem)
    {
        return $user->hasPermissionTo('view Exchangeitem')
            ? Response::allow()
            : Response::deny('You do not have permission to view this exchangeitem.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Exchangeitem')
            ? Response::allow()
            : Response::deny('You do not have permission to create a exchangeitem.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Exchangeitem $exchangeitem)
    {
        return $user->hasPermissionTo('update Exchangeitem')
            ? Response::allow()
            : Response::deny('You do not have permission to update this exchangeitem.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Exchangeitem $exchangeitem)
    {
        return $user->hasPermissionTo('delete Exchangeitem')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this exchangeitem.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Exchangeitem $exchangeitem): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Exchangeitem $exchangeitem): bool
    {
        //
    }
}
