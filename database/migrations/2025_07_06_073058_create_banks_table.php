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
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            //current balance
            $table->decimal('current_balance', 10, 2)->default(0);
            //bank account number
            $table->string('account_number')->nullable();
            //iban number
            $table->string('iban')->nullable();
            //bank account type
            $table->string('account_type')->nullable();
            //bank swift code
            $table->string('swift_code')->nullable();
            //bank routing number
            $table->string('routing_number')->nullable();
            //bank address
            $table->string('bank_address')->nullable();
            //bank phone number
            $table->string('bank_phone')->nullable();
            //bank email
            $table->string('bank_email')->nullable();
            //bank website
            $table->string('bank_website')->nullable();
            //bank notes
            $table->text('notes')->nullable();
            //status
            $table->enum('status', ['active', 'inactive'])->default('active');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};
