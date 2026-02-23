# 🎨 Gramora - AI Instagram Content Generator

**An intelligent platform for creating, managing, and publishing Instagram content powered by AI.**

Generate captions, hashtags, and post content automatically using Google Gemini AI, then publish directly to Instagram with secure MongoDB-backed user authentication.

---

## 🚀 Quick Start

### **Backend Setup**

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5002`

### **Frontend Setup**

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📋 Project Structure

```
Gramora/
├── backend/              # Node.js Express API server
│   ├── models/          # MongoDB schemas (User, Post)
│   ├── routes/          # API endpoints
│   ├── config/          # Database configuration
│   ├── services/        # Business logic (AI, Instagram)
│   └── README.md        # Detailed backend docs
├── Frontend/            # React + Vite frontend
│   ├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   └── services/        # API integration
├── android/             # Android app
├── ios/                 # iOS app
└── README.md            # This file
```

---

## ✨ Features

### 🔐 Authentication
- ✅ Secure user signup & login
- ✅ bcrypt password hashing
- ✅ MongoDB user storage
- ✅ Email & username uniqueness validation

### 🤖 AI Content Generation
- ✅ AI-powered caption generation (Google Gemini)
- ✅ Smart hashtag suggestions
- ✅ Content idea processing
- ✅ Segment-based content optimization

### 📸 Instagram Integration
- ✅ Direct Instagram API posting
- ✅ Cloudinary image hosting
- ✅ Media container management
- ✅ Automatic publishing

### 📱 Multi-Platform
- ✅ Web (React + Vite)
- ✅ Android (Capacitor)
- ✅ iOS (Capacitor)
- ✅ Backend API (Node.js)

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** bcrypt
- **AI:** Google Generative AI (Gemini)
- **Image Hosting:** Cloudinary
- **Social Media:** Instagram Graph API

### **Frontend**
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS3
- **HTTP Client:** Fetch API
- **State:** React Hooks
- **Authentication:** Firebase (optional)

### **Mobile**
- **Framework:** Capacitor
- **Platforms:** Android & iOS
- **Base:** Web (React)

---

## 🔌 API Endpoints

### **Authentication**
- `POST /signup` - Create new user
- `POST /login` - User login

### **Content Generation**
- `POST /api/generate` - Generate captions & hashtags
- `POST /api/generateHashtag` - Generate hashtags only

### **Content Management**
- `POST /api/upload` - Save post to database
- `POST /api/instagram/upload` - Publish to Instagram

### **Health**
- `GET /health` - Server health check
- `GET /api/ping` - API ping test

---

## 📖 Documentation

### **Backend**
For detailed backend setup, API documentation, and testing guides:
→ **[Backend README](backend/README.md)**

### **Database Setup**
Complete MongoDB setup and configuration:
→ **[MongoDB Setup Guide](backend/MONGODB_SETUP.md)**

### **Authentication Verification**
Test results and API verification report:
→ **[Auth Verification Report](backend/AUTH_VERIFICATION_REPORT.md)**

---

## ⚙️ Configuration

### **Environment Variables**

Create `.env` in backend folder:

```env
# Server
PORT=5002

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gramora

# APIs
GEMINI_API_KEY=your_key
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_secret
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_USER_ID=your_user_id
```

---

## 🧪 Testing

### **Test Login Endpoint**

```powershell
$body = @{email="user@example.com"; password="SecurePass123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5002/login" `
  -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
```

### **Check Database Users**

```bash
cd backend
node listUsers.js
```

---

## 🚀 Deployment

### **Backend (Heroku/Railway)**
```bash
cd backend
npm install
npm start
```

### **Frontend (Vercel/Netlify)**
```bash
cd Frontend
npm install
npm run build
# Deploy 'dist' folder
```

---

## 📊 Current Database Status

✅ **MongoDB Connected:** gramora database
✅ **Users Collection:** 4 users stored
✅ **Authentication:** Working & tested
✅ **Password Security:** bcrypt hashing enabled

See: `node backend/listUsers.js`

---

## 🐛 Troubleshooting

### Backend Issues
→ See [Backend README - Troubleshooting](backend/README.md#-troubleshooting)

### Database Connection
→ See [MongoDB Setup Guide](backend/MONGODB_SETUP.md)

### API Testing
→ See [Backend README - Testing APIs](backend/README.md#-testing-apis)

---

## 🔄 Development Workflow

### **1. Start Backend**
```bash
cd backend
npm run dev
```

### **2. Start Frontend**
```bash
cd Frontend
npm run dev
```

### **3. Test APIs**
- Use Postman or PowerShell scripts
- Check responses in browser console
- Monitor server logs

### **4. Build for Production**
```bash
# Backend
cd backend && npm start

# Frontend
cd Frontend && npm run build
```

---

## 📝 Git Commands

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Add your changes"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request
# (on GitHub)
```

---

## 📞 Support & Resources

- **Backend Setup:** [Backend README](backend/README.md)
- **Database Guide:** [MongoDB Setup](backend/MONGODB_SETUP.md)
- **API Tests:** [Auth Verification](backend/AUTH_VERIFICATION_REPORT.md)
- **Issues:** Check troubleshooting sections

---

## 📜 License

MIT License

---

## 👥 Contributors

- Team Gramora

---

**Status:** ✅ Production Ready
**Last Updated:** February 23, 2026
**MongoDB:** ✅ Connected
**Server:** ✅ Running on Port 5002
