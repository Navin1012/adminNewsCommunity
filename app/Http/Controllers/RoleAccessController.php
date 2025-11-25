<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RoleAccessController extends Controller
{
  
    public function index(Request $request)
    {
        $roles = Roles::select('id', 'employee_code', 'name', 'email', 'phone_number', 'role', 'active', 'designation')
            ->orderBy('name')
            ->paginate(20);
// dd($roles);
        return Inertia::render("Admin/Access/Index", [
            'roles' => $roles
        ]);
    }


   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'phone_number'  => 'nullable|string|max:20',
            'email'         => 'required|email|unique:roles_access,email',
            'birthdate'     => 'nullable|date',
            'designation'   => 'required|string|max:255',
            'role'          => 'required|in:admin,manager,employee',
            'active'        => 'required|boolean',
            'password'      => 'required|string|min:6|confirmed',
        ]);

        Roles::create([
            'name'          => $validated['name'],
            'phone_number'  => $validated['phone_number'],
            'email'         => $validated['email'],
            'birthdate'     => $validated['birthdate'],
            'designation'   => $validated['designation'],
            'role'          => $validated['role'],
            'active'        => $validated['active'],
            'password'      => Hash::make($validated['password']),
        ]);

        return redirect()->route('admin.access.index')
            ->with('success', 'New access user created successfully!');
    }


   
    public function update(Request $request, $id)
    {
        $role = Roles::find($id);

        if (!$role) {
            return back()->with('error', 'Employee not found!');
        }

        $validated = $request->validate([
            'employee_code' => 'required|string|max:50',
            'name'          => 'required|string|max:255',
            'phone_number'  => 'nullable|string|max:15',
            'email'         => 'required|email|unique:roles_access,email,' . $role->id,
            'birthdate'     => 'nullable|date',
            'designation'   => 'required|string|max:255',
            'role'          => 'required|in:manager,employee',
            'active'        => 'required|boolean',
            'password'      => 'nullable|string|min:6',
        ]);

        if ($validated['password'] ?? false) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); 
        }

        $role->update($validated);

        return redirect()->route('admin.access.index')
            ->with('success', 'Employee updated successfully.');
    }


    public function toggle($id)
    {
        $role = Roles::find($id);

        if (!$role) {
            return back()->with('error', 'Employee not found.');
        }

        $role->update(['active' => !$role->active]);

        return back()->with('success', 'Status updated successfully.');
    }


    public function destroy($id)
    {
        $role = Roles::find($id);

        if (!$role) {
            return back()->with('error', 'Employee not found.');
        }

        $role->delete();

        return back()->with('success', 'Employee deleted successfully.');
    }
}
