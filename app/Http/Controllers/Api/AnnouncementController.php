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
            ->get()
            ->map(function ($announcement) {
                // Fix any double /storage/ prefix issues
                if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                    // Remove any duplicate /storage/ prefixes
                    $announcement->photo_path = preg_replace('#^(/storage/)+#', '/storage/', $announcement->photo_path);
                }
                return $announcement;
            });

        return response()->json($announcements);
    }
}
