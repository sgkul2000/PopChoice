import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', '.env') })

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY })
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_API_KEY
)

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 150,
  chunkOverlap: 20,
})

function parseMovies(text) {
  return text
    .split(/\n\n+/)
    .map(block => block.trim())
    .filter(Boolean)
}

function extractTitle(content) {
  const firstLine = content.split('\n')[0]
  const match = firstLine.match(/^(.+?):\s*\d{4}/)
  return match ? match[1].trim() : firstLine
}

async function seedMovies() {
  const text = readFileSync(join(__dirname, '..', 'data', 'movies.txt'), 'utf-8')
  const movies = parseMovies(text)

  console.log(`Found ${movies.length} movies to seed.\n`)

  for (const content of movies) {
    const title = extractTitle(content)

    // Skip if already exists
    const { data: existing } = await supabase
      .from('documents')
      .select('id')
      .ilike('content', `${title}%`)
      .limit(1)

    if (existing?.length) {
      console.log(`  SKIP   ${title}`)
      continue
    }

    const chunks = await splitter.splitText(content)
    console.log(`  SPLIT  ${title} → ${chunks.length} chunks`)

    const rows = []
    for (const chunk of chunks) {
      const { data: embedding } = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunk,
      })
      rows.push({ content: chunk, embedding: embedding[0].embedding })
    }

    const { error } = await supabase.from('documents').insert(rows)

    if (error) {
      console.error(`  ERROR  ${title}: ${error.message}`)
    } else {
      console.log(`  SEEDED ${title} (${rows.length} chunks inserted)`)
    }
  }

  console.log('\nDone!')
}

seedMovies().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
