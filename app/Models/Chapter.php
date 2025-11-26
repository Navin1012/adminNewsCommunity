<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model; // IMPORTANT for MongoDB
// use MongoDB\Laravel\Eloquent\SoftDeletes;

class Chapter extends Model
{
    // use SoftDeletes;

    protected $connection = 'mongodb';
    protected $collection = 'chapters'; // collection name

    protected $fillable = [
        'title',
        'state',
        'total_members',
        'description',
        'icon',
        'status',
    ];
}
