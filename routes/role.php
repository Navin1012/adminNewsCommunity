<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleAuthController;

Route::get('/login', [RoleAuthController::class, 'showLogin'])->name('role.login');
Route::post('/login', [RoleAuthController::class, 'login'])->name('role.login.submit');
Route::get('/', function () {
    return redirect()->route('admin.login');
});

Route::middleware('role.auth')->group(function () {
    Route::get('/dashboard', [RoleAuthController::class, 'dashboard'])
        ->name('role.dashboard');


    Route::post('/logout', [RoleAuthController::class, 'logout'])
        ->name('role.logout');
});
