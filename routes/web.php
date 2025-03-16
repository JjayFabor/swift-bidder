    <?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/register', [RegisterController::class, 'index'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

/** OTP Route */
Route::get('/otp/verify', [UserController::class, 'verifyAccount'])->name('verify.account');
Route::post('/otp/verify', [UserController::class, 'emailActivation'])->name('otp.verify');
Route::post('/resend-otp', [UserController::class, 'resendOtp'])->name('resend.otp');

/** Admin Route */
Route::middleware(['admin', 'auth', 'verified'])->prefix('admin')->group(
    function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');

        Route::get('/auctions', [AdminController::class, 'auctions'])->name('admin.auctions');
        Route::get('/auctions/{id}', [AuctionController::class, 'show'])->name('admin.auction.show');
        Route::post('/auctions', [AuctionController::class, 'store'])->name('admin.auction.store');
        Route::delete('/auctions/{id}', [AuctionController::class, 'destroy'])->name('admin.auction.delete');
    }
);

/** User Route */
Route::middleware(['auth', 'verified'])->group(
    function () {
        Route::get('/', [UserController::class, 'index'])->name('user.dashboard');
    }
);
