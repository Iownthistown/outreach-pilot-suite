import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sjsuwthvozuzabktkcxu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqc3V3dGh2b3p1emFia3RrY3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDI5OTQsImV4cCI6MjA2ODU3ODk5NH0.pPe3MMWw-KBLLLSwxvjVgFz9LLoJRYByO8BazltpMXA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)