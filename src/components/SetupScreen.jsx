import { useState } from 'react'

export default function SetupScreen({ onDone }) {
  const [numPeople, setNumPeople] = useState('')
  const [timeAvailable, setTimeAvailable] = useState('')

  function handleStart() {
    const n = parseInt(numPeople)
    if (!n || n < 1 || !timeAvailable.trim()) return
    onDone({ numPeople: n, timeAvailable: timeAvailable.trim() })
  }

  const isValid = parseInt(numPeople) >= 1 && timeAvailable.trim()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a1040] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🍿</div>
          <h1 className="text-4xl font-black text-white tracking-tight">PopChoice</h1>
        </div>

        <div className="space-y-4 mb-8">
          <input
            type="number"
            min="1"
            placeholder="How many people?"
            value={numPeople}
            onChange={e => setNumPeople(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 text-base outline-none focus:bg-white/15 transition"
          />
          <input
            type="text"
            placeholder="How much time do you have?"
            value={timeAvailable}
            onChange={e => setTimeAvailable(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 text-base outline-none focus:bg-white/15 transition"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="w-full bg-[#4ade80] text-black font-black text-xl py-5 rounded-3xl disabled:opacity-40 transition active:scale-95"
        >
          Start
        </button>
      </div>
    </div>
  )
}
