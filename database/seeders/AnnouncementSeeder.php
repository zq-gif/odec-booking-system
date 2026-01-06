<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first admin user, or any user if no admin exists
        $admin = User::where('role', 'admin')->first();

        if (!$admin) {
            $admin = User::first();
        }

        if (!$admin) {
            $this->command->warn('No users found. Please create a user first.');
            return;
        }

        $announcements = [
            [
                'title' => 'Welcome to UMS Beach Resort!',
                'message' => 'Experience paradise at our beautiful beach resort. Book your stay today and enjoy our world-class facilities and amenities.',
                'type' => 'success',
                'priority' => 'high',
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'VR Tour Now Available',
                'message' => 'Explore our resort virtually! Take our new immersive 360° VR tour to see all our facilities before you book. Works great on mobile devices!',
                'type' => 'info',
                'priority' => 'normal',
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Maintenance Notice',
                'message' => 'The basketball court will be undergoing scheduled maintenance next Monday from 8 AM to 2 PM. All other facilities remain open.',
                'type' => 'warning',
                'priority' => 'normal',
                'is_active' => true,
                'created_by' => $admin->id,
            ],
            [
                'title' => 'Special Weekend Promotion',
                'message' => 'Book 3 days and get 1 day free! This special offer is valid for all weekends in November. Don\'t miss out!',
                'type' => 'info',
                'priority' => 'high',
                'is_active' => true,
                'expires_at' => now()->addDays(30),
                'created_by' => $admin->id,
            ],
            [
                'title' => 'New Amenities Added',
                'message' => 'We\'ve added new beach umbrellas, loungers, and a smoothie bar near the beach area. Come and enjoy!',
                'type' => 'success',
                'priority' => 'low',
                'is_active' => true,
                'created_by' => $admin->id,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }

        $this->command->info('Announcements seeded successfully!');
    }
}
