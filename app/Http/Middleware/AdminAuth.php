<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('admin')->check()) {

            // always use back() or redirect()->route() WITH flash
            return redirect()
                ->route('admin.login')
                ->with('error', 'Please login first.');
        }

        return $next($request);
    }
}

