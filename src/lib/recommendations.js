import { openai, supabase } from './config.js'

async function fetchMoviePoster(title) {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
    const data = await res.json()
    return data.Poster && data.Poster !== 'N/A' ? data.Poster : null
  } catch {
    return null
  }
}

function parseMovieContent(content) {
  const lines = content.trim().split('\n')
  const firstLine = lines[0]
  // Handles titles with colons like "Top Gun: Maverick: 2022 | ..."
  const titleMatch = firstLine.match(/^(.+?):\s*\d{4}/)
  const title = titleMatch ? titleMatch[1].trim() : firstLine
  const description = lines.slice(1).join(' ').trim()
  return { title, description }
}

function buildQueryString(responses, timeAvailable) {
  const personText = responses
    .map(
      (r, i) =>
        `Person ${i + 1}: Favorite movie is "${r.favMovie}". ` +
        `Wants to watch ${r.era} movies. ` +
        `In the mood for ${r.mood} content. ` +
        `Would love to watch with someone like "${r.filmPerson}".`
    )
    .join(' ')
  return `Available time: ${timeAvailable}. ${personText}`
}

export async function getMovieRecommendations(responses, timeAvailable) {
  const query = buildQueryString(responses, timeAvailable)

  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  })
  const queryEmbedding = embeddingResponse.data[0].embedding

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3,
    match_count: 5,
  })
  if (error) throw new Error(error.message)
  if (!data?.length) throw new Error('No matching movies found. Try different preferences!')

  const movies = await Promise.all(
    data.map(async (doc) => {
      const { title, description } = parseMovieContent(doc.content)
      const poster = await fetchMoviePoster(title)
      return { id: doc.id, title, description, poster, similarity: doc.similarity }
    })
  )

  return movies
}
