<?php

use App\Models\Order;
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
          // Step 1: Add a new temporary column with the updated enum values
          Schema::table('orders', function (Blueprint $table) {
            $table->enum('method_temp', ['cash', 'bank', 'cheque', 'online', 'partial'])
                  ->default('cash');
            $table->text('payment_note')->nullable();
            $table->json('payment_details')->nullable();
            $table->text('note')->nullable();
        });

        // Step 2: Copy all data from the old column to the new column
        Order::query()->update(['method_temp' => \DB::raw('method')]);

        // Step 3: Drop the old column
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('method');
        });

        // Step 4: Rename the new column to the original column name
        // Use a raw SQL statement for MariaDB compatibility
        \DB::statement('ALTER TABLE orders CHANGE method_temp method ENUM("cash", "bank", "cheque", "online", "partial") DEFAULT "cash"');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          // Step 1: Add a new temporary column with the original enum values
          Schema::table('orders', function (Blueprint $table) {
            $table->enum('method_temp', ['cash', 'bank', 'cheque', 'online'])
                  ->default('cash');
        });

        // Step 2: Copy all data from the current column to the temporary column
        Order::query()->update(['method_temp' => \DB::raw('method')]);

        // Step 3: Drop the current column
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('method');
        });

        // Step 4: Rename the temporary column back to the original column name
        // Use a raw SQL statement for MariaDB compatibility
        \DB::statement('ALTER TABLE orders CHANGE method_temp method ENUM("cash", "bank", "cheque", "online") DEFAULT "cash"');
    }
};
