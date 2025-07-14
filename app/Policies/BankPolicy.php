<?php

namespace App\Policies;

use App\Models\Bank;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BankPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
         return $user->hasPermissionTo('viewAny Bank')
        ? Response::allow()
        : Response::deny('You do not have permission to view banks.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Bank $bank)
    {
        return $user->hasPermissionTo('view Bank')
            ? Response::allow()
            : Response::deny('You do not have permission to view this bank.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Bank')
            ? Response::allow()
            : Response::deny('You do not have permission to create a bank.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Bank $bank)
    {
        return $user->hasPermissionTo('update Bank')
            ? Response::allow()
            : Response::deny('You do not have permission to update this bank.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Bank $bank)
    {
        return $user->hasPermissionTo('delete Bank')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this bank.');
    }

     public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete Bank')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete banks.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Bank $bank)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Bank $bank)
    {
        //
    }
}
