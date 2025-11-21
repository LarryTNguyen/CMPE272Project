import React from 'react';
import TrendingMarkets from '../components/TrendingMarkets';
import NewsSection from '../components/NewsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <p className="text-gray-600">Markets at a glance & breaking news</p>
        </header>

        {/* Trending Markets — component already renders its own card */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Markets</h2>
          <TrendingMarkets />
        </section>

        {/* News — card wrapper to match Dashboard sections */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest News</h2>
          <NewsSection />
        </section>
      </div>
    </main>
  );
}
