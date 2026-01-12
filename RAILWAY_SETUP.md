# Complete Railway MySQL Setup Guide - ODEC Booking System

This guide will walk you through setting up your ODEC Booking System on Railway with MySQL database.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Login to Railway CLI

Open your terminal and run:

```bash
cd odec-booking-system
railway login
```

This will open your browser. Login with your Railway account (or create one at https://railway.app).

---

### Step 2: Create New Railway Project

After logging in, run:

```bash
railway init
```

- Choose: **"Create new project"**
- Enter project name: **ODEC Booking System**
- Choose: **"Empty project"**

---

### Step 3: Link Your Project

```bash
railway link
```

Select the project you just created.

---

### Step 4: Add MySQL Database

```bash
railway add --database mysql
```

This automatically provisions a MySQL database with all connection credentials.

---

### Step 5: Set Environment Variables

Run this helper script to set all required variables:

```bash
bash setup-railway-env.sh
```

Or manually add each variable:

```bash
# Application Key (use the one from your local .env)
railway variables set APP_KEY="base64:TgSl/dnReWwVleWpRxhvbGEVfoUP6stSozAClSh8H88="

# Application Settings
railway variables set APP_NAME="ODEC Booking System"
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false

# Database (Railway auto-provides MySQL variables)
railway variables set DB_CONNECTION=mysql
railway variables set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'

# Session & Cache
railway variables set SESSION_DRIVER=file
railway variables set CACHE_DRIVER=file
railway variables set QUEUE_CONNECTION=sync

# Filesystem
railway variables set FILESYSTEM_DISK=public

# Logging
railway variables set LOG_CHANNEL=stack
railway variables set LOG_LEVEL=error

# Security
railway variables set TRUST_PROXIES="*"
```

---

### Step 6: Deploy Your Application

```bash
railway up
```

This will:
- Build your application
- Install dependencies
- Compile assets
- Deploy to Railway
- Run migrations automatically

---

### Step 7: Get Your Public URL

```bash
railway domain
```

This generates a public URL like: `https://odec-booking-system-production.up.railway.app`

Then set it as APP_URL:

```bash
railway variables set APP_URL="https://your-generated-url.up.railway.app"
```

---

### Step 8: Create Admin User

Connect to your Railway project and run:

```bash
railway run php artisan tinker
```

Then in tinker:

```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->username = 'admin';
$user->email = 'admin@odec.com';
$user->password = Hash::make('Admin123!');
$user->role = 'admin';
$user->email_verified_at = now();
$user->save();
exit;
```

---

### Step 9: Add Storage Volume (For VR Images)

```bash
railway volume create storage-volume
railway volume attach storage-volume /app/storage/app/public
```

---

## ✅ Verification Checklist

After deployment, verify everything works:

1. Visit your Railway URL
2. Register a test user
3. Login with admin credentials
4. Test facility booking
5. Test activity booking
6. Upload a test payment receipt
7. Check VR tour images load correctly
8. Verify admin panel access

---

## 🛠️ Useful Commands

### View Live Logs
```bash
railway logs
```

### Run Migrations
```bash
railway run php artisan migrate
```

### Clear Cache
```bash
railway run php artisan cache:clear
```

### Run Database Seeder
```bash
railway run php artisan db:seed
```

### Connect to MySQL Database
```bash
railway run mysql
```

### Restart Service
```bash
railway restart
```

### View All Variables
```bash
railway variables
```

---

## 🔧 Troubleshooting

### Issue: "No linked project"

**Solution:**
```bash
railway link
```
Select your project from the list.

### Issue: MySQL Connection Failed

**Solution:**
1. Check if MySQL plugin is running:
```bash
railway status
```

2. Verify environment variables:
```bash
railway variables
```

3. Redeploy:
```bash
railway up
```

### Issue: 500 Internal Server Error

**Solution:**
1. Enable debug temporarily:
```bash
railway variables set APP_DEBUG=true
```

2. Check logs:
```bash
railway logs
```

3. Fix the issue, then disable debug:
```bash
railway variables set APP_DEBUG=false
```

### Issue: VR Images Not Loading

**Solution:**
1. Verify storage link:
```bash
railway run php artisan storage:link --force
```

2. Check volume is attached:
```bash
railway volume list
```

---

## 📊 Railway Dashboard Setup

### Alternative: Manual Setup via Web Dashboard

If you prefer using the Railway web interface:

1. **Go to** [railway.app](https://railway.app)

2. **Create New Project** → "Empty Project"

3. **Add MySQL:**
   - Click "+ New" → "Database" → "MySQL"

4. **Add Your GitHub Repo:**
   - Click "+ New" → "GitHub Repo"
   - Select: `odec-booking-system`

5. **Configure Variables:**
   - Click your app service
   - Go to "Variables" tab
   - Add all variables listed in Step 5 above

6. **Generate Domain:**
   - Click "Settings" → "Networking"
   - Click "Generate Domain"

7. **Deploy:**
   - Push to GitHub or click "Deploy" manually

---

## 💰 Cost Estimate

**Railway Pricing:**
- **Free Trial:** $5 credit (lasts ~16 days with 24/7 uptime)
- **Hobby Plan:** $5/month (includes $5 credit)
- **Pro Plan:** $20/month (includes $20 credit)

**Your Usage:**
- Web App: ~$0.20/day
- MySQL Database: ~$0.10/day
- **Total:** ~$9/month

**Recommendation:** Start with Hobby Plan for continuous availability.

---

## 🔐 Security Recommendations

1. **Change Admin Password** after first login
2. **Disable APP_DEBUG** in production
3. **Use Strong APP_KEY** (never share it)
4. **Enable 2FA** on Railway account
5. **Regular Database Backups** (use Railway backup feature)

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **Laravel Deployment:** https://laravel.com/docs/deployment
- **Support:** Railway Discord or community forums

---

## 🎯 Quick Deployment Checklist

- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] Project created and linked
- [ ] MySQL database added
- [ ] All environment variables set
- [ ] Application deployed successfully
- [ ] Public domain generated
- [ ] APP_URL updated with domain
- [ ] Database migrations ran
- [ ] Admin user created
- [ ] Storage volume attached
- [ ] All features tested

---

**Need Help?** Open an issue on the GitHub repository or contact support.

**Deployment Date:** 2026-01-12
**Railway CLI Version:** 4.23.0
**Laravel Version:** 11.x

Good luck with your deployment! 🚀
