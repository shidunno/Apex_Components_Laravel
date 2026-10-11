<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id', 'items'];

    // Add this casts array to ensure 'items' is always treated as a PHP array
    protected $casts = [
        'items' => 'array',
    ];
}