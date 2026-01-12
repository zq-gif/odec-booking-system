# 🚀 5-Minute Railway Deployment

Follow these exact steps to deploy your ODEC Booking System to Railway with MySQL.

## Prerequisites Completed ✅
- Railway CLI installed
- Git repository ready
- All configuration files created

---

## Step-by-Step Deployment

### 1️⃣ Login to Railway (30 seconds)

Open your terminal:

```bash
cd odec-booking-system
railway login
```

**Action:** Your browser will open. Login with GitHub or email.

---

### 2️⃣ Initialize Project (30 seconds)

```bash
railway init
```

**Choose:**
- ✅ "Create new project"
- **Name:** ODEC Booking System
- ✅ "Empty project"

---

### 3️⃣ Add MySQL Database (30 seconds)

```bash
railway add
```

**Select:** `mysql` from the list

Railway will automatically provision the database.

---

### 4️⃣ Set Environment Variables (1 minute)

Run the automated script:

```bash
bash setup-railway-env.sh
```

This sets all 15+ required variables automatically!

---

### 5️⃣ Deploy Application (2 minutes)

```bash
railway up
```

Wait for:
- ✅ Dependencies installation
- ✅ Asset compilation
- ✅ Deployment
- ✅ Migrations

---

### 6️⃣ Generate Public URL (15 seconds)

```bash
railway domain
```

Copy the generated URL (e.g., `odec-booking-system-production.up.railway.app`)

---

### 7️⃣ Set APP_URL (15 seconds)

```bash
railway variables set APP_URL="https://YOUR-GENERATED-URL.up.railway.app"
```

Replace `YOUR-GENERATED-URL` with the URL from step 6.

---

### 8️⃣ Create Admin User (30 seconds)

```bash
railway run bash create-admin.sh
```

**Default Credentials:**
- **Email:** admin@odec.com
- **Password:** Admin123!

⚠️ Change password after first login!

---

## ✅ Deployment Complete!

Visit your URL: `https://YOUR-URL.up.railway.app`

You should see the ODEC Booking System login page!

---

## 🎯 Quick Verification

Test these features:

1. ✅ Homepage loads
2. ✅ Login with admin credentials
3. ✅ Access admin dashboard
4. ✅ View facilities
5. ✅ View activities
6. ✅ Check VR tours

---

## 🛠️ Useful Commands

| Task | Command |
|------|---------|
| View logs | `railway logs` |
| Restart app | `railway restart` |
| Run migrations | `railway run php artisan migrate` |
| Clear cache | `railway run php artisan cache:clear` |
| Access database | `railway run mysql` |
| Open dashboard | `railway open` |

---

## 🔧 Common Issues & Fixes

### Issue: "No project linked"

```bash
railway link
```

### Issue: MySQL connection fails

```bash
railway restart
```

### Issue: 500 error on site

```bash
railway logs
railway run php artisan config:clear
```

### Issue: Assets not loading

```bash
railway run php artisan storage:link --force
```

---

## 💡 Pro Tips

1. **Enable Notifications:** Railway Dashboard → Settings → Turn on deployment notifications

2. **Auto-Deploy from GitHub:**
   - Railway Dashboard → Settings → GitHub
   - Connect your repository
   - Every push auto-deploys!

3. **Monitor Costs:**
   - Railway Dashboard → Usage
   - Track your spending
   - Free tier: $5/month credit

4. **Backup Database:**
   ```bash
   railway run mysqldump > backup.sql
   ```

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **GitHub Issues:** Open an issue on your repository

---

## 📊 What Was Deployed?

✅ Laravel 11.x application
✅ MySQL 8.x database
✅ All database migrations
✅ Admin user account
✅ VR tour system
✅ Booking system
✅ Payment verification
✅ Announcement system

---

**Deployment Time:** ~5 minutes
**Cost:** ~$9/month (or free trial for 16 days)
**Status:** Production Ready 🎉

---

## 🎉 Success!

Your ODEC Booking System is now live on Railway!

Share your URL with users and start taking bookings! 🏕️
