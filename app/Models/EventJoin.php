<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Support\Str;

class EventJoin extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'event_joins';
    protected $primaryKey = 'id';
    public $incrementing = false; // UUID
    protected $keyType = 'string';

    protected $fillable = [
        'id',         // unique identifier
        'event_id',   // which event
        'user_id',    // who participated
        'status'      // "joined" or "canceled"
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid()->toString();
            $model->status = 'joined'; // default dynamically
        });
    }

    public function user()
{
    return $this->belongsTo(User::class, 'user_id', '_id');
}

}