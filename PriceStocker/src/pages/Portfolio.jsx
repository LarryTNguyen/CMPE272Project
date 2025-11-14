import React, { useState, useEffect } from "react";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";
import PortfolioCard from "../components/PortfolioCard";
const Portfolio = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null)
    const [portfolio, setPortfolio] = useState(null)

    useEffect(() => {
        const fetchUserAndPortfolio = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                if (!user) {
                    console.log("No user logged in, redirecting...");
                    return;
                }

                setUser(user);

                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                if (profileError) throw profileError;

                setProfile(profileData);

                const { data: portfolioData, error: portfolioError } = await supabase
                    .from("positions")
                    .select("*")
                    .eq("user_id", user.id);

                if (portfolioError) throw portfolioError;
                setPortfolio(portfolioData)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserAndPortfolio();
    }, []);






    return (<>
        <Navbar />
        <div className="flex flex-col gap-3 max-w-xl mx-auto">
            {portfolio?.map((item) => (
                <PortfolioCard key={item.ticker} ticker={item.ticker} quantity={item.quantity} price={item.average_price}
                />
            ))}
        </div>
    </>)
}
export default Portfolio;