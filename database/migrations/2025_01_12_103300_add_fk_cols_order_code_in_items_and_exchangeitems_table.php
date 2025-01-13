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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('code', 255)->nullable()->unique()->change(); // Ensure the `code` column is unique
        });
        Schema::table('items', function (Blueprint $table) {
            $table->foreign('order_code')->references('code')->on('orders')->onDelete('cascade');
        });
        Schema::table('exchangeitems', function (Blueprint $table) {
            $table->foreign('order_code')->references('code')->on('orders')->onDelete('cascade');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('exchange_order_code')->references('code')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items_and_exchangeitems', function (Blueprint $table) {
            //
        });
    }
};
