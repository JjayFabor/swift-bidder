    <?php

use App\Events\TestEvent;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerifyTokenController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/register', [RegisterController::class, 'index'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

/** OTP Route */
Route::get('/otp/verify', [VerifyTokenController::class, 'verifyAccount'])->name('verify.account');
Route::post('/otp/verify', [VerifyTokenController::class, 'emailActivation'])->name('otp.verify');
Route::post('/resend-otp', [VerifyTokenController::class, 'resendOtp'])->name('resend.otp');

Route::middleware(['auth', 'verified'])->group(function () {
    // Bidder User Routes
    Route::get('/', [UserController::class, 'index'])->name('user.dashboard');
    Route::get('/auctions/{id}', [AuctionController::class, 'show'])->name('auction.show');
    Route::post('/auctions/{id}/bid', [BidController::class, 'store'])->name('auction.bid');

    // Admin-Specific Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::get('/auction-page', [AdminController::class, 'auctionPage'])->name('admin.auction.page');

        Route::get('/auctions', [AdminController::class, 'auctions'])->name('admin.auctions');
        Route::post('/auctions', [AuctionController::class, 'store'])->name('admin.auction.store');
        Route::delete('/auctions/{id}', [AuctionController::class, 'destroy'])->name('admin.auction.delete');
    });
});

/** This is for test pusher */
Route::get('/test-broadcast', function () {
    broadcast(new TestEvent('Hello, this is a test message!'));

    return 'TestEvent has been broadcasted!';
});

Route::get('/test-page', function () {
    return Inertia::render('TestPage');
});
