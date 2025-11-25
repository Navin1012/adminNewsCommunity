<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class RoleAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render("Role/Login");
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = strtolower(trim($request->email));
        $ip = $request->ip();
        $key = "login_attempts:" . $email . ":" . $ip;

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors([
               'email' => 'Too many login attempts. Try again in ' . RateLimiter::availableIn($key) . ' seconds.',
            ]);
        }

        $roleUser = Roles::select('id', 'employee_code', 'name', 'role', 'email', 'password', 'active')
            ->where('email', $email)
            ->first();

        if (!$roleUser) {
            RateLimiter::hit($key, 60);
            return back()->withErrors([
                'email' => 'Invalid credentials.'
            ]);
        }

        if (!Hash::check($request->password, $roleUser->password)) {
            RateLimiter::hit($key, 60);
            return back()->withErrors([
                'email' => 'Invalid credentials.'
            ]);
        }

        if (!$roleUser->active) {
            return back()->withErrors([
                'email' => 'Your account is inactive. Contact administrator.'
            ]);
        }

        RateLimiter::clear($key);

        session()->put('role_user', [
            'id' => $roleUser->id,
            'employee_code' => $roleUser->employee_code,
            'name' => $roleUser->name,
            'role' => $roleUser->role,
            'email' => $roleUser->email,
        ]);

        $request->session()->regenerate();

        return redirect()->route('role.dashboard')
            ->with('success', "Welcome back, {$roleUser->name}!");
    }

   
    public function dashboard()
    {
        if (!session()->has('role_user')) {
            return redirect()->route('role.login');
        }

        return Inertia::render("Role/Dashboard", [
            'role' => session('role_user')
        ]);
    }

    public function logout(Request $request)
    {
        session()->forget('role_user');
        $request->session()->invalidate();     
        $request->session()->regenerateToken(); 

        return redirect()
            ->route('role.login')
            ->with('success', 'Logged out successfully.');
    }
}
