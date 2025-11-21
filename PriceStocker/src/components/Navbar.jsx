// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../services/superbase';
import Logo from './Logo';
import tickers from '../data/tickers.json';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      // In a real app, you would handle the actual authentication status here
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else if (user) {
        setUser(user);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  if (query.length > 1) {
    const lowerCaseQuery = query.toLowerCase();
    // Filter stocks by ticker or name and limit the list
    const filtered = tickers.filter(stock =>
      (stock.ticker && stock.ticker.toLowerCase().includes(lowerCaseQuery)) ||
      (stock.name && stock.name.toLowerCase().includes(lowerCaseQuery))
    ).slice(0, 5); // Limit to 5 suggestions
    
    setSuggestions(filtered);
  } else {
    setSuggestions([]);
  }
};

  const handleSelectSuggestion = (ticker) => {
    setSearchQuery('');
    setSuggestions([]);
    // Navigate to the specific stock detail page
    navigate(`/stock/${ticker}`);
  };
  useEffect(() => {
  }, [suggestions]);
  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">

      {/* LEFT SIDE: Logo and Brand Name */}
      <div className="flex items-center gap-3">
        <Link to="/home">
          <Logo />
        </Link>
      </div>

      {/* CENTER: Search Bar and Navigation Links */}
      <div className="flex items-center gap-8">

        {/* Search Bar Component */}
        <div className="relative w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search stocks (Ticker or Name)..."
            className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={() => handleSelectSuggestion(stock.ticker)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors flex justify-between items-center"
                >
                  <span className="font-semibold">{stock.ticker}</span>
                  <span className="text-sm text-gray-500 truncate ml-2">{stock.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:text-white hover:bg-gray-800/70 active:scale-95"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:text-white hover:bg-gray-800/70 active:scale-95"
          >
            Dashboard
          </Link>
          <Link
            to="/portfolio"
            className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:text-white hover:bg-gray-800/70 active:scale-95"
          >
            Portfolio
          </Link>

          {user && (
            <Link
              to="/transactions"
              className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:text-white hover:bg-gray-800/70 active:scale-95"
            >
              Transactions
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Auth Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to={`/profile/${user.user_metadata?.username || user.email.split('@')[0]}`}
              className="px-3 py-2 rounded-lg bg-gray-800 text-gray-100 font-medium transition-all duration-300 hover:bg-gray-700 hover:text-white active:scale-95 shadow-sm"
            >
              {user.user_metadata?.full_name || user.email}
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-lg text-red-400 font-medium transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 active:scale-95"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:bg-blue-600/70 hover:text-white active:scale-95"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 rounded-lg text-gray-200 font-medium transition-all duration-200 hover:bg-green-600/70 hover:text-white active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;