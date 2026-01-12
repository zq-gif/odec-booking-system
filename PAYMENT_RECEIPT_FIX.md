# Payment Receipt Display Fix

## Issue
When visitors uploaded payment receipts for facility or activity bookings, the admin panel could not display the receipt images properly.

## Root Cause
The payment receipt paths were stored in the database in multiple formats:
1. **Local storage** (new uploads): `payment_receipts/FB-ABC12345_1234567890.jpg`
2. **Cloudinary URLs** (legacy): `https://res.cloudinary.com/xxx/image/upload/v123/payment_receipts/xxx.png`
3. **Already prefixed**: `/storage/payment_receipts/xxx.jpg`

The admin BookingController was passing the raw database path to the frontend without converting it to a proper URL, and was incorrectly adding `/storage/` prefix to full Cloudinary URLs, resulting in malformed URLs like `/storage/https://...`.

## Files Modified

### 1. [app/Http/Controllers/Admin/BookingController.php](app/Http/Controllers/Admin/BookingController.php) (Backend)

#### Changes Made:
1. Updated facility bookings mapping (lines 23-36):
   - Added logic to convert payment receipt paths to proper URLs
   - Handles three cases:
     - Full URLs (Cloudinary or external, starting with `http://` or `https://`)
     - Already prefixed paths (starting with `/storage/`)
     - Raw paths (adds `/storage/` prefix)

2. Updated activity bookings mapping (lines 65-78):
   - Same conversion logic as facility bookings

3. No additional imports needed - uses only built-in PHP functions

### 2. [resources/js/Pages/Admin/Bookings.jsx](resources/js/Pages/Admin/Bookings.jsx) (Frontend)

#### Changes Made:
1. **Line 68**: Removed `/storage/` prefix from download link
   - Changed from: `link.href = \`/storage/${receiptUrl}\`;`
   - Changed to: `link.href = receiptUrl;`

2. **Line 455**: Removed `/storage/` prefix from image src
   - Changed from: `src={\`/storage/${selectedReceipt.receiptUrl}\`}`
   - Changed to: `src={selectedReceipt.receiptUrl}`

3. **Line 486**: Removed `/storage/` prefix from "Open in New Tab" link
   - Changed from: `href={\`/storage/${selectedReceipt.receiptUrl}\`}`
   - Changed to: `href={selectedReceipt.receiptUrl}`

**Reason**: Backend now returns complete URLs with `/storage/` prefix already included, so frontend should not add it again.

## How It Works

### Before Fix
```php
'payment_receipt' => $booking->payment_receipt,
// Returns: "payment_receipts/FB-ABC12345_1234567890.jpg"
// Result: Image doesn't load (404 error)
```

### After Fix
```php
// Convert payment receipt path to URL
$receiptUrl = null;
if ($booking->payment_receipt) {
    // Check if it's a full URL (including Cloudinary URLs)
    if (str_starts_with($booking->payment_receipt, 'http://') ||
        str_starts_with($booking->payment_receipt, 'https://')) {
        // Already a full URL (Cloudinary or external)
        $receiptUrl = $booking->payment_receipt;
    } elseif (str_starts_with($booking->payment_receipt, '/storage/')) {
        // Already has /storage/ prefix
        $receiptUrl = $booking->payment_receipt;
    } else {
        // Convert to /storage/ URL
        $receiptUrl = '/storage/' . $booking->payment_receipt;
    }
}

'payment_receipt' => $receiptUrl,
// Examples:
// Input: "payment_receipts/FB-ABC12345.jpg" → Output: "/storage/payment_receipts/FB-ABC12345.jpg"
// Input: "https://res.cloudinary.com/.../receipt.png" → Output: "https://res.cloudinary.com/.../receipt.png"
// Input: "/storage/payment_receipts/FB-ABC12345.jpg" → Output: "/storage/payment_receipts/FB-ABC12345.jpg"
// Result: All images load correctly
```

## Why This Approach?

### Path Storage Format
Payment receipts are stored in the database as **relative paths** without the `/storage/` prefix:
- **FacilityBookingController.php line 71**: `$receiptPath = $path;`
- **ActivityBookingController.php line 67**: `$receiptPath = $path;`

This is consistent with other file uploads like:
- Facility images
- Activity images
- Announcements

However, those files are stored WITH the `/storage/` prefix when saved, while payment receipts are not.

### URL Conversion
The admin panel needs the full URL path to display images. The conversion logic:
1. Checks if it's already a full external URL (for backwards compatibility)
2. Checks if it already has `/storage/` prefix (for consistency)
3. Adds `/storage/` prefix if needed (main fix)

