#!/bin/bash

# Create Admin User Script for Railway
# Run this after deployment: railway run bash create-admin.sh

echo "🔐 Creating Admin User for ODEC Booking System..."
echo ""

# Create admin user using artisan tinker
php artisan tinker << 'EOF'
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Check if admin exists
$existingAdmin = User::where('email', 'admin@odec.com')->first();

if ($existingAdmin) {
    echo "⚠️  Admin user already exists!\n";
    echo "Email: " . $existingAdmin->email . "\n";
    echo "Role: " . $existingAdmin->role . "\n";
} else {
    // Create new admin user
    $user = new User();
    $user->name = 'Administrator';
    $user->username = 'admin';
    $user->email = 'admin@odec.com';
    $user->password = Hash::make('Admin123!');
    $user->phone_number = '1234567890';
    $user->role = 'admin';
    $user->email_verified_at = now();
    $user->save();

    echo "✅ Admin user created successfully!\n";
    echo "-----------------------------------\n";
    echo "Email: admin@odec.com\n";
    echo "Password: Admin123!\n";
    echo "Role: admin\n";
    echo "-----------------------------------\n";
    echo "⚠️  Please change the password after first login!\n";
}

exit;
EOF

echo ""
echo "🎉 Script completed!"
