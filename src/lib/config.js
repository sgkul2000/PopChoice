import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.VITE_OPENAI_API_KEY) throw new Error('Missing VITE_OPENAI_API_KEY')
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing VITE_SUPABASE_API_KEY')
export const supabase = createClient(supabaseUrl, supabaseKey)
