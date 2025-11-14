import React from 'react';
import TrendingMarkets from '../components/FlashStock';
import NewsSection from '../components/NewsSection';
import PositionsList from '../components/PositionsList';
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
      <section>
        <h1 className="text-2xl font-semibold">Testing Positions</h1>
        <PositionsList/>
      </section>

    </main>
  );
};

export default Home;
