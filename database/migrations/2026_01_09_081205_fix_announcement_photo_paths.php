<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Announcement;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix announcement photo paths - remove /storage/ prefix
        $announcements = Announcement::whereNotNull('photo_path')
            ->where('photo_path', 'like', '/storage/%')
            ->get();

        foreach ($announcements as $announcement) {
            if (str_starts_with($announcement->photo_path, '/storage/')) {
                $announcement->photo_path = str_replace('/storage/', '', $announcement->photo_path);
                $announcement->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore /storage/ prefix
        $announcements = Announcement::whereNotNull('photo_path')
            ->where('photo_path', 'not like', '/storage/%')
            ->where('photo_path', 'not like', 'http%')
            ->get();

        foreach ($announcements as $announcement) {
            $announcement->photo_path = '/storage/' . $announcement->photo_path;
            $announcement->save();
        }
    }
};
