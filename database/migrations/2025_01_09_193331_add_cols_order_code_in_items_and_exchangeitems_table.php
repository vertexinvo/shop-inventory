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
        Schema::table('items', function (Blueprint $table) {
            $table->string('order_code')->nullable();
            // set order_id as nullable
            $table->unsignedBigInteger('order_id')->nullable()->change();
        });
        Schema::table('exchangeitems', function (Blueprint $table) {
            $table->string('order_code')->nullable();
            // set order_id as nullable
            $table->unsignedBigInteger('order_id')->nullable()->change();
        });
        Schema::table('products', function (Blueprint $table) {
            $table->string('exchange_order_code')->nullable();
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
