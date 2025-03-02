<?php

namespace Modules\Master\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Applogin extends Model
{
    use HasFactory;

    protected $connection = 'master';

    protected $table = 'applogin';

    protected $fillable = [ 'token', 'device_id', 'device_type', 'device_name', 'device_os', 'device_os_version', 'device_model', 'device_uid', 'ip_address', 'status', 'tenant_id','expired_at'];
    
    protected static function newFactory()
    {
        return \Modules\Master\Database\factories\ApploginFactory::new();
    }


    public function tenant()
    {
        return $this->belongsTo(Tenancy::class, 'tenant_id');
    }
}
