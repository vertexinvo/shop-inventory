<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Product')
            ? Response::allow()
            : Response::deny('You do not have permission to view products.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Product $product)
    {
        return $user->hasPermissionTo('view Product')
            ? Response::allow()
            : Response::deny('You do not have permission to view this product.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Product')
            ? Response::allow()
            : Response::deny('You do not have permission to create a product.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Product $product)
    {
        return $user->hasPermissionTo('update Product')
            ? Response::allow()
            : Response::deny('You do not have permission to update this product.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Product $product)
    {
        return $user->hasPermissionTo('delete Product')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this product.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Product')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Product $product): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        //
    }
}
