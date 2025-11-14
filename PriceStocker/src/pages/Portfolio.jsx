import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from '../services/superbase';
import Navbar from "../components/Navbar";
import PortfolioCard from "../components/PortfolioCard";
import { DollarSign, User, Zap, LogOut } from 'lucide-react';
const Portfolio = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null)
    const [portfolio, setPortfolio] = useState(null)

    function consolidatePortfolio(list) {
        const combined = {};

        list.forEach(item => {
            const { ticker, quantity, purchase_price } = item;
            if (!combined[ticker]) {
                combined[ticker] = { //initialize
                    ticker,
                    quantity: 0,
                    totalCost: 0
                };
            }
            combined[ticker].quantity += quantity; 
            combined[ticker].totalCost += purchase_price * quantity;
        });

        return Object.values(grouped).map(stock => ({
            ticker: stock.ticker,
            quantity: stock.quantity,
            price: stock.totalCost / stock.quantity  // calculate average price
        }));
    }

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
                    .from("user_portfolio")
                    .select("*")
                    .eq("user_id", user.id);

                if (portfolioError) throw portfolioError;
                const consolidated = consolidatePortfolio(portfolioData);
                setPortfolio(consolidated)
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
                <PortfolioCard key={item.ticker} ticker={item.ticker} quantity={item.quantity} price={item.price}
                />
            ))}
        </div>
    </>)
}
export default Portfolio;