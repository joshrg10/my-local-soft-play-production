import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gfyziwbrzfqfaktfmfjd.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeXppd2JyemZxZmFrdGZtZmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNDc2ODQsImV4cCI6MjA1NjYyMzY4NH0.P5fvgpgiO_vPuDrddgOWP2bAnICclY-9K0N-FMCnOuA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);