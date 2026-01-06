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
        Schema::table('announcements', function (Blueprint $table) {
            // Add photo column
            $table->string('photo_path')->nullable()->after('message');

            // Remove type and priority columns
            $table->dropColumn(['type', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            // Remove photo column
            $table->dropColumn('photo_path');

            // Add back type and priority columns
            $table->enum('type', ['info', 'success', 'warning', 'error'])->default('info');
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');
        });
    }
};
