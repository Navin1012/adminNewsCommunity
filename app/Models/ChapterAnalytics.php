<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ChapterAnalytics extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'chapter_analytics';

    protected $fillable = [
        'chapter_id',
        'period_analytics',
        'calculated_at',
    ];

    protected $casts = [
        'chapter_id' => 'string',
    ];
}



