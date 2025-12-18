<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FacebookPage extends Model
{
    protected $collection = 'facebook_pages';

   protected $fillable = [
    'facebook_user_id',
    'page_id',
    'name',
    'category',
    'access_token',
];

}
