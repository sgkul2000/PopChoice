import { useState } from 'react'

const ERA_OPTIONS = ['New', 'Classic']
const MOOD_OPTIONS = ['Fun', 'Serious', 'Inspiring', 'Scary']

function ToggleGroup({ options, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition active:scale-95 ${
            selected === opt
              ? 'bg-white text-[#0a1628]'
              : 'bg-white/15 text-white hover:bg-white/25'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function QuestionnaireScreen({ personNumber, totalPeople, isLast, onDone }) {
  const [favMovie, setFavMovie] = useState('')
  const [era, setEra] = useState(null)
  const [mood, setMood] = useState(null)
  const [filmPerson, setFilmPerson] = useState('')

  const isValid = favMovie.trim() && era && mood && filmPerson.trim()

  function handleSubmit() {
    if (!isValid) return
    onDone({ favMovie, era: era.toLowerCase(), mood: mood.toLowerCase(), filmPerson })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a1040] flex flex-col items-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center pt-8 mb-8">
          <div className="text-5xl mb-3">🍿</div>
          <div className="text-6xl font-black text-white leading-none">{personNumber}</div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-white font-semibold mb-2 text-sm">
              What's your favorite movie and why?
            </p>
            <textarea
              placeholder="The Shawshank Redemption because it taught me..."
              value={favMovie}
              onChange={e => setFavMovie(e.target.value)}
              rows={3}
              className="w-full bg-white/10 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white/15 transition resize-none"
            />
          </div>

          <div>
            <p className="text-white font-semibold mb-3 text-sm">
              Are you in the mood for something new or a classic?
            </p>
            <ToggleGroup options={ERA_OPTIONS} selected={era} onSelect={setEra} />
          </div>

          <div>
            <p className="text-white font-semibold mb-3 text-sm">What are you in the mood for?</p>
            <ToggleGroup options={MOOD_OPTIONS} selected={mood} onSelect={setMood} />
          </div>

          <div>
            <p className="text-white font-semibold mb-2 text-sm">
              Which famous film person would you love to be stranded on an island with and why?
            </p>
            <textarea
              placeholder="Tom Hanks because he is really funny..."
              value={filmPerson}
              onChange={e => setFilmPerson(e.target.value)}
              rows={3}
              className="w-full bg-white/10 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white/15 transition resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full mt-8 mb-8 bg-[#4ade80] text-black font-black text-xl py-5 rounded-3xl disabled:opacity-40 transition active:scale-95"
        >
          {isLast ? 'Get Movie' : 'Next Person'}
        </button>
      </div>
    </div>
  )
}
