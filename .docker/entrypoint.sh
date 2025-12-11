#!/bin/bash
set -e

# Ensure storage directories exist with proper permissions
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/app/public
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Create storage symlink (important for accessing files via /storage URLs)
php artisan storage:link --force

# Ensure database directory and file exist
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Creating SQLite database..."
    touch /var/www/html/database/database.sqlite
fi

# Fix permissions for database directory to allow WAL creation
chown -R www-data:www-data /var/www/html/database
chmod -R 775 /var/www/html/database

# Enable WAL mode for better concurrency
sqlite3 /var/www/html/database/database.sqlite "PRAGMA journal_mode=WAL;"
sqlite3 /var/www/html/database/database.sqlite "PRAGMA synchronous=NORMAL;"
sqlite3 /var/www/html/database/database.sqlite "PRAGMA busy_timeout=5000;"

# Fix permissions recursively for storage (again, to be safe)
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Run migrations
php artisan migrate --force

# Seed essential data on first run only (permissions, roles, superadmin)
if [ ! -f /var/www/html/storage/.seeded ]; then
    echo "First run detected. Seeding essential data..."
    php artisan db:seed --class=PermissionsFromRoutesSeeder --force
    php artisan db:seed --class=RoleSeeder --force

    # Create superadmin user via tinker
    php artisan tinker --execute="
        \$user = \\App\\Models\\User::firstOrCreate(
            ['email' => 'superadmin@sikawan.com'],
            ['name' => 'Super Admin', 'password' => bcrypt('password'), 'email_verified_at' => now()]
        );
        \$user->assignRole('superadmin');
        echo 'Superadmin user created/verified.';
    "

    touch /var/www/html/storage/.seeded
    echo "Essential data seeded successfully!"
fi

# Optimize
php artisan optimize

echo "Application is ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
