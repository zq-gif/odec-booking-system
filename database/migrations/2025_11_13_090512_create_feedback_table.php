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
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('booking_reference')->nullable();
            $table->string('feedback_type')->default('general'); // general, booking, facility, activity

            // Rating fields
            $table->integer('overall_rating')->default(0); // 1-5 stars
            $table->integer('cleanliness_rating')->nullable();
            $table->integer('staff_rating')->nullable();
            $table->integer('facilities_rating')->nullable();
            $table->integer('value_rating')->nullable();

            // Feedback content
            $table->string('title')->nullable();
            $table->text('comment')->nullable();
            $table->text('suggestions')->nullable();

            // Additional info
            $table->boolean('would_recommend')->default(true);
            $table->enum('status', ['pending', 'reviewed', 'published'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
