import React, { useState, useEffect } from 'react';
import supabase from '../services/superbase';
import Navbar from '../components/Navbar';
import PortfolioCard from '../components/PortfolioCard';

export default function Portfolio() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchUserAndPortfolio = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        setUser(user);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: portfolioData, error: portfolioError } = await supabase
          .from('positions')
          .select('*')
          .eq('user_id', user.id);
        if (portfolioError) throw portfolioError;
        setPortfolio(portfolioData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserAndPortfolio();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-600">
              Your positions and performance{profile?.username ? ` — @${profile.username}` : ''}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {portfolio?.map((item) => (
              <PortfolioCard
                key={item.ticker}
                ticker={item.ticker}
                quantity={item.quantity}
                price={item.average_price}
              />
            ))}

            {!portfolio?.length && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="text-gray-600">No positions yet.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
