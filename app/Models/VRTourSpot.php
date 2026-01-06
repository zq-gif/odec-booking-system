<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VRTourSpot extends Model
{
    protected $table = 'vr_tour_spots';

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'order',
        'is_active',
        'hotspots',
        'pitch',
        'yaw',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'hotspots' => 'array',
        'pitch' => 'decimal:2',
        'yaw' => 'decimal:2',
        'order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
