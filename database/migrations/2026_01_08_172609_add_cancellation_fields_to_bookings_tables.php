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
        // Add fields to facility_bookings table
        Schema::table('facility_bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('facility_bookings', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('confirmed_at');
            }
            if (!Schema::hasColumn('facility_bookings', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('cancelled_at');
            }
            if (!Schema::hasColumn('facility_bookings', 'special_requests')) {
                $table->text('special_requests')->nullable()->after('cancellation_reason');
            }
        });

        // Add fields to activity_bookings table
        Schema::table('activity_bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('activity_bookings', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('payment_verification_notes');
            }
            if (!Schema::hasColumn('activity_bookings', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('cancelled_at');
            }
            if (!Schema::hasColumn('activity_bookings', 'special_requests')) {
                $table->text('special_requests')->nullable()->after('cancellation_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facility_bookings', function (Blueprint $table) {
            $table->dropColumn(['cancelled_at', 'cancellation_reason', 'special_requests']);
        });

        Schema::table('activity_bookings', function (Blueprint $table) {
            $table->dropColumn(['cancelled_at', 'cancellation_reason', 'special_requests']);
        });
    }
};
