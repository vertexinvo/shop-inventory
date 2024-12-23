<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('setting')->group(function(){
    Route::get('', [SettingController::class, 'index'])->name('setting');
    Route::get('/edit', [SettingController::class, 'edit'])->name('setting.edit')->middleware('isSuperAdmin');
    Route::post('update', [SettingController::class, 'update'])->name('setting.update')->middleware('isSuperAdmin');
});
