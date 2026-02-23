# 🚀 Gramora Backend - API Documentation

**A Node.js + Express backend for AI-powered Instagram content generation with MongoDB authentication.**

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Testing APIs](#testing-apis)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

✅ **User Authentication**
- Secure signup with bcrypt password hashing
- Login with email/password validation
- MongoDB user storage with unique constraints

✅ **Content Generation**
- AI-powered caption generation (Google Gemini)
- Hashtag generation for posts
- Content idea processing

✅ **Instagram Integration**
- Direct Instagram API posting
- Cloudinary image hosting
- Media container creation

✅ **Database**
- MongoDB Atlas integration
- Mongoose ODM
- User and Post models

---

## 📦 Prerequisites

- **Node.js** v14+ or v16+
- **npm** v6+
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image hosting)
- **Google Gemini API** key
- **Instagram Developer** account (for posting)

---

## 🔧 Installation

### 1. **Clone the Repository**

```bash
git clone <repository-url>
cd Gramora/backend
```

### 2. **Install Dependencies**

```bash
npm install
```

**Installed Packages:**
```
- express: Web framework
- mongoose: MongoDB ODM
- bcrypt: Password hashing
- dotenv: Environment variables
- cloudinary: Image hosting
- @google/generative-ai: AI content generation
- cors: Cross-origin resource sharing
- multer: File uploads
```

### 3. **Create `.env` File**

Copy environment template and add your credentials:

```env
# Server
PORT=5002

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gramora

# API Keys
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Instagram
INSTAGRAM_ACCESS_TOKEN=your_ig_token
INSTAGRAM_USER_ID=your_ig_user_id
```

---

## 🚀 Running the Server

### **Development Mode (with auto-reload)**

```bash
npm run dev
```

Requires `nodemon` (already installed)

### **Production Mode**

```bash
npm start
```

### **Expected Output**

```
✅ Connected to MongoDB Atlas
✅ Server running on port 5002
```

---

## 🔌 API Endpoints

### **Authentication Routes**

#### **📝 Signup**

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (201):**
```json
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
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

#### **🔑 Login**

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
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
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### **Content Generation Routes**

#### **💡 Generate Content**

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "idea": "Travel photography tips",
  "segment": "photography"
}
```

**Response:**
```json
{
  "captions": ["Caption 1", "Caption 2", ...],
  "hashtags": ["#travel", "#photography", ...]
}
```

---

#### **#️⃣ Generate Hashtags Only**

**Endpoint:** `POST /api/generateHashtag`

**Request Body:**
```json
{
  "idea": "Fashion trends",
  "segment": "fashion"
}
```

**Response:**
```json
{
  "hashtags": ["#fashion", "#trend", ...]
}
```

---

### **Upload Routes**

#### **📸 Upload Post**

**Endpoint:** `POST /api/upload`

**Request Body:**
```json
{
  "idea": "Summer vibes",
  "caption": "Enjoying the sunshine ☀️",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post received",
  "id": "ObjectId"
}
```

---

#### **📱 Upload to Instagram**

**Endpoint:** `POST /api/instagram/upload`

**Request (Form Data):**
- `image`: File upload
- `caption`: Post caption

**Response:**
```json
{
  "success": true,
  "publishData": { ... }
}
```

---

### **Health Check**

**Endpoint:** `GET /health`

**Response:**
```json
{ "ok": true }
```

---

## 🗄️ Database Setup

### **MongoDB Atlas Setup**

1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create a cluster (free tier available)
3. Get connection string: `mongodb+srv://...`
4. Add to `.env` as `MONGODB_URI`

### **User Model**

**File:** `models/User.js`

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date (auto-timestamp)
}
```

### **Post Model**

**File:** `models/Post.js`

```javascript
{
  idea: String,
  content: String,
  imageUrl: String,
  createdAt: Date
}
```

### **Check Database**

Run utility to see all users:

```bash
node listUsers.js
```

**Output:**
```
✅ Connected to MongoDB Atlas (gramora database)
📋 Collections found:
  ✓ users
  ✓ posts

👥 Total users in database: 4

📝 All users (without passwords):
  1. Username: rithvik, Email: rithvik@example.com
  2. Username: testuser, Email: test@example.com
  ...
