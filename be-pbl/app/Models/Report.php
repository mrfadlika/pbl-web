<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'item_id',
        'userName',
        'contact',
        'message',
        'proofDescription',
        'proofImages',
        'report_type',
        'status',
        'admin_review',
        'additional_info',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'proofImages' => 'array',
        'admin_review' => 'boolean',
    ];

    /**
     * Get the item that the report belongs to.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
