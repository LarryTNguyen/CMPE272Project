// src/features/news/hooks/useNews.js
import { useEffect, useState } from "react";
export function useNews() {
  const [articles, setArticles] = useState(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    async function run() {
      // Replace with your news API call
      setArticles([
        { id: 1, title: "Market rallies on earnings", source: "Reuters" },
        { id: 2, title: "Fed hints at rate path", source: "Bloomberg" },
      ]);
      setStatus("success");
    }
    run();
  }, []);
  return { articles, status };
}
