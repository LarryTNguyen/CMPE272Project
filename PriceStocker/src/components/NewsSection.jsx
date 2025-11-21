import { useEffect, useState } from "react";

const RSS_FEEDS = [
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml",
];

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setStatus("loading");
        const rssUrl = "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml";
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.items) throw new Error("No articles found");

        const formatted = data.items.map((item) => ({
          id: item.guid || item.link,
          title: item.title,
          source: "New York Times",
          link: item.link,
          published: item.pubDate,
        }));

        setArticles(formatted);
        setStatus("success");
      } catch (error) {
        console.error("Error loading news:", error);
        setStatus("error");
      }
    };

    fetchNews();
  }, []);

  if (status === "loading") return <div className="p-4">Loading news…</div>;
  if (status === "error") return <div className="p-4 text-red-600">News failed to load.</div>;

  return (
    <div className="space-y-3">
      {articles.map((a) => (
        <article
          key={a.id}
          className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer transition"
          onClick={() => window.open(a.link, "_blank")}
        >
          <h4 className="font-semibold text-gray-900">{a.title}</h4>
          <div className="text-sm text-gray-600">{a.source}</div>
        </article>
      ))}
    </div>
  );
}
