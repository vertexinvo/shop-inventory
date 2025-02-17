<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Eliseekn\LaravelMetrics\LaravelMetrics;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Supplierinvoice;
use App\Models\Product;
use App\Models\Item;
use App\Models\tax;
use Spatie\Activitylog\LogOptions;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    use LogsActivity;

    protected static $logAttributes = ['status', 'payable_amount', 'name','phone','code']; // Attributes to log
    protected static $logOnlyDirty = true; // Log only changed attributes
    protected static $logName = 'order'; // Log category name

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'payable_amount', 'name','phone'])
            ->useLogName('order')
            ->setDescriptionForEvent(fn(string $eventName) => "Order has been {$eventName}");
    }

    public static function metrics(): LaravelMetrics
    {
        $parent = get_called_class();

        return LaravelMetrics::query($parent::query()->whereNotIn('status', ['cancel']));
    }
 
    protected $fillable = [ 
        
        'name',
        'email',
        'phone',
        'address',
        'user_id',
        'total',
        'payable_amount',
        'paid_amount',
        'method',
        'cheque_no',
        'cheque_date',
        'bank_name',
        'bank_branch',
        'bank_account',
        'online_payment_link',
        'extra_charges',
        'shipping_charges',
        'discount',
        'tax',
        'status',
        'is_installment',
        'installment_amount',
        'installment_period',
        'installment_count',
        'installment_start_date',
        'installment_end_date',
        'tax_id',
        'shipping_id',
        'order_date',
        'exchange',
        'code',
        'payment_note',
        'note',
        'payment_details',
        'bill_no',
    ];

    protected $appends = ['tax_fee']; 
   
        // Automatically generate purchase ID when creating a new record
        protected static function boot()
        {
            parent::boot();
    
            static::creating(function ($order) {
                $order->code= self::generateOrderId();
            });
        }
    
        // Function to generate a unique purchase ID
        public static function generateOrderId()
        {
            $date = now()->format('Ymd'); // Format the current date as YYYYMMDD
            $lastOrder =  self::withTrashed()->whereDate('created_at', now()->toDateString())
                ->orderBy('id', 'desc')
                ->first();
        
            // Get the last sequential number and increment it
            $sequence = $lastOrder ? intval(substr($lastOrder->code, -4)) + 1 : 1;
            $environment = env('APP_PLATFORM');
            
            // Pad the sequence with four leading zeros and return the formatted ID
            return 'SAL-' . $environment.'-'. $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
        }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exchangeproduct(){
        return $this->hasMany(Product::class, 'exchange_order_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class);          
    }
    

    public function exchange_items()
    {
        return $this->hasMany(Exchangeitem::class);
    }

    public function tax()
    {
        return $this->belongsTo(tax::class);
    }

    public function shipping()
    {
        return $this->belongsTo(ShippingRate::class);
    }

    //get tax into tax_fee
    public function getTaxFeeAttribute()
    {
        return  $this->tax;
    }
}
