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
DB_USERNAME=sail
DB_PASSWORD=password
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

## 🔑 Seeder Data

<details>
<summary><b>📥 Admin & User Credentials</b> (Generated from Seeders)</summary>

### ✅ **Admin Credentials**

| Email              | Password  |
|--------------------|-----------|
| `admin@example.com` | `admin1234` |

### ✅ **User Credentials**

| Email              | Password  |
|--------------------|-----------|
| `test@example.com`  | `test1234` |

> ⚠️ **Note:** These credentials are created when you run `php artisan migrate --seed`.

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
