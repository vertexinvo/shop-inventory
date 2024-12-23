<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SupplierPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to view suppliers.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Supplier $supplier)
    {
        return $user->hasPermissionTo('view Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to view this supplier.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to create a supplier.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Supplier $supplier)
    {
        return $user->hasPermissionTo('update Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to update this supplier.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Supplier $supplier)
    {
        return $user->hasPermissionTo('delete Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this supplier.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Supplier')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Supplier $supplier): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Supplier $supplier): bool
    {
        //
    }
}
