<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class FacebookUser extends Model
{
    protected $collection = 'facebook_users';

    protected $fillable = [
        'user_id',
        'facebook_id',
        'access_token',
        'access_token_expires_at'
    ];

    public function pages()
    {
        return $this->hasMany(FacebookPage::class, 'facebook_user_id');
    }
}
