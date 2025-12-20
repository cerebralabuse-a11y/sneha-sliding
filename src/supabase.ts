import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fxwryouedphlotunmzbq.supabase.co'
const supabaseKey = 'sb_publishable_HI3dFGFbWo61Xa0gOvH-9w_NGgokVd-'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)