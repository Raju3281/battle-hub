import { useEffect, useState } from "react";
import api from "../../utils/api";
import moment from "moment";

// 🔥 Convert ANY YouTube link → Proper embed URL
const convertToEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("embed")) return url;

  // Extract video ID (works for all formats)
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/)|youtu\.be\/)([^"&?\/ ]{11})/;

  const match = url.match(regex);
  const videoId = match ? match[1] : null;

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

export default function WatchOnYouTube() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      const res = await api.get("/matches/with-links");
      const data = res.data.matches || [];

      const processed = data.map((m) => ({
        ...m,
        youtubeUrl: convertToEmbedUrl(m.matchLink),
      }));

      setMatches(processed);
    } catch (err) {
      console.error("Error loading match links:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading streams...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto text-white p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-8">
        🎥 Watch Live Matches on YouTube
      </h2>

      {matches.length === 0 ? (
        <p className="text-center text-gray-400">No matches available to watch.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {matches.map((match) => (
            <div
              key={match._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition"
            >
              {/* YouTube iframe */}
              <div className="relative w-full h-[250px] sm:h-[300px]">
                {match.youtubeUrl ? (
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-lg"
                    src={`${match.youtubeUrl}?autoplay=0&mute=0&controls=1`}
                    title={match.matchName}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                    🔗 Invalid or Missing YouTube Link
                  </div>
                )}
              </div>

              {/* Match Info */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  {match.matchName}
                </h3>

                <div className="text-gray-300 space-y-1 text-sm sm:text-base">
                  <p>
                    <span className="text-yellow-400 font-semibold">Type:</span>{" "}
                    {match.matchType?.toUpperCase()}
                  </p>
                  {/* <p>
                    <span className="text-yellow-400 font-semibold">Map:</span>{" "}
                    {match.matchMap || "Unknown"}
                  </p> */}
                  <p>
                    <span className="text-yellow-400 font-semibold">Time:</span>{" "}
                    {moment(match.matchTime).utc().format("DD/MM/YYYY hh:mm A")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-gray-400 text-center mt-10 text-sm">
        📺 Streams hosted on the official{" "}
        <a
          href="https://www.youtube.com/@BreakDrawnGaming"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 underline hover:text-yellow-300"
        >
          Breakdrawn YouTube Channel
        </a>
      </p>
    </div>
  );
}
