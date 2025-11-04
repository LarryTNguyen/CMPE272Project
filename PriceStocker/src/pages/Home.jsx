import React from 'react';
import TrendingMarkets from '../components/FlashStock';
import NewsSection from '../components/NewsSection';
const Home = () => {
  return (
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
  );
};

export default Home;
