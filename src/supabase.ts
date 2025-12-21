import { createClient } from '@supabase/supabase-js'

// Use environment variables for better security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxwryouedphlotunmzbq.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4d3J5b3VlZHBobG90dW5temJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjc3MzAsImV4cCI6MjA4MTgwMzczMH0.vCIQKGCmIi6NsH4XG6H-oWwXi1oOW3ypDYutIokd1-A'

console.log('Initializing Supabase client with:', { supabaseUrl, supabaseKey });

// Validate the key format
if (!supabaseKey || supabaseKey.startsWith('sb_') || supabaseKey.length < 50) {
  console.warn('Warning: Supabase key might be invalid. Please check your environment variables.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)

// Test the connection
supabase.from('enquiries').select('*').limit(1).then(result => {
  console.log('Supabase connection test result:', result);
}).catch(error => {
  console.error('Supabase connection test error:', error);
});