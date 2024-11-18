<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function(){
    Route::resource('user',UserController::class);
    Route::put('user/status/{id}', [UserController::class, 'status'])->name('user.status');
    Route::post('user/bulkdestroy', [UserController::class, 'bulkdestroy'])->name('user.bulkdestroy');
});

