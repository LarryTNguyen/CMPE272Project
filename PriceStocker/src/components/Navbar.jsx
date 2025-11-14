import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../services/superbase';
import Logo from './Logo';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
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

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <Logo />
      </div>

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
      </div>

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
              Logout
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