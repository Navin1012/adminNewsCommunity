<?php

namespace App\Http\Controllers;

use App\Models\FacebookUser;
use App\Models\User;              
use Inertia\Inertia;

class FacebookUserController extends Controller
{
    public function index()
    {
        $facebookUsers = FacebookUser::all();

        $list = $facebookUsers->map(function ($fbUser) {

            $user = User::where('_id', $fbUser->user_id)->first();

            return [
                'id'          => (string) $fbUser->_id,
                'user_id'     => (string) $fbUser->user_id,
                'facebook_id' => $fbUser->facebook_id,
                'name'        => $user?->name ?? 'Unknown',
                'email'       => $user?->email ?? 'N/A',
                'pages_count' => $fbUser->pages()->count(),
            ];
        });

        return Inertia::render('Social/FacebookUsersList', [
            'users' => $list,
        ]);
    }
}
