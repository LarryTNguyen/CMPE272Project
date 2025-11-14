import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";
import { DollarSign, User, Zap, LogOut } from 'lucide-react';

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
            console.log("filename ", fileName)

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = data.publicUrl;
            console.log("pulic url", data)
            const { error: dbError } = await supabase
                .from("profiles")
                .update({ avatar_url: publicUrl })
                .eq("id", user.id);

            if (dbError) throw dbError;

            setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));

        } catch (error) {
            console.error("Error :", error.message);
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto">
                    <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-700">

                        <header className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-white flex items-center justify-center">
                                <User className="w-8 h-8 mr-2 text-green-400" />
                                Your Profile
                            </h2>
                            <p className="text-gray-400 mt-2">Manage your account and view your balance.</p>
                        </header>


                        {profile ? (
                            <>
                                <div className="bg-gray-700 rounded-2xl p-6 mb-8 shadow-inner">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900 ring-4 ring-green-400/50">



                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900 ring-4 ring-green-400/50 overflow-hidden">
                                                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                                    {profile.avatar_url ? (
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt="Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        profile.full_name?.charAt(0).toUpperCase() || <User className="w-8 h-8" />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handlePFP}
                                                    />
                                                </label>
                                            </div>



                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white leading-none">{profile.full_name || 'User Name'}</h1>
                                            <p className="text-green-400 text-lg font-medium mt-1">@{username}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-center shadow-lg transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-green-500/30 mb-8">
                                    <h2 className="text-sm uppercase text-white font-semibold tracking-widest flex items-center justify-center mb-2">
                                        <DollarSign className="w-5 h-5 mr-1" />
                                        Account Balance
                                    </h2>
                                    <p className="text-5xl font-extrabold text-white mt-2">
                                        {formatCash(profile.cash)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shadow-green-500/30"
                                        onClick={handleDeposit}>
                                        <Zap className="w-5 h-5" />
                                        <span>Deposit</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shadow-gray-500/30"
                                        onClick={handleWithdrawal}>
                                        <DollarSign className="w-5 h-5" />
                                        <span>Withdraw</span>
                                    </button>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-700">


                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-2 bg-transparent border border-red-500 text-red-400 hover:bg-red-900/50 font-medium py-3 rounded-xl transition-all duration-300"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>

                            </>
                        ) : (
                            <div className="text-center p-10">
                                <p className="text-gray-400 text-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 mr-2 animate-pulse text-green-400" />
                                    Loading profile data...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    );

}
export default Profile