<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tenancies', function (Blueprint $table) {
            $table->id();
            $table->string('domain');
            $table->string('user');
            $table->string('db_name');
            $table->string('db_user');
            $table->string('db_password');
            $table->string('db_host');
            $table->string('db_port');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->boolean('mobileapp_access')->default(false);
            $table->boolean('pos_access')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tenancies');
    }
};
