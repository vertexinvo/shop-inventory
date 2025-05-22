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
        Schema::table('stocklogs', function (Blueprint $table) {
            $table->double('purchase_price')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stocklogs', function (Blueprint $table) {
            $table->dropColumn('purchase_price');
            $table->dropColumn('product_id');
        });
    }
};
