<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'name',
        'description',
        'capacity',
        'price_per_person',
        'image',
        'vr_tour_image',
        'duration',
        'requirements',
        'difficulty_level',
        'status',
    ];

    protected $casts = [
        'price_per_person' => 'decimal:2',
    ];

    public function bookings()
    {
        return $this->hasMany(ActivityBooking::class);
    }
}
