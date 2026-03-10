# 🍿 PopChoice

> AI-powered movie recommendations for groups — everyone's taste, one perfect pick.

---

## The Problem

Picking a movie with a group is painful. Everyone has different moods, different tastes, and no one wants to scroll through a streaming platform for 45 minutes only to give up and rewatch something familiar. Existing recommendation engines optimise for a single user profile — not a room full of people with conflicting preferences.

## The Solution

PopChoice collects each person's preferences through a quick questionnaire, then uses **semantic vector search** to find a movie that genuinely fits the group's collective vibe — not just a keyword match, but a deep semantic understanding of tone, genre, and taste.

---

## Screenshots

| Setup | Questionnaire | Last Person | Result |
|-------|---------------|-------------|--------|
| ![Setup](docs/screenshots/setup.png) | ![Questionnaire](docs/screenshots/questionnaire.png) | ![Get Movie](docs/screenshots/get-movie.png) | ![Result](docs/screenshots/result.png) |

---

## How It Works

```
Each person answers 4 questions about their mood and preferences
                        ↓
     All responses are combined into one semantic query string
                        ↓
  OpenAI text-embedding-ada-002 encodes the query as a 1536-dim vector
                        ↓
  Supabase pgvector finds the closest movie chunks via cosine similarity
                        ↓
           OMDB API fetches the poster for the matched movie
                        ↓
              Results are presented one at a time
```

### Vector Search in Detail

Movies in `data/movies.txt` are pre-processed at seed time:

1. Each movie's text is split into **150-character chunks** with a **20-character overlap** using LangChain's `RecursiveCharacterTextSplitter` — preserving context across chunk boundaries
2. Each chunk is independently embedded via `text-embedding-ada-002` (1536 dimensions)
3. Chunks and their embeddings are stored in a Supabase `documents` table powered by `pgvector`

At query time, the combined group preferences are embedded and matched against stored chunks using **cosine similarity** through Supabase's `match_documents` RPC function.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Vite |
| AI Embeddings | OpenAI `text-embedding-ada-002` |
| Vector Database | Supabase + pgvector |
| Text Splitting | LangChain `RecursiveCharacterTextSplitter` |
| Movie Posters | OMDB API |

---

## Project Structure

```
popchoice/
├── data/
│   └── movies.txt                   # Raw movie dataset
├── docs/
│   └── screenshots/                 # README screenshots
├── scripts/
│   └── seed.js                      # One-time DB seeding script (Node.js)
├── src/
│   ├── components/
│   │   ├── SetupScreen.jsx          # Number of people + available time
│   │   ├── QuestionnaireScreen.jsx  # Per-person preference questions
│   │   └── ResultScreen.jsx         # Movie result with poster
│   ├── lib/
│   │   ├── config.js                # OpenAI + Supabase clients
│   │   └── recommendations.js       # Embedding → vector search → poster fetch
│   ├── App.jsx                      # App state machine
│   ├── index.css                    # Tailwind entry
│   └── main.jsx                     # React entry point
├── supabase/
│   ├── create_db.sql                # Table schema (pgvector)
│   └── match_documents.sql          # Cosine similarity RPC function
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key
- An [OMDB](https://www.omdbapi.com/apikey.aspx) API key (free tier: 1,000 req/day)

### 1. Clone & install

```bash
git clone https://github.com/your-username/popchoice.git
cd popchoice
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_API_KEY=your-supabase-anon-key
VITE_OMDB_API_KEY=your-omdb-key
```

### 3. Set up Supabase

Run the following in the **Supabase SQL Editor**, in order:

```sql
-- Step 1: enable the pgvector extension
create extension if not exists vector;
```

Then run:
- [`supabase/create_db.sql`](supabase/create_db.sql) — creates the `documents` table
- [`supabase/match_documents.sql`](supabase/match_documents.sql) — creates the RPC search function

### 4. Seed the database

```bash
npm run seed
```

Reads `data/movies.txt`, splits each entry into chunks, generates embeddings via OpenAI, and inserts them into Supabase. Re-running is safe — existing entries are skipped.

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Adding More Movies

Append entries to `data/movies.txt` using the existing format:

```
Movie Title: YEAR | RATING | RUNTIME | IMDB score
One or two sentence description of the film.
```

Then re-run `npm run seed`.

---

## License

MIT
