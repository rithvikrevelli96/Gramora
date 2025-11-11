import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContentCreationPage from './pages/ContentCreationPage';

import Register from './components/Register';
import Chat from './components/Chat';
import PostForm from './components/PostForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<ContentCreationPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/postform" element={<PostForm />} />
        <Route path="*" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;