// Frontend Integration Guide
// File: src/services/authService.js

const API_URL = 'http://localhost:5002';

/**
 * Sign up a new user
 * @param {string} username - Username for the account
 * @param {string} email - Email address
 * @param {string} password - Password (minimum 8 chars recommended)
 * @returns {Promise} Response with user data
 */
export const signup = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Save user to localStorage
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', data.user.id);
        }

        return data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

/**
 * Login with email and password
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise} Response with user data
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Save user to localStorage
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userEmail', data.user.email);
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Logout user (clears local storage)
 */
export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
};

/**
 * Get current logged in user
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
    return Boolean(localStorage.getItem('user'));
};

// ============================================
// Usage Examples in Components
// ============================================

/*
// In LoginPage.jsx
import { login, isLoggedIn } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      console.log('Login successful:', result);
      navigate('/dashboard'); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoggedIn()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
*/

/*
// In SignupPage.jsx
import { signup, isLoggedIn } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await signup(username, email, password);
      console.log('Signup successful:', result);
      navigate('/dashboard'); // Redirect after signup
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoggedIn()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
}
*/

/*
// Protected Route Component
import { getCurrentUser } from '../services/authService';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage in App.jsx:
// <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
*/

export default {
    signup,
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
};
