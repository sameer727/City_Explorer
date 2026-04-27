import { Compass, LogOut, Menu, Moon, Sun, UserCircle2, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();

  const links = [
    ['Home', '/'],
    ['Explore', '/explore'],
    ['Hotels', '/hotels'],
    ...(isLoggedIn ? [['My Bookings', '/my-bookings']] : []),
    ['Favorites', '/favorites'],
    ['Contact', '/contact']
  ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-brand-ink dark:text-white">
          <span className="grid h-9 w-9 place-content-center rounded-2xl bg-gradient-to-br from-brand-accent to-brand-accentDeep text-white shadow-soft">
            <Compass className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">CityExplorer</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="hidden rounded-full bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:block"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="rounded-2xl bg-brand-accent p-2 text-white shadow-soft transition hover:brightness-110"
            aria-label="Sign in"
          >
            <UserCircle2 className="h-5 w-5" />
          </Link>
        )}
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {links.map(([label, to]) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-center text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
