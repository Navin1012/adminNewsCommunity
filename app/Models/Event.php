<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // common MongoDB Eloquent
use Illuminate\Support\Str;

class Event extends Model
{
    protected $collection = 'events'; // optional
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'start_at',
        'end_at',
        'location',
        'image',   // storage path
        'is_published',
        'created_by', // admin id
    ];

    // auto-generate slug if not provided
    public static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title) . '-' . uniqid();
            }
        });
    }

    public function getImageUrlAttribute()
{
    return $this->image ? asset('storage/'.$this->image) : null;
}

}
