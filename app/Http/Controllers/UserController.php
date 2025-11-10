<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class UserController extends Controller
{
    public function index() {
        $users = User::all();
        return Inertia::render('users', [
            'users' => $users,
        ]);
    }

    public function create() {
        return Inertia::render('users/create-user');
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|min:3|max:255|regex:/^[A-Za-zÀ-ÿ\'’\- ]+$/',
            'email' => 'required|email|string|max:255|unique:users,email',
            'password' => 'required|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/',
            'role' => 'required|in:superadmin,admin,operator',
        ], [
            // name
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap minimal terdiri dari dari 3 karakter.',
            'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
            'name.regex' => 'Nama lengkap hanya boleh berisi huruf, spasi, tanda hubung (-), dan apostrof (’).',

            // email
            'email.required' => 'Alamat email wajib diisi.',
            'email.string' => 'Alamat email harus berupa teks.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.max' => 'Alamat email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Alamat email ini sudah terdaftar.',

            // password
            'password.required' => 'Kata sandi wajib diisi.',
            'password.regex' => 'Kata sandi harus memiliki minimal 6 karakter dan mengandung huruf besar, huruf kecil, angka, serta simbol.',

            // role
            'role.required' => 'Peran pengguna wajib dipilih.',
            'role.in' => 'Peran pengguna yang dipilih tidak valid.',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => Carbon::now(),
            'password' => bcrypt($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('users')->withSuccess('Pengguna berhasil ditambahkan.');
    }

    public function show($user_id) {
        $user = User::findOrFail($user_id);
        return Inertia::render('users/view-user', [
            'user' => $user,
        ]);
    }

    public function edit($user_id) {
        $user = User::findOrFail($user_id);
        return Inertia::render('users/edit-user', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, $user_id) {
        $user = User::findOrFail($user_id);

        $request->validate([
            'name' => 'required|min:3|max:255|regex:/^[A-Za-zÀ-ÿ\'’\- ]+$/',
            'email' => 'required|email|string|max:255',
            'role' => 'required|in:superadmin,admin,operator',
        ], [
            // name
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap minimal terdiri dari dari 3 karakter.',
            'name.max' => 'Nama lengkap tidak boleh lebih dari 255 karakter.',
            'name.regex' => 'Nama lengkap hanya boleh berisi huruf, spasi, tanda hubung (-), dan apostrof (’).',

            // email
            'email.required' => 'Alamat email wajib diisi.',
            'email.string' => 'Alamat email harus berupa teks.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.max' => 'Alamat email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Alamat email ini sudah terdaftar.',

            // role
            'role.required' => 'Peran pengguna wajib dipilih.',
            'role.in' => 'Peran pengguna yang dipilih tidak valid.',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => Carbon::now(),
            'role' => $request->role,
        ]);

        return redirect()->route('users')->withSuccess('Pengguna dengan ID '. $user->id. ' berhasil di update!');
    }

    public function destroy(Request $request) {
        $user = User::findOrFail($request->id);
        $user->delete();

        return redirect()->route('users')->withSuccess('Pengguna berhasil dihapus.');
    }
}
