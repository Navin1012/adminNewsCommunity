<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Roles;

class RoleAuth
{
    public function handle($request, Closure $next)
    {
        // Not logged in
        if (!session()->has('role_user')) {
            return redirect()->route('role.login')->with('error', 'Please login first!');
        }

        $roleSession = session('role_user');

        // Fetch fresh user from DB
        $roleUser = Roles::find($roleSession['id']);

        // If user deleted OR inactive → force logout
        if (!$roleUser || !$roleUser->active) {

            session()->forget('role_user');

            return redirect()->route('role.login')
                ->with('error', 'Your account is inactive. Contact admin.');
        }

        return $next($request);
    }
}
