<?php

namespace App\Policies;

use App\Models\ShippingRate;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ShippingRatePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('viewAny ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to view shipping rates.');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ShippingRate $shippingRate)
    {
        return $user->hasPermissionTo('view ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to view this shipping rate.');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to create a shipping rate.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ShippingRate $shippingRate)
    {
        return $user->hasPermissionTo('update ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to update this shipping rate.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ShippingRate $shippingRate)
    {
        return $user->hasPermissionTo('delete ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to delete this shipping rate.');
    }

    public function bulkdelete(User $user)
    {
        return $user->hasPermissionTo('delete ShippingRate')
            ? Response::allow()
            : Response::deny('You do not have permission to bulk delete brands.');
    }


    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ShippingRate $shippingRate): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ShippingRate $shippingRate): bool
    {
        //
    }
}
