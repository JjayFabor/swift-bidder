# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build frontend assets
#
# VITE_* values are inlined into the bundle at build time, so they must be
# present here as build args, not merely at runtime.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS assets

WORKDIR /app

ARG VITE_APP_NAME="Swift Bidder"
ARG VITE_PUSHER_APP_KEY=""
ARG VITE_PUSHER_APP_CLUSTER="ap1"
ARG VITE_PUSHER_HOST=""
ARG VITE_PUSHER_PORT="443"
ARG VITE_PUSHER_SCHEME="https"

ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_PUSHER_APP_KEY=$VITE_PUSHER_APP_KEY \
    VITE_PUSHER_APP_CLUSTER=$VITE_PUSHER_APP_CLUSTER \
    VITE_PUSHER_HOST=$VITE_PUSHER_HOST \
    VITE_PUSHER_PORT=$VITE_PUSHER_PORT \
    VITE_PUSHER_SCHEME=$VITE_PUSHER_SCHEME

COPY package.json package-lock.json ./
# --legacy-peer-deps reproduces the resolution the committed lock file was built
# with: react-day-picker@8 declares a peer of date-fns ^2||^3, but the project
# uses date-fns v4. Upgrading react-day-picker to v9 would fix this properly, but
# v9 changes the API used by components/ui/calendar.jsx, so it is deliberately
# left as follow-up work rather than a deploy-time change.
RUN npm ci --legacy-peer-deps

COPY vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
COPY resources ./resources
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 — PHP dependencies
# ---------------------------------------------------------------------------
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
# Artisan isn't available yet, so skip the post-install scripts here; package
# discovery runs in the final stage where the full source tree exists.
RUN composer install \
        --no-dev \
        --no-interaction \
        --no-scripts \
        --prefer-dist \
        --optimize-autoloader

# ---------------------------------------------------------------------------
# Stage 3 — runtime: nginx + php-fpm under supervisord
# ---------------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS runtime

WORKDIR /var/www/html

# Composer is needed in this stage so the autoloader is dumped against the same
# PHP build and extension set the app actually runs on.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache \
        nginx \
        supervisor \
        gettext \
        libpng \
        libjpeg-turbo \
        freetype \
        libzip \
        libpq \
        oniguruma \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        postgresql-dev \
        oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pdo_mysql \
        gd \
        zip \
        bcmath \
        exif \
        pcntl \
        opcache \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

# Opcache tuning matters here: the free tier cold-starts often, so a warm,
# validated-off cache meaningfully cuts time-to-first-byte.
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=0'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=16'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=0'; \
    } > /usr/local/etc/php/conf.d/opcache.ini \
    && { \
        echo 'memory_limit=256M'; \
        echo 'upload_max_filesize=64M'; \
        echo 'post_max_size=64M'; \
        echo 'expose_php=Off'; \
    } > /usr/local/etc/php/conf.d/app.ini

# php-fpm must speak TCP on 9000 for the nginx fastcgi_pass above.
RUN sed -i 's|^listen = .*|listen = 127.0.0.1:9000|' /usr/local/etc/php-fpm.d/www.conf \
    && mkdir -p /etc/nginx/http.d /run/nginx

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

# Dump the optimized autoloader with scripts disabled. `package:discover` boots the
# framework, which resolves the broadcast driver and therefore needs PUSHER_* to be
# present — those are runtime secrets that must not exist in the image, so discovery
# is deferred to the entrypoint instead.
RUN composer dump-autoload --no-dev --optimize --no-interaction --no-scripts

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
