# MongoDB Setup & Auth Verification

## ✅ Configuration Status

### 1. MongoDB Connection
- **URI**: Located in `.env` → `MONGODB_URI`
- **Status**: Connected to MongoDB Atlas
- **Database**: `gramora`
- **Connection in**: `index.js` (lines 32-38)

### 2. Dependencies
- ✅ `mongoose` - ^8.0.0
- ✅ `bcrypt` - ^5.1.1
- ✅ Both installed in package.json

### 3. User Model
**File**: `models/User.js`
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  createdAt: Date (auto-timestamp)
}
```

## 📝 Auth Routes

### Signup Endpoint
**POST** `/signup`
```json
Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (Success - 201):
{
  "success": true,
  "message": "Signup successful",
  "user": {
    "id": "ObjectId",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2026-02-23T..."
  }
}

Response (Error - 409):
{
  "success": false,
  "message": "User already exists"
}
```

### Login Endpoint
**POST** `/login`
```json
Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (Success - 200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "ObjectId",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2026-02-23T..."
  }
}

Response (Error - 401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

## 🚀 Running the Server

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev
```

**Expected Output**:
```
✅ Connected to MongoDB Atlas
✅ Server running on port 5002
```

## 📊 Testing Auth Routes

### Using cURL
```bash
# Signup
curl -X POST http://localhost:5002/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5002/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Using Postman
1. Create POST request to `http://localhost:5002/signup`
2. Set header: `Content-Type: application/json`
3. Set body (raw):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}
```

## 🔒 Security Features Implemented

✅ **Password Hashing**: bcrypt with salt rounds = 10
✅ **Unique Validation**: Username and email must be unique in database
✅ **Input Validation**: All fields required before processing
✅ **Error Handling**: Proper HTTP status codes (201, 400, 401, 409, 500)
✅ **Database Protection**: Never returns hashed password in responses

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check `.env` for valid `MONGODB_URI`
- Ensure MongoDB Atlas cluster is active
- Verify IP whitelist in MongoDB Atlas

### Port Already in Use
```bash
# Change PORT in .env (default: 5002)
PORT=5003
```

### Duplicate User Error
- Username or email already exists in MongoDB
- Check the MongoDB collection `users` directly

## 📱 Frontend Integration

The frontend should:
1. Send login credentials to `/login` endpoint
2. Receive user object with ID and email
3. Store user info in localStorage or session
4. Use user ID for subsequent API calls

Example:
```javascript
const response = await fetch('http://localhost:5002/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
if (data.success) {
  localStorage.setItem('user', JSON.stringify(data.user));
}
```

## 📌 Notes

- Two auth implementations exist: inline in `index.js` and separate `auth.js` route file
- Both have been updated with user data in responses
- Consider consolidating to single route file for cleaner code
- Future: Add JWT token support for persistent authentication
