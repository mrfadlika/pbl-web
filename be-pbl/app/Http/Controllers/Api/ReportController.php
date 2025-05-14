<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     */
    public function index(Request $request): JsonResponse
    {
        $item_id = $request->query('item_id');
        $status = $request->query('status');
        $report_type = $request->query('report_type');
        
        $query = Report::with('item')->orderBy('created_at', 'desc');
        
        if ($item_id) {
            $query->where('item_id', $item_id);
        }
        
        if ($status) {
            $query->where('status', $status);
        }
        
        if ($report_type) {
            $query->where('report_type', $report_type);
        }
        
        $reports = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $reports
        ]);
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'item_id' => 'required|exists:items,id',
            'userName' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'message' => 'required|string',
            'proofDescription' => 'nullable|string',
            'proofImages' => 'required|array|min:3|max:5',
            'proofImages.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'report_type' => 'required|in:claim,found',
            'additional_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify if the item exists
        $item = Item::find($request->item_id);
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item not found'
            ], 404);
        }

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('proofImages')) {
            foreach ($request->file('proofImages') as $image) {
                $path = $image->store('reports', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        $report = Report::create([
            'item_id' => $request->item_id,
            'userName' => $request->userName,
            'contact' => $request->contact,
            'message' => $request->message,
            'proofDescription' => $request->proofDescription,
            'proofImages' => $imageUrls,
            'report_type' => $request->report_type,
            'status' => 'pending',
            'admin_review' => false,
            'additional_info' => $request->additional_info,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Report submitted successfully',
            'data' => $report
        ], 201);
    }

    /**
     * Display the specified report.
     */
    public function show(string $id): JsonResponse
    {
        $report = Report::with('item')->find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $report
        ]);
    }

    /**
     * Update the specified report in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'userName' => 'sometimes|string|max:255',
            'contact' => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'proofDescription' => 'nullable|string',
            'status' => 'sometimes|in:pending,verified,rejected',
            'admin_review' => 'sometimes|boolean',
            'additional_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle image uploads if there are new images
        if ($request->hasFile('proofImages')) {
            $imageUrls = [];
            foreach ($request->file('proofImages') as $image) {
                $path = $image->store('reports', 'public');
                $imageUrls[] = Storage::url($path);
            }
            $report->proofImages = $imageUrls;
        }

        // Update other fields
        $report->fill($request->except('proofImages'));
        $report->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report updated successfully',
            'data' => $report
        ]);
    }

    /**
     * Toggle the admin_review status of a report.
     */
    public function toggleAdminReview(string $id): JsonResponse
    {
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        $report->admin_review = !$report->admin_review;
        $report->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report admin_review status toggled successfully',
            'data' => $report
        ]);
    }

    /**
     * Remove the specified report from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }
        
        // Remove image files
        if (is_array($report->proofImages)) {
            foreach ($report->proofImages as $imageUrl) {
                $path = str_replace(Storage::url('/'), '', $imageUrl);
                Storage::disk('public')->delete($path);
            }
        }
        
        $report->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report deleted successfully'
        ]);
    }
}
