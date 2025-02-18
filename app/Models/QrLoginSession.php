<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrLoginSession extends Model
{
    use HasFactory;

    // $table->foreignId('user_id')->constrained()->onDelete('cascade');
    // $table->string('qr_token')->unique();
    // $table->timestamp('expires_at');

    protected $fillable = [
        'user_id',
        'qr_token',
        'expires_at',
    ];

    public $timestamps = false; // Disable timestamps

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
