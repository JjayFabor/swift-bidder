<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class LogoutController extends Controller
{
    public function logout()
    {
        Auth::logout();
        Session::invalidate();
        Session::regenerateToken();

        return redirect()->route('login');
    }
}
