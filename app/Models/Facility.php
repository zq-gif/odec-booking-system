<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location',
        'price_per_hour',
        'slot_duration',
        'capacity',
        'image',
        'status',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'price_per_hour' => 'decimal:2',
    ];

    public function bookings()
    {
        return $this->hasMany(FacilityBooking::class);
    }
}
