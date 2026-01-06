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
        Schema::create('activity_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('activity_id')->constrained()->onDelete('cascade');
            $table->string('reference_number')->unique();

            // Booking details
            $table->date('booking_date');
            $table->time('start_time');
            $table->integer('number_of_participants');
            $table->integer('duration_minutes');

            // Participant details
            $table->json('participant_names')->nullable();
            $table->json('participant_ages')->nullable();
            $table->text('experience_level')->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('emergency_contact')->nullable();

            // Pricing
            $table->decimal('price_per_person', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('final_amount', 10, 2);

            // Equipment rental
            $table->json('equipment_rental')->nullable();
            $table->decimal('equipment_cost', 10, 2)->default(0);

            // Additional info
            $table->text('special_requests')->nullable();
            $table->boolean('transportation_needed')->default(false);

            // Status tracking
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'partial', 'paid', 'refunded'])->default('unpaid');
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();

            // Safety waivers
            $table->boolean('waiver_signed')->default(false);
            $table->timestamp('waiver_signed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_bookings');
    }
};