```

---

## 🧪 Testing APIs

### **1. Using PowerShell**

**Test Signup:**
```powershell
$ProgressPreference = 'SilentlyContinue'
$body = @{
  username = "john_doe"
  email = "john@example.com"
  password = "SecurePass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5002/signup" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Test Login:**
```powershell
$body = @{
  email = "john@example.com"
  password = "SecurePass123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5002/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### **2. Using cURL**

```bash
# Signup
curl -X POST http://localhost:5002/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:5002/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'

# Health Check
curl http://localhost:5002/health
```

### **3. Using Postman**

1. Import or create requests
2. Method: `POST`
3. Body: `raw` → `JSON`
4. Add your test data
5. Send request

### **4. Using Thunder Client (VS Code)**

1. Install extension
2. Create request → POST
3. URL: `http://localhost:5002/signup`
4. Body → JSON
5. Send

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection config
├── models/
│   ├── User.js              # User schema & model
│   └── Post.js              # Post schema & model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── instagramRoutes.js   # Instagram API routes
│   └── controllers/
│       └── instagramController.js
├── services/
│   ├── utils/
│   │   ├── aiService.js     # AI content generation
│   │   └── upload.js        # Upload utilities
│   └── instagramService.js
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── index.js                 # Main server entry
├── package.json             # Dependencies
├── listUsers.js             # Database utility
└── checkDB.js               # Database checker
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5002` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `CLOUD_NAME` | Cloudinary cloud name | `dja37lluh` |
| `CLOUD_API_KEY` | Cloudinary API key | `218569838633147` |
| `CLOUD_API_SECRET` | Cloudinary API secret | `0KBk82rT...` |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram API token | `EAAA...` |
| `INSTAGRAM_USER_ID` | Instagram user ID | `1220970485...` |

---

## 🔒 Security Features

✅ **Password Hashing** - bcrypt with 10 salt rounds
✅ **Unique Constraints** - Username & email must be unique
✅ **Input Validation** - All fields required
✅ **CORS Enabled** - Cross-origin requests allowed
✅ **Error Handling** - Proper HTTP status codes
✅ **No Password Exposure** - Never returned in responses

---

## 📊 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Login successful |
| `201` | Created | User signup successful |
| `400` | Bad Request | Missing fields |
| `401` | Unauthorized | Invalid credentials |
| `409` | Conflict | User already exists |
| `500` | Server Error | Database connection failed |

---

## 🐛 Troubleshooting

### **MongoDB Connection Failed**

**Error:** `MongoDB connection error: getaddrinfo ENOTFOUND`

**Solution:**
1. Check `.env` has valid `MONGODB_URI`
2. Verify MongoDB cluster is active
3. Check IP whitelist in MongoDB Atlas
4. Test connection: `node listUsers.js`

### **Port Already in Use**

**Error:** `Error: listen EADDRINUSE: address already in use :::5002`

**Solution:**
```bash
# Find and kill process using port 5002
netstat -ano | findstr :5002
taskkill /PID <PID> /F

# Or change port in .env
PORT=5003
```

### **User Already Exists**

Signup with same email/username returns 409.

**Solution:**
- Use unique email and username
- Or check database: `node listUsers.js`

### **Invalid Credentials**

Login with wrong password returns 401.

**Solution:**
- Verify email exists in database
- Check password is correct
- Try: `node listUsers.js` to see users

### **CORS Errors**

**Error:** `No 'Access-Control-Allow-Origin' header`

**Solution:** Already enabled in `index.js`:
```javascript
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
```

---

## 🔄 Future Enhancements

- [ ] JWT token authentication
- [ ] Email verification
- [ ] Password reset flow
- [ ] Rate limiting for APIs
- [ ] Two-factor authentication
- [ ] Refresh tokens
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Testing suite (Jest)
- [ ] Docker containerization

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review [AUTH_VERIFICATION_REPORT.md](AUTH_VERIFICATION_REPORT.md)
3. Check [MONGODB_SETUP.md](MONGODB_SETUP.md)

---

**Last Updated:** February 23, 2026
**Server Status:** ✅ Production Ready
**Database:** ✅ MongoDB Atlas Connected
