#!/bin/bash
set -e

# Ensure storage directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Ensure database directory and file exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
    chmod 664 /var/www/html/database/database.sqlite
fi

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Run migrations
php artisan migrate --force

# Optimize
php artisan optimize

echo "Application is ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
