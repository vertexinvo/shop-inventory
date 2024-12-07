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
        Schema::create('stocklogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_id')->constrained('stocks')->onDelete('cascade'); // Link to stocks
            $table->integer('quantity'); // Quantity change (+ve or -ve)
            $table->enum('type', ['addition', 'removal', 'adjustment'])->default('addition'); // Type of stock change
            $table->boolean('is_supplier')->default(false); // Whether change is supplier-related
            $table->string('supplier_invoice_no')->nullable(); // Supplier's invoice number, if applicable
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // User responsible for the change
            $table->text('remarks')->nullable(); // Additional remarks
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocklogs');
    }
};
