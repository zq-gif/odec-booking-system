<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campsite extends Model
{
    protected $fillable = [
        'site_number',
        'name',
        'description',
        'location',
        'max_occupancy',
        'base_price_per_night',
        'image',
        'status',
        'tent_price',
        'table_price',
        'chair_price',
        'available_tents',
        'available_tables',
        'available_chairs',
        'has_electricity',
        'has_water',
        'has_shade',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'base_price_per_night' => 'decimal:2',
        'tent_price' => 'decimal:2',
        'table_price' => 'decimal:2',
        'chair_price' => 'decimal:2',
        'has_electricity' => 'boolean',
        'has_water' => 'boolean',
        'has_shade' => 'boolean',
    ];
}
