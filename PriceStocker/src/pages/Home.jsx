import TrendingMarkets from '../components/TrendingMarkets';
import NewsSection from '../components/NewsSection';
import ProfitAreaChart from '../components/portfolio/ProfitAreaChart';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Home</h1>
          <p className="text-gray-600">Markets at a glance & breaking news</p>
        </header>
        <section>
          <ProfitAreaChart />
        </section>
        {/* Trending Markets — component already renders its own card */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Trending Markets
          </h2>
          <TrendingMarkets />
        </section>

        {/* News — card wrapper to match Dashboard sections */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Latest News</h2>
          <NewsSection />
        </section>
      </div>
    </main>
  );
}
