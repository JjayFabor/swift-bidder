# 🏆 Laravel Real-Time Auction System

<p align="center">
    <a href="https://laravel.com" target="_blank">
        <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="250" alt="Laravel Logo">
    </a>
</p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

---

## 🚀 About the Project

This is a **Real-Time Auction System** built using **Laravel 12.x**, **InertiaJS**, and **React**. It allows users to create and participate in live auctions with real-time bidding updates using **Laravel Echo** and **Reverb** for broadcasting. The system supports user authentication, bid tracking, and status updates with a responsive user interface using **shadcn/ui**.

The project is containerized using **Laravel Sail** on **WSL2** (Windows Subsystem for Linux), which sets up a complete development environment with **Docker**. Sail handles the installation of PHP, MySQL, Redis, and other services, ensuring a consistent environment for development and deployment across different systems.

---

## 📸 Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Create and Manage Auctions
- ✅ Real-Time Bidding with WebSockets
- ✅ Auction Status Tracking (Active, Pending, Closed, Cancelled)
- ✅ Upload Multiple Images and a Video for Each Auction
- ✅ Role-Based Access (Admin/User)
- ✅ Responsive UI with Tailwind CSS and shadcn/ui

---

## 🏗️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Laravel 12.x** | Backend Framework |
| **InertiaJS** | Full Stack Frontend Handling |
| **React** | Frontend Framework |
| **Laravel Echo + Reverb** | Real-Time Event Broadcasting |
| **MySQL** | Database |
| **Docker + Sail** | Development Environment |
| **shadcn/ui** | UI Components |
| **Tailwind CSS 3.4.17** | Styling |

---

## 🛠️ Installation

<details>
<summary><b>🚀 Installation</b></summary>

### ✅ **Clone the repository**

```bash
git clone https://github.com/JjayFabor/swift-bidder.git
cd realtime-auction
```

### ✅ Set up environment

Create a .env file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

### ✅ Install dependencies

```bash
composer install
npm install
```

### ✅ Create database

Create a MySQL database named `auction_db` and update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=auction_db
DB_USERNAME=root
DB_PASSWORD=
```

### ✅ Run Docker with Sail

```bash
./vendor/bin/sail up -d
```

### ✅ Run migrations and seed data

```bash
./vendor/bin/sail artisan migrate --seed || php artisan migrate --seed
```

### ✅ Run Vite for frontend

```bash
npm run dev
```

</details>

<details>
<summary><b>📧 Mail Configuration (Gmail)</b></summary>

To enable email notifications through Gmail, configure the mail settings in your .env file as shown below:

## ✅ .env Configuration

Add the following to your .env file:

```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD="your-app-password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

## ✅ Setting Up Gmail Account for SMTP

1. **Enable 2-Step Verification** on your Google account.
2. Create an **App Password**:

    * Go to **Google Account Settings** → **Security** → **App Passwords**.
    * Select **Mail** → **Other** → Type "Laravel App."
    * Copy the generated password and use it as `MAIL_PASSWORD` in the `.env` file.

## ✅ Test Email Configuration

You can test your email configuration using the following Artisan command:

```bash
php artisan tinker
```

In Tinker, send a test email:

```php
Mail::raw('Test email from Laravel', function ($message) {
    $message->to('recipient@example.com')
            ->subject('Test Email');
});
```

If the configuration is correct, the email will be sent successfully.

### 🎯 Helpful Resource:

👉 [How to Set Up Gmail SMTP in Laravel](https://mailtrap.io/blog/laravel-send-email-gmail/#Setting-up-Laravel-email-service-before-sending-emails)

</details>

## 🔑 Demo Accounts

<details>
<summary><b>📥 Admin & Bidder Credentials</b> (Generated from Seeders)</summary>

Defined in `config/demo.php` — the seeder and the login screen both read from
there, so the list only needs changing in one place.

### ✅ **Admin**

| Email               | Password    | Can do                           |
|---------------------|-------------|----------------------------------|
| `admin@example.com` | `admin1234` | Create, edit and delete auctions |

### ✅ **Bidders**

| Email                 | Password     |
|-----------------------|--------------|
| `bidder1@example.com` | `bidder1234` |
| `bidder2@example.com` | `bidder1234` |
| `bidder3@example.com` | `bidder1234` |
| `bidder4@example.com` | `bidder1234` |

Four separate bidder accounts exist so several people can test at once and bid
against each other, instead of sharing one session.

> ⚠️ **Note:** Created by `php artisan migrate --seed`. All accounts are seeded
> pre-verified, so they skip the OTP step — which matters on hosts that block
> outbound SMTP.

**Demo mode.** Set `APP_DEMO=true` to list these accounts on the login screen with
click-to-fill. Leave it `false` anywhere holding real data.

**Resetting.** `php artisan demo:reset` clears all auctions and bids and reseeds a
clean set. It refuses to run unless `APP_DEMO=true`, unless you pass `--force`.

</details>

## 📚 Resources

- 📖 **[Laravel Documentation](https://laravel.com/docs)**
- 📖 **[Laravel Sail Documentation](https://laravel.com/docs/12.x/sail)**
- 📖 **[InertiaJS Documentation](https://inertiajs.com)**
- 📖 **[React Documentation](https://react.dev)**
- 📖 **[Tailwind CSS Documentation](https://tailwindcss.com)**
- 📖 **[shadcn/ui Documentation](https://ui.shadcn.com)**
- 📖 **[Reverb Documentation](https://reverb.laravel.com)**

## 📄 License

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).

---

## 💬 Contact

**👤 Jaylord Vhan Fabor** </br>
📧 **Email:** [faborjaylordvhan@gmail.com](mailto:faborjaylordvhan@gmail.com) </br>
📍 **LinkedIn:** [JjayFabor](https://www.linkedin.com/in/jjayfabor/)
