import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Bell, Search, UserCheck, Shield, ChevronDown, Sparkles, Home, LogIn, LogOut, Eye, Volume2, Type } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsDrawer from './NotificationsDrawer';

export default function Header() {
  const { currentRole, setCurrentRole, ROLES, isLoggedIn, logout } = useRole();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    highContrast,
    toggleHighContrast,
    screenReaderMode,
    toggleScreenReader
  } = useAccessibility();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Accessibility & Government Top Bar (WCAG Compliance Header) */}
      <div className="bg-blue-950 text-white px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-blue-900">
        <div className="flex items-center gap-3">
          {/* Skip to Content for Keyboard Users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:bg-amber-400 focus:text-slate-950 focus:px-3 focus:py-1 focus:rounded font-bold"
          >
            Skip to Main Content
          </a>

          <Link to="/" className="flex items-center gap-1 font-bold text-amber-300 hover:underline">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            GOVERNMENT OF INDIA • Ministry of Statistics & Programme Implementation
          </Link>
          <span className="hidden md:inline text-blue-700">|</span>
          <span className="hidden md:inline text-slate-300 font-medium">MPLADS NIRISHA AI Portal</span>
        </div>

        {/* Accessibility & Compliance Toolbar */}
        <div className="flex items-center gap-4 text-[11px]">
          {/* Font Size Adjuster Tools */}
          <div className="flex items-center gap-1 bg-blue-900/80 px-2 py-0.5 rounded border border-blue-800">
            <span className="text-slate-300 text-[10px] uppercase font-bold mr-1 flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Text Size:
            </span>
            <button
              onClick={decreaseFontSize}
              title="Decrease Font Size"
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'normal' ? 'bg-blue-800 text-slate-300' : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              title="Reset Font Size"
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'normal' ? 'bg-amber-400 text-slate-950' : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              A
            </button>
            <button
              onClick={increaseFontSize}
              title="Increase Font Size"
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                fontSize === 'xlarge' ? 'bg-amber-400 text-slate-950' : 'bg-blue-700 text-white hover:bg-blue-600'
              }`}
            >
              A+
            </button>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30"
              title="Sign out of active session"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          ) : (
            <Link to="/login" className="text-amber-300 hover:underline flex items-center gap-1 font-bold">
              <LogIn className="w-3.5 h-3.5" /> Officer Login
            </Link>
          )}
        </div>
      </div>

      {/* Main White & Blue Header Bar */}
      <div className="bg-white text-slate-900 px-6 py-3.5 flex items-center justify-between gap-6 border-b border-slate-200">
        {/* Logo & Official Branding */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1">
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-blue-800 transition-colors">
            NIR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl leading-none tracking-tight text-blue-900">
                NIRISHA <span className="text-blue-600">AI</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              National Integrated Risk & Intelligence System for Holistic Assessment
            </p>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Project ID, Contractor, Tender, or District..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder-slate-400 font-medium shadow-2xs"
            aria-label="Global Project Search"
          />
        </form>

        {/* Notifications & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-blue-700 hover:bg-slate-200 transition-colors border border-slate-200"
            title="Notifications Drawer"
            aria-label="Open Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      {/* Slide-out Notifications Drawer */}
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </header>
  );
}
