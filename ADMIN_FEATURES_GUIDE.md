# Admin Features Implementation Guide

## Overview
A comprehensive admin panel has been implemented with full hotel management capabilities, image uploads, and other admin features.

## Features Implemented

### 1. **Admin Dashboard** (`/admin`)
- Main hub for all admin operations
- Quick statistics showing:
  - Total hotels count
  - Total bookings count
  - Total messages count
- Navigation cards to all admin features
- Future features placeholder for upcoming tools

### 2. **Hotel Management** (`/admin/hotels`)
- **Create Hotels**: Add new hotels with:
  - Basic info (name, city, location)
  - Pricing and rating
  - Category (Budget, Standard, Premium, Luxury)
  - Number of rooms and capacity
  - Description and amenities list
  - Image upload functionality
  - Contact information
  
- **View Hotels**: Display all hotels in a grid with:
  - Hotel image preview
  - Price and rating
  - Location
  - Category badge
  - Amenities tags
  
- **Edit Hotels**: Update hotel information and images
- **Delete Hotels**: Remove hotels with automatic image cleanup

### 3. **Bookings Management** (`/admin/bookings`)
- View all bookings in a table format
- Display booking details:
  - Guest information
  - Hotel name
  - Check-in and check-out dates
  - Number of rooms
  - Total price
  - Booking status (Confirmed, Cancelled, Pending)
- Quick statistics on booking summary

### 4. **Messages Management** (`/admin/messages`)
- Already implemented - manages contact form messages

## Backend Implementation

### Updated Models
**Hotel.js** - Enhanced with:
```javascript
- amenities[] // Array of strings
- images[] // Array of image URLs
- rooms // Number of rooms
- capacity // Total capacity
- category // Budget/Standard/Premium/Luxury
- contact // Phone and email
- createdBy // Reference to admin user
```

### New Files
- **config/multer.js** - File upload configuration
  - Image format validation (jpeg, jpg, png, gif, webp)
  - 5MB file size limit
  - Automatic directory creation

### Enhanced Controller (hotelController.js)
New endpoints:
- `getHotels()` - Get all hotels (public)
- `getHotelById(id)` - Get single hotel (public)
- `getHotelsByCity(cityName)` - Get hotels by city (public)
- `createHotel()` - Create new hotel (admin only)
- `updateHotel(id)` - Update hotel (admin only)
- `deleteHotel(id)` - Delete hotel with image cleanup (admin only)

### Updated Routes (routes/hotels.js)
```
GET    /api/hotels                    - Public
GET    /api/hotels/:id               - Public
GET    /api/hotels/city/:cityName    - Public
POST   /api/hotels                   - Admin only
PATCH  /api/hotels/:id               - Admin only
DELETE /api/hotels/:id               - Admin only
```

All admin routes require authentication + admin middleware

## Frontend Implementation

### New Pages
1. **AdminDashboard.jsx** - Main admin hub
2. **AdminHotelsPage.jsx** - Hotel management interface
3. **AdminBookingsPage.jsx** - Bookings management

### Updated API Client
Enhanced `hotelApi` with:
```javascript
list()              // Get all hotels
getById(id)         // Get single hotel
getByCity(cityName) // Get hotels by city
create(formData)    // Create hotel with image
update(id, formData) // Update hotel with image
delete(id)          // Delete hotel
```

### Updated Navbar
- Admin users see "Admin Panel" button
- Links to `/admin` dashboard

### Updated Routing (App.jsx)
New routes:
- `/admin` - Admin Dashboard
- `/admin/hotels` - Hotel Management
- `/admin/bookings` - Bookings Management
- `/admin/messages` - Messages Management (existing)

All admin routes require `ProtectedRoute` with `requireAdmin` flag

## Security

### Authentication & Authorization
- All admin endpoints protected with `authMiddleware` + `adminMiddleware`
- Only users with `isAdmin: true` in JWT can access admin routes
- Images only uploaded through authenticated admin routes
- File uploads validated (type + size)

### File Uploads
- Images stored in `/backend/uploads/` directory
- Old images automatically deleted when updated
- Images deleted when hotel is deleted
- 5MB file size limit per image
- Only image formats allowed: jpeg, jpg, png, gif, webp

