<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vr_tour_spots', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_path'); // Path to 360° image
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('hotspots')->nullable(); // Interactive points in the 360° view
            $table->decimal('pitch', 8, 2)->default(0); // Initial camera pitch
            $table->decimal('yaw', 8, 2)->default(0); // Initial camera yaw
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vr_tour_spots');
    }
};
