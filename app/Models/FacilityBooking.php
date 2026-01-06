<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacilityBooking extends Model
{
    protected $fillable = [
        'user_id',
        'facility_id',
        'reference_number',
        'booking_date',
        'start_time',
        'end_time',
        'duration_hours',
        'number_of_guests',
        'number_of_attendees',
        'phone_number',
        'price_per_hour',
        'total_amount',
        'discount',
        'final_amount',
        'purpose',
        'additional_services',
        'status',
        'payment_status',
        'payment_method',
        'payment_receipt',
        'payment_verified',
        'payment_verified_at',
        'payment_verified_by',
        'payment_verification_notes',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'payment_verified_at' => 'datetime',
        'additional_services' => 'array',
        'price_per_hour' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'payment_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
    }
}
