<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityBooking extends Model
{
    protected $fillable = [
        'user_id',
        'activity_id',
        'reference_number',
        'booking_date',
        'start_time',
        'end_time',
        'number_of_participants',
        'phone_number',
        'total_amount',
        'status',
        'payment_method',
        'payment_receipt',
        'payment_verified',
        'payment_verified_at',
        'payment_verified_by',
        'payment_verification_notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_amount' => 'decimal:2',
        'payment_verified' => 'boolean',
        'payment_verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
    }
}
