<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IssueReport extends Model
{
    protected $fillable = [
        'user_id',
        'ticket_number',
        'category',
        'priority',
        'subject',
        'description',
        'location',
        'contact_name',
        'contact_email',
        'contact_phone',
        'attachments',
        'status',
        'staff_notes',
        'resolution',
        'resolved_at',
        'assigned_to',
    ];

    protected $casts = [
        'attachments' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
