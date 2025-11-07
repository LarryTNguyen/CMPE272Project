// src/features/news/components/NewsSection.jsx
import { useNews } from "../features/authentication/useNews";

export default function NewsSection() {
  const { articles, status } = useNews();

  if (status === "loading") return <div className="p-4">Loading news…</div>;
  if (status === "error") return <div className="p-4 text-red-600">News failed to load.</div>;

  return (
    <div className="space-y-3">
      {articles.map((a) => (
        <article key={a.id} className="p-4 rounded-2xl border shadow-sm">
          <h4 className="font-semibold">{a.title}</h4>
          <div className="text-sm text-gray-500">{a.source}</div>
        </article>
      ))}
    </div>
  );
}
