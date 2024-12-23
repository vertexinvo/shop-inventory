<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny User')
        ? Response::allow()
        : Response::deny('You do not have permission to view users.');

    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model)
    {
        return $user->hasPermissionTo('view User')
            ? Response::allow()
            : Response::deny('You do not have permission to view this user.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create User')
            ? Response::allow()
            : Response::deny('You do not have permission to create a user.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model)
    {
        return $user->hasPermissionTo('update User')
            ? Response::allow()
            : Response::deny('You do not have permission to update this user.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model)
    {
        return $user->hasPermissionTo('delete User')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this user.');
    }


    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete User')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete users.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        //
    }
}
