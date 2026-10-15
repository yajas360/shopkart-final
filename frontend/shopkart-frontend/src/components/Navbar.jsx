import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { getWishlist } from '../services/wishlistApi';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(null);

  const { user, checkAuth } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const fetchWishlistCount = () => {
      getWishlist()
        .then((data) => {
          if (!cancelled && data?.success && typeof data?.count === 'number') {
            setWishlistCount(data.count);
          }
        })
        .catch(() => {});
    };

    fetchWishlistCount();

    window.addEventListener('shopkart:wishlist_change', fetchWishlistCount);

    return () => {
      cancelled = true;
      window.removeEventListener('shopkart:wishlist_change', fetchWishlistCount);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('shopkart_token');
      localStorage.removeItem('token');
      await checkAuth();
      navigate('/login');
    }
  };

  const displayName = user?.fullName || user?.name || 'Account';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs transition-colors duration-200">
      {/* Brand & Desktop Navigation */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-sm tracking-tighter group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors">
            SK
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            ShopKart<span className="text-emerald-600 dark:text-emerald-400">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/products"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.startsWith('/products')
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            Products
          </Link>
          <Link
            to="/wishlist"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              location.pathname === '/wishlist'
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Wishlist</span>
            {wishlistCount !== null && wishlistCount > 0 && (
              <span className="bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.2 rounded-full text-[11px] font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              location.pathname === '/cart'
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-emerald-600 dark:bg-emerald-500 text-white px-1.5 py-0.2 rounded-full text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname.startsWith('/orders')
                ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            Orders
          </Link>
        </nav>
      </div>

      {/* Right Controls: Theme Toggle, Profile pill, Mobile Bar & Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile Nav Links */}
        <nav className="flex md:hidden items-center space-x-1">
          <Link
            to="/products"
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              location.pathname.startsWith('/products')
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Shop
          </Link>
          <Link
            to="/wishlist"
            className={`p-1.5 rounded-lg text-xs font-medium relative transition ${
              location.pathname === '/wishlist'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Saved
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`p-1.5 rounded-lg text-xs font-medium relative transition ${
              location.pathname === '/cart'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              location.pathname.startsWith('/orders')
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer flex items-center justify-center"
        >
          {theme === 'dark' ? (
            /* Sun Icon */
            <svg
              className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon Icon */
            <svg
              className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Profile Link Badge */}
        <Link
          to="/home"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition text-slate-700 dark:text-slate-200"
          title="Account Profile"
        >
          <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {initial}
          </div>
          <span className="text-xs font-medium hidden sm:inline max-w-[100px] truncate">
            {displayName}
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}