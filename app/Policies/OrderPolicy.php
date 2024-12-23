<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Order')
            ? Response::allow()
            : Response::deny('You do not have permission to view orders.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Order $order)
    {
        return $user->hasPermissionTo('view Order')
            ? Response::allow()
            : Response::deny('You do not have permission to view this order.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Order')
            ? Response::allow()
            : Response::deny('You do not have permission to create a order.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order)
    {
        return $user->hasPermissionTo('update Order')
            ? Response::allow()
            : Response::deny('You do not have permission to update this order.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order)
    {
        return $user->hasPermissionTo('delete Order')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this order.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Order')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Order $order): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Order $order): bool
    {
        //
    }
}
