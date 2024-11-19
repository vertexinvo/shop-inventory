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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_warranty')->default(false);
            $table->enum('identity_type', ['sku', 'emi' ,'none'])->default('none');
            $table->string('identity_value')->nullable();
            $table->enum('warranty_type', ['days', 'months' ,'years' ,'none'])->default('none');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
    }
};
