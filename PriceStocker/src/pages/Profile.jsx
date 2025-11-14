// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";
import { DollarSign, User, Zap, LogOut, History } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          console.log('No user logged in, redirecting...');
          return;
        }

        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.username !== username) {
          navigate("/dashboard");
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching user/profile:", error);
      }
    };

    fetchUserAndProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/');
    }
  };

  const handleDeposit = async () => {
    const newCash = profile.cash + 1000
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ cash: (newCash) })
      .eq("id", user.id);
    if (dbError) throw dbError;
    setProfile((prev) => ({ ...prev, cash: newCash }));
  };

  const handleWithdrawal = async () => {
    const newCash = 0
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ cash: 0 })
      .eq("id", user.id);
    if (dbError) throw dbError;
    setProfile((prev) => ({ ...prev, cash: newCash }));
  };

  const formatCash = (cash) => {
    return Number(cash).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePFP = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (dbError) throw dbError;

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
    } catch (error) {
      console.error("Error :", error.message);
    }
  };

  // NEW: navigate to transactions
  const goToTransactions = () => {
    // Change this path if your route differs (e.g., `/u/${username}/transactions`)
    navigate('/transactions');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">

            <header className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
                <User className="w-8 h-8 mr-2 text-blue-500" />
                Your Profile
              </h2>
              <p className="text-gray-500 mt-2">Manage your account and view your balance.</p>
            </header>

            {profile ? (
              <>
                <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-200 flex items-center justify-center">
                    <img
                      src={profile.avatar_url || ''}
                      alt="Avatar"
                      className={`w-full h-full object-cover ${!profile.avatar_url ? 'hidden' : ''}`}
                    />
                    {!profile.avatar_url && (
                      <span className="text-gray-500 text-2xl font-bold">
                        {profile.full_name?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
                      </span>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 cursor-pointer transition">
                      <span className="text-white text-xl font-bold">+</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePFP} />
                    </label>
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'User Name'}</h1>
                    <p className="text-blue-500 text-lg font-medium mt-1">@{username}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="bg-blue-500/80 text-white rounded-xl p-6 text-center mb-6">
                  <h2 className="text-sm uppercase font-semibold tracking-widest flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 mr-1" />
                    Account Balance
                  </h2>
                  <p className="text-4xl font-extrabold mt-2">{formatCash(profile.cash)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
                    onClick={handleDeposit}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Deposit</span>
                  </button>
                  <button
                    className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
                    onClick={handleWithdrawal}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Withdraw</span>
                  </button>
                </div>

                {/* NEW: View Transactions button */}
                <div className="mt-4">
                  <button
                    onClick={goToTransactions}
                    className="w-full flex items-center justify-center space-x-2 border border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition"
                  >
                    <History className="w-5 h-5" />
                    <span>View Transactions</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 border border-red-400 text-red-500 hover:bg-red-50 font-medium py-3 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <p className="text-gray-500 text-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 mr-2 animate-pulse text-blue-400" />
                  Loading profile data...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
