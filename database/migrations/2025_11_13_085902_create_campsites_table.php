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
        Schema::create('campsites', function (Blueprint $table) {
            $table->id();
            $table->string('site_number')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->integer('max_occupancy')->default(4);
            $table->decimal('base_price_per_night', 10, 2)->default(0);
            $table->string('image')->nullable();
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');

            // Equipment pricing
            $table->decimal('tent_price', 10, 2)->default(0);
            $table->decimal('table_price', 10, 2)->default(0);
            $table->decimal('chair_price', 10, 2)->default(0);

            // Equipment availability
            $table->integer('available_tents')->default(0);
            $table->integer('available_tables')->default(0);
            $table->integer('available_chairs')->default(0);

            // Site features
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_water')->default(false);
            $table->boolean('has_shade')->default(false);
            $table->json('amenities')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campsites');
    }
};
