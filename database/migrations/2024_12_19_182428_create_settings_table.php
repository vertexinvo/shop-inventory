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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->nullable();
            $table->string('site_title')->nullable();
            $table->string('site_description')->nullable();
            $table->string('site_logo')->nullable();
            $table->string('site_icon')->nullable();
            $table->string('site_favicon')->nullable();
            $table->string('site_email')->nullable();
            $table->string('site_phone')->nullable();
            $table->string('site_address')->nullable();
            $table->string('site_currency')->nullable();
            $table->string('site_currency_symbol')->nullable();
            $table->string('site_currency_position')->nullable();
            $table->string('site_timezone')->nullable();
            $table->string('site_language')->nullable();
            $table->string('site_status')->nullable();
            $table->string('site_maintenance')->nullable();
            $table->string('site_maintenance_message')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
