export default function ResultScreen({ movie, onNext, hasMore }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a1040] flex flex-col items-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-white text-2xl font-black text-center pt-8 mb-6 leading-tight">
          {movie.title}
        </h1>

        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full rounded-2xl object-cover mb-6 shadow-2xl"
          />
        ) : (
          <div className="w-full h-64 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-7xl">🎬</span>
          </div>
        )}

        <p className="text-white/70 text-sm leading-relaxed mb-8">{movie.description}</p>

        {hasMore && (
          <button
            onClick={onNext}
            className="w-full mb-8 bg-[#4ade80] text-black font-black text-xl py-5 rounded-3xl transition active:scale-95"
          >
            Next Movie
          </button>
        )}
      </div>
    </div>
  )
}
