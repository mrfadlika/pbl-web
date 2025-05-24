<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Items routes
Route::get('/items', [ItemController::class, 'index']);
Route::get('/items/{id}', [ItemController::class, 'show']);
Route::post('/items', [ItemController::class, 'store']);
Route::put('/items/{id}', [ItemController::class, 'update']);
Route::delete('/items/{id}', [ItemController::class, 'destroy']);

// Reports routes
Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports/{id}', [ReportController::class, 'show']);
Route::post('/reports', [ReportController::class, 'store']);
Route::put('/reports/{id}', [ReportController::class, 'update']);
Route::patch('/reports/{id}/admin-review', [ReportController::class, 'toggleAdminReview']);
Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

// Admin routes
Route::post('/admin/login', [AdminController::class, 'login']);


Route::post('/admin/logout', [AdminController::class, 'logout']);
Route::get('/admin/reports', [AdminController::class, 'getAdminReports']);
Route::patch('/admin/reports/{id}/verify', [AdminController::class, 'verifyReport']);
Route::patch('/admin/reports/{id}/reject', [AdminController::class, 'rejectReport']);
Route::get('/admin/dashboard', [AdminController::class, 'getDashboardStats']);
Route::post('/admin/create', [AdminController::class, 'createAdmin']);