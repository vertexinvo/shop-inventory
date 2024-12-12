
<?php

use App\Http\Controllers\SupplierinvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->controller(SupplierinvoiceController::class)->group(function () {
    Route::resource('supplier-invoice', SupplierinvoiceController::class);  
    // Route::post('brand/bulkdestroy', [SupplierController::class, 'bulkdestroy'])->name('brand.bulkdestroy');
    Route::put('supplier-invoice/{id}/changestatus', 'changestatus')->name('supplier-invoice.changeStatus');
    Route::put('supplier-invoice/{id}/amountupdate', 'amountupdate')->name('supplier-invoice.amountupdate');

});