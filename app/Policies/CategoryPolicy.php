<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Category')
            ? Response::allow()
            : Response::deny('You do not have permission to view categories.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Category $category)
    {
        return $user->hasPermissionTo('view Category')
            ? Response::allow()
            : Response::deny('You do not have permission to view this category.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Category')
            ? Response::allow()
            : Response::deny('You do not have permission to create a category.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Category $category)
    {
        return $user->hasPermissionTo('update Category')
            ? Response::allow()
            : Response::deny('You do not have permission to update this category.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Category $category)
    {
        return $user->hasPermissionTo('delete Category')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this category.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Category')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Category $category): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Category $category): bool
    {
        //
    }
}
