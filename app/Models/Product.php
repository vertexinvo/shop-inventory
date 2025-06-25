<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model  implements HasMedia
{
    use HasFactory, SoftDeletes , InteractsWithMedia;
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
    protected $appends = ['supplier_name','image_url','purchase_price_stocklog'];




    // Automatically generate purchase ID when creating a new record
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $product->code= self::generatePurchaseId();
        });
    }


     /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('product')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/gif']);
    }

    /**
     * Get the product image URL
     */
    public function getImageUrlAttribute()
    {
        $media = $this->getFirstMedia('product');
        return $media ? $media->getUrl() : null;
    }

    //purchase_price_stocklog lastest value from stocklog
    public function getPurchasePriceStocklogAttribute()
    {
        $stock = $this->stock;
        if (!$stock) {
            return null; // Return product's default purchase_price if no stock is associated
        }

        $stockLog = $stock->stockLogs()->latest('datetime')->first(); // Using 'id' as fallback if no timestamps
        return $stockLog?->purchase_price ?: $this->purchase_price; // Return the latest purchase price from stock log or the product's default purchase price
    }



   /**
     * Update product image
     */
    public function updateImage($file)
    {
        // Clear existing media first since we're using singleFile
        $this->clearMediaCollection('product');
        
        // Add new media
        $this->addMedia($file)->toMediaCollection('product');
    }

    /**
     * Delete product image
     */
    public function deleteImage()
    {
        $this->clearMediaCollection('product');
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


   

    // In your Product model

    public function getSupplierNameAttribute()
    {
        return $this->supplierInvoice ? $this->supplierInvoice->supplier->person_name . ' - ' . $this->supplierInvoice->supplier->code : '';
    }

    // Relationship to get stock logs through stock

  
}
