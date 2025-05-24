<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Item;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * Admin login
     */
    // public function login(Request $request): JsonResponse
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email',
    //         'password' => 'required|string|min:6',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Validation failed',
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }

    //     if (Auth::guard('admin')->attempt(['email' => $request->email, 'password' => $request->password])) {
    //         $admin = Admin::where('email', $request->email)->firstOrFail();
    //         $token = $admin->createToken('admin-token')->plainTextToken;

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Login successful',
    //             'data' => [
    //                 'admin' => $admin,
    //                 'token' => $token,
    //             ]
    //         ]);
    //     }

    //     return response()->json([
    //         'status' => 'error',
    //         'message' => 'Invalid credentials'
    //     ], 401);
    // }

    // /**
    //  * Admin logout
    //  */
    // public function logout(Request $request): JsonResponse
    // {
    //     $request->user()->tokens()->delete();

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Logout successful'
    //     ]);
    // }

    /**
     * Get admin reports (reports marked for admin review)
     */
    public function getAdminReports(Request $request): JsonResponse
    {
        $status = $request->query('status');
        
        $query = Report::with('item')
            ->where('admin_review', true)
            ->orderBy('created_at', 'desc');
            
        if ($status) {
            $query->where('status', $status);
        }
        
        $reports = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $reports
        ]);
    }

    /**
     * Verify a report (mark as verified)
     */
    public function verifyReport(string $id): JsonResponse
    {
        $report = Report::with('item')->find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        // Update report status
        $report->status = 'verified';
        $report->save();
        
        // Also update the item status if appropriate
        if ($report->item) {
            $report->item->status = 'verified';
            $report->item->save();
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report verified successfully',
            'data' => $report
        ]);
    }

    /**
     * Reject a report
     */
    public function rejectReport(string $id): JsonResponse
    {
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        $report->status = 'rejected';
        $report->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report rejected successfully',
            'data' => $report
        ]);
    }

    /**
     * Get admin dashboard statistics
     */
    public function getDashboardStats(): JsonResponse
    {
        $totalLostItems = Item::where('type', 'lost')->count();
        $totalFoundItems = Item::where('type', 'found')->count();
        $pendingReports = Report::where('status', 'pending')->count();
        $adminReviewReports = Report::where('admin_review', true)->count();
        $verifiedReports = Report::where('status', 'verified')->count();
        
        $recentReports = Report::with('item')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
            
        $stats = [
            'total_lost_items' => $totalLostItems,
            'total_found_items' => $totalFoundItems,
            'pending_reports' => $pendingReports,
            'admin_review_reports' => $adminReviewReports,
            'verified_reports' => $verifiedReports,
            'recent_reports' => $recentReports,
        ];
        
        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }

    /**
     * Create a new admin account (super admin only)
     */
    // public function createAdmin(Request $request): JsonResponse
    // {
    //     // Check if user is super admin
    //     if ($request->user()->role !== 'super_admin') {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Unauthorized. Only super admin can create new admin accounts'
    //         ], 403);
    //     }
        
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:admins',
    //         'password' => 'required|string|min:6',
    //         'role' => 'required|in:admin,super_admin',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Validation failed',
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }
        
    //     $admin = Admin::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //         'role' => $request->role,
    //     ]);
        
    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Admin created successfully',
    //         'data' => $admin
    //     ], 201);
    // }
}
