<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    use LogsActivity;
    protected static $logAttributes = ['*'];
    protected static $logOnlyDirty = true;
    protected static $logName = 'product';
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name','model','code','purchase_price','selling_price','status'])
            ->useLogName('product')
            ->setDescriptionForEvent(fn(string $eventName) => "Product has been {$eventName}");
    }
         

    protected $fillable = [
        'name',
        'model',
        'specifications',
        'purchase_price',
        'selling_price',
        'warranty_period',
        'is_borrow',
        'shop_name',
        'shop_address',
        'shop_phone',
        'shop_email',
        'identity_type',
        'identity_value',
        'warranty_type',
        'is_warranty',
        'supplier_invoice_no',
        'description',
        'weight',
        'is_supplier',
        'customfield',
        'is_exchange',
        'exchange_remarks',
        'is_return',
        'return_remarks',
        'exchange_order_id',
        'type',
        'code',
        'exchange_order_code',
    ];

    // appends supplier name
    protected $appends = ['supplier_name'];


    // Automatically generate purchase ID when creating a new record
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $product->code= self::generatePurchaseId();
        });
    }

    // Function to generate a unique purchase ID
    public static function generatePurchaseId()
    {
        $date = now()->format('Ymd'); // Format the current date as YYYYMMDD
        $lastProduct = self::withTrashed()->whereDate('created_at', now()->toDateString())
            ->orderBy('id', 'desc')
            ->first();
    
        // Get the last sequential number and increment it
        $sequence = $lastProduct ? intval(substr($lastProduct->code, -4)) + 1 : 1;
        $environment = env('APP_PLATFORM');
        
        // Pad the sequence with four leading zeros and return the formatted ID
        return 'PUR-' . $environment.'-'. $date . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function exchangeorder()
    {
        return $this->belongsTo(Order::class, 'exchange_order_id');
    }
    


    public function brands()
    {
        return $this->belongsToMany(Brand::class, 'brand_product', 'product_id', 'brand_id');
    }

    // supplier
    public function supplierInvoice()
    {
        return $this->belongsTo(Supplierinvoice::class, 'supplier_invoice_no', 'invoice_no');
    }

    public function getSupplierNameAttribute()
    {
        return $this->supplierInvoice ? $this->supplierInvoice->supplier->person_name . ' - ' . $this->supplierInvoice->supplier->code : '';
    }
}
