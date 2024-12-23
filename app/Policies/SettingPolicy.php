<?php

namespace App\Policies;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SettingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny Setting')
            ? Response::allow()
            : Response::deny('You do not have permission to view settings.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Setting $setting)
    {
        return $user->hasPermissionTo('view Setting')
            ? Response::allow()
            : Response::deny('You do not have permission to view this setting.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create Setting')
            ? Response::allow()
            : Response::deny('You do not have permission to create a setting.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Setting $setting)
    {
        return $user->hasPermissionTo('update Setting')
            ? Response::allow()
            : Response::deny('You do not have permission to update this setting.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Setting $setting)
    {
        return $user->hasPermissionTo('delete Setting')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this setting.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Setting $setting): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Setting $setting): bool
    {
        //
    }
}
