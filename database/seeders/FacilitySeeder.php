<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facilities = [
            [
                'name' => 'Beach Area',
                'description' => 'Beautiful beach area perfect for gatherings and events. Enjoy the stunning ocean view and sandy shores.',
                'location' => 'North Beach Section',
                'price_per_hour' => 50.00,
                'capacity' => 100,
                'image' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
                'status' => 'available',
                'amenities' => json_encode(['Beach chairs', 'Umbrellas', 'BBQ pits', 'Shower facilities']),
            ],
            [
                'name' => 'Basketball Court',
                'description' => 'Full-size basketball court with seating areas and proper lighting for evening games.',
                'location' => 'Sports Complex',
                'price_per_hour' => 30.00,
                'capacity' => 50,
                'image' => 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop',
                'status' => 'available',
                'amenities' => json_encode(['Seating area', 'Night lights', 'Score board', 'Ball storage']),
            ],
            [
                'name' => 'Conference Hall',
                'description' => 'Modern conference hall equipped with state-of-the-art audiovisual equipment and comfortable seating.',
                'location' => 'Main Building, 2nd Floor',
                'price_per_hour' => 80.00,
                'capacity' => 200,
                'image' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
                'status' => 'available',
                'amenities' => json_encode(['Projector', 'Sound system', 'Air conditioning', 'WiFi', 'Whiteboard']),
            ],
            [
                'name' => 'Tennis Court',
                'description' => 'Professional tennis court with high-quality surface and lighting for night games.',
                'location' => 'Sports Complex',
                'price_per_hour' => 40.00,
                'capacity' => 20,
                'image' => 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop',
                'status' => 'available',
                'amenities' => json_encode(['Night lights', 'Seating area', 'Equipment rental', 'Water fountain']),
            ],
            [
                'name' => 'Swimming Pool',
                'description' => 'Olympic-sized swimming pool with diving boards, perfect for training and recreational swimming.',
                'location' => 'Aquatic Center',
                'price_per_hour' => 60.00,
                'capacity' => 80,
                'image' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop',
                'status' => 'maintenance',
                'amenities' => json_encode(['Diving boards', 'Lane dividers', 'Changing rooms', 'Lifeguard', 'Lockers']),
            ],
            [
                'name' => 'Banquet Hall',
                'description' => 'Elegant banquet hall for formal events and celebrations with catering facilities.',
                'location' => 'Main Building, Ground Floor',
                'price_per_hour' => 120.00,
                'capacity' => 300,
                'image' => 'https://images.unsplash.com/photo-1519167758481-83f29da8c2a6?w=800&auto=format&fit=crop',
                'status' => 'available',
                'amenities' => json_encode(['Catering kitchen', 'Stage', 'Sound system', 'Dance floor', 'Chandeliers', 'Bar area']),
            ],
        ];

        foreach ($facilities as $facility) {
            Facility::create($facility);
        }
    }
}
