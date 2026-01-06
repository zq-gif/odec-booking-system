<?php

namespace Database\Seeders;

use App\Models\VRTourSpot;
use Illuminate\Database\Seeder;

class VRTourSpotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $spots = [
            [
                'title' => 'Beach Entrance',
                'description' => 'Welcome to UMS Beach! Start your virtual tour at our main entrance with stunning ocean views.',
                'image_path' => 'https://pannellum.org/images/alma.jpg', // Sample 360° image
                'order' => 1,
                'is_active' => true,
                'pitch' => 0,
                'yaw' => 0,
                'hotspots' => json_encode([
                    [
                        'pitch' => -2,
                        'yaw' => 117,
                        'text' => 'Main Reception Area'
                    ]
                ])
            ],
            [
                'title' => 'Beach Front View',
                'description' => 'Experience the breathtaking view of our pristine beach and crystal-clear waters.',
                'image_path' => 'https://pannellum.org/images/cerro-toco-0.jpg', // Sample 360° image
                'order' => 2,
                'is_active' => true,
                'pitch' => 10,
                'yaw' => 180,
                'hotspots' => json_encode([
                    [
                        'pitch' => 0,
                        'yaw' => 90,
                        'text' => 'Swimming Area'
                    ],
                    [
                        'pitch' => -5,
                        'yaw' => 270,
                        'text' => 'Beach Lounging Area'
                    ]
                ])
            ],
            [
                'title' => 'Recreation Facilities',
                'description' => 'Explore our world-class recreation facilities including sports courts and activity areas.',
                'image_path' => 'https://pannellum.org/images/bma-0.jpg', // Sample 360° image
                'order' => 3,
                'is_active' => true,
                'pitch' => 0,
                'yaw' => 0,
                'hotspots' => json_encode([
                    [
                        'pitch' => -10,
                        'yaw' => 45,
                        'text' => 'Basketball Court'
                    ],
                    [
                        'pitch' => 0,
                        'yaw' => 135,
                        'text' => 'Volleyball Net'
                    ]
                ])
            ],
            [
                'title' => 'Dining & Refreshments',
                'description' => 'Visit our beachside restaurant and bar offering delicious local cuisine and refreshing beverages.',
                'image_path' => 'https://pannellum.org/images/from-tree.jpg', // Sample 360° image
                'order' => 4,
                'is_active' => true,
                'pitch' => 0,
                'yaw' => 90,
                'hotspots' => json_encode([
                    [
                        'pitch' => 0,
                        'yaw' => 0,
                        'text' => 'Outdoor Seating'
                    ],
                    [
                        'pitch' => -5,
                        'yaw' => 180,
                        'text' => 'Bar Counter'
                    ]
                ])
            ]
        ];

        foreach ($spots as $spot) {
            VRTourSpot::create($spot);
        }
    }
}
