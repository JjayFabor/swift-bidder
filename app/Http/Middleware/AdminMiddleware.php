<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check() || (Auth::user() && Auth::user()->role !== 'admin')) {
            if ($request->expectsJson() || $request->inertia()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            return redirect()->route('login')->with('error', 'You are not authorized to access this page.');
        }

        return $next($request);
    }
}
