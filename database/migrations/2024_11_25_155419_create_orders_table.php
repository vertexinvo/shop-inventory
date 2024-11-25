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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->decimal('total', 10, 2);         
            $table->decimal('payable_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->nullable();
            $table->enum('method', ['cash', 'bank', 'cheque', 'online'])->default('cash');
            $table->string('cheque_no')->nullable();
            $table->date('cheque_date')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('online_payment_link')->nullable();
            $table->decimal('extra_charges', 10, 2)->nullable();
            $table->decimal('shipping_charges', 10, 2)->nullable();
            $table->decimal('discount', 10, 2)->nullable();
            $table->decimal('tax', 10, 2)->nullable();
            $table->string('status')->default('pending');
            $table->boolean('is_installment')->nullable();
            $table->decimal('installment_amount', 10, 2)->nullable();
            $table->integer('installment_period')->nullable();
            $table->integer('installment_count')->nullable();
            $table->timestamp('installment_start_date')->nullable();
            $table->timestamp('installment_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
