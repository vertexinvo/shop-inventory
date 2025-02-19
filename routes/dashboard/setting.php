<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;

Route::middleware(['auth'])->prefix('setting')->group(function(){
    Route::get('', [SettingController::class, 'index'])->name('setting');
    Route::get('/edit', [SettingController::class, 'edit'])->name('setting.edit')->middleware('isSuperAdmin');
    Route::post('update', [SettingController::class, 'update'])->name('setting.update')->middleware('isSuperAdmin');
    Route::get('/exportdb', [SettingController::class, 'exportDatabase'])->name('setting.db')->middleware('isSuperAdmin');
});
//route for activity log
Route::get('/activitylog', function (Request $request) {
    $activities = Activity::with('causer')->latest()->paginate(20);
    return Inertia::render('ActivityLog', compact('activities'));
})->name('setting.activitylog')->middleware('isSuperAdmin');