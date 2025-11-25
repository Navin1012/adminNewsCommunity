<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{

    private function validateObjectId($id)
    {
        if (!preg_match('/^[a-f0-9]{24}$/i', $id)) {
            abort(404, 'Invalid ID format');
        }
    }

    public function index(Request $request)
    {
        $search = trim($request->q);

        $query = User::select([
            '_id',
            'name',
            'email',
            'channel_name',
            'channel_url',
            'mobile_number',
            'address',
            'premium',
            'payment_status',
            'active',
            'email_verified_at',
            'created_at'
        ])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('mobile_number', 'like', "%{$search}%")
                        ->orWhere('channel_name', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at');

        $users = $query->paginate(15)->through(function ($u) {
            return [
                'id' => (string) ($u->_id ?? $u->id),
                'name' => $u->name,
                'email' => $u->email,
                'channel_name' => $u->channel_name,
                'channel_url' => $u->channel_url,
                'mobile_number' => $u->mobile_number,
                'address' => $u->address,
                'premium' => (bool) $u->premium,
                'payment_status' => $u->payment_status,
                'active' => (bool) $u->active,
                'email_verified_at' => $u->email_verified_at,
                'created_at' => $u->created_at,
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['q' => $search],
        ]);
    }

    public function toggleActive($id)
    {
        $this->validateObjectId($id);

        $user = User::select('_id', 'active', 'email')->find($id);

        if (!$user) {
            return back()->with('error', 'User not found.');
        }

        if ((string) $user->id === (string) auth()->guard('admin')->id()) {
            return back()->with('error', 'You cannot deactivate yourself.');
        }

        $user->active = !$user->active;
        $user->save();

        return back()->with('success', 'User status updated successfully.');
    }
}
