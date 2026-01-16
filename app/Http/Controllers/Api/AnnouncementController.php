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
                // Fix any storage path issues
                if ($announcement->photo_path && !str_starts_with($announcement->photo_path, 'http')) {
                    // Normalize path: remove duplicate /storage/ or storage/ prefixes and ensure it starts with /storage/
                    $path = $announcement->photo_path;
                    // Remove all leading /storage/ or storage/ prefixes
                    $path = preg_replace('#^(/storage/|storage/)+#', '', $path);
                    // Add back single /storage/ prefix
                    $announcement->photo_path = '/storage/' . $path;
                }
                return $announcement;
            });

        return response()->json($announcements);
    }
}
