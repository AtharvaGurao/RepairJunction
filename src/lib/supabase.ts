import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seepwgjvgppqlowmjnmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZXB3Z2p2Z3BwcWxvd21qbm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzYzNTgsImV4cCI6MjA1MzIxMjM1OH0.r5ALgsBSu3nCyXyvvdkN-D1yBKSa1_slPbjeQ8VdMoY';

export const supabase = createClient(supabaseUrl, supabaseKey);