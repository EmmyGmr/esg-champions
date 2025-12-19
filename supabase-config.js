/**
 * Supabase Configuration
 * ESG Champions Platform
 * 
 * Replace these values with your Supabase project credentials
 * Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
 */

// Supabase Project URL
const SUPABASE_URL = 'https://euyfomkdridmyfmrtzzi.supabase.co';

// Supabase Anonymous Public Key (safe to expose in client-side code)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWZvbWtkcmlkbXlmbXJ0enppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDAyMTAsImV4cCI6MjA4MTcxNjIxMH0.8JFafntZ2tm6bwmCxbUbovy37BheRSe5zhUDzgH-lmU';

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_URL, SUPABASE_ANON_KEY };
}

