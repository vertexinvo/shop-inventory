<?php

namespace App\Policies;

use App\Models\Stock;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StockPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Stock')
            ? Response::allow()
            : Response::deny('You do not have permission to view stocks.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Stock $stock)
    {
        return $user->hasPermissionTo('view Stock')
            ? Response::allow()
            : Response::deny('You do not have permission to view this stock.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Stock')
            ? Response::allow()
            : Response::deny('You do not have permission to create a stock.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Stock $stock)
    {
        return $user->hasPermissionTo('update Stock')
            ? Response::allow()
            : Response::deny('You do not have permission to update this stock.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Stock $stock)
    {
        return $user->hasPermissionTo('delete Stock')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this stock.');
    }

    

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Stock $stock): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Stock $stock): bool
    {
        //
    }
}
