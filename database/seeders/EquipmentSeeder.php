<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Equipment;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment = [
            [
                'name' => 'BBQ Grill Set',
                'description' => 'Complete BBQ grill set with charcoal and utensils',
                'category' => 'bbq',
                'price_per_unit' => 50.00,
                'quantity_available' => 10,
                'is_available' => true,
            ],
            [
                'name' => 'BBQ Portable Stove',
                'description' => 'Portable gas stove for cooking',
                'category' => 'bbq',
                'price_per_unit' => 30.00,
                'quantity_available' => 8,
                'is_available' => true,
            ],
            [
                'name' => 'Kayak (Single)',
                'description' => 'Single person kayak with paddle and life jacket',
                'category' => 'water_sports',
                'price_per_unit' => 80.00,
                'quantity_available' => 6,
                'is_available' => true,
            ],
            [
                'name' => 'Paddleboard',
                'description' => 'Stand-up paddleboard with paddle',
                'category' => 'water_sports',
                'price_per_unit' => 60.00,
                'quantity_available' => 8,
                'is_available' => true,
            ],
            [
                'name' => 'Snorkeling Gear Set',
                'description' => 'Complete snorkeling set (mask, snorkel, fins)',
                'category' => 'water_sports',
                'price_per_unit' => 40.00,
                'quantity_available' => 15,
                'is_available' => true,
            ],
            [
                'name' => 'Beach Volleyball Set',
                'description' => 'Professional volleyball with net',
                'category' => 'water_sports',
                'price_per_unit' => 35.00,
                'quantity_available' => 5,
                'is_available' => true,
            ],
            [
                'name' => 'Sound System',
                'description' => 'Portable sound system with microphones',
                'category' => 'audio',
                'price_per_unit' => 150.00,
                'quantity_available' => 3,
                'is_available' => true,
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Waterproof bluetooth speaker',
                'category' => 'audio',
                'price_per_unit' => 45.00,
                'quantity_available' => 10,
                'is_available' => true,
            ],
            [
                'name' => 'Folding Chair',
                'description' => 'Comfortable folding beach chair',
                'category' => 'seating',
                'price_per_unit' => 10.00,
                'quantity_available' => 50,
                'is_available' => true,
            ],
            [
                'name' => 'Picnic Table',
                'description' => 'Foldable picnic table (seats 6)',
                'category' => 'seating',
                'price_per_unit' => 40.00,
                'quantity_available' => 8,
                'is_available' => true,
            ],
            [
                'name' => 'Beach Tent (4-person)',
                'description' => 'Pop-up beach tent with UV protection',
                'category' => 'other',
                'price_per_unit' => 55.00,
                'quantity_available' => 12,
                'is_available' => true,
            ],
            [
                'name' => 'Cooler Box (Large)',
                'description' => 'Large insulated cooler box with ice',
                'category' => 'other',
                'price_per_unit' => 25.00,
                'quantity_available' => 15,
                'is_available' => true,
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::create($item);
        }
    }
}
