<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('user',UserController::class);
});

