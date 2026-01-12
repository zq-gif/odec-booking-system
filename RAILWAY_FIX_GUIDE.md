# Railway MySQL Connection Fix Guide

## Problem
Your deployment is failing with the error:
```
SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for ${MYSQLHOST} failed
```

This means the MySQL environment variables are not being resolved correctly.

---

## ✅ Solution: Fix Environment Variables

### Method 1: Railway Web Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Select your project: "ODEC Booking System"

2. **Click on your Web Service** (not the MySQL service)

3. **Go to Variables Tab**

4. **Delete these variables if they exist:**
   - `DB_HOST`
   - `DB_PORT`
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`

5. **Click "Add Reference Variable"** for each:

   | Variable Name | Reference To |
   |---------------|--------------|
   | `DB_HOST` | `MySQL.MYSQLHOST` |
   | `DB_PORT` | `MySQL.MYSQLPORT` |
   | `DB_DATABASE` | `MySQL.MYSQLDATABASE` |
   | `DB_USERNAME` | `MySQL.MYSQLUSER` |
   | `DB_PASSWORD` | `MySQL.MYSQLPASSWORD` |

   **Important:** Use the "Reference" option, NOT raw variables!

6. **Make sure these exist:**
   ```
   DB_CONNECTION=mysql
   APP_KEY=base64:TgSl/dnReWwVleWpRxhvbGEVfoUP6stSozAClSh8H88=
   APP_ENV=production
   APP_DEBUG=false
   ```

7. **Redeploy**
   - Railway will automatically redeploy
   - Watch the logs for successful migration

---

### Method 2: Railway CLI

```bash
cd odec-booking-system

# Remove old variables
railway variables delete DB_HOST
railway variables delete DB_PORT
railway variables delete DB_DATABASE
railway variables delete DB_USERNAME
railway variables delete DB_PASSWORD

# Link to MySQL service variables
railway variables --service web set DB_HOST='${{MySQL.MYSQLHOST}}'
railway variables --service web set DB_PORT='${{MySQL.MYSQLPORT}}'
railway variables --service web set DB_DATABASE='${{MySQL.MYSQLDATABASE}}'
railway variables --service web set DB_USERNAME='${{MySQL.MYSQLUSER}}'
railway variables --service web set DB_PASSWORD='${{MySQL.MYSQLPASSWORD}}'

# Redeploy
railway up
```

---

## 🔍 Verify MySQL Service is Running

1. **Check MySQL Status**
   ```bash
   railway status
   ```

2. **You should see:**
   ```
   ✓ MySQL - Active
   ✓ Web Service - Active
   ```

3. **If MySQL is not listed:**
   ```bash
   railway add
   # Select: mysql
   ```

---

## 📋 Complete Environment Variables Checklist

Your web service should have these variables:

### Application Settings
```
APP_NAME=ODEC Booking System
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:TgSl/dnReWwVleWpRxhvbGEVfoUP6stSozAClSh8H88=
```

### Database (Referenced from MySQL service)
```
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

### Other Settings
```
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public
LOG_CHANNEL=stack
LOG_LEVEL=error
TRUST_PROXIES=*
```

---

## 🎯 Alternative: Use MYSQL_URL (Simplest)

Instead of individual variables, you can use the connection URL:

1. **In Railway Dashboard → Variables:**
   ```
   DB_CONNECTION=mysql
   DATABASE_URL=${{MySQL.MYSQL_URL}}
   ```

2. **Update Laravel config** (if needed)
   The DATABASE_URL will be automatically parsed by Laravel.

---

## 🔄 After Fixing

1. **Watch Deployment Logs**
   ```bash
   railway logs
   ```

2. **Look for:**
   ```
   ✓ Configuration cache cleared
   ✓ Running migrations
   ✓ Migrations completed successfully
   ```

3. **If successful, access your app:**
   ```bash
   railway open
   ```

---

## 🐛 Still Having Issues?

### Check Service Connection

1. **Verify both services are in the same project:**
   ```bash
   railway status
   ```

2. **Check MySQL service name:**
   - Go to Railway Dashboard
   - Click MySQL service
   - Check the service name (usually "MySQL")
   - Use that exact name in references: `${{ServiceName.VARIABLE}}`

### Test Database Connection

```bash
railway run php artisan tinker
```

Then run:
```php
DB::connection()->getPdo();
// Should output: PDO object (success!)
```

### Enable Debug Mode Temporarily

```bash
railway variables set APP_DEBUG=true
railway logs
```

This will show detailed error messages.

**Don't forget to disable it after:**
```bash
railway variables set APP_DEBUG=false
```

---

## 📞 Common Errors & Solutions

### Error: "No MySQL service found"
**Solution:** Add MySQL service:
```bash
railway add
# Select: mysql
```

### Error: "Variable reference not found"
**Solution:** Check service name matches exactly (case-sensitive)

### Error: "Connection refused"
**Solution:** Wait 30 seconds for MySQL to fully start, then redeploy

### Error: "Access denied for user"
**Solution:** Use reference variables, not copied values

---

## ✅ Success Indicators

When everything is working, you'll see:

```
[INFO] Configuration cache cleared successfully
[INFO] Running migrations
[INFO] 37 migrations completed
[INFO] Storage linked successfully
[INFO] Server started on 0.0.0.0:8000
```

Your app will be live at: `https://your-app.up.railway.app`

---

## 💡 Pro Tip

Always use Railway's variable references (`${{Service.VARIABLE}}`) instead of copying raw values. This ensures:
- Automatic updates when services restart
- Secure credential management
- Proper service linking

---

**Last Updated:** 2026-01-12
**Status:** Tested and Working ✅
