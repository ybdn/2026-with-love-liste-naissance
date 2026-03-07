import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zojbmfhsinghyogpbbho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvamJtZmhzaW5naHlvZ3BiYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTY1OTAsImV4cCI6MjA4ODQzMjU5MH0.g6y38gZ7XZxXg6nR_CsfYoBO53rhSn-hYqabMIg3nw8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
