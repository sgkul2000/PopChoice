import { useState } from 'react'
import SetupScreen from './components/SetupScreen.jsx'
import QuestionnaireScreen from './components/QuestionnaireScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { getMovieRecommendations } from './lib/recommendations.js'

export default function App() {
  const [screen, setScreen] = useState('setup') // 'setup' | 'questionnaire' | 'loading' | 'results' | 'error'
  const [numPeople, setNumPeople] = useState(0)
  const [timeAvailable, setTimeAvailable] = useState('')
  const [currentPerson, setCurrentPerson] = useState(0)
  const [responses, setResponses] = useState([])
  const [movies, setMovies] = useState([])
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [error, setError] = useState(null)

  function handleSetupDone({ numPeople, timeAvailable }) {
    setNumPeople(numPeople)
    setTimeAvailable(timeAvailable)
    setCurrentPerson(0)
    setResponses([])
    setScreen('questionnaire')
  }

  async function handlePersonDone(response) {
    const newResponses = [...responses, response]
    setResponses(newResponses)

    const isLast = currentPerson + 1 >= numPeople
    if (!isLast) {
      setCurrentPerson(prev => prev + 1)
      return
    }

    setScreen('loading')
    try {
      const results = await getMovieRecommendations(newResponses, timeAvailable)
      setMovies(results)
      setCurrentMovieIndex(0)
      setScreen('results')
    } catch (err) {
      setError(err.message)
      setScreen('error')
    }
  }

  function handleNextMovie() {
    setCurrentMovieIndex(prev => (prev + 1) % movies.length)
  }

  if (screen === 'setup') {
    return <SetupScreen onDone={handleSetupDone} />
  }

  if (screen === 'questionnaire') {
    return (
      <QuestionnaireScreen
        personNumber={currentPerson + 1}
        totalPeople={numPeople}
        isLast={currentPerson + 1 >= numPeople}
        onDone={handlePersonDone}
      />
    )
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a1040] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-7xl mb-6 animate-bounce">🍿</div>
          <p className="text-xl font-semibold">Finding your perfect movie...</p>
        </div>
      </div>
    )
  }

  if (screen === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a1040] flex items-center justify-center p-6">
        <div className="text-center text-white w-full max-w-sm">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-xl font-bold text-red-400 mb-2">Something went wrong</p>
          <p className="text-sm text-white/50 mb-8">{error}</p>
          <button
            onClick={() => setScreen('setup')}
            className="w-full bg-[#4ade80] text-black font-black text-xl py-5 rounded-3xl transition active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'results') {
    return (
      <ResultScreen
        movie={movies[currentMovieIndex]}
        onNext={handleNextMovie}
        hasMore={movies.length > 1}
      />
    )
  }
}
