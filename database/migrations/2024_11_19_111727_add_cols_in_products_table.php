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
            $table->enum('identity_type', ['sku', 'imei' ,'none','serial'])->default('none');
            $table->string('identity_value')->nullable();
            $table->enum('warranty_type', ['days', 'months' ,'years' ,'none'])->default('none');
            $table->string('supplier_invoice_no')->nullable();
            $table->longText('description')->nullable();
            $table->float('weight')->nullable();
            $table->boolean('is_supplier')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       
    }
};
