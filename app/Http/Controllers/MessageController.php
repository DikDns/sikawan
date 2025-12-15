<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();

        return Inertia::render('messages', [
            'messages' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:3|max:150|regex:/^[A-Za-zÀ-ÿ\'’\- ]+$/',
            'email' => 'required|email|string|max:150',
            'subject' => 'required|string|max:255',
            'content' => 'required|string|max:2000',
        ], [
            // name
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.min' => 'Nama lengkap harus terdiri dari minimal :min karakter.',
            'name.max' => 'Nama lengkap tidak boleh lebih dari :max karakter.',
            'name.regex' => 'Nama lengkap hanya boleh berisi huruf dan tanda baca umum.',

            // email
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.max' => 'Alamat email tidak boleh lebih dari :max karakter.',

            // subject
            'subject.required' => 'Subjek pesan wajib diisi.',
            'subject.max' => 'Subjek tidak boleh lebih dari :max karakter.',

            // content
            'content.required' => 'Isi pesan wajib diisi.',
            'content.max' => 'Isi pesan tidak boleh lebih dari :max karakter.',
        ]);

        Message::create($request->all());

        return redirect()->back()->withSuccess('Pesan anda berhasil dikirim!');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:messages,id',
        ]);

        Message::whereIn('id', $request['ids'])->delete();

        return back()->withSuccess(count($request['ids']).' pesan berhasil dihapus.');
    }
}
