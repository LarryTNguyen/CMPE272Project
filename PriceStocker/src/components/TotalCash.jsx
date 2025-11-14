import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";
import { DollarSign, User, Zap, LogOut } from 'lucide-react';

const formatCash = (cash) =>
  Number(cash).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const TotalCash = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return console.log("No user logged in");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("cash")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="h-28 aspect-square rounded-2xl border bg-background shadow-sm p-4 flex flex-col items-center justify-center text-center">
      <div className="text-sm font-medium text-muted-foreground">Buying Power:</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-yellow-600">
        {loading ? "Loading..." : formatCash(profile?.cash ?? 0)}
      </div>
    </div>
  );
}
export default TotalCash