#!/bin/sh
set -e

# Render injects the port to bind on; default matches their convention for local runs.
: "${PORT:=10000}"
export PORT

echo "==> Rendering nginx config for port ${PORT}"
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/http.d/default.conf

# Everything below runs at boot rather than build time because it needs the
# environment variables, which only exist once the service is running.
echo "==> Clearing stale caches"
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "==> Discovering packages"
php artisan package:discover --ansi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "==> Running migrations"
    php artisan migrate --force
fi

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    echo "==> Seeding database (seeder is idempotent)"
    php artisan db:seed --force
fi

echo "==> Caching config, routes and views"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Starting supervisord"
exec supervisord -c /etc/supervisord.conf