## Testing

### Test Payment Receipt Display
1. **Create a new booking**:
   - Go to facility or activity booking page
   - Fill in booking details
   - Upload a payment receipt (JPG, PNG, or PDF)
   - Submit the booking

2. **View in admin panel**:
   - Login as admin
   - Navigate to Bookings page
   - Find the booking you just created
   - Click to view booking details
   - **Expected**: Payment receipt image should display correctly

3. **Verify different scenarios**:
   - New uploads (path: `payment_receipts/filename.jpg`) → displays from local storage
   - Legacy Cloudinary URLs (path: `https://res.cloudinary.com/...`) → displays from Cloudinary
   - External URLs (path: `https://example.com/receipt.jpg`) → displays from external source
   - Already prefixed paths (path: `/storage/payment_receipts/filename.jpg`) → displays correctly

## Alternative Solutions Considered

### Option 1: Store with /storage/ prefix (NOT CHOSEN)
**Modify**: `FacilityBookingController.php` and `ActivityBookingController.php`
```php
$receiptPath = '/storage/' . $path; // Store with prefix
```
**Pros**: Consistent with other image uploads
**Cons**:
- Requires database migration for existing records
- Inconsistent with how `putFileAs` works
- Path stored in DB would be tied to web URL structure

### Option 2: Use Storage::url() helper (NOT CHOSEN)
```php
'payment_receipt' => Storage::disk('public')->url($booking->payment_receipt),
```
**Pros**: Laravel's recommended way
**Cons**:
- Returns full URL including domain (e.g., `https://web-production-67b67.up.railway.app/storage/...`)
- May cause issues with domain changes
- Doesn't work with external URLs

### Option 3: Frontend URL conversion (NOT CHOSEN)
**Modify**: Frontend Vue/React components
```javascript
const receiptUrl = receipt.startsWith('http') ? receipt : `/storage/${receipt}`;
```
**Pros**: No backend changes needed
**Cons**:
- Logic scattered across multiple components
- Harder to maintain
- Frontend shouldn't handle backend data inconsistencies

### ✅ Option 4: Backend URL conversion in controller (CHOSEN)
**Pros**:
- Centralized logic in one place
- Handles all edge cases (external URLs, already-prefixed paths)
- No database migration needed
- Works with existing data
- Frontend receives clean, ready-to-use URLs
**Cons**: None significant

## Deployment

### Railway Deployment
When deploying this fix to Railway:

1. **Push code to repository**:
   ```bash
   git add app/Http/Controllers/Admin/BookingController.php
   git commit -m "Fix payment receipt display in admin panel"
   git push
   ```

2. **Railway will automatically redeploy** with the fix

3. **No database changes needed** - works with existing data

4. **Test immediately** after deployment:
   - Create a test booking with payment receipt
   - Verify it displays in admin panel

### Local Development
1. **Pull latest changes**:
   ```bash
   git pull
   ```

2. **No additional steps needed** - the fix is code-only

## Summary

✅ **Fixed**: Payment receipts now display correctly in admin panel
✅ **Backwards compatible**: Works with existing database records (including legacy Cloudinary URLs)
✅ **Future proof**: Handles external URLs and different path formats
✅ **No migration needed**: Pure code fix
✅ **Cloudinary support**: Legacy Cloudinary URLs continue to work

**Date Fixed**: January 12, 2026
**Files Changed**: 2 files (1 backend controller, 1 frontend component)
**Backend Lines**: ~30 lines of path conversion logic
**Frontend Lines**: 3 lines (removed double prefix)
**Database Changes**: None required

### Important Note About Legacy Data
If you have existing bookings with Cloudinary URLs in the database (like `https://res.cloudinary.com/...`), those images will continue to display correctly even though you removed Cloudinary from new uploads. The fix properly handles all URL formats.

---

## Related Files

- [app/Http/Controllers/FacilityBookingController.php](app/Http/Controllers/FacilityBookingController.php) - Stores receipt paths
- [app/Http/Controllers/ActivityBookingController.php](app/Http/Controllers/ActivityBookingController.php) - Stores receipt paths
- [app/Http/Controllers/Admin/BookingController.php](app/Http/Controllers/Admin/BookingController.php) - **FIXED (Backend)** - Converts paths to URLs
- [resources/js/Pages/Admin/Bookings.jsx](resources/js/Pages/Admin/Bookings.jsx) - **FIXED (Frontend)** - Uses URLs directly
