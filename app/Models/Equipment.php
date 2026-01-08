<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price_per_unit',
        'quantity_available',
        'is_available',
        'image',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function facilityBookings()
    {
        return $this->belongsToMany(FacilityBooking::class, 'booking_equipment', 'equipment_id', 'booking_id')
            ->where('booking_type', 'facility')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }

    public function activityBookings()
    {
        return $this->belongsToMany(ActivityBooking::class, 'booking_equipment', 'equipment_id', 'booking_id')
            ->where('booking_type', 'activity')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }
}
