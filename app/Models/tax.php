<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tax extends Model
{
    protected $table = 'taxes';

    protected $fillable = [
        'name',
        'cost',
    ];
    use HasFactory;
}
