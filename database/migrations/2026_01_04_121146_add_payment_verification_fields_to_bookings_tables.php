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
        // Add payment verification fields to facility_bookings
        Schema::table('facility_bookings', function (Blueprint $table) {
            $table->boolean('payment_verified')->default(false)->after('payment_receipt');
            $table->timestamp('payment_verified_at')->nullable()->after('payment_verified');
            $table->unsignedBigInteger('payment_verified_by')->nullable()->after('payment_verified_at');
            $table->text('payment_verification_notes')->nullable()->after('payment_verified_by');

            $table->foreign('payment_verified_by')->references('id')->on('users')->onDelete('set null');
        });

        // Add payment verification fields to activity_bookings
        Schema::table('activity_bookings', function (Blueprint $table) {
            $table->boolean('payment_verified')->default(false)->after('payment_receipt');
            $table->timestamp('payment_verified_at')->nullable()->after('payment_verified');
            $table->unsignedBigInteger('payment_verified_by')->nullable()->after('payment_verified_at');
            $table->text('payment_verification_notes')->nullable()->after('payment_verified_by');

            $table->foreign('payment_verified_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facility_bookings', function (Blueprint $table) {
            $table->dropForeign(['payment_verified_by']);
            $table->dropColumn(['payment_verified', 'payment_verified_at', 'payment_verified_by', 'payment_verification_notes']);
        });

        Schema::table('activity_bookings', function (Blueprint $table) {
            $table->dropForeign(['payment_verified_by']);
            $table->dropColumn(['payment_verified', 'payment_verified_at', 'payment_verified_by', 'payment_verification_notes']);
        });
    }
};
