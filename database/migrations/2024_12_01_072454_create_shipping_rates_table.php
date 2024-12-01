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
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('rate_id')->nullable();
            $table->string('zone_id')->nullable();
            $table->string('weight_status')->nullable();
            $table->string('merchant_id')->nullable();
            $table->string('country_id')->nullable();
            $table->string('country_name')->nullable();
            $table->string('state_id')->nullable();
            $table->string('state_name')->nullable();
            $table->string('city_id')->nullable();
            $table->string('city_name')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('area_id')->nullable();
            $table->string('branch_id')->nullable();
            $table->string('area_name')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->decimal('fee', 10, 5)->nullable();
            $table->decimal('minimum', 10, 2)->nullable();
            $table->decimal('min_for_free_delivery', 10, 2)->nullable();
            $table->integer('delivery_estimation')->nullable();
            $table->integer('sequence')->nullable();
            $table->string('date_created')->nullable();
            $table->string('date_modified')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->decimal('weight_charges', 10, 2)->nullable();
            $table->decimal('additional_weight_charges', 10, 2)->nullable();
            $table->decimal('end_weight_range', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
