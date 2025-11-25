<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            // 🔥 AUTH DATA PASS FOR ADMIN + ROLE USER
            'auth' => [
                'admin'      => $request->user('admin'),
                'role'  => session('role'),   // Manager / Employee login data
            ],

            // 🔥 FLASH MESSAGES
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ];
    }
}
