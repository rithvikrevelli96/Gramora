# Gramora Frontend

**AI Instagram Content Generator - React + Vite**

A modern, responsive web application for creating and managing Instagram content powered by AI. Built with React 18 and Vite for fast development and optimized production builds.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** v6 or higher
- **Backend** running on `http://localhost:5002` (see [Backend README](../backend/README.md))

### Setup

1. **Install dependencies:**
```bash
cd Frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Windows PowerShell Users

If you encounter PowerShell execution policy errors, run this command as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt (cmd.exe) instead of PowerShell.

---

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
│   └── textures/          # Texture files
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Button.jsx
│   │   ├── Chat.jsx
│   │   ├── FormCard.jsx
│   │   ├── InputField.jsx
│   │   ├── Logo.jsx
│   │   ├── PostForm.jsx
│   │   ├── Register.jsx
│   │   ├── UploadPost.jsx
│   │   └── MyComponent.jsx
│   ├── pages/             # Page components
│   │   ├── ContentCreationPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   └── WelcomePage.jsx
│   ├── styles/            # CSS stylesheets
│   │   ├── ContentCreationPage.css
│   │   ├── DashboardPage.css
│   │   ├── LoginPage.css
│   │   ├── SignupPage.css
│   │   └── WelcomePage.css
│   ├── hooks/             # Custom React hooks
│   │   └── useSocket.js
│   ├── utils/             # Utility functions
│   │   ├── api.js         # API configuration
│   │   ├── saveTOFirestore.js
│   │   └── uploadToCloudinary.js
│   ├── services/          # API services
│   │   └── authService.js # Authentication service
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Vite entry point
│   ├── firebase.js        # Firebase configuration
│   └── index.css           # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── capacitor.config.json  # Capacitor config (mobile)
└── README.md              # This file
```

---

## 📦 Available Scripts

### Development
```bash
npm run dev              # Start development server (auto-reload)
npm run preview          # Preview production build
```

### Production
```bash
npm run build            # Build for production
npm run install-deps     # Install dependencies
```

### Mobile (Capacitor)
```bash
npm run build            # Build web assets
npx cap add ios          # Add iOS
npx cap add android      # Add Android
npx cap open ios         # Open iOS Xcode
npx cap open android     # Open Android Studio
```

---

## 🔌 API Configuration

### Backend Connection
The frontend connects to the backend API at `http://localhost:5002`

**Configure in:** `src/utils/api.js` or `src/services/authService.js`

### Environment Variables

Create `.env` file in Frontend folder:

```env
VITE_API_URL=http://localhost:5002
VITE_FIREBASE_CONFIG=your_firebase_config
```

### API Base URL

Update if backend runs on different port:

```javascript
// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
```

---

## 🎨 Key Pages

### **WelcomePage**
- Landing page with project description
- Navigation to login/signup
- Features overview

### **SignupPage**
- User registration form
- Email & password validation
- Stored in MongoDB via backend

### **LoginPage**
- User authentication
- Email & password login
- Session storage with user data

### **DashboardPage**
- Main user dashboard
- Content overview
- Post management

### **ContentCreationPage**
- AI-powered content generation
- Caption suggestions
- Hashtag generation
- Image upload support

---

## 🔐 Authentication

### Using AuthService

```javascript
import { signup, login, logout, getCurrentUser } from '../services/authService';

// Sign up
const result = await signup('username', 'email@example.com', 'password');

// Log in
const result = await login('email@example.com', 'password');

// Get current user
const user = getCurrentUser();

// Log out
logout();
```

### Features
- ✅ Secure password hashing (bcrypt)
- ✅ Email uniqueness validation
- ✅ JWT token support (optional)
- ✅ Local storage persistence
- ✅ Error handling

---

## 🛠️ Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite 5
- **HTTP Client:** Fetch API
- **Styling:** CSS3
- **State Management:** React Hooks (useState, useContext)
- **Authentication:** Services-based (authService.js)
- **Backend Connection:** REST API
- **Database:** MongoDB (via backend)
- **Mobile:** Capacitor (optional)
- **Image Hosting:** Cloudinary

---

## 🚀 Development Workflow

### **1. Start Backend**
```bash
cd ../backend
npm run dev
```

### **2. Start Frontend**
```bash
cd Frontend
npm run dev
```

### **3. Access App**
- Web: http://localhost:5173
- API: http://localhost:5002

### **4. Test Features**
1. Navigate to SignupPage
2. Create account (saved to MongoDB)
3. Login with credentials
4. Access DashboardPage
5. Create content with AI generation

---

## 📱 Mobile Development (Capacitor)

### Setup iOS
```bash
npm run build
npx cap add ios
npx cap open ios
# Build and run in Xcode
```

### Setup Android
```bash
npm run build
npx cap add android
npx cap open android
# Build and run in Android Studio
```

### Sync Changes
```bash
npm run build
npx cap sync
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5173
npx kill-port 5173

# Or change port in vite.config.js
export default {
  server: {
    port: 5174
  }
}
```

### CORS Errors
- ✅ Backend CORS is enabled
- Check backend running on localhost:5002
- Verify API URL in configuration

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Vite Cache Issues
```bash
# Clear Vite cache
rm -r .vite
npm run dev
```

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5002` |
| `VITE_FIREBASE_CONFIG` | Firebase config JSON | `{...}` |

---

## 🔄 Key Features

✅ **User Authentication**
- Signup & login with MongoDB
- Secure password handling
- User session management

✅ **AI Content Generation**
- Gemini-powered caption suggestions
- Smart hashtag generation
- Content optimization by segment

✅ **Post Management**
- Create and edit posts
- Upload images to Cloudinary
- Save drafts

✅ **Instagram Integration**
- Direct publishing to Instagram
- Media management
- Analytics (future)

✅ **Responsive Design**
- Mobile-friendly UI
- Cross-browser compatible
- Touch gestures support

---

## 🚀 Production Build

### Build for Web
```bash
npm run build
# Creates 'dist' folder
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📚 Related Documentation

- **Backend API:** [Backend README](../backend/README.md)
- **MongoDB Setup:** [MongoDB Guide](../backend/MONGODB_SETUP.md)
- **API Testing:** [Auth Verification](../backend/AUTH_VERIFICATION_REPORT.md)
- **Root README:** [Project README](../README.md)

---

## 📞 Support

For issues:
1. Check this README
2. Review [Backend README](../backend/README.md)
3. Check console for errors (F12)
4. Verify backend is running

---

## 📜 License

MIT License

---

**Status:** ✅ Development Ready
**Last Updated:** February 23, 2026
**Backend:** ✅ Connected on localhost:5002
**Database:** ✅ MongoDB Atlas