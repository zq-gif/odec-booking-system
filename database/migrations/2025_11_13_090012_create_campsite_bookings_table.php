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
        Schema::create('campsite_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('campsite_id')->constrained()->onDelete('cascade');
            $table->string('reference_number')->unique();

            // Booking dates
            $table->date('check_in_date');
            $table->date('check_out_date');
            $table->integer('number_of_nights');
            $table->integer('number_of_guests');

            // Equipment rental
            $table->integer('tents_rented')->default(0);
            $table->integer('tables_rented')->default(0);
            $table->integer('chairs_rented')->default(0);

            // Pricing
            $table->decimal('site_total', 10, 2)->default(0);
            $table->decimal('equipment_total', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);

            // Booking details
            $table->enum('status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'])->default('pending');
            $table->enum('payment_status', ['unpaid', 'partial', 'paid', 'refunded'])->default('unpaid');
            $table->text('special_requests')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campsite_bookings');
    }
};
