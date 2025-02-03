<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'phone',
        'address',
        'code',
    ];

    protected $appends = [
        'total_orders',
        'total_orders_amount',
        'total_orders_amount_paid',
        'total_order_amount_pending',
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->code= self::generateUserId();
        });
    }

    // Function to generate a unique purchase ID
    public static function generateUserId()
    {
        $date = now()->format('Ymd'); // Format the current date as YYYYMMDD
        $lastUser = self::withTrashed()->whereDate('created_at', now()->toDateString())
            ->orderBy('id', 'desc')
            ->first();
    
        // Get the last sequential number and increment it
        $sequence = $lastUser ? intval(substr($lastUser->code, -4)) + 1 : 1;
        $environment = env('APP_PLATFORM');
        
        // Pad the sequence with four leading zeros and return the formatted ID
        return 'USR-' . $environment.'-'. $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

   
    /**
     * Accessor for the user's first role name.
     *
     * @return string|null
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getTotalOrdersAttribute(){
        return $this->orders()->where('status', '!=', 'cancel')->count();
    }

    public function getTotalOrdersAmountAttribute(){
        return $this->orders()->where('status', '!=', 'cancel')->sum('payable_amount');
    }

    public function getTotalOrdersAmountPaidAttribute(){
        return $this->orders()->where('status', '!=', 'cancel')->sum('paid_amount');
    }

    public function getTotalOrderAmountPendingAttribute(){
        return $this->orders()->where('status', '!=', 'cancel')->get()->sum(function ($order) {
            return $order->payable_amount - $order->paid_amount;
        });
    }

 
}
