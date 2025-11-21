import { createClient } from '@supabase/supabase-js'

const url = 'https://jaaktefezeddygeiqstr.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYWt0ZWZlemVkZHlnZWlxc3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzUxMTgsImV4cCI6MjA3NjMxMTExOH0.-z5By7_YrljfhpvRGLsy5bBrx6BvsecwMFjM_WKWcdg'

const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export default supabase
