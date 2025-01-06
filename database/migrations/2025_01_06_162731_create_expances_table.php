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
        Schema::create('expances', function (Blueprint $table) { 
            $table->id(); 
            $table->string('name')->nullable(); 
            $table->string('type')->nullable(); 
            $table->timestamp('datetime')->nullable(); 
            $table->text('description')->nullable();
            $table->decimal('amount', 10, 2)->nullable(); 
            $table->enum('status', ['paid', 'unpaid'])->default('paid')->nullable(); 
            $table->unsignedBigInteger('uid')->nullable();
            $table->decimal('pending_amount', 10, 2)->nullable()->default(0);
            $table->foreign('uid')->references('id')->on('users')->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expances');
    }
};
