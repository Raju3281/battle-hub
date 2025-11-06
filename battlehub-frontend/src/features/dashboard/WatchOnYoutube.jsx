export default function WatchOnYouTube() {
  // 🧠 Mock matches (you can later replace with data from backend)
  const liveMatches = [
    {
      title: "Erangel Squad Match",
      type: "Squad",
      map: "Erangel",
      time: "Today 6:00 PM",
      youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Livik Duo Match",
      type: "Duo",
      map: "Livik",
      time: "Today 8:00 PM",
      youtubeUrl: "https://www.youtube.com/embed/3fumBcKC6RE",
    },
    {
      title: "Miramar Solo Match",
      type: "Solo",
      map: "Miramar",
      time: "Tomorrow 5:30 PM",
      youtubeUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto text-white p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-8">
        🎥 Watch Live Matches on YouTube
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {liveMatches.map((match, idx) => (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition"
          >
            {/* YouTube iframe */}
            <div className="relative w-full h-[250px] sm:h-[300px]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={match.youtubeUrl}
                title={match.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Match Info */}
            <div className="p-4 sm:p-5">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                {match.title}
              </h3>

              <div className="text-gray-300 space-y-1 text-sm sm:text-base">
                <p>
                  <span className="text-yellow-400 font-semibold">Type:</span>{" "}
                  {match.type}
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">Map:</span>{" "}
                  {match.map}
                </p>
                <p>
                  <span className="text-yellow-400 font-semibold">
                    Timing:
                  </span>{" "}
                  {match.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-gray-400 text-center mt-10 text-sm">
        📺 Streams hosted on the official{" "}
        <span className="text-yellow-400">BattleHub YouTube Channel</span>
      </p>
    </div>
  );
}