## How to Use

### For Admin Users:
1. Access `/admin` from navbar (Admin Panel button)
2. From dashboard, choose the feature:
   - **Hotel Management** - Add/Edit/Delete hotels
   - **Bookings** - View all bookings
   - **Messages** - View contact messages

### Adding a Hotel:
1. Click "Add Hotel" button
2. Fill in hotel details
3. Select an image (optional)
4. Click "Create Hotel"

### Editing a Hotel:
1. Click "Edit" button on hotel card
2. Modify details
3. Upload new image if needed
4. Click "Update Hotel"

### Deleting a Hotel:
1. Click "Delete" button on hotel card
2. Confirm deletion
3. Hotel and associated images are removed

## Environment Variables Required
- `JWT_SECRET` - For token generation
- `MONGODB_URI` - Database connection
- `PORT` - Server port (default 5000)

## Directory Structure
```
backend/
  config/
    multer.js           (NEW - File upload config)
  uploads/              (NEW - Image storage)
    hotel-*.jpg
    hotel-*.png
    etc.
  models/
    Hotel.js            (UPDATED - Enhanced schema)
  controllers/
    hotelController.js  (UPDATED - New CRUD endpoints)
  routes/
    hotels.js           (UPDATED - New admin routes)
    
frontend/
  src/
    pages/
      AdminDashboard.jsx      (NEW)
      AdminHotelsPage.jsx     (NEW)
      AdminBookingsPage.jsx   (NEW)
    components/
      Navbar.jsx              (UPDATED - Admin link)
    App.jsx                    (UPDATED - New routes)
    lib/
      api.js                   (UPDATED - Hotel endpoints)
```

## Future Features to Add
1. **User Management** - Manage user roles and permissions
2. **Reviews Management** - Moderate and manage user reviews
3. **Analytics** - Detailed analytics and reports
4. **System Settings** - Configure platform settings
5. **Cities Management** - Add/Edit/Delete cities
6. **Attractions Management** - Add/Edit/Delete attractions
7. **Bulk Operations** - Upload multiple hotels via CSV
8. **Export Reports** - Export bookings and data to CSV/PDF

## API Response Examples

### Create Hotel Success
```json
{
  "message": "Hotel created successfully",
  "hotel": {
    "_id": "...",
    "name": "Luxury Resort",
    "cityName": "Paris",
    "location": "Champs-Élysées",
    "price": 250,
    "rating": 4.8,
    "rooms": 50,
    "capacity": 150,
    "category": "Luxury",
    "imageUrl": "/uploads/hotel-1234567890.jpg",
    "amenities": ["WiFi", "Pool", "Gym"],
    "createdBy": {...}
  }
}
```

### Admin Routes Protection
All admin routes return 403 Forbidden if user is not admin:
```json
{
  "message": "Access denied. Admin privileges required."
}
```

## Testing the Features

1. **Create Admin User**:
   ```bash
   node backend/make_admin.js
   ```

2. **Login as Admin** and navigate to `/admin`

3. **Add a Hotel**:
   - Fill form with test data
   - Upload an image
   - Check `/uploads` folder for image

4. **Test Image Upload**:
   - Add hotel with image
   - Navigate to image URL in browser
   - Should display correctly

5. **Test CRUD Operations**:
   - Create hotel ✓
   - Read all hotels ✓
   - Update hotel ✓
   - Delete hotel ✓

## Troubleshooting

### Images not uploading
- Check `/backend/uploads/` folder exists
- Verify multer configuration in `config/multer.js`
- Ensure image file is under 5MB
- Check allowed image formats

### Admin routes return 403
- Ensure user has `isAdmin: true` in JWT token
- Check token is being sent with Authorization header
- Use `node backend/make_admin.js` to grant admin privileges

### Multer module not found
- Run `npm install multer` in backend directory
- Check backend/package.json includes multer

## Notes
- All hotel images are stored locally in `/backend/uploads/`
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- File cleanup is automatic when hotels are deleted
- Admin middleware checks `isAdmin` flag in JWT token
