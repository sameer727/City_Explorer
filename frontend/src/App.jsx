import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExploreCitiesPage from './pages/ExploreCitiesPage';
import DashboardPage from './pages/DashboardPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import ContactUsPage from './pages/ContactUsPage';
import HotelsPage from './pages/HotelsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminHotelsPage from './pages/AdminHotelsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';
import { registerLogoutCallback } from './lib/api';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const location = useLocation();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('cityexplorer_dark_mode') === '1');

  // Register the logout callback so the Axios 401 interceptor can call it
  useEffect(() => {
    registerLogoutCallback(logout);
  }, [logout]);

  useEffect(() => {
    localStorage.setItem('cityexplorer_dark_mode', darkMode ? '1' : '0');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/20" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/15" />
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExploreCitiesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/places/:id" element={<PlaceDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute requireAdmin><AdminMessagesPage /></ProtectedRoute>} />
          <Route path="/admin/hotels" element={<ProtectedRoute requireAdmin><AdminHotelsPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookingsPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
