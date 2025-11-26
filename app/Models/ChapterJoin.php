<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;

class ChapterJoin extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'chapter_joins';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    // Future-proof — stores all user details safely
    protected $fillable = [
        'id',
        'chapter_id',
        'user_id',
        'user_data',     // ⭐ full profile JSON
        'status',        // joined / pending / approved etc.
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid()->toString();   // Unique join ID
            $model->status = 'joined';              // Default status
        });
    }
}