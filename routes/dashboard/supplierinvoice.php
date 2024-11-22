
<?php

use App\Http\Controllers\SupplierinvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('supplier-invoice', SupplierinvoiceController::class);  
    Route::post('supplier-invoice/generateinvoicecode', [SupplierinvoiceController::class, 'generateinvoicecode'])->name('supplier-invoice.generateinvoicecode');
    // Route::post('brand/bulkdestroy', [SupplierController::class, 'bulkdestroy'])->name('brand.bulkdestroy');
});