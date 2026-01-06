<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'user_id',
        'booking_reference',
        'feedback_type',
        'overall_rating',
        'cleanliness_rating',
        'staff_rating',
        'facilities_rating',
        'value_rating',
        'title',
        'comment',
        'suggestions',
        'would_recommend',
        'status',
    ];

    protected $casts = [
        'would_recommend' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
