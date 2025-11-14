import React, { useEffect } from 'react';
import TrendingMarkets from '../components/TrendingMarkets';
import NewsSection from '../components/NewsSection';
const Home = () => {
  return (

    <div style={{ maxWidth: 1200, margin: "24px auto", padding: 16 }}>
      <main className="p-6 space-y-6">
        <section>
          <h1 className="text-2xl font-semibold">Trending Markets</h1>
          <TrendingMarkets />
        </section>
        <section>
          <h1 className="text-2xl font-semibold">Latest News</h1>
          <NewsSection />
        </section>

      </main>
    </div>
  );
};

export default Home;
