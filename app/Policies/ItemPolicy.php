<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ItemPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Item')
            ? Response::allow()
            : Response::deny('You do not have permission to view items.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Item $item)
    {
        return $user->hasPermissionTo('view Item')
            ? Response::allow()
            : Response::deny('You do not have permission to view this item.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Item')
            ? Response::allow()
            : Response::deny('You do not have permission to create a item.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Item $item)
    {
        return $user->hasPermissionTo('update Item')
            ? Response::allow()
            : Response::deny('You do not have permission to update this item.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Item $item)
    {
        return $user->hasPermissionTo('delete Item')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this item.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Item $item): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Item $item): bool
    {
        //
    }
}
