<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('notification', NotificationController::class)->only(['index', 'destroy']);
    Route::post('notification/bulkdestroy', [NotificationController::class, 'bulkdestroy'])->name('notification.bulkdestroy');
    Route::post('notification/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notification.markAsRead');
    Route::post('notification/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notification.markAllAsRead');
    Route::get('notification/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notification.unreadCount');
});