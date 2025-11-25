<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Roles extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';        // 👈 REQUIRED
    protected $collection = 'roles_access';   // 👈 Your collection

    protected $fillable = [
        'employee_code',
        'name',
        'phone_number',
        'email',
        'birthdate',
        'designation',
        'role',
        'password',
        'active',
    ];

    protected $hidden = ['password'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $last = Roles::orderBy('_id', 'desc')->first();
            $next = $last ? intval(substr($last->employee_code, 3)) + 1 : 1;

            $model->employee_code = 'EMP' . str_pad($next, 5, '0', STR_PAD_LEFT);
            $model->active = $model->active ?? true;
        });
    }
}
