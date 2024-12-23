<?php

namespace App\Policies;

use App\Models\Supplierinvoice;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SupplierinvoicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to view supplierinvoices.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Supplierinvoice $supplierinvoice)
    {
        return $user->hasPermissionTo('view Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to view this supplierinvoice.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to create a supplierinvoice.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Supplierinvoice $supplierinvoice)
    {
        return $user->hasPermissionTo('update Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to update this supplierinvoice.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Supplierinvoice $supplierinvoice)
    {
        return $user->hasPermissionTo('delete Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this supplierinvoice.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Supplierinvoice')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Supplierinvoice $supplierinvoice): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Supplierinvoice $supplierinvoice): bool
    {
        //
    }
}
