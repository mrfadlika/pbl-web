<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type'); // 'lost' or 'found'
        $category = $request->query('category');
        
        $query = Item::with('reports')->orderBy('created_at', 'desc');
        
        if ($type) {
            $query->where('type', $type);
        }
        
        if ($category && $category !== 'Semua Kategori') {
            $query->where('category', $category);
        }
        
        $items = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $items
        ]);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:lost,found',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('items', 'public');
                $imageUrls[] = Storage::url($path);
            }
        }

        $item = Item::create([
            'title' => $request->title,
            'description' => $request->description,
            'location' => $request->location,
            'category' => $request->category,
            'date' => $request->date,
            'type' => $request->type,
            'image' => $imageUrls,
            'status' => 'pending',
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Item created successfully',
            'data' => $item
        ], 201);
    }

    /**
     * Display the specified item.
     */
    public function show(string $id): JsonResponse
    {
        $item = Item::with('reports')->find($id);
        
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $item
        ]);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $item = Item::find($id);
        
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,verified,rejected',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Handle image uploads if there are new images
        if ($request->hasFile('images')) {
            $imageUrls = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('items', 'public');
                $imageUrls[] = Storage::url($path);
            }
            $item->image = $imageUrls;
        }

        // Update other fields
        $item->fill($request->except('images'));
        $item->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Item updated successfully',
            'data' => $item
        ]);
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $item = Item::find($id);
        
        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item not found'
            ], 404);
        }
        
        // Remove image files
        if (is_array($item->image)) {
            foreach ($item->image as $imageUrl) {
                $path = str_replace(Storage::url('/'), '', $imageUrl);
                Storage::disk('public')->delete($path);
            }
        }
        
        $item->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Item deleted successfully'
        ]);
    }
}
