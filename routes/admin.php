<?php
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AdminEventJoinController;
use App\Http\Controllers\RoleAccessController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\NewsArticleController;
use App\Http\Controllers\FacebookAnalyticsController;
use App\Http\Controllers\FacebookUserController;
use App\Http\Controllers\ChapterAnalyticsController;
// Login Routes
Route::get('/login', [AdminAuthController::class, 'showLogin'])
    ->name('admin.login')
    ->middleware('guest:admin');

Route::post('/login', [AdminAuthController::class, 'login'])
    ->name('admin.login.submit')
    ->middleware('guest:admin');
    
Route::get('/', function () {
    return redirect()->route('admin.login');
});
// Protected Routes
Route::middleware('auth.admin')->group(function () {

    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('admin.dashboard');

    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('/users/{id}/toggle-active', [AdminUserController::class, 'toggleActive'])->name('admin.users.toggleActive');

    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

    // Events
    Route::get('/events', [EventController::class, 'index'])->name('admin.events.index');
    Route::post('/events', [EventController::class, 'store'])->name('admin.events.store');
    Route::post('/events/{id}', [EventController::class, 'update'])->name('admin.events.update');
    Route::post('/events/{id}/toggle-publish', [EventController::class, 'togglePublish'])->name('admin.events.togglePublish');
    Route::post('/events/{id}/delete', [EventController::class, 'destroy'])->name('admin.events.destroy');
    Route::get('/events/{id}/joins', [AdminEventJoinController::class, 'index'])->name('admin.events.joins');

    // Role Access Management
    Route::get('/access', [RoleAccessController::class, 'index'])->name('admin.access.index');
    Route::get('/access/create', [RoleAccessController::class, 'create'])->name('admin.access.create');
    Route::post('/access/store', [RoleAccessController::class, 'store'])->name('admin.access.store');
    Route::get('/access/{id}/edit', [RoleAccessController::class, 'edit'])->name('admin.access.edit');
    Route::put('/access/{id}', [RoleAccessController::class, 'update'])->name('admin.access.update');
    Route::post('/access/toggle/{id}', [RoleAccessController::class, 'toggle'])
        ->name('admin.access.toggle');
    Route::delete('/access/delete/{id}', [RoleAccessController::class, 'destroy'])
        ->name('admin.access.delete');

    Route::get('/chapters', [ChapterController::class, 'index'])->name('chapters.index');
    Route::post('/chapters', [ChapterController::class, 'store'])->name('chapters.store');
    Route::post('/chapters/{id}', [ChapterController::class, 'update'])->name('chapters.update');
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy'])->name('chapters.destroy');
    Route::post('/chapters/{id}/toggle', [ChapterController::class, 'toggle'])->name('chapters.toggle');
    Route::get('/chapters/{id}/joins', [ChapterController::class, 'joins'])->name('chapters.joins');
    Route::delete('/chapters/joins/{join}', [ChapterController::class, 'removeuser'])->name('chapters.joins.remove');

    Route::get('/news-articles', [NewsArticleController::class, 'index'])->name('news.index');
    Route::post('/news-articles', [NewsArticleController::class, 'store'])->name('news.store');
    Route::post('/news-articles/{id}', [NewsArticleController::class, 'update'])->name('news.update');
    Route::delete('/news-articles/{id}', [NewsArticleController::class, 'destroy'])->name('news.destroy');

    Route::get('/social/analysis', [FacebookAnalyticsController::class, 'index'])->name('social.analysis');
    Route::get('/facebook-users', [FacebookUserController::class, 'index'])->name('facebook.users');

    Route::get('/all-users-analytics', [FacebookAnalyticsController::class, 'allUsersAnalytics'])->name('all.users.analytics');
    Route::get('/chapters-analytics/{chapter}', [ChapterAnalyticsController::class, 'chaptersAnalytics'])->name('chapters.analytics.show');
    Route::get('/chapters/analytics', [ChapterAnalyticsController::class, 'index'])->name('chapters.analytics.index');
});


Route::middleware(['auth:employee', 'role:admin'])->group(function () {
    Route::get('/admin-panel', function () {
        return "Admin Panel";
    });
});

Route::middleware(['auth:role', 'role:admin,manager'])->group(function () {
    Route::get('/manage-users', function () {
        return "Users Management";
    });
});

Route::middleware(['auth:role', 'role:employee'])->group(function () {
    Route::get('/employee/dashboard', function () {
        return "Employee Dashboard";
    });
});
