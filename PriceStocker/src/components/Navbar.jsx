import Logo from './Logo';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import supabase from '../services/superbase';
const Navbar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error', error);
      } else if (user) {
        console.log('logged in : ', user);
        setUser(user);
      } else {
        console.log('No user logged in');
      }
    };

    fetchUser();
  }, []);
  return (

    <div className="bg- flex justify-between rounded-b-sm bg-gray-600 px-3 py-4">
      <Logo />
      <div className="flex justify-evenly gap-5">
        <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
          <Link to="/dashboard">Dashboard</Link>
        </button>
        <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
          Profile
        </button>
        {user ? (
          <>
            <p className="text-gray-50 transition-all duration-300 hover:text-gray-400" > {user.user_metadata?.full_name || user.email}</p>
            <button className="text-gray-50 transition-all duration-300 hover:text-gray-400" onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }
            }>Logout</button>
          </>
        ) : (<div>
          <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
            <Link to="/signin"> Sign In </Link>
          </button>
          <button className="text-gray-50 transition-all duration-300 hover:text-gray-400">
            <Link to="/signup"> Sign Up</Link>
          </button>
        </div>)}


      </div>
    </div>
  );
};

export default Navbar;
