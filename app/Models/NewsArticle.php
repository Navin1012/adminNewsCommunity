<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;


class NewsArticle extends Model
{
    protected $table = 'news_articles';

    protected $fillable = [
        'title',
        'summary',
        'content',
        'image',
        'category',
        'author',
        'read_time',
    ];
}