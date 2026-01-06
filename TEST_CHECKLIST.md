# UMS Beach Booking System - Manual Testing Checklist

Use this checklist to perform manual testing of the application. Check off items as you complete them.

## 🔐 AUTHENTICATION TESTING

### Registration
- [ ] Navigate to http://127.0.0.1:8000/register
- [ ] Verify beach-themed UI (orange/amber colors)
- [ ] Fill in registration form:
  - Name: Test User
  - Email: testuser@example.com
  - Password: password123
  - Confirm Password: password123
- [ ] Click "Create Account"
- [ ] Verify email verification page appears
- [ ] Check that user exists in database

### Login
- [ ] Navigate to http://127.0.0.1:8000/login
- [ ] Verify "Welcome Back!" header
- [ ] Enter credentials:
  - Email: testuser@example.com
  - Password: password123
- [ ] Click "Log in"
- [ ] Verify redirect to dashboard (http://127.0.0.1:8000/dashboard)

### Logout
- [ ] Click user dropdown (top right)
- [ ] Click "Log Out"
- [ ] Verify redirect to home page

---

## 🏖️ USER DASHBOARD TESTING

### Dashboard Display
- [ ] Login and navigate to dashboard
- [ ] Verify welcome message shows your name
- [ ] Verify 4 quick action cards are visible:
  1. Browse Facilities
  2. Book Your Stay
  3. Virtual Tour
  4. My Reservations
- [ ] Verify VR Tour section (purple/indigo gradient)
- [ ] Verify notifications section
- [ ] Verify "Special Beach Package" banner at bottom
- [ ] Check responsive design (resize browser window)

### Quick Actions
- [ ] Click "Browse Facilities" - should navigate to /facilities
- [ ] Go back, click "Book Your Stay" - should navigate to /book-facility
- [ ] Go back, click "Virtual Tour" - should navigate to /vr-tour
- [ ] Go back, click "My Reservations" - should navigate to /my-bookings

---

## 🏢 FACILITY MANAGEMENT TESTING

### Browse Facilities
- [ ] Navigate to http://127.0.0.1:8000/facilities
- [ ] Verify list of facilities displays
- [ ] Check that each facility shows:
  - Name
  - Description
  - Capacity
  - Price per hour
  - Photo (if any)
- [ ] Test search/filter functionality (if implemented)

### Book Facility
- [ ] Navigate to http://127.0.0.1:8000/book-facility
- [ ] Select a facility from dropdown
- [ ] Choose booking date (future date)
- [ ] Select start time (e.g., 14:00)
- [ ] Select end time (e.g., 16:00)
- [ ] Verify price calculation updates
- [ ] Add number of guests
- [ ] Click "Confirm Booking"
- [ ] Verify success message appears
- [ ] Verify booking appears in "My Bookings"

### My Bookings
- [ ] Navigate to http://127.0.0.1:8000/my-bookings
- [ ] Verify your booking appears in the list
- [ ] Check booking details:
  - Reference number
  - Facility name
  - Date and time
  - Status (confirmed/pending)
  - Total amount

---

## 🎯 ACTIVITY BOOKING TESTING

### Browse Activities
- [ ] Navigate to http://127.0.0.1:8000/book-activity
- [ ] Verify list of activities displays
- [ ] Check activity details visible

### Book Activity
- [ ] Select an activity
- [ ] Choose number of participants
- [ ] Select date
- [ ] Verify price calculation
- [ ] Click "Confirm Booking"
- [ ] Verify booking confirmation
- [ ] Check booking in "My Bookings"

---

## 🥽 VR TOUR TESTING

### Desktop VR Tour
- [ ] Login to dashboard
- [ ] Scroll to "Virtual Reality Beach Tour" section
- [ ] Click "Start VR Tour" button
- [ ] Verify new window/tab opens
- [ ] Verify A-Frame VR tour loads (http://127.0.0.1:8000/vr-tour/index.html)
- [ ] Test navigation (WASD keys or mouse drag)
- [ ] Test scene transitions
- [ ] Test interactive hotspots
- [ ] Test fullscreen mode

### Mobile VR Tour
- [ ] Open http://127.0.0.1:8000 on mobile device
- [ ] Login to account
- [ ] Navigate to dashboard
- [ ] Click "Start VR Tour"
- [ ] Allow device orientation access
- [ ] Move phone to look around
- [ ] Verify gyroscope controls work
- [ ] Test touch navigation
- [ ] Test scene switching

---

## 👨‍💼 ADMIN DASHBOARD TESTING

### Admin Login
- [ ] Logout if logged in
- [ ] Login with admin credentials:
  - Email: admin@example.com (or your admin email)
  - Password: (your admin password)
- [ ] Navigate to http://127.0.0.1:8000/admin/dashboard
- [ ] Verify admin dashboard loads

### User Management
- [ ] Navigate to http://127.0.0.1:8000/admin/users
- [ ] Verify list of users displays
- [ ] Test user search/filter
- [ ] Click on a user to view details
- [ ] Test edit user functionality
- [ ] Test delete user (use test user only!)

### Facility Management
- [ ] Navigate to http://127.0.0.1:8000/admin/facilities
- [ ] Click "Add New Facility"
- [ ] Fill in facility details:
  - Name: Test Facility
  - Description: Test description
  - Capacity: 10
  - Price: 50.00
- [ ] Save facility
- [ ] Verify facility appears in list
- [ ] Edit the facility
- [ ] Delete the facility

### Booking Management
- [ ] Navigate to http://127.0.0.1:8000/admin/bookings
- [ ] Verify all bookings display
- [ ] Test filtering by date
- [ ] Test filtering by status
- [ ] Click on a booking to view details
- [ ] Test booking confirmation (if pending)
- [ ] Test booking cancellation

### Activity Management
- [ ] Navigate to http://127.0.0.1:8000/admin/activities
- [ ] Test CRUD operations for activities
- [ ] Verify activity status changes

### Staff Management
- [ ] Navigate to http://127.0.0.1:8000/admin/staff
- [ ] Test staff member CRUD operations

### Maintenance Management
- [ ] Navigate to http://127.0.0.1:8000/admin/maintenance
- [ ] Test maintenance record management

### Issue Reports
- [ ] Navigate to http://127.0.0.1:8000/admin/issues
- [ ] View reported issues
- [ ] Test issue resolution workflow

### Feedback
- [ ] Navigate to http://127.0.0.1:8000/admin/feedback
- [ ] View user feedback
- [ ] Test feedback filtering

---

## 📱 RESPONSIVE DESIGN TESTING

### Mobile (< 640px)
- [ ] Resize browser to mobile width or use Chrome DevTools
- [ ] Test navigation menu (hamburger menu)
- [ ] Verify all pages are scrollable
- [ ] Check that buttons are touch-friendly
- [ ] Verify forms are usable on mobile
- [ ] Test VR tour on mobile

### Tablet (640px - 1024px)
- [ ] Resize browser to tablet width
- [ ] Test grid layouts adapt correctly
- [ ] Verify navigation works
- [ ] Check form layouts

### Desktop (> 1024px)
- [ ] Test on full desktop width
- [ ] Verify multi-column layouts
- [ ] Check hover effects work
- [ ] Verify dashboard grid layout

---

## 🎨 UI/UX TESTING

### Theme Consistency
- [ ] Welcome page - Orange/amber theme
- [ ] Login page - Beach theme with gradients
- [ ] Register page - Beach theme
- [ ] Dashboard - Orange/amber throughout
- [ ] All forms - Consistent button styling
- [ ] Admin pages - Theme applied

### Navigation
- [ ] Test all navigation links work
- [ ] Verify breadcrumbs (if implemented)
- [ ] Test back button behavior
- [ ] Verify active state on nav items

### Forms
- [ ] Test all form validations
- [ ] Verify error messages display
- [ ] Test success messages
- [ ] Check date/time pickers work
- [ ] Verify dropdown selections

---

## 🔒 SECURITY TESTING

### Authentication
- [ ] Try accessing /dashboard without login - should redirect to login
- [ ] Try accessing /admin without admin role - should deny access
- [ ] Try accessing /api endpoints without auth - should return 401

### CSRF Protection
- [ ] Verify all forms have CSRF tokens
- [ ] Test form submission without token (should fail)

### Input Validation
- [ ] Try submitting empty forms - should show errors
- [ ] Try invalid email formats - should reject
- [ ] Try SQL injection in inputs - should be sanitized
- [ ] Try XSS attacks - should be escaped

---

## ⚡ PERFORMANCE TESTING

### Page Load Times
- [ ] Measure welcome page load time
- [ ] Measure dashboard load time
- [ ] Measure facility list load time
- [ ] Verify VR tour loads within 5 seconds

### Database Queries
- [ ] Check for N+1 query problems
- [ ] Verify eager loading is used
- [ ] Test with 100+ bookings

---

## 🐛 BUG VERIFICATION

### Fixed Bugs
- [ ] Test facility booking - should work (TIME field bug fixed)
- [ ] Verify no cache table errors (using file cache now)
- [ ] Verify queue operations work (using sync driver)

---

## ✅ ACCEPTANCE CRITERIA

Before marking system as production-ready, verify:
- [ ] All authentication flows work correctly
- [ ] Bookings can be created, viewed, and managed
- [ ] VR tour works on both desktop and mobile
- [ ] Admin can manage all resources
- [ ] No console errors in browser
- [ ] No PHP errors in logs
- [ ] Responsive design works on all devices
- [ ] Theme is consistent across all pages
- [ ] Email notifications work (if configured)
- [ ] Database relationships are correct

---

## 📊 TEST RESULTS

**Date Tested:** _________________

**Tester:** _________________

**Overall Status:** ⬜ PASS  ⬜ FAIL  ⬜ NEEDS FIXES

**Critical Issues Found:** _________________

**Notes:**
_________________
_________________
_________________

---

## 🔧 TROUBLESHOOTING

### Server Not Starting
```bash
cd C:\Odec\OdecBookingSystem\odec-booking-system
php artisan serve
```

### Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### Rebuild Assets
```bash
npm run build
```

### Database Issues
```bash
php artisan migrate:fresh --seed
```

### Check Logs
- Laravel: `storage/logs/laravel.log`
- Browser: F12 > Console tab

---

**Testing URL:** http://127.0.0.1:8000

**Good luck with testing! 🚀**