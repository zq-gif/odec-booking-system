<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::active()
            ->byDate()
            ->limit(5)
            ->get();

        return response()->json($announcements);
    }
}
