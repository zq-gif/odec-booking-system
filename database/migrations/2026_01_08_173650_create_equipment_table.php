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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('category', ['bbq', 'water_sports', 'audio', 'seating', 'other'])->default('other');
            $table->decimal('price_per_unit', 10, 2);
            $table->integer('quantity_available')->default(0);
            $table->boolean('is_available')->default(true);
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // Create booking_equipment pivot table
        Schema::create('booking_equipment', function (Blueprint $table) {
            $table->id();
            $table->string('booking_type'); // 'facility' or 'activity'
            $table->unsignedBigInteger('booking_id');
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_equipment');
        Schema::dropIfExists('equipment');
    }
};
