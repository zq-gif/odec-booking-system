# Railway Deployment Guide - ODEC Booking System

Complete step-by-step guide to deploy your Laravel + Inertia.js booking system to Railway.

---

## Prerequisites

- [x] GitHub account
- [x] Railway account (sign up at [railway.app](https://railway.app))
- [x] Git repository pushed to GitHub
- [x] Project works locally

---

## Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/odec-booking-system.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Authorize Railway to access your repositories

---

## Step 3: Create New Project on Railway

### 3.1 Deploy from GitHub

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **odec-booking-system** repository
4. Railway will automatically detect it's a Laravel project

### 3.2 Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"MySQL"**
4. Railway will create a MySQL instance and provide connection variables

---

## Step 4: Configure Environment Variables

### 4.1 Generate Application Key

Run locally to get your APP_KEY:

```bash
php artisan key:generate --show
```

Copy the output (looks like: `base64:xyz123...`)

### 4.2 Add Variables in Railway

Go to your Railway project → **Variables** tab → Add these:

```env
# Application
APP_NAME=ODEC Booking System
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_KEY_FROM_STEP_4.1

# Database (Railway auto-fills these with $ references)
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Filesystem
FILESYSTEM_DISK=public

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error

# Security
TRUST_PROXIES=*
```

**Note:** Railway automatically provides `RAILWAY_PUBLIC_DOMAIN` for APP_URL

### 4.3 Add APP_URL (After First Deploy)

After your first deployment, Railway will give you a public URL like:
`https://odec-booking-system-production.up.railway.app`

Add this variable:

```env
APP_URL=https://your-app-url.up.railway.app
```

Then redeploy.

---

## Step 5: Configure Custom Start Command

1. Go to **Settings** → **Deploy**
2. Under **Custom Start Command**, add:

```bash
php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT}
```

Or Railway will use the `Procfile` we created automatically.

---

## Step 6: Deploy

Railway will automatically deploy when you:
- Push to GitHub
- Change environment variables
- Click **"Deploy"** manually

### Monitor Deployment

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Watch the **Logs** in real-time

You should see:
```
📦 Installing dependencies...
🔨 Building assets...
🗄️ Running migrations...
✅ Deployment successful!
```

---

## Step 7: Verify Deployment

### 7.1 Check Application

Visit your Railway public URL:
```
https://your-app-name.up.railway.app
```

You should see the ODEC Booking System welcome page!

### 7.2 Create Admin User

**Option 1: Via Tinker (Recommended)**

In Railway → **Settings** → Click **"Run a Command"**

```bash
php artisan tinker
```

Then run:
```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@odec.com';
$user->password = Hash::make('your-secure-password');
$user->role = 'admin';
$user->save();
exit;
```

**Option 2: Via Database Seeder**

Create a seeder locally:

```bash
php artisan make:seeder AdminUserSeeder
```

Edit `database/seeders/AdminUserSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@odec.com',
            'password' => Hash::make('SecurePassword123!'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }
}
```

Commit and push, then run on Railway:

```bash
php artisan db:seed --class=AdminUserSeeder
```

---

## Step 8: Set Up Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **"Generate Domain"** (free Railway subdomain)
   - Or add your custom domain

3. If using custom domain:
   - Add CNAME record in your DNS provider
   - Point to Railway's provided domain

---

## Step 9: Configure Storage for VR Images

### Option A: Use Railway Volumes (Recommended)

1. In Railway project → Click **"+ New"**
2. Select **"Volume"**
3. Mount path: `/app/storage/app/public`
4. This persists your uploaded files across deployments

### Option B: Use External Storage (Better for Production)

Update your `.env` on Railway:

```env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=odec-vr-images
AWS_URL=https://your-bucket.s3.amazonaws.com
```

---

## Troubleshooting

### Issue: 500 Error

**Solution:**
1. Enable debug mode temporarily:
   ```env
   APP_DEBUG=true
   ```
2. Check Railway logs for error details
3. Disable debug after fixing

### Issue: Database Connection Failed

**Solution:**
1. Verify MySQL plugin is running
2. Check database variables are properly referenced:
   ```env
   DB_HOST=${{MySQL.MYSQLHOST}}
   ```
3. Restart deployment

### Issue: Storage Symlink Error

**Solution:**
Run manually in Railway command:
```bash
php artisan storage:link --force
```

### Issue: VR Images Not Loading

**Solution:**
1. Check storage symlink exists
2. Verify APP_URL is set correctly
3. Use Railway Volume or external storage

### Issue: npm Build Fails

**Solution:**
Increase build timeout in Railway settings:
1. Settings → Deploy
2. Set **Deploy Timeout** to 20 minutes

---

## Monitoring & Maintenance

### View Logs

Railway Dashboard → **Deployments** → Select deployment → **Logs**

### Database Backup

Railway doesn't auto-backup on free tier. Manual backup:

```bash
# Run this command on Railway
php artisan db:backup
```

Or export MySQL directly from Railway dashboard.

### Update Code

Simply push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway auto-deploys!

---

## Cost Estimates

With Railway's free tier ($5 monthly credit):

**Your ODEC System Usage:**
- **Web App:** ~$0.20/day (24/7 running)
- **MySQL Database:** ~$0.10/day
- **Total:** ~$9/month (exceeds free tier after ~16 days)

**To stay within free tier:**
- Only run during testing hours
- Use Railway's sleep feature
- Upgrade to **Hobby Plan** ($5/month) for continuous running

---

## Production Checklist

Before going live:

- [ ] APP_DEBUG=false
- [ ] APP_ENV=production
- [ ] Strong APP_KEY generated
- [ ] Database backups configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate verified (Railway provides free SSL)
- [ ] Admin user created
- [ ] Test all booking flows
- [ ] Test payment receipt uploads
- [ ] Test VR tour loading
- [ ] Verify email notifications (when implemented)
- [ ] Storage properly configured
- [ ] Error logging configured

---

## Next Steps After Deployment

1. **Test Everything:**
   - Register user
   - Book facility
   - Book activity
   - Upload payment receipt
   - View VR tours
   - Test admin panel

2. **Configure Email:**
   Add to Railway variables:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@odec.com
   MAIL_FROM_NAME="ODEC Booking System"
   ```

3. **Implement Missing Features:**
   - Payment verification UI (admin panel)
   - Email notifications
   - Database indexes (performance)

4. **Monitor Usage:**
   - Check Railway dashboard for credit usage
   - Upgrade plan when needed

---

## Support

**Railway Documentation:** https://docs.railway.app
**Laravel Deployment:** https://laravel.com/docs/deployment
**Need Help?** Check Railway community or Laravel forums

---

## Quick Reference Commands

```bash
# View logs
railway logs

# Run migrations
railway run php artisan migrate

# Run tinker
railway run php artisan tinker

# Clear cache
railway run php artisan cache:clear

# Restart service
railway restart
```

---

**Deployment Date:** January 4, 2026
**Laravel Version:** 11.x
**Railway Region:** Recommended: US West (Oregon) for best performance

---

Good luck with your deployment! 🚀
